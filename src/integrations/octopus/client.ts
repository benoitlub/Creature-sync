import type {
  CreatureObservationEvent,
  OctopusInsight,
  OctopusObservationResponse,
} from "./contracts";

const DEFAULT_TIMEOUT_MS = 6000;
const DEFAULT_OCTOPUS_API = "https://octopus-engine.onrender.com";

function getEndpoint() {
  const explicit = import.meta.env.VITE_OCTOPUS_OBSERVATION_URL?.trim();
  if (explicit) return explicit;
  const base = (import.meta.env.VITE_OCTOPUS_API_URL?.trim() || DEFAULT_OCTOPUS_API).replace(/\/$/, "");
  return `${base}/mission`;
}

export function isOctopusBridgeEnabled() {
  return Boolean(getEndpoint());
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function normalizeStatus(value: unknown): OctopusObservationResponse["status"] {
  const status = String(value || "").toLowerCase();
  if (["completed", "complete", "ready", "done", "success"].includes(status)) return "completed";
  if (["queued", "accepted", "recorded"].includes(status)) return "queued";
  if (["blocked", "waiting-authorization", "waiting_authorization"].includes(status)) return "blocked";
  if (["failed", "error", "cancelled"].includes(status)) return "failed";
  return "running";
}

function normalizeInsights(payload: unknown): OctopusInsight[] {
  const source = asRecord(payload);
  const output = asRecord(source.output);
  const candidates = Array.isArray(source.insights)
    ? source.insights
    : Array.isArray(output.insights)
      ? output.insights
      : Array.isArray(source.actions)
        ? source.actions
        : [];

  return candidates.flatMap((item): OctopusInsight[] => {
    const record = asRecord(item);
    const type = String(record.type || "");
    if (type === "hypothesis") {
      return [{
        type,
        label: String(record.label || record.species || "Hypothèse à vérifier"),
        confidence: typeof record.confidence === "number" ? record.confidence : undefined,
        reason: typeof record.reason === "string" ? record.reason : undefined,
      }];
    }
    if (type === "request_recapture") {
      return [{
        type,
        reason: String(record.reason || "Signal insuffisant"),
        durationSeconds: typeof record.durationSeconds === "number" ? record.durationSeconds : 15,
        guidance: typeof record.guidance === "string" ? record.guidance : undefined,
      }];
    }
    if (type === "notify_user") {
      return [{
        type,
        title: String(record.title || "Observation enrichie"),
        message: String(record.message || "Octopus a examiné cette observation."),
      }];
    }
    if (type === "ignore") return [{ type, reason: typeof record.reason === "string" ? record.reason : undefined }];
    return [];
  });
}

function extractMessage(payload: unknown): string {
  const source = asRecord(payload);
  const output = asRecord(source.output);
  return String(
    source.message
    || source.summary
    || output.message
    || output.summary
    || "",
  ).trim();
}

function isWaitingForCompatibleExecutor(message: string) {
  const normalized = message.toLowerCase();
  return normalized.includes("compatible executor")
    || normalized.includes("waiting for an executor")
    || normalized.includes("aucun exécuteur compatible");
}

function buildLocalFallback(observation: CreatureObservationEvent): OctopusObservationResponse {
  const quality = observation.metrics?.signalQuality;
  const weakSignal = typeof quality === "number" && quality < 55;
  const confidence = observation.confidence;
  const lowConfidence = typeof confidence === "number" && confidence < 70;

  const reason = weakSignal
    ? "La qualité du signal est trop faible pour enrichir cette observation de façon fiable."
    : lowConfidence
      ? "L’identification reste prudente : une nouvelle captation permettrait de mieux la vérifier."
      : "Aucun exécuteur compatible n’est disponible ; la détection brute reste inchangée.";

  return {
    observationId: observation.id,
    status: "completed",
    summary: "Analyse locale Creature-Sync · Octopus a bien enregistré l’observation mais aucun exécuteur compatible n’était disponible.",
    insights: [{
      type: "request_recapture",
      reason,
      durationSeconds: 15,
      guidance: "Enregistre à nouveau en te rapprochant légèrement de la source et en évitant les bruits parasites.",
    }],
  };
}

export async function sendObservationToOctopus(
  observation: CreatureObservationEvent,
): Promise<OctopusObservationResponse | null> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(getEndpoint(), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        operationId: `creature_sync_${observation.id}`,
        title: `Creature Sync · ${observation.rawLabel}`,
        objective: "Examiner une observation acoustique neutre sans altérer la détection source.",
        parcelId: "project-creature-sync",
        context: {
          id: "project-creature-sync",
          label: "Creature Sync",
          objective: "Enrichir des observations animales et environnementales.",
          metadata: {
            owner: "creature-sync",
            adapter: "creature-sync-octopus-v2",
            event: "observation.detected",
            observation,
          },
        },
        requiredCapabilities: ["observation.analyze"],
        authorizationPolicy: {
          internalWork: "allowed",
          externalAction: "forbidden",
        },
        authorizedResources: [],
        prompt: [
          "Analyse uniquement les données fournies.",
          "Ne présente jamais une hypothèse comme une identification certaine.",
          "Tu peux proposer une hypothèse, demander une nouvelle captation ou signaler une incohérence.",
          "Ne modifie pas la détection brute de Creature Sync.",
          `Observation: ${JSON.stringify(observation)}`,
          "Format préféré: { insights: [{ type: hypothesis|request_recapture|notify_user|ignore, ... }] }",
        ].join("\n"),
      }),
      signal: controller.signal,
    });

    if (!response.ok) return buildLocalFallback(observation);

    const raw = await response.json() as unknown;
    const source = asRecord(raw);
    const message = extractMessage(raw);
    const insights = normalizeInsights(raw);

    if (isWaitingForCompatibleExecutor(message) || insights.length === 0) {
      return buildLocalFallback(observation);
    }

    return {
      observationId: observation.id,
      status: normalizeStatus(source.status),
      summary: typeof source.summary === "string" ? source.summary : undefined,
      insights,
      raw,
    };
  } catch {
    return buildLocalFallback(observation);
  } finally {
    window.clearTimeout(timeout);
  }
}

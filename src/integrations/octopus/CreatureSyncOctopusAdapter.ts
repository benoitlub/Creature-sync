import type {
  CreatureObservation,
  CreatureObservationAction,
  CreatureObservationResult,
  CreatureSyncOctopusConfig,
} from "./types";

const DEFAULT_TIMEOUT_MS = 6000;
const DEFAULT_OCTOPUS_API = "https://octopus-engine.onrender.com";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function normalizeActions(payload: unknown): CreatureObservationAction[] {
  const source = asRecord(payload);
  const output = asRecord(source.output);
  const candidates = Array.isArray(source.insights)
    ? source.insights
    : Array.isArray(output.insights)
      ? output.insights
      : Array.isArray(source.actions)
        ? source.actions
        : [];

  return candidates.flatMap((item): CreatureObservationAction[] => {
    const record = asRecord(item);
    const type = String(record.type || "");
    if (type === "hypothesis") return [{
      type,
      label: String(record.label || record.species || "Hypothèse à vérifier"),
      confidence: typeof record.confidence === "number" ? record.confidence : undefined,
      reason: typeof record.reason === "string" ? record.reason : undefined,
    }];
    if (type === "request_recapture") return [{
      type,
      reason: String(record.reason || "Signal insuffisant"),
      durationSeconds: typeof record.durationSeconds === "number" ? record.durationSeconds : 15,
      guidance: typeof record.guidance === "string" ? record.guidance : undefined,
    }];
    if (type === "notify_user") return [{
      type,
      title: String(record.title || "Observation enrichie"),
      message: String(record.message || "Octopus a examiné cette observation."),
    }];
    if (type === "ignore") return [{ type, reason: typeof record.reason === "string" ? record.reason : undefined }];
    return [];
  });
}

function extractSummary(payload: unknown): string | undefined {
  const source = asRecord(payload);
  const output = asRecord(source.output);
  const value = source.summary || source.message || output.summary || output.message;
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function localFallback(observation: CreatureObservation): CreatureObservationResult {
  const quality = observation.metrics?.signalQuality;
  const weakSignal = typeof quality === "number" && quality < 55;
  const lowConfidence = typeof observation.confidence === "number" && observation.confidence < 70;
  const reason = weakSignal
    ? "La qualité du signal est trop faible pour enrichir cette observation de façon fiable."
    : lowConfidence
      ? "L’identification reste prudente : une nouvelle captation permettrait de mieux la vérifier."
      : "Aucun exécuteur compatible n’est disponible ; la détection brute reste inchangée.";

  return {
    observationId: observation.id,
    summary: "Analyse locale Creature Sync : aucun retour exploitable d’Octopus.",
    actions: [{
      type: "request_recapture",
      reason,
      durationSeconds: 15,
      guidance: "Enregistre à nouveau en te rapprochant légèrement de la source et en évitant les bruits parasites.",
    }],
    octopus: { status: "failed", source: "local" },
  };
}

export class CreatureSyncOctopusAdapter {
  constructor(
    private readonly config: CreatureSyncOctopusConfig,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  async handle(observation: CreatureObservation): Promise<CreatureObservationResult> {
    if (!this.config.enabled) {
      return {
        observationId: observation.id,
        summary: "Adaptateur Octopus désactivé.",
        actions: [],
        octopus: { status: "disabled", source: "disabled" },
      };
    }

    const startedAt = performance.now();
    const controller = new AbortController();
    const timeoutId = globalThis.setTimeout(() => controller.abort(), this.config.timeoutMs ?? DEFAULT_TIMEOUT_MS);
    const endpoint = (this.config.endpoint || DEFAULT_OCTOPUS_API).replace(/\/$/, "");

    try {
      const response = await this.fetchImpl(`${endpoint}/mission`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        signal: controller.signal,
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
              adapter: "creature-sync-octopus-v3",
              event: "observation.detected",
              observation,
            },
          },
          requiredCapabilities: ["observation.analyze"],
          authorizationPolicy: { internalWork: "allowed", externalAction: "forbidden" },
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
      });

      if (!response.ok) return { ...localFallback(observation), octopus: { status: "failed", source: "local", latencyMs: Math.round(performance.now() - startedAt) } };

      const raw = await response.json() as unknown;
      const actions = normalizeActions(raw);
      if (actions.length === 0) return { ...localFallback(observation), octopus: { status: "failed", source: "local", latencyMs: Math.round(performance.now() - startedAt) } };

      return {
        observationId: observation.id,
        summary: extractSummary(raw),
        actions,
        octopus: { status: "completed", source: "remote", latencyMs: Math.round(performance.now() - startedAt) },
      };
    } catch {
      return { ...localFallback(observation), octopus: { status: "failed", source: "local", latencyMs: Math.round(performance.now() - startedAt) } };
    } finally {
      globalThis.clearTimeout(timeoutId);
    }
  }
}
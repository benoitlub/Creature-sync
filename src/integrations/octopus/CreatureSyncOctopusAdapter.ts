import type {
  CreatureObservation,
  CreatureObservationAction,
  CreatureObservationResult,
  CreatureSyncOctopusConfig,
} from "./types";

const DEFAULT_TIMEOUT_MS = 6000;
const ACCEPTED_STATUSES = new Set(["completed", "queued", "running", "accepted", "ok", "success"]);

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function localFallback(observation: CreatureObservation, detail?: string): CreatureObservationResult {
  const quality = observation.metrics?.signalQuality;
  const weakSignal = typeof quality === "number" && quality < 55;
  const lowConfidence = typeof observation.confidence === "number" && observation.confidence < 70;
  const reason = weakSignal
    ? "La qualité du signal est trop faible pour transmettre cette observation de façon fiable."
    : lowConfidence
      ? "L’identification locale reste prudente : une nouvelle captation permettrait de mieux la vérifier."
      : "L’observation reste conservée localement sans encombrer la mémoire d’Octopus.";

  return {
    observationId: observation.id,
    summary: detail ? `Mode local · ${detail}` : "Mode local Creature Sync.",
    actions: [{
      type: "request_recapture",
      reason,
      durationSeconds: 15,
      guidance: "Enregistre à nouveau seulement si tu souhaites confirmer cette observation.",
    }],
    octopus: { status: "failed", source: "local" },
  };
}

function translateKnowledge(payload: unknown): CreatureObservationAction[] {
  const source = asRecord(payload);
  const output = asRecord(source.output);
  const knowledge = asRecord(output.knowledge);
  const aggregates = asRecord(knowledge.aggregates);
  const trend = asRecord(knowledge.trend);
  const relations = Array.isArray(knowledge.relations) ? knowledge.relations : [];
  const relatedCount = typeof aggregates.relatedCount === "number" ? aggregates.relatedCount : relations.length;
  const observedCount = typeof aggregates.observedCount === "number" ? aggregates.observedCount : undefined;
  const direction = typeof trend.direction === "string" ? trend.direction : "insufficient-data";

  if (relatedCount <= 0 && !observedCount) return [];

  const message = relatedCount > 0
    ? `${relatedCount} observation${relatedCount > 1 ? "s" : ""} similaire${relatedCount > 1 ? "s" : ""} reliée${relatedCount > 1 ? "s" : ""}${observedCount ? ` sur ${observedCount} enregistrée${observedCount > 1 ? "s" : ""}` : ""}. Tendance : ${direction}.`
    : `Observation enregistrée · ${observedCount} observation${observedCount && observedCount > 1 ? "s" : ""} dans la mémoire.`;

  return [{ type: "notify_user", title: "Mémoire Octopus", message }];
}

function extractSummary(payload: unknown): string | undefined {
  const source = asRecord(payload);
  const output = asRecord(source.output);
  const value = source.summary || source.message || output.reason || output.summary || output.message;
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function extractStatus(payload: unknown) {
  const source = asRecord(payload);
  const output = asRecord(source.output);
  return String(source.status || output.status || "").trim().toLowerCase();
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

    const endpoint = String(this.config.endpoint || "").replace(/\/$/, "");
    if (!endpoint) return localFallback(observation, "aucun serveur Octopus configuré");

    const startedAt = performance.now();
    const controller = new AbortController();
    const timeoutId = globalThis.setTimeout(() => controller.abort(), this.config.timeoutMs ?? DEFAULT_TIMEOUT_MS);

    try {
      const response = await this.fetchImpl(`${endpoint}/mission`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          operationId: `observation_${observation.id}`,
          title: "Receive and deduplicate one stabilized external observation.",
          objective: "Preserve only this supplied observation and return memory relations when useful.",
          context: {
            id: `observation:${observation.id}`,
            label: "Stabilized external observation",
            objective: "Preserve only this supplied observation and return memory relations when useful.",
            metadata: {
              source: "external-application",
              ingestionPolicy: { stabilizedOnly: true, deduplicate: true, noFollowUpMission: true },
              event: {
                occurredAt: observation.timestamp,
                modality: observation.source,
                classification: {
                  label: observation.rawLabel,
                  category: observation.category,
                  candidate: observation.species,
                  scientificName: observation.scientificName,
                  confidence: observation.confidence,
                },
                context: {
                  description: observation.context,
                  place: observation.location,
                  habitat: observation.habitat,
                },
                metrics: observation.metrics,
                mediaRef: observation.mediaRef,
              },
            },
          },
          requiredCapabilities: ["observation.receive"],
          authorizationPolicy: { internalWork: "allowed", externalAction: "forbidden" },
          authorizedResources: [],
        }),
      });

      const latencyMs = Math.round(performance.now() - startedAt);
      if (!response.ok) {
        return {
          ...localFallback(observation, `HTTP ${response.status}`),
          octopus: { status: "failed", source: "local", latencyMs },
        };
      }

      const raw = await response.json() as unknown;
      const status = extractStatus(raw);
      if (status && !ACCEPTED_STATUSES.has(status)) {
        return {
          ...localFallback(observation, `statut ${status}`),
          octopus: { status: "failed", source: "local", latencyMs },
        };
      }

      return {
        observationId: observation.id,
        summary: extractSummary(raw) || (status === "queued" || status === "running"
          ? "Observation acceptée par Octopus et placée en mémoire."
          : "Observation reçue par Octopus."),
        actions: translateKnowledge(raw),
        octopus: { status: "completed", source: "remote", latencyMs },
      };
    } catch (error) {
      const detail = error instanceof Error
        ? error.name === "AbortError" ? "délai dépassé" : error.message
        : "erreur réseau";
      return {
        ...localFallback(observation, detail),
        octopus: { status: "failed", source: "local", latencyMs: Math.round(performance.now() - startedAt) },
      };
    } finally {
      globalThis.clearTimeout(timeoutId);
    }
  }
}

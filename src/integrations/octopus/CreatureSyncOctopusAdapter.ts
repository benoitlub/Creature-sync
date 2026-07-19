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

function localFallback(observation: CreatureObservation): CreatureObservationResult {
  const quality = observation.metrics?.signalQuality;
  const weakSignal = typeof quality === "number" && quality < 55;
  const lowConfidence = typeof observation.confidence === "number" && observation.confidence < 70;
  const reason = weakSignal
    ? "La qualité du signal est trop faible pour transmettre cette observation de façon fiable."
    : lowConfidence
      ? "L’identification locale reste prudente : une nouvelle captation permettrait de mieux la vérifier."
      : "Octopus n’a pas pu enregistrer cette observation ; la détection brute reste conservée localement.";

  return {
    observationId: observation.id,
    summary: "Mode local Creature Sync : aucun accusé de réception d’Octopus.",
    actions: [{
      type: "request_recapture",
      reason,
      durationSeconds: 15,
      guidance: "Enregistre à nouveau en te rapprochant légèrement de la source et en évitant les bruits parasites.",
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

  const message = relatedCount > 0
    ? `${relatedCount} observation${relatedCount > 1 ? "s" : ""} similaire${relatedCount > 1 ? "s" : ""} reliée${relatedCount > 1 ? "s" : ""}${observedCount ? ` sur ${observedCount} enregistrée${observedCount > 1 ? "s" : ""}` : ""}. Tendance : ${direction}.`
    : `Observation enregistrée${observedCount ? ` · ${observedCount} observation${observedCount > 1 ? "s" : ""} dans la mémoire` : ""}. Pas encore assez de données comparables.`;

  return [{ type: "notify_user", title: "Mémoire Octopus", message }];
}

function extractSummary(payload: unknown): string | undefined {
  const source = asRecord(payload);
  const output = asRecord(source.output);
  const value = source.summary || source.message || output.reason || output.summary || output.message;
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
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
          operationId: `observation_${observation.id}`,
          title: "Receive external observation",
          objective: "Receive, timestamp, record and compare a domain-neutral observation.",
          context: {
            id: `observation:${observation.id}`,
            label: "External observation",
            objective: "Preserve the supplied observation and return universal memory relations.",
            metadata: {
              source: "external-application",
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
          authorizedResources: [],
        }),
      });

      if (!response.ok) {
        return {
          ...localFallback(observation),
          octopus: { status: "failed", source: "local", latencyMs: Math.round(performance.now() - startedAt) },
        };
      }

      const raw = await response.json() as unknown;
      const source = asRecord(raw);
      if (source.status !== "completed") {
        return {
          ...localFallback(observation),
          octopus: { status: "failed", source: "local", latencyMs: Math.round(performance.now() - startedAt) },
        };
      }

      return {
        observationId: observation.id,
        summary: extractSummary(raw) || "Observation reçue et enregistrée par Octopus.",
        actions: translateKnowledge(raw),
        octopus: { status: "completed", source: "remote", latencyMs: Math.round(performance.now() - startedAt) },
      };
    } catch {
      return {
        ...localFallback(observation),
        octopus: { status: "failed", source: "local", latencyMs: Math.round(performance.now() - startedAt) },
      };
    } finally {
      globalThis.clearTimeout(timeoutId);
    }
  }
}

import type {
  CreatureObservation,
  CreatureObservationAction,
  CreatureObservationResult,
  CreatureSyncOctopusConfig,
} from "./types";

const DEFAULT_TIMEOUT_MS = 2500;

function fallbackVoice(observation: CreatureObservation) {
  const creature = observation.species || "Créature observatrice";
  if (observation.category === "aircraft") {
    return {
      creature,
      text: "Les grands oiseaux de métal traversent encore le ciel. Ils ne nichent jamais, mais les humains lèvent toujours la tête.",
    };
  }
  return {
    creature,
    text: observation.context.trim() || `J’ai remarqué ${observation.rawLabel.toLowerCase()} près d’ici.`,
  };
}

function extractText(output: unknown): string | null {
  if (!output || typeof output !== "object" || Array.isArray(output)) return null;
  const value = output as Record<string, unknown>;
  if (typeof value.text === "string" && value.text.trim()) return value.text.trim();
  if (typeof value.content === "string" && value.content.trim()) return value.content.trim();
  return null;
}

export class CreatureSyncOctopusAdapter {
  constructor(
    private readonly config: CreatureSyncOctopusConfig,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  async handle(observation: CreatureObservation): Promise<CreatureObservationResult> {
    const fallback = fallbackVoice(observation);
    let voice = fallback;
    let status: CreatureObservationResult["octopus"]["status"] = "disabled";
    let latencyMs: number | undefined;

    if (this.config.enabled && this.config.endpoint) {
      const startedAt = performance.now();
      const controller = new AbortController();
      const timeoutId = globalThis.setTimeout(
        () => controller.abort(),
        this.config.timeoutMs ?? DEFAULT_TIMEOUT_MS,
      );

      try {
        const response = await this.fetchImpl(`${this.config.endpoint.replace(/\/$/, "")}/mission`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            operationId: `creature_${observation.id}`,
            title: `Donner une voix à ${observation.species || observation.rawLabel}`,
            objective: "Produire une phrase brève, poétique et ancrée dans l’observation, dite par l’animal lui-même.",
            context: {
              id: `creature-sync:${observation.id}`,
              label: observation.species || observation.rawLabel,
              objective: observation.context,
              metadata: { source: "creature-sync", observation },
            },
            requiredCapabilities: ["narrative.generate"],
            authorizedResources: ["mistral"],
            prompt: [
              "Tu écris une seule phrase en français, 30 mots maximum.",
              `La voix est celle de : ${observation.species || "un animal témoin"}.`,
              `Observation : ${observation.rawLabel}.`,
              `Contexte : ${observation.context || "aucun détail supplémentaire"}.`,
              `Lieu : ${observation.location || "non précisé"}.`,
              "Ne donne aucune explication et ne mets pas de guillemets.",
            ].join("\n"),
          }),
        });

        if (!response.ok) throw new Error(`Octopus mission failed (${response.status})`);
        const mission = await response.json() as Record<string, unknown>;
        const generated = extractText(mission.output);
        if (mission.status === "completed" && generated) {
          voice = { creature: observation.species || fallback.creature, text: generated };
          status = "completed";
        } else {
          status = "failed";
        }
      } catch {
        status = "failed";
      } finally {
        latencyMs = Math.round(performance.now() - startedAt);
        globalThis.clearTimeout(timeoutId);
      }
    }

    const actions: CreatureObservationAction[] = [
      { type: "speak_as_creature", ...voice },
      {
        type: "save_to_notion",
        database: "Creature-Sync observations",
        payload: { observation, voice, source: "creature-sync" },
      },
    ];

    return { observationId: observation.id, actions, octopus: { status, latencyMs } };
  }
}
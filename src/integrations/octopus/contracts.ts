export type ObservationSource = "audio" | "manual" | "camera" | "ambient";

export type ObservationCategory =
  | "animal"
  | "weather"
  | "human_activity"
  | "aircraft"
  | "unknown";

export type CreatureObservationEvent = {
  id: string;
  timestamp: string;
  location?: string;
  source: ObservationSource;
  species?: string;
  category: ObservationCategory;
  confidence?: number;
  rawLabel: string;
  context: string;
  mediaRef?: string;
};

export type OctopusAction =
  | {
      type: "speak_as_creature";
      creature: string;
      text: string;
    }
  | {
      type: "save_to_notion";
      database?: string;
      payload?: Record<string, unknown>;
    }
  | {
      type: "notify_user";
      title: string;
      message: string;
    }
  | {
      type: "ignore";
      reason?: string;
    };

export type OctopusObservationResponse = {
  observationId: string;
  actions: OctopusAction[];
};

export const CREATURE_OBSERVATION_EVENT = "creature-sync:observation";
export const OCTOPUS_ACTION_EVENT = "creature-sync:octopus-action";

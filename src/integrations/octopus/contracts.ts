export type ObservationSource = "audio" | "manual" | "camera" | "ambient";

export type ObservationCategory =
  | "animal"
  | "weather"
  | "human_activity"
  | "aircraft"
  | "unknown";

export type ObservationMetrics = {
  dominantFreq?: number;
  spectralCentroid?: number;
  rms?: number;
  clarity?: number;
  resonance?: number;
  signalQuality?: number;
};

export type CreatureObservationEvent = {
  id: string;
  timestamp: string;
  location?: string;
  source: ObservationSource;
  species?: string;
  scientificName?: string;
  category: ObservationCategory;
  confidence?: number;
  rawLabel: string;
  context: string;
  habitat?: string;
  metrics?: ObservationMetrics;
  mediaRef?: string;
};

export type OctopusInsight =
  | {
      type: "hypothesis";
      label: string;
      confidence?: number;
      reason?: string;
    }
  | {
      type: "request_recapture";
      reason: string;
      durationSeconds?: number;
      guidance?: string;
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
  status: "completed" | "queued" | "running" | "blocked" | "failed";
  summary?: string;
  insights: OctopusInsight[];
  raw?: unknown;
};

export const CREATURE_OBSERVATION_EVENT = "creature-sync:observation";
export const OCTOPUS_ACTION_EVENT = "creature-sync:octopus-action";

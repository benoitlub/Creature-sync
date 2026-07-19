export type CreatureObservation = {
  id: string;
  timestamp: string;
  location?: string;
  source: "audio" | "manual" | "camera" | "ambient";
  species?: string;
  scientificName?: string;
  category: "animal" | "weather" | "human_activity" | "aircraft" | "unknown";
  confidence?: number;
  rawLabel: string;
  context: string;
  habitat?: string;
  metrics?: {
    dominantFreq?: number;
    spectralCentroid?: number;
    rms?: number;
    clarity?: number;
    resonance?: number;
    signalQuality?: number;
  };
  mediaRef?: string;
};

export type CreatureObservationAction =
  | { type: "hypothesis"; label: string; confidence?: number; reason?: string }
  | { type: "request_recapture"; reason: string; durationSeconds?: number; guidance?: string }
  | { type: "notify_user"; title: string; message: string }
  | { type: "save_to_notion"; database?: string; payload?: Record<string, unknown> }
  | { type: "ignore"; reason?: string };

export type CreatureObservationResult = {
  observationId: string;
  summary?: string;
  actions: CreatureObservationAction[];
  octopus: { status: "disabled" | "completed" | "failed"; latencyMs?: number; source: "remote" | "local" | "disabled" };
};

export type CreatureSyncOctopusConfig = {
  enabled: boolean;
  endpoint?: string;
  timeoutMs?: number;
};
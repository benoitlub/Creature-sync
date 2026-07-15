export type CreatureObservation = {
  id: string;
  timestamp: string;
  location?: string;
  source: "audio" | "manual" | "camera" | "ambient";
  species?: string;
  category: "animal" | "weather" | "human_activity" | "aircraft" | "unknown";
  confidence?: number;
  rawLabel: string;
  context: string;
  mediaRef?: string;
};

export type CreatureObservationAction =
  | { type: "speak_as_creature"; creature: string; text: string }
  | { type: "save_to_notion"; database?: string; payload?: Record<string, unknown> }
  | { type: "notify_user"; title: string; message: string }
  | { type: "ignore"; reason?: string };

export type CreatureObservationResult = {
  observationId: string;
  actions: CreatureObservationAction[];
  octopus: { status: "disabled" | "completed" | "failed"; latencyMs?: number };
};

export type CreatureSyncOctopusConfig = {
  enabled: boolean;
  endpoint?: string;
  timeoutMs?: number;
};
import { CreatureSyncOctopusAdapter } from "./CreatureSyncOctopusAdapter";

const enabled = import.meta.env.VITE_OCTOPUS_ADAPTER_ENABLED === "true" || import.meta.env.VITE_OCTOPUS_ADAPTER_ENABLED === "1";
const timeout = Number(import.meta.env.VITE_OCTOPUS_ADAPTER_TIMEOUT_MS);

export const createCreatureSyncOctopusAdapter = () => new CreatureSyncOctopusAdapter({
  enabled,
  endpoint: import.meta.env.VITE_OCTOPUS_ADAPTER_ENDPOINT,
  timeoutMs: Number.isFinite(timeout) && timeout > 0 ? timeout : undefined,
});

export { CreatureSyncOctopusAdapter } from "./CreatureSyncOctopusAdapter";
export type {
  CreatureObservation,
  CreatureObservationAction,
  CreatureObservationResult,
  CreatureSyncOctopusConfig,
} from "./types";
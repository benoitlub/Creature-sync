import { CreatureSyncOctopusAdapter } from "./CreatureSyncOctopusAdapter";

const enabledFlag = import.meta.env.VITE_OCTOPUS_ADAPTER_ENABLED;
const enabled = enabledFlag !== "false" && enabledFlag !== "0";
const timeout = Number(import.meta.env.VITE_OCTOPUS_ADAPTER_TIMEOUT_MS);

export const createCreatureSyncOctopusAdapter = () => new CreatureSyncOctopusAdapter({
  enabled,
  endpoint: import.meta.env.VITE_OCTOPUS_ADAPTER_ENDPOINT || import.meta.env.VITE_OCTOPUS_API_URL,
  timeoutMs: Number.isFinite(timeout) && timeout > 0 ? timeout : undefined,
});

export { CreatureSyncOctopusAdapter } from "./CreatureSyncOctopusAdapter";
export type {
  CreatureObservation,
  CreatureObservationAction,
  CreatureObservationResult,
  CreatureSyncOctopusConfig,
} from "./types";
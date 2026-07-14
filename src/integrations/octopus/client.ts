import type {
  CreatureObservationEvent,
  OctopusObservationResponse,
} from "./contracts";

const DEFAULT_TIMEOUT_MS = 4500;

function getEndpoint() {
  return import.meta.env.VITE_OCTOPUS_OBSERVATION_URL?.trim() || "";
}

export function isOctopusBridgeEnabled() {
  return Boolean(getEndpoint());
}

export async function sendObservationToOctopus(
  observation: CreatureObservationEvent,
): Promise<OctopusObservationResponse | null> {
  const endpoint = getEndpoint();
  if (!endpoint) return null;

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(observation),
      signal: controller.signal,
    });

    if (!response.ok) return null;
    return (await response.json()) as OctopusObservationResponse;
  } catch {
    return null;
  } finally {
    window.clearTimeout(timeout);
  }
}

import { useEffect, useState } from "react";
import {
  CREATURE_OBSERVATION_EVENT,
  OCTOPUS_ACTION_EVENT,
  type CreatureObservationEvent,
  type OctopusAction,
} from "../integrations/octopus/contracts";
import {
  isOctopusBridgeEnabled,
  sendObservationToOctopus,
} from "../integrations/octopus/client";

type BridgeState = {
  status: "idle" | "sending" | "offline" | "done";
  action: OctopusAction | null;
};

export function OctopusObservationBridge() {
  const [state, setState] = useState<BridgeState>({ status: "idle", action: null });

  useEffect(() => {
    const handleObservation = async (event: Event) => {
      const observation = (event as CustomEvent<CreatureObservationEvent>).detail;
      if (!observation) return;

      if (!isOctopusBridgeEnabled()) {
        setState({ status: "offline", action: null });
        return;
      }

      setState({ status: "sending", action: null });
      const response = await sendObservationToOctopus(observation);
      const action = response?.actions?.find((item) => item.type === "speak_as_creature")
        ?? response?.actions?.find((item) => item.type === "notify_user")
        ?? null;

      setState({ status: response ? "done" : "offline", action });
      if (response) {
        window.dispatchEvent(new CustomEvent(OCTOPUS_ACTION_EVENT, { detail: response }));
      }
    };

    window.addEventListener(CREATURE_OBSERVATION_EVENT, handleObservation);
    return () => window.removeEventListener(CREATURE_OBSERVATION_EVENT, handleObservation);
  }, []);

  if (state.status === "idle") return null;

  const text = state.action?.type === "speak_as_creature"
    ? `${state.action.creature} : « ${state.action.text} »`
    : state.action?.type === "notify_user"
      ? `${state.action.title} — ${state.action.message}`
      : state.status === "sending"
        ? "Octopus examine l’observation…"
        : "Observation conservée localement · Octopus indisponible";

  return (
    <aside
      aria-live="polite"
      className="fixed left-3 right-3 bottom-3 z-40 mx-auto max-w-xl rounded-lg border px-3 py-2 text-[10px] font-mono tracking-wide backdrop-blur-md"
      style={{
        borderColor: state.status === "offline" ? "#ff8c0044" : "#00d4ff44",
        background: "rgba(2, 8, 20, 0.92)",
        color: state.status === "offline" ? "#ffbf7a" : "#b8f5ff",
        boxShadow: "0 0 20px rgba(0,212,255,0.12)",
      }}
    >
      <span className="mr-2 text-cyan-400/60">OCTOPUS</span>
      {text}
    </aside>
  );
}

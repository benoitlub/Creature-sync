import { useEffect, useMemo, useState } from "react";
import {
  CREATURE_OBSERVATION_EVENT,
  OCTOPUS_ACTION_EVENT,
  type CreatureObservationEvent,
} from "../integrations/octopus/contracts";
import { createCreatureSyncOctopusAdapter } from "../integrations/octopus";
import type { CreatureObservationAction, CreatureObservationResult } from "../integrations/octopus/types";

type BridgeState = {
  status: "idle" | "sending" | "offline" | "done";
  action: CreatureObservationAction | null;
  result?: CreatureObservationResult;
};

export function OctopusObservationBridge() {
  const adapter = useMemo(() => createCreatureSyncOctopusAdapter(), []);
  const [state, setState] = useState<BridgeState>({ status: "idle", action: null });
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const handleObservation = async (event: Event) => {
      const observation = (event as CustomEvent<CreatureObservationEvent>).detail;
      if (!observation) return;

      setState({ status: "sending", action: null });
      const result = await adapter.handle(observation);
      const action = result.actions.find(item => item.type === "request_recapture")
        ?? result.actions.find(item => item.type === "hypothesis")
        ?? result.actions.find(item => item.type === "notify_user")
        ?? result.actions[0]
        ?? null;

      setState({
        status: result.octopus.source === "disabled" ? "offline" : "done",
        action,
        result,
      });
      window.dispatchEvent(new CustomEvent(OCTOPUS_ACTION_EVENT, { detail: result }));
    };

    window.addEventListener(CREATURE_OBSERVATION_EVENT, handleObservation);
    return () => window.removeEventListener(CREATURE_OBSERVATION_EVENT, handleObservation);
  }, [adapter]);

  if (state.status === "idle") return null;

  const action = state.action;
  const text = action?.type === "hypothesis"
    ? `Hypothèse à vérifier : ${action.label}${typeof action.confidence === "number" ? ` · ${Math.round(action.confidence)} %` : ""}`
    : action?.type === "request_recapture"
      ? `Nouvelle captation conseillée : ${action.reason}${action.guidance ? ` · ${action.guidance}` : ""}`
      : action?.type === "notify_user"
        ? `${action.title} — ${action.message}`
        : state.status === "sending"
          ? "L’adaptateur Creature Sync transmet l’observation à Octopus…"
          : state.status === "offline"
            ? "Observation conservée localement · adaptateur Octopus désactivé"
            : state.result?.summary || "Observation traitée par l’adaptateur Creature Sync";

  const source = state.result?.octopus.source;
  const sourceLabel = source === "remote" ? "OCTOPUS DISTANT" : source === "local" ? "ANALYSE LOCALE" : "ADAPTATEUR";

  return (
    <aside
      aria-live="polite"
      className="fixed left-3 right-3 top-[5.6rem] z-40 mx-auto max-w-xl rounded-lg border px-3 py-2 text-[10px] font-mono tracking-wide backdrop-blur-md"
      style={{
        borderColor: source === "local" || state.status === "offline" ? "#ff8c0044" : "#00d4ff44",
        background: "rgba(2, 8, 20, 0.92)",
        color: source === "local" || state.status === "offline" ? "#ffbf7a" : "#b8f5ff",
        boxShadow: "0 0 20px rgba(0,212,255,0.12)",
      }}
    >
      <button
        type="button"
        onClick={() => setExpanded(value => !value)}
        className="flex w-full items-center gap-2 text-left"
        aria-expanded={expanded}
      >
        <span className="shrink-0 text-cyan-400/60">{sourceLabel}</span>
        <span className={expanded ? "" : "truncate"}>{text}</span>
        <span className="ml-auto shrink-0 text-cyan-300/50">{expanded ? "−" : "+"}</span>
      </button>
    </aside>
  );
}
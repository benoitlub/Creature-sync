import { useEffect, useState } from "react";
import {
  CREATURE_OBSERVATION_EVENT,
  OCTOPUS_ACTION_EVENT,
  type CreatureObservationEvent,
  type OctopusInsight,
} from "../integrations/octopus/contracts";
import {
  isOctopusBridgeEnabled,
  sendObservationToOctopus,
} from "../integrations/octopus/client";

type BridgeState = {
  status: "idle" | "sending" | "offline" | "done";
  insight: OctopusInsight | null;
  summary?: string;
};

export function OctopusObservationBridge() {
  const [state, setState] = useState<BridgeState>({ status: "idle", insight: null });
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const handleObservation = async (event: Event) => {
      const observation = (event as CustomEvent<CreatureObservationEvent>).detail;
      if (!observation) return;

      if (!isOctopusBridgeEnabled()) {
        setState({ status: "offline", insight: null });
        return;
      }

      setState({ status: "sending", insight: null });
      const response = await sendObservationToOctopus(observation);
      const insight = response?.insights.find((item) => item.type === "request_recapture")
        ?? response?.insights.find((item) => item.type === "hypothesis")
        ?? response?.insights.find((item) => item.type === "notify_user")
        ?? null;

      setState({
        status: response ? "done" : "offline",
        insight,
        summary: response?.summary,
      });
      if (response) {
        window.dispatchEvent(new CustomEvent(OCTOPUS_ACTION_EVENT, { detail: response }));
      }
    };

    window.addEventListener(CREATURE_OBSERVATION_EVENT, handleObservation);
    return () => window.removeEventListener(CREATURE_OBSERVATION_EVENT, handleObservation);
  }, []);

  if (state.status === "idle") return null;

  const text = state.insight?.type === "hypothesis"
    ? `Hypothèse à vérifier : ${state.insight.label}${typeof state.insight.confidence === "number" ? ` · ${Math.round(state.insight.confidence)} %` : ""}`
    : state.insight?.type === "request_recapture"
      ? `Nouvelle captation conseillée : ${state.insight.reason}${state.insight.guidance ? ` · ${state.insight.guidance}` : ""}`
      : state.insight?.type === "notify_user"
        ? `${state.insight.title} — ${state.insight.message}`
        : state.status === "sending"
          ? "Octopus examine les mesures de l’observation…"
          : state.status === "offline"
            ? "Observation conservée localement · Octopus indisponible"
            : state.summary || "Observation reçue · aucune correction nécessaire";

  return (
    <aside
      aria-live="polite"
      className="fixed left-3 right-3 top-[5.6rem] z-40 mx-auto max-w-xl rounded-lg border px-3 py-2 text-[10px] font-mono tracking-wide backdrop-blur-md"
      style={{
        borderColor: state.status === "offline" ? "#ff8c0044" : "#00d4ff44",
        background: "rgba(2, 8, 20, 0.92)",
        color: state.status === "offline" ? "#ffbf7a" : "#b8f5ff",
        boxShadow: "0 0 20px rgba(0,212,255,0.12)",
      }}
    >
      <button
        type="button"
        onClick={() => setExpanded(value => !value)}
        className="flex w-full items-center gap-2 text-left"
        aria-expanded={expanded}
      >
        <span className="shrink-0 text-cyan-400/60">OCTOPUS · INFLUX</span>
        <span className={expanded ? "" : "truncate"}>{text}</span>
        <span className="ml-auto shrink-0 text-cyan-300/50">{expanded ? "−" : "+"}</span>
      </button>
    </aside>
  );
}

import { type AnalysisState, getThreatColor } from "../data/translations";

type PanelProps = { className?: string; children: React.ReactNode; label: string; accent?: string };

export function Panel({ className = "", children, label, accent = "#00d4ff" }: PanelProps) {
  return (
    <div
      className={`relative rounded border p-3 backdrop-blur-sm ${className}`}
      style={{
        background: "rgba(2, 8, 20, 0.75)",
        borderColor: accent + "33",
        boxShadow: `0 0 12px ${accent}11, inset 0 0 12px ${accent}08`,
      }}
    >
      <div
        className="absolute -top-px left-3 right-3 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}88, transparent)` }}
      />
      <div
        className="text-[9px] font-mono tracking-[0.3em] uppercase mb-2 flex items-center gap-2"
        style={{ color: accent }}
      >
        <div className="w-1 h-1 rounded-full" style={{ background: accent, boxShadow: `0 0 4px ${accent}` }} />
        {label}
      </div>
      {children}
    </div>
  );
}

function Bar({ value, color, label, sublabel }: { value: number; color: string; label: string; sublabel?: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-baseline">
        <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider">{label}</span>
        {sublabel && <span className="text-[9px] font-mono" style={{ color }}>{sublabel}</span>}
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: `0 0 6px ${color}`,
          }}
        />
      </div>
    </div>
  );
}

function Placeholder({ text = "AWAITING SIGNAL" }: { text?: string }) {
  return (
    <div className="text-[10px] font-mono text-gray-600 tracking-widest py-1">{text}</div>
  );
}

export function SpeciesPanel({ state }: { state: AnalysisState }) {
  const ready = state.isComplete && state.species;
  return (
    <Panel label="SPECIES IDENTIFICATION" accent="#00d4ff">
      {ready && state.species ? (
        <div className="space-y-1">
          <div className="text-base font-mono font-bold text-white tracking-wider">{state.species.name}</div>
          <div className="text-[10px] font-mono text-cyan-400/70 italic">{state.species.scientificName}</div>
          <div className="flex flex-wrap gap-1 mt-2">
            {state.species.personality.map(p => (
              <span key={p} className="text-[8px] font-mono px-1.5 py-0.5 rounded border border-cyan-400/20 text-cyan-300/70 tracking-wider">{p}</span>
            ))}
          </div>
          <div className="mt-2">
            <Bar value={state.confidence} color="#00d4ff" label="CONFIDENCE" sublabel={`${state.confidence}%`} />
          </div>
        </div>
      ) : (
        <Placeholder text={state.isAnalyzing ? "SCANNING..." : "NO SIGNAL"} />
      )}
    </Panel>
  );
}

export function EmotionalPanel({ state }: { state: AnalysisState }) {
  const ready = state.isComplete;
  return (
    <Panel label="EMOTIONAL FREQUENCY" accent="#ff8c00">
      {ready ? (
        <div className="space-y-2">
          <div className="text-[11px] font-mono text-orange-400 tracking-wider">{state.emotionalState}</div>
          <Bar value={state.neuralResonance} color="#ff8c00" label="NEURAL RESONANCE" sublabel={`${state.neuralResonance}%`} />
          <Bar value={state.signalQuality} color="#ffcc00" label="SIGNAL CLARITY" sublabel={`${state.signalQuality}%`} />
        </div>
      ) : (
        <Placeholder text={state.isAnalyzing ? "CALIBRATING..." : "OFFLINE"} />
      )}
    </Panel>
  );
}

export function ThreatPanel({ state }: { state: AnalysisState }) {
  const ready = state.isComplete;
  const color = getThreatColor(state.threatLevel);
  const levels = ["MINIMAL", "LOW", "MODERATE", "ELEVATED", "CRITICAL"] as const;
  const idx = levels.indexOf(state.threatLevel);
  return (
    <Panel label="THREAT ASSESSMENT" accent="#ff4444">
      {ready ? (
        <div className="space-y-2">
          <div
            className="text-lg font-mono font-bold tracking-[0.2em]"
            style={{ color, textShadow: `0 0 10px ${color}` }}
          >
            {state.threatLevel}
          </div>
          <div className="flex gap-1">
            {levels.map((l, i) => (
              <div
                key={l}
                className="flex-1 h-1.5 rounded-sm"
                style={{
                  background: i <= idx ? color : "#ffffff11",
                  boxShadow: i <= idx ? `0 0 4px ${color}` : "none",
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        <Placeholder text={state.isAnalyzing ? "ASSESSING..." : "OFFLINE"} />
      )}
    </Panel>
  );
}

export function BiologicalPanel({ state }: { state: AnalysisState }) {
  const ready = state.isComplete;
  return (
    <Panel label="BIOLOGICAL INTENT" accent="#00ff88">
      {ready ? (
        <div className="text-[11px] font-mono text-green-400 tracking-wider leading-relaxed">
          {state.biologicalIntent}
        </div>
      ) : (
        <Placeholder text={state.isAnalyzing ? "DECODING..." : "OFFLINE"} />
      )}
    </Panel>
  );
}

export function NeuralPanel({ state }: { state: AnalysisState }) {
  const ready = state.isComplete && state.species;
  return (
    <Panel label="NEURAL RESONANCE" accent="#9b59ff">
      {ready && state.species ? (
        <div className="space-y-1.5">
          {state.species.neuralPatterns.map(p => (
            <div key={p} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-purple-400" style={{ boxShadow: "0 0 4px #9b59ff" }} />
              <span className="text-[9px] font-mono text-purple-300/80 tracking-wider">{p}</span>
            </div>
          ))}
        </div>
      ) : (
        <Placeholder text={state.isAnalyzing ? "RESONATING..." : "OFFLINE"} />
      )}
    </Panel>
  );
}

export function EnvironmentPanel({ state }: { state: AnalysisState }) {
  const ready = state.isComplete && state.species;
  return (
    <Panel label="ENVIRONMENTAL SCAN" accent="#ffcc00">
      {ready && state.species ? (
        <div className="space-y-1.5">
          {state.species.environmentalScans.map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-yellow-400" style={{ boxShadow: "0 0 4px #ffcc00" }} />
              <span className="text-[9px] font-mono text-yellow-300/80 tracking-wider">{s}</span>
            </div>
          ))}
        </div>
      ) : (
        <Placeholder text={state.isAnalyzing ? "SCANNING ENVIRONMENT..." : "OFFLINE"} />
      )}
    </Panel>
  );
}

export function SignalQualityPanel({ state, scanProgress }: { state: AnalysisState; scanProgress: number }) {
  return (
    <Panel label="AUDIO SIGNAL QUALITY" accent="#00d4ff">
      <div className="space-y-2">
        <Bar
          value={state.isComplete ? state.signalQuality : state.isAnalyzing ? scanProgress : 0}
          color="#00d4ff"
          label="SIGNAL STRENGTH"
          sublabel={state.isComplete ? `${state.signalQuality}%` : state.isAnalyzing ? `${Math.floor(scanProgress)}%` : "0%"}
        />
        <div className="flex justify-between text-[8px] font-mono text-gray-600 tracking-wider">
          <span>FREQ: {state.isListening ? "2.4–18 kHz" : "---"}</span>
          <span>CODEC: ORNITH-X/v3</span>
        </div>
      </div>
    </Panel>
  );
}

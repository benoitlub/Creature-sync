import { type AnalysisState, type Lang, UI_LABELS, getThreatColor } from "../data/translations";

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

export function SpeciesPanel({ state, lang }: { state: AnalysisState; lang: Lang }) {
  const t = UI_LABELS[lang];
  const ready = state.isComplete && state.species;
  return (
    <Panel label={t.species} accent="#00d4ff">
      {ready && state.species ? (
        <div className="space-y-1">
          <div className="text-base font-mono font-bold text-white tracking-wider">{state.species.name}</div>
          <div className="text-[10px] font-mono text-cyan-400/70 italic">{state.species.scientificName}</div>
          <div className="flex flex-wrap gap-1 mt-2">
            {state.species.personality[lang].map(p => (
              <span key={p} className="text-[8px] font-mono px-1.5 py-0.5 rounded border border-cyan-400/20 text-cyan-300/70 tracking-wider">{p}</span>
            ))}
          </div>
          <div className="mt-2">
            <Bar value={state.confidence} color="#00d4ff" label={t.confidence} sublabel={`${state.confidence}%`} />
          </div>
        </div>
      ) : (
        <Placeholder text={state.isAnalyzing ? t.scanning : t.noSignal} />
      )}
    </Panel>
  );
}

export function EmotionalPanel({ state, lang }: { state: AnalysisState; lang: Lang }) {
  const t = UI_LABELS[lang];
  const ready = state.isComplete;
  return (
    <Panel label={t.emotional} accent="#ff8c00">
      {ready ? (
        <div className="space-y-2">
          <div className="text-[11px] font-mono text-orange-400 tracking-wider">{state.emotionalState}</div>
          <Bar value={state.neuralResonance} color="#ff8c00" label={t.resonance} sublabel={`${state.neuralResonance}%`} />
          <Bar value={state.signalQuality} color="#ffcc00" label={t.clarity} sublabel={`${state.signalQuality}%`} />
        </div>
      ) : (
        <Placeholder text={state.isAnalyzing ? t.calibrating : t.offline} />
      )}
    </Panel>
  );
}

export function ThreatPanel({ state, lang }: { state: AnalysisState; lang: Lang }) {
  const t = UI_LABELS[lang];
  const ready = state.isComplete;
  const color = getThreatColor(state.threatLevel);
  const levels: AnalysisState["threatLevel"][] = ["MINIMAL", "LOW", "MODERATE", "ELEVATED", "CRITICAL"];
  const idx = levels.indexOf(state.threatLevel);
  return (
    <Panel label={t.threat} accent="#ff4444">
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
        <Placeholder text={state.isAnalyzing ? t.assessing : t.offline} />
      )}
    </Panel>
  );
}

export function BiologicalPanel({ state, lang }: { state: AnalysisState; lang: Lang }) {
  const t = UI_LABELS[lang];
  const ready = state.isComplete;
  return (
    <Panel label={t.biological} accent="#00ff88">
      {ready ? (
        <div className="text-[11px] font-mono text-green-400 tracking-wider leading-relaxed">
          {state.biologicalIntent}
        </div>
      ) : (
        <Placeholder text={state.isAnalyzing ? t.decoding2 : t.offline} />
      )}
    </Panel>
  );
}

export function NeuralPanel({ state, lang }: { state: AnalysisState; lang: Lang }) {
  const t = UI_LABELS[lang];
  const ready = state.isComplete && state.species;
  return (
    <Panel label={t.neural} accent="#9b59ff">
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
        <Placeholder text={state.isAnalyzing ? t.resonating : t.offline} />
      )}
    </Panel>
  );
}

export function EnvironmentPanel({ state, lang }: { state: AnalysisState; lang: Lang }) {
  const t = UI_LABELS[lang];
  const ready = state.isComplete && state.species;
  return (
    <Panel label={t.environment} accent="#ffcc00">
      {ready && state.species ? (
        <div className="space-y-1.5">
          {state.species.environmentalScans[lang].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-yellow-400" style={{ boxShadow: "0 0 4px #ffcc00" }} />
              <span className="text-[9px] font-mono text-yellow-300/80 tracking-wider">{s}</span>
            </div>
          ))}
        </div>
      ) : (
        <Placeholder text={state.isAnalyzing ? t.envScan : t.offline} />
      )}
    </Panel>
  );
}

export function SignalQualityPanel({ state, scanProgress, lang }: { state: AnalysisState; scanProgress: number; lang: Lang }) {
  const t = UI_LABELS[lang];
  return (
    <Panel label={t.signal} accent="#00d4ff">
      <div className="space-y-2">
        <Bar
          value={state.isComplete ? state.signalQuality : state.isAnalyzing ? scanProgress : 0}
          color="#00d4ff"
          label={t.strength}
          sublabel={state.isComplete ? `${state.signalQuality}%` : state.isAnalyzing ? `${Math.floor(scanProgress)}%` : "0%"}
        />
        <div className="flex justify-between text-[8px] font-mono text-gray-600 tracking-wider">
          <span>{t.freq}: {state.isListening ? "2.4–18 kHz" : "---"}</span>
          <span>{t.codec}: ORNITH-X/v3</span>
        </div>
      </div>
    </Panel>
  );
}

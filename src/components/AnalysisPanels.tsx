import { type AnalysisState, type Lang, UI_LABELS, getThreatColor } from "../data/animals";

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
        className="text-[9px] font-mono tracking-[0.25em] uppercase mb-2 flex items-center gap-2"
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
  const safeValue = Math.max(0, Math.min(100, Math.round(value || 0)));
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-baseline">
        <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider">{label}</span>
        {sublabel && <span className="text-[9px] font-mono" style={{ color }}>{sublabel}</span>}
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${safeValue}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: `0 0 6px ${color}`,
          }}
        />
      </div>
    </div>
  );
}

function Placeholder({ text = "AWAITING SIGNAL" }: { text?: string }) {
  return <div className="text-[10px] font-mono text-gray-600 tracking-widest py-1">{text}</div>;
}

function isActive(state: AnalysisState) {
  return Boolean(state.isComplete || state.isListening || state.isAnalyzing || state.species || state.detectedSpecies);
}

function liveProgress(state: AnalysisState, fallback = 24) {
  if (state.isComplete) return state.confidence || state.signalQuality || 80;
  return Math.max(fallback, Math.min(96, state.scanProgress || fallback));
}

function getPhaseLabel(state: AnalysisState, lang: Lang) {
  const p = state.scanProgress || 0;
  if (state.isComplete) return lang === "fr" ? "CONFIRMÉ" : "CONFIRMED";
  if (p < 25) return lang === "fr" ? "SIGNAL" : "SIGNAL";
  if (p < 55) return lang === "fr" ? "PROBABLE" : "LIKELY";
  return lang === "fr" ? "EN COURS" : "IN PROGRESS";
}

export function SpeciesPanel({ state, lang }: { state: AnalysisState; lang: Lang }) {
  const t = UI_LABELS[lang];
  const active = isActive(state);
  const speciesName = state.species?.name || state.detectedSpecies || (state.isListening ? "SIGNATURE AVIAIRE" : "");
  const commonName = state.species?.scientificName?.[lang] || (state.isListening ? "Classification progressive" : "");
  const confidence = state.isComplete ? state.confidence : liveProgress(state, state.speciesConfidence || 34);

  return (
    <Panel label={t.species} accent="#00d4ff">
      {active && speciesName ? (
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <div className="text-base font-mono font-bold text-white tracking-wider leading-tight">{speciesName}</div>
            {!state.isComplete && <span className="text-[8px] text-cyan-300/70 tracking-widest">{getPhaseLabel(state, lang)}</span>}
          </div>
          <div className="text-[10px] font-mono text-cyan-400/70 italic">{commonName}</div>
          {state.species && (
            <div className="flex flex-wrap gap-1 mt-2">
              {state.species.personality[lang].slice(0, state.isComplete ? 4 : 2).map(p => (
                <span key={p} className="text-[8px] font-mono px-1.5 py-0.5 rounded border border-cyan-400/20 text-cyan-300/70 tracking-wider">{p}</span>
              ))}
            </div>
          )}
          <div className="mt-2">
            <Bar value={confidence} color="#00d4ff" label={t.confidence} sublabel={`${Math.round(confidence)}%`} />
          </div>
        </div>
      ) : (
        <Placeholder text={state.isListening || state.isAnalyzing ? t.scanning : t.noSignal} />
      )}
    </Panel>
  );
}

export function EmotionalPanel({ state, lang }: { state: AnalysisState; lang: Lang }) {
  const t = UI_LABELS[lang];
  const active = isActive(state) && (state.emotionalState || state.isListening || state.isAnalyzing);
  const resonance = state.isComplete ? state.neuralResonance : liveProgress(state, 28);
  const clarity = state.isComplete ? state.signalQuality : Math.max(18, Math.min(92, resonance + 12));

  return (
    <Panel label={t.emotional} accent="#ff8c00">
      {active ? (
        <div className="space-y-2">
          <div className="text-[11px] font-mono text-orange-400 tracking-wider leading-relaxed">
            {state.emotionalState || (lang === "fr" ? "CALIBRAGE ÉMOTIONNEL" : "EMOTIONAL CALIBRATION")}
          </div>
          <Bar value={resonance} color="#ff8c00" label={t.resonance} sublabel={`${Math.round(resonance)}%`} />
          <Bar value={clarity} color="#ffcc00" label={t.clarity} sublabel={`${Math.round(clarity)}%`} />
        </div>
      ) : (
        <Placeholder text={state.isListening || state.isAnalyzing ? t.calibrating : t.offline} />
      )}
    </Panel>
  );
}

export function ThreatPanel({ state, lang }: { state: AnalysisState; lang: Lang }) {
  const t = UI_LABELS[lang];
  const active = isActive(state);
  const liveLevel: AnalysisState["threatLevel"] = state.threatLevel || "LOW";
  const color = getThreatColor(liveLevel);
  const levels: AnalysisState["threatLevel"][] = ["MINIMAL", "LOW", "MODERATE", "ELEVATED", "CRITICAL"];
  const idx = Math.max(0, levels.indexOf(liveLevel));

  return (
    <Panel label={t.threat} accent="#ff4444">
      {active ? (
        <div className="space-y-2">
          <div className="text-lg font-mono font-bold tracking-[0.2em]" style={{ color, textShadow: `0 0 10px ${color}` }}>
            {state.isComplete ? liveLevel : getPhaseLabel(state, lang)}
          </div>
          <div className="flex gap-1">
            {levels.map((l, i) => (
              <div
                key={l}
                className="flex-1 h-1.5 rounded-sm transition-all duration-500"
                style={{ background: i <= idx ? color : "#ffffff11", boxShadow: i <= idx ? `0 0 4px ${color}` : "none" }}
              />
            ))}
          </div>
        </div>
      ) : (
        <Placeholder text={state.isListening || state.isAnalyzing ? t.assessing : t.offline} />
      )}
    </Panel>
  );
}

export function BiologicalPanel({ state, lang }: { state: AnalysisState; lang: Lang }) {
  const t = UI_LABELS[lang];
  const active = isActive(state) && (state.biologicalIntent || state.isListening || state.isAnalyzing);
  return (
    <Panel label={t.biological} accent="#00ff88">
      {active ? (
        <div className="text-[11px] font-mono text-green-400 tracking-wider leading-relaxed">
          {state.biologicalIntent || (lang === "fr" ? "DÉCODAGE DU COMPORTEMENT" : "BEHAVIOR DECODING")}
        </div>
      ) : (
        <Placeholder text={state.isListening || state.isAnalyzing ? t.decoding2 : t.offline} />
      )}
    </Panel>
  );
}

export function NeuralPanel({ state, lang }: { state: AnalysisState; lang: Lang }) {
  const t = UI_LABELS[lang];
  const active = isActive(state);
  const patterns = state.species?.neuralPatterns || ["SIGNAL_LOCK", "BIOACOUSTIC_SYNC", "FIELD_BUFFER"];
  return (
    <Panel label={t.neural} accent="#9b59ff">
      {active ? (
        <div className="space-y-1.5">
          {patterns.slice(0, state.isComplete ? 3 : 2).map(p => (
            <div key={p} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-purple-400" style={{ boxShadow: "0 0 4px #9b59ff" }} />
              <span className="text-[9px] font-mono text-purple-300/80 tracking-wider">{p}</span>
            </div>
          ))}
        </div>
      ) : (
        <Placeholder text={state.isListening || state.isAnalyzing ? t.resonating : t.offline} />
      )}
    </Panel>
  );
}

export function EnvironmentPanel({ state, lang }: { state: AnalysisState; lang: Lang }) {
  const t = UI_LABELS[lang];
  const active = isActive(state);
  const scans = state.isComplete && state.species
    ? state.species.environmentalScans[lang]
    : [state.environmentalScan || (lang === "fr" ? "AMBIANCE : ÉCOUTE EN COURS" : "AMBIENCE: LISTENING")];

  return (
    <Panel label={t.environment} accent="#ffcc00">
      {active ? (
        <div className="space-y-1.5">
          {scans.slice(0, state.isComplete ? 3 : 2).map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-yellow-400" style={{ boxShadow: "0 0 4px #ffcc00" }} />
              <span className="text-[9px] font-mono text-yellow-300/80 tracking-wider leading-relaxed">{s}</span>
            </div>
          ))}
        </div>
      ) : (
        <Placeholder text={state.isListening || state.isAnalyzing ? t.envScan : t.offline} />
      )}
    </Panel>
  );
}

export function SignalQualityPanel({ state, scanProgress, lang }: { state: AnalysisState; scanProgress: number; lang: Lang }) {
  const t = UI_LABELS[lang];
  const active = state.isListening || state.isAnalyzing || state.isComplete;
  const signal = state.isComplete ? state.signalQuality : active ? Math.max(scanProgress, state.signalQuality || 18) : 0;
  return (
    <Panel label={t.signal} accent="#00d4ff">
      <div className="space-y-2">
        <Bar value={signal} color="#00d4ff" label={t.strength} sublabel={`${Math.floor(signal)}%`} />
        <div className="flex justify-between text-[8px] font-mono text-gray-600 tracking-wider">
          <span>{t.freq}: {active ? "0.2–10 kHz" : "---"}</span>
          <span>{t.codec}: CREATURE-SYNC/v3</span>
        </div>
      </div>
    </Panel>
  );
}

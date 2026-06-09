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

function clampPercent(value: number, fallback = 0) {
  const safe = Number.isFinite(value) ? value : fallback;
  return Math.max(0, Math.min(100, Math.round(safe || fallback)));
}

function Bar({ value, color, label, sublabel }: { value: number; color: string; label: string; sublabel?: string }) {
  const safeValue = clampPercent(value);
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-baseline">
        <span className="text-[9px] font-mono text-gray-400 uppercase tracking-wider">{label}</span>
        {sublabel && <span className="text-[9px] font-mono" style={{ color }}>{sublabel}</span>}
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
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

function getLiveConfidence(state: AnalysisState) {
  if (state.isComplete) return state.confidence || state.speciesConfidence || 80;
  return clampPercent(state.speciesConfidence || state.confidence || (state.scanProgress * 0.72 + 18), 24);
}

function getLiveResonance(state: AnalysisState) {
  if (state.isComplete) return state.neuralResonance || 80;
  const f = state.audioFeatures;
  if (state.neuralResonance) return clampPercent(state.neuralResonance);
  if (!f) return clampPercent((state.scanProgress || 0) * 0.6 + 24);
  return clampPercent((f.periodicity || 0) * 190 + (1 - (f.flatness || 0.35)) * 28 + (f.zcr || 0) * 140 + 18);
}

function getLiveClarity(state: AnalysisState) {
  if (state.isComplete) return state.signalQuality || 82;
  const f = state.audioFeatures;
  if (state.signalQuality) return clampPercent(state.signalQuality);
  if (!f) return clampPercent((state.scanProgress || 0) * 0.55 + 20);
  return clampPercent((f.rms || 0) * 520 + (1 - (f.flatness || 0.4)) * 35 + Math.min(22, (f.spectralCentroid || 0) / 180));
}

function getPhaseLabel(state: AnalysisState, lang: Lang) {
  const p = state.scanProgress || 0;
  if (state.isComplete) return lang === "fr" ? "CONFIRMÉ" : lang === "es" ? "CONFIRMADO" : "CONFIRMED";
  if (p < 25) return "SIGNAL";
  if (p < 55) return lang === "fr" ? "PROBABLE" : lang === "es" ? "PROBABLE" : "LIKELY";
  return lang === "fr" ? "EN COURS" : lang === "es" ? "EN CURSO" : "IN PROGRESS";
}

function getAnimalIcon(state: AnalysisState, commonName: string, latinName: string) {
  const raw = `${state.species?.id || ""} ${commonName} ${latinName}`.toLowerCase();
  if (raw.includes("owl") || raw.includes("chouette") || raw.includes("hibou") || raw.includes("strix")) return "🦉";
  if (raw.includes("duck") || raw.includes("canard") || raw.includes("anas")) return "🦆";
  if (raw.includes("cat") || raw.includes("chat") || raw.includes("felis")) return "🐈";
  if (raw.includes("dog") || raw.includes("chien") || raw.includes("canis")) return "🐕";
  if (raw.includes("parakeet") || raw.includes("perruche") || raw.includes("psittacula")) return "🦜";
  if (raw.includes("magpie") || raw.includes("pie") || raw.includes("pica")) return "🐦‍⬛";
  if (raw.includes("crow") || raw.includes("corbeau") || raw.includes("corneille") || raw.includes("corvus")) return "🐦‍⬛";
  if (raw.includes("pigeon") || raw.includes("columba")) return "🕊️";
  if (raw.includes("blackbird") || raw.includes("merle") || raw.includes("turdus")) return "🐦‍⬛";
  if (raw.includes("robin") || raw.includes("rouge-gorge") || raw.includes("erithacus")) return "🐦";
  if (raw.includes("tit") || raw.includes("mésange") || raw.includes("parus") || raw.includes("cyanistes")) return "🐤";
  if (raw.includes("wren") || raw.includes("troglodyte")) return "🐥";
  if (raw.includes("jay") || raw.includes("geai") || raw.includes("garrulus")) return "🐦‍⬛";
  return state.species?.emoji || "🐾";
}

function AnimalBadge({ state, commonName, latinName, confidence }: { state: AnalysisState; commonName: string; latinName: string; confidence: number }) {
  const icon = getAnimalIcon(state, commonName, latinName);
  return (
    <div
      className="ml-2 flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl border text-center"
      style={{
        borderColor: "rgba(0,212,255,0.32)",
        background: "radial-gradient(circle at 50% 28%, rgba(0,212,255,0.14), rgba(0,10,25,0.70))",
        boxShadow: "inset 0 0 18px rgba(0,212,255,0.08), 0 0 18px rgba(0,212,255,0.08)",
      }}
    >
      <div className="text-4xl leading-none" aria-hidden="true">{icon}</div>
      <div className="mt-1 text-[8px] font-mono tracking-[0.18em] text-cyan-200/70">{confidence}%</div>
    </div>
  );
}

export function SpeciesPanel({ state, lang }: { state: AnalysisState; lang: Lang }) {
  const t = UI_LABELS[lang];
  const active = isActive(state);
  const commonName = state.species?.scientificName?.[lang] || state.detectedSpecies || (state.isListening ? (lang === "fr" ? "Signature aviaire" : lang === "es" ? "Firma aviar" : "Bird signature") : "");
  const latinName = state.species?.name || (state.isListening ? (lang === "fr" ? "Classification progressive" : lang === "es" ? "Clasificación progresiva" : "Progressive classification") : "");
  const confidence = getLiveConfidence(state);

  return (
    <Panel label={t.species} accent="#00d4ff">
      {active && commonName ? (
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <div className="text-base font-mono font-bold text-white tracking-wider leading-tight truncate">{commonName}</div>
              {!state.isComplete && <span className="text-[8px] text-cyan-300/70 tracking-widest shrink-0">{getPhaseLabel(state, lang)}</span>}
            </div>
            <div className="text-[10px] font-mono text-cyan-400/70 italic uppercase truncate">{latinName}</div>
            {state.species && (
              <div className="flex flex-wrap gap-1 mt-2">
                {state.species.personality[lang].slice(0, state.isComplete ? 4 : 2).map(p => (
                  <span key={p} className="text-[8px] font-mono px-1.5 py-0.5 rounded border border-cyan-400/20 text-cyan-300/70 tracking-wider">{p}</span>
                ))}
              </div>
            )}
            <div className="mt-2">
              <Bar value={confidence} color="#00d4ff" label={t.confidence} sublabel={`${confidence}%`} />
            </div>
          </div>
          <AnimalBadge state={state} commonName={commonName} latinName={latinName} confidence={confidence} />
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
  const resonance = getLiveResonance(state);
  const clarity = getLiveClarity(state);

  return (
    <Panel label={t.emotional} accent="#ff8c00">
      {active ? (
        <div className="space-y-2">
          <div className="text-[11px] font-mono text-orange-400 tracking-wider leading-relaxed">
            {state.emotionalState || (lang === "fr" ? "CALIBRAGE ÉMOTIONNEL" : lang === "es" ? "CALIBRACIÓN EMOCIONAL" : "EMOTIONAL CALIBRATION")}
          </div>
          <Bar value={resonance} color="#ff8c00" label={t.resonance} sublabel={`${resonance}%`} />
          <Bar value={clarity} color="#ffcc00" label={t.clarity} sublabel={`${clarity}%`} />
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
          {state.biologicalIntent || (lang === "fr" ? "DÉCODAGE DU COMPORTEMENT" : lang === "es" ? "DECODIFICACIÓN DEL COMPORTAMIENTO" : "BEHAVIOR DECODING")}
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
    : [state.environmentalScan || (lang === "fr" ? "AMBIANCE : ÉCOUTE EN COURS" : lang === "es" ? "AMBIENTE: ESCUCHANDO" : "AMBIENCE: LISTENING")];

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
  const signal = state.isComplete ? (state.signalQuality || 82) : active ? getLiveClarity(state) : 0;
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

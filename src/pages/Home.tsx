import { useEffect, useMemo, useState } from "react";
import { useAudioAnalysis } from "../hooks/useAudioAnalysis";
import { ParticleField } from "../components/ParticleField";
import { MicButton } from "../components/MicButton";
import { TranslationCard } from "../components/TranslationCard";
import { UI_LABELS, type Lang } from "../data/translations";
import {
  SpeciesPanel,
  EmotionalPanel,
  ThreatPanel,
  BiologicalPanel,
  NeuralPanel,
  EnvironmentPanel,
} from "../components/AnalysisPanels";

function ScannerLines() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 1 }}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
          backgroundSize: "100% 4px",
        }}
      />
    </div>
  );
}

function GlitchOverlay({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 50, background: "rgba(0, 212, 255, 0.03)", mixBlendMode: "screen" }}
    >
      <div
        className="absolute"
        style={{
          top: `${20 + Math.random() * 60}%`,
          left: 0,
          right: 0,
          height: "2px",
          background: "rgba(255, 140, 0, 0.4)",
          transform: `translateX(${(Math.random() - 0.5) * 20}px)`,
        }}
      />
      <div
        className="absolute"
        style={{
          top: `${30 + Math.random() * 40}%`,
          left: 0,
          right: 0,
          height: "1px",
          background: "rgba(0, 212, 255, 0.3)",
          transform: `translateX(${(Math.random() - 0.5) * 30}px)`,
        }}
      />
    </div>
  );
}

function CrypticTicker({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div
      className="text-[7px] font-mono tracking-[0.36em] uppercase px-2.5 py-0.5 rounded-sm border leading-tight"
      style={{ color: "#ff8c0088", borderColor: "#ff8c0022", background: "#ff8c0008", animation: "fadeInOut 4s ease-in-out" }}
    >
      ▲ {message} ▲
    </div>
  );
}

function LangSelector({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  const opts: { v: Lang; l: string }[] = [
    { v: "fr", l: "FR" },
    { v: "en", l: "EN" },
    { v: "es", l: "ES" },
  ];
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[8px] font-mono text-gray-500 tracking-widest">{UI_LABELS[lang].lang}</span>
      {opts.map(o => (
        <button
          key={o.v}
          onClick={() => onChange(o.v)}
          className="text-[9px] font-mono px-1.5 py-0.5 rounded border transition-all duration-200"
          style={{
            borderColor: lang === o.v ? "#00d4ff55" : "#ffffff11",
            color: lang === o.v ? "#00d4ff" : "#ffffff44",
            background: lang === o.v ? "rgba(0,212,255,0.08)" : "transparent",
            boxShadow: lang === o.v ? "0 0 6px #00d4ff22" : "none",
          }}
        >
          {o.l}
        </button>
      ))}
    </div>
  );
}

function Header({ glitch, lang, onLangChange }: { glitch: boolean; lang: Lang; onLangChange: (l: Lang) => void }) {
  const [time, setTime] = useState("");
  const [blink, setBlink] = useState(true);
  const t = UI_LABELS[lang];

  useEffect(() => {
    const tick = () => setTime(new Date().toISOString().replace("T", " ").slice(0, 19));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setBlink(b => !b), 800);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="relative border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-4 py-3" style={{ borderColor: "#00d4ff22", background: "rgba(0,10,25,0.9)" }}>
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <div
            className="text-lg font-mono font-bold tracking-[0.15em] uppercase leading-none"
            style={{ color: "#00d4ff", textShadow: "0 0 12px #00d4ff88", filter: glitch ? "blur(0.5px)" : "none" }}
          >
            {t.title}
          </div>
          <div className="text-[9px] font-mono tracking-[0.35em] text-orange-400/60 uppercase">{t.subtitle}</div>
        </div>
      </div>
      <div className="flex items-center gap-4 text-[9px] font-mono text-gray-500 tracking-wider flex-wrap">
        <LangSelector lang={lang} onChange={onLangChange} />
        <span className="hidden sm:inline">|</span>
        <span>{t.institute}</span>
        <span className="hidden sm:inline">|</span>
        <span className="hidden sm:inline">{time}</span>
        <div className="flex items-center gap-1">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: blink ? "#00ff88" : "#00ff8844", boxShadow: blink ? "0 0 4px #00ff88" : "none", transition: "all 0.3s" }}
          />
          <span style={{ color: blink ? "#00ff88" : "#00ff8844" }}>{t.online}</span>
        </div>
      </div>
    </header>
  );
}

function LedBar({ value, pending = false }: { value: number; pending?: boolean }) {
  const lit = pending ? 0 : Math.max(0, Math.min(10, Math.round(value / 10)));
  return (
    <div className="flex gap-0.5 w-20 justify-end" aria-label={`${value}%`}>
      {Array.from({ length: 10 }, (_, i) => (
        <span
          key={i}
          className="h-2 w-1.5 rounded-sm transition-all duration-200"
          style={{
            background: i < lit ? (i > 7 ? "#ff8c00" : "#00d4ff") : "rgba(255,255,255,0.08)",
            boxShadow: i < lit ? `0 0 5px ${i > 7 ? "#ff8c00" : "#00d4ff"}` : "none",
            opacity: pending ? 0.22 : i < lit ? 0.95 : 0.35,
          }}
        />
      ))}
    </div>
  );
}

type SignatureRow = {
  label: string;
  value: number;
  tone: "primary" | "secondary" | "warning" | "idle";
  pending?: boolean;
};

function inferHabitat(audioFeatures: any, active: boolean) {
  if (!active && !audioFeatures) return "---";
  return (audioFeatures?.spectralCentroid ?? 0) > 1800 && (audioFeatures?.lowEnergyRatio ?? 0.3) < 0.5 ? "FORÊT" : "MIXTE";
}

function getSignalPercent(audioFeatures: any, progress: number) {
  const rawSignal = Math.round((audioFeatures?.rms ?? 0) * 420);
  return Math.min(99, Math.max(0, rawSignal || progress || 0));
}

function LiveSignalDashboard({
  active,
  audioFeatures,
  detectedLabel,
  progress,
}: {
  active: boolean;
  audioFeatures: any;
  detectedLabel: string | null;
  progress: number;
}) {
  const signal = getSignalPercent(audioFeatures, progress);
  const sharpness = Math.min(99, Math.max(0, Math.round((audioFeatures?.zcr ?? 0) * 420)));
  const gossip = Math.min(99, Math.max(0, Math.round((audioFeatures?.flatness ?? 0) * 180 + sharpness * 0.45)));
  const lowEnergy = Math.min(99, Math.max(0, Math.round((audioFeatures?.lowEnergyRatio ?? 0) * 95)));
  const habitat = inferHabitat(audioFeatures, active);
  const hasSignal = active || progress > 1 || Boolean(detectedLabel);

  const signatureRows = useMemo<SignatureRow[]>(() => {
    if (!hasSignal) {
      return [{ label: "EMPLACEMENT SIGNATURE", value: 0, tone: "idle", pending: true }];
    }

    const rows: SignatureRow[] = [];
    const primaryValue = Math.min(96, Math.max(8, Math.round(detectedLabel ? Math.max(progress, signal) : Math.max(progress, signal * 1.4))));
    rows.push({
      label: detectedLabel || (progress > 24 ? "SIGNATURE AVIAIRE" : "ACQUISITION DU SIGNAL"),
      value: primaryValue,
      tone: "primary",
    });

    const secondaryValue = Math.min(82, Math.max(0, Math.round(gossip * 0.62 + signal * 0.18)));
    if (progress > 22 || secondaryValue > 28) {
      const secondaryLabel = habitat === "FORÊT" ? "PASSEREAU POSSIBLE" : gossip > 55 ? "PIGEON SUSPECT" : "ÉCHO SECONDAIRE";
      rows.push({ label: secondaryLabel, value: Math.max(18, secondaryValue), tone: "secondary" });
    }

    const lowBandValue = Math.min(76, Math.max(0, Math.round(lowEnergy * 0.78)));
    if (lowEnergy > 62 && signal > 10) {
      rows.push({ label: "BASSE FRÉQ. / CANIDÉ", value: lowBandValue, tone: "warning" });
    }

    return rows.slice(0, 3);
  }, [hasSignal, detectedLabel, progress, signal, gossip, lowEnergy, habitat]);

  return (
    <div
      className="rounded border px-3 py-2 backdrop-blur-sm"
      style={{ borderColor: active ? "#00d4ff44" : "#ffffff11", background: "rgba(0,10,25,0.68)" }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="text-[9px] font-mono tracking-[0.32em] uppercase text-cyan-400/70">Signatures détectées</div>
        <div className="text-[8px] font-mono tracking-[0.22em] uppercase" style={{ color: active ? "#00ff88" : "#ffffff33" }}>
          {active ? "LIVE" : "VEILLE"}
        </div>
      </div>

      <div className="space-y-1">
        {signatureRows.map(row => {
          const diode = row.tone === "primary" ? "#00ff88" : row.tone === "secondary" ? "#00d4ff" : row.tone === "warning" ? "#ff8c00" : "#ffffff33";
          return (
            <div key={row.label} className="grid grid-cols-[10px_1fr_auto_34px] items-center gap-2 text-[9px] font-mono tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: diode, boxShadow: row.pending ? "none" : `0 0 5px ${diode}` }} />
              <span className={`truncate uppercase ${row.pending ? "text-gray-600" : "text-gray-300"}`}>{row.label}</span>
              <LedBar value={row.value} pending={row.pending} />
              <span className={`text-right ${row.pending ? "text-gray-600" : "text-cyan-300"}`}>{row.pending ? "--" : `${row.value}%`}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Home() {
  const {
    state,
    crypticMessage,
    audioFeatures,
    detectedLabel,
    lang,
    setLang,
    startListening,
    stopListening,
    reset,
  } = useAudioAnalysis();

  const activeAudioFeatures = audioFeatures || state.audioFeatures;
  const micSignal = state.isComplete ? state.signalQuality : getSignalPercent(activeAudioFeatures, state.scanProgress);
  const micHabitat = state.environmentalScan ? state.environmentalScan.split("—")[0].replace("AMBIANCE :", "").trim() : inferHabitat(activeAudioFeatures, state.isListening || state.isAnalyzing);

  return (
    <div
      className="relative min-h-screen w-full overflow-x-hidden flex flex-col"
      style={{
        background: "radial-gradient(ellipse at 20% 20%, rgba(0,40,80,0.4) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(20,0,40,0.3) 0%, transparent 60%), #02060f",
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
      }}
    >
      <ParticleField active={state.isListening || state.isAnalyzing} />
      <ScannerLines />
      <GlitchOverlay active={state.glitchActive} />

      <Header glitch={state.glitchActive} lang={lang} onLangChange={setLang} />

      <main
        className="relative flex-1 flex flex-col gap-2 p-3 sm:p-4 max-w-4xl mx-auto w-full"
        style={{ zIndex: 2, paddingBottom: "calc(13rem + env(safe-area-inset-bottom, 0px))" }}
      >
        <div className="grid grid-cols-2 gap-2">
          <SpeciesPanel state={state} lang={lang} />
          <EmotionalPanel state={state} lang={lang} />
        </div>

        <LiveSignalDashboard
          active={state.isListening || state.isAnalyzing}
          audioFeatures={activeAudioFeatures}
          detectedLabel={detectedLabel || state.detectedSpecies}
          progress={state.scanProgress}
        />

        <div className="flex justify-center">
          <CrypticTicker message={crypticMessage} />
        </div>

        <TranslationCard state={state} lang={lang} />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <ThreatPanel state={state} lang={lang} />
          <BiologicalPanel state={state} lang={lang} />
          <NeuralPanel state={state} lang={lang} />
          <EnvironmentPanel state={state} lang={lang} />
        </div>

        <MicButton
          isListening={state.isListening}
          isAnalyzing={state.isAnalyzing}
          isComplete={state.isComplete}
          onStart={startListening}
          onStop={stopListening}
          onReset={reset}
          lang={lang}
          signalQuality={micSignal}
          habitat={micHabitat}
        />
      </main>
    </div>
  );
}

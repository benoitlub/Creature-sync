import { useEffect, useState } from "react";
import { useAudioAnalysis } from "../hooks/useAudioAnalysis";
import { ParticleField } from "../components/ParticleField";
import { Waveform } from "../components/Waveform";
import { Spectrogram } from "../components/Spectrogram";
import { MicButton } from "../components/MicButton";
import { TranslationCard } from "../components/TranslationCard";
import { UI_LABELS, type Lang } from "../data/animals";
import {
  SpeciesPanel,
  EmotionalPanel,
  ThreatPanel,
  BiologicalPanel,
  NeuralPanel,
  EnvironmentPanel,
  SignalQualityPanel,
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
      style={{
        zIndex: 50,
        background: "rgba(0, 212, 255, 0.03)",
        animation: "none",
        mixBlendMode: "screen",
      }}
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
      className="text-[8px] font-mono tracking-[0.4em] uppercase px-3 py-1 rounded-sm border"
      style={{
        color: "#ff8c0088",
        borderColor: "#ff8c0022",
        background: "#ff8c0008",
        animation: "fadeInOut 4s ease-in-out",
      }}
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
    <header className="relative border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-4 py-3"
      style={{ borderColor: "#00d4ff22", background: "rgba(0,10,25,0.9)" }}>
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <div
            className="text-lg font-mono font-bold tracking-[0.15em] uppercase leading-none"
            style={{
              color: "#00d4ff",
              textShadow: "0 0 12px #00d4ff88",
              filter: glitch ? "blur(0.5px)" : "none",
            }}
          >
            {t.title}
          </div>
          <div className="text-[9px] font-mono tracking-[0.35em] text-orange-400/60 uppercase">
            {t.subtitle}
          </div>
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
            style={{
              background: blink ? "#00ff88" : "#00ff8844",
              boxShadow: blink ? "0 0 4px #00ff88" : "none",
              transition: "all 0.3s",
            }}
          />
          <span style={{ color: blink ? "#00ff88" : "#00ff8844" }}>{t.online}</span>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {
    state,
    crypticMessage,
    waveformData,
    spectrogramData,
    detectedLabel,
    lang,
    setLang,
    startListening,
    stopListening,
    reset,
  } = useAudioAnalysis();
  const t = UI_LABELS[lang];

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

      <main className="relative flex-1 flex flex-col gap-3 p-3 sm:p-4 max-w-4xl mx-auto w-full" style={{ zIndex: 2 }}>

        {/* Cryptic ticker */}
        <div className="flex justify-center">
          <CrypticTicker message={crypticMessage} />
        </div>

        {/* Waveform + spectrogram */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            className="rounded border p-2 backdrop-blur-sm"
            style={{ borderColor: "#00d4ff22", background: "rgba(0,10,25,0.7)", height: "80px" }}
          >
            <div className="text-[8px] font-mono text-cyan-400/40 tracking-[0.3em] mb-1">{t.freq}</div>
            <div style={{ height: "52px" }}>
              <Waveform data={waveformData} active={state.isListening || state.isAnalyzing} />
            </div>
          </div>
          <div
            className="rounded border p-2 backdrop-blur-sm"
            style={{ borderColor: "#ff8c0022", background: "rgba(0,10,25,0.7)", height: "80px" }}
          >
            <div className="text-[8px] font-mono text-orange-400/40 tracking-[0.3em] mb-1">{t.environment.toUpperCase()}</div>
            <div style={{ height: "52px" }}>
              <Spectrogram data={spectrogramData} active={state.isListening || state.isAnalyzing} />
            </div>
          </div>
        </div>

        {/* Live detection hint */}
        {detectedLabel && state.isListening && (
          <div className="flex justify-center">
            <div
              className="text-[9px] font-mono tracking-[0.3em] uppercase px-3 py-1 rounded border animate-pulse"
              style={{
                color: "#00d4ff",
                borderColor: "#00d4ff33",
                background: "rgba(0,212,255,0.06)",
              }}
            >
              {t.detected} : {detectedLabel}
            </div>
          </div>
        )}

        {/* Mic button + main CTA */}
        <div
          className="rounded border flex flex-col items-center justify-center gap-2 py-6 backdrop-blur-sm"
          style={{ borderColor: "#ffffff11", background: "rgba(0,10,25,0.5)" }}
        >
          <MicButton
            isListening={state.isListening}
            isAnalyzing={state.isAnalyzing}
            isComplete={state.isComplete}
            onStart={startListening}
            onStop={stopListening}
            onReset={reset}
            lang={lang}
          />
          <div className="text-[8px] font-mono text-gray-600 tracking-widest">
            {t.station}
          </div>
        </div>

        {/* Progress bar during analysis */}
        {state.isAnalyzing && (
          <div className="space-y-1">
            <div className="flex justify-between text-[8px] font-mono text-gray-500 tracking-wider">
              <span>{t.bioacoustic}</span>
              <span>{Math.floor(state.scanProgress)}%</span>
            </div>
            <div className="h-0.5 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-150"
                style={{
                  width: `${state.scanProgress}%`,
                  background: "linear-gradient(90deg, #00d4ff88, #ff8c00)",
                  boxShadow: "0 0 8px #ff8c00",
                }}
              />
            </div>
          </div>
        )}

        {/* Translation card */}
        <TranslationCard state={state} lang={lang} />

        {/* Analysis panels grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <SpeciesPanel state={state} lang={lang} />
          <EmotionalPanel state={state} lang={lang} />
          <ThreatPanel state={state} lang={lang} />
          <BiologicalPanel state={state} lang={lang} />
          <NeuralPanel state={state} lang={lang} />
          <EnvironmentPanel state={state} lang={lang} />
        </div>

        {/* Signal quality + footer */}
        <SignalQualityPanel state={state} scanProgress={state.scanProgress} lang={lang} />

        <div className="flex justify-between items-center text-[7px] font-mono text-gray-700 tracking-widest py-1">
          <span>{t.footer1}</span>
          <span>{t.footer2}</span>
          <span>{t.footer3}</span>
        </div>
      </main>
    </div>
  );
}

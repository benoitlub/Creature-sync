import { useEffect, useState } from "react";
import { useAudioAnalysis } from "../hooks/useAudioAnalysis";
import { ParticleField } from "../components/ParticleField";
import { Waveform } from "../components/Waveform";
import { Spectrogram } from "../components/Spectrogram";
import { MicButton } from "../components/MicButton";
import { TranslationCard } from "../components/TranslationCard";
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

function Header({ glitch }: { glitch: boolean }) {
  const [time, setTime] = useState("");
  const [blink, setBlink] = useState(true);

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
            CRÉATURE-SYNC
          </div>
          <div className="text-[9px] font-mono tracking-[0.35em] text-orange-400/60 uppercase">
            // ORNITH-X ANIMAL TRANSLATION PROTOCOL
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 text-[9px] font-mono text-gray-500 tracking-wider">
        <span>FEUCH INSTITUTE</span>
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
          <span style={{ color: blink ? "#00ff88" : "#00ff8844" }}>ONLINE</span>
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
    startListening,
    stopListening,
    reset,
  } = useAudioAnalysis();

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

      <Header glitch={state.glitchActive} />

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
            <div className="text-[8px] font-mono text-cyan-400/40 tracking-[0.3em] mb-1">AUDIO WAVEFORM</div>
            <div style={{ height: "52px" }}>
              <Waveform data={waveformData} active={state.isListening || state.isAnalyzing} />
            </div>
          </div>
          <div
            className="rounded border p-2 backdrop-blur-sm"
            style={{ borderColor: "#ff8c0022", background: "rgba(0,10,25,0.7)", height: "80px" }}
          >
            <div className="text-[8px] font-mono text-orange-400/40 tracking-[0.3em] mb-1">SPECTROGRAM ANALYSIS</div>
            <div style={{ height: "52px" }}>
              <Spectrogram data={spectrogramData} active={state.isListening || state.isAnalyzing} />
            </div>
          </div>
        </div>

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
          />
          <div className="text-[8px] font-mono text-gray-600 tracking-widest">
            BLACKLACE ISLAND RESEARCH STATION — SECTOR 7
          </div>
        </div>

        {/* Progress bar during analysis */}
        {state.isAnalyzing && (
          <div className="space-y-1">
            <div className="flex justify-between text-[8px] font-mono text-gray-500 tracking-wider">
              <span>BIOACOUSTIC PATTERN RECOGNITION</span>
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
        <TranslationCard state={state} />

        {/* Analysis panels grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <SpeciesPanel state={state} />
          <EmotionalPanel state={state} />
          <ThreatPanel state={state} />
          <BiologicalPanel state={state} />
          <NeuralPanel state={state} />
          <EnvironmentPanel state={state} />
        </div>

        {/* Signal quality + footer */}
        <SignalQualityPanel state={state} scanProgress={state.scanProgress} />

        <div className="flex justify-between items-center text-[7px] font-mono text-gray-700 tracking-widest py-1">
          <span>ORNITH-X v3.7.2 // FEUCH INSTITUTE PROPRIETARY</span>
          <span>CLASSIFICATION: LEVEL-4</span>
          <span>BLACKLACE ISLAND</span>
        </div>
      </main>
    </div>
  );
}

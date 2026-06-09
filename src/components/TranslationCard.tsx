import { useEffect, useMemo, useState } from "react";
import { type AnalysisState, UI_LABELS, type Lang } from "../data/animals";

const ANALYSIS_STEPS: Record<Lang, string[]> = {
  fr: [
    "Capture du signal bioacoustique",
    "Nettoyage du bruit humain inutile",
    "Isolement des individus suspects",
    "Comparaison BirdNET Lite",
    "Interprétation comportementale",
    "Traduction approximative interdite aux humains",
  ],
  en: [
    "Capturing bioacoustic signal",
    "Removing unnecessary human noise",
    "Isolating suspicious individuals",
    "Comparing BirdNET Lite patterns",
    "Reading behavioral intent",
    "Rendering forbidden human translation",
  ],
  es: [
    "Captura de señal bioacústica",
    "Limpieza del ruido humano innecesario",
    "Aislamiento de individuos sospechosos",
    "Comparación BirdNET Lite",
    "Interpretación del comportamiento",
    "Traducción aproximada prohibida a humanos",
  ],
};

const LIVE_PREFIX: Record<Lang, string> = {
  fr: "fragment capté",
  en: "captured fragment",
  es: "fragmento captado",
};

const CARD_COPY: Record<Lang, { reflection: string; live: string; transmission: string; fragmentStream: string }> = {
  fr: {
    reflection: "RÉFLEXION BIOACOUSTIQUE",
    live: "DIRECT",
    transmission: "⚠ Transmission interceptée...",
    fragmentStream: "FLUX DE FRAGMENTS",
  },
  en: {
    reflection: "BIOACOUSTIC REFLECTION",
    live: "LIVE",
    transmission: "⚠ Transmission intercepted...",
    fragmentStream: "FRAGMENT STREAM",
  },
  es: {
    reflection: "REFLEXIÓN BIOACÚSTICA",
    live: "EN VIVO",
    transmission: "⚠ Transmisión interceptada...",
    fragmentStream: "FLUJO DE FRAGMENTOS",
  },
};

function splitWords(text: string) {
  return text
    .replace(/[“”"«»]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
}

function sentenceFragments(text: string, progress: number, lang: Lang) {
  const words = splitWords(text);
  if (words.length === 0) return "";

  const firstSize = Math.min(5, Math.max(2, Math.ceil(words.length * 0.3)));
  const midStart = Math.max(0, Math.floor(words.length * 0.35));
  const midEnd = Math.min(words.length, midStart + 5);
  const endSize = Math.min(6, Math.max(3, Math.ceil(words.length * 0.35)));

  const fragments = [
    words.slice(0, firstSize).join(" "),
    words.slice(midStart, midEnd).join(" "),
    words.slice(Math.max(0, words.length - endSize)).join(" "),
  ].filter(Boolean);

  const visibleCount = progress < 32 ? 1 : progress < 68 ? 2 : 3;

  return fragments
    .slice(0, visibleCount)
    .map((fragment, index) => `// ${LIVE_PREFIX[lang]} ${index + 1}: …${fragment}…`)
    .join("\n");
}

export function TranslationCard({ state, lang }: { state: AnalysisState; lang: Lang }) {
  const t = UI_LABELS[lang];
  const c = CARD_COPY[lang];
  const [displayed, setDisplayed] = useState("");
  const [cursor, setCursor] = useState(true);
  const steps = ANALYSIS_STEPS[lang];
  const hasTranslation = Boolean(state.translation);
  const isLive = state.isListening && hasTranslation;
  const isFinal = state.isComplete && hasTranslation;

  const activeStep = useMemo(() => {
    if (!state.isAnalyzing && !state.isListening) return -1;
    return Math.min(steps.length - 1, Math.floor((state.scanProgress / 100) * steps.length));
  }, [state.isAnalyzing, state.isListening, state.scanProgress, steps.length]);

  useEffect(() => {
    if (!hasTranslation) {
      setDisplayed("");
      return;
    }

    if (state.isListening) {
      setDisplayed(sentenceFragments(state.translation, state.scanProgress, lang));
      return;
    }

    if (!state.isComplete) {
      setDisplayed("");
      return;
    }

    setDisplayed("");
    let i = 0;
    let interval: ReturnType<typeof setInterval> | null = null;

    const delay = setTimeout(() => {
      interval = setInterval(() => {
        if (i <= state.translation.length) {
          setDisplayed(state.translation.slice(0, i));
          i++;
        } else if (interval) {
          clearInterval(interval);
        }
      }, 45);
    }, 250);

    return () => {
      clearTimeout(delay);
      if (interval) clearInterval(interval);
    };
  }, [state.translation, state.isComplete, state.isListening, state.scanProgress, lang, hasTranslation]);

  useEffect(() => {
    const interval = setInterval(() => setCursor(x => !x), 500);
    return () => clearInterval(interval);
  }, []);

  const accentColor = state.isPoetic ? "#9b59ff" : isLive ? "#00ff88" : "#00d4ff";
  const labelText = isLive
    ? lang === "fr" ? "FRAGMENTS INTERCEPTÉS // CANAL OUVERT" : lang === "en" ? "INTERCEPTED FRAGMENTS // OPEN CHANNEL" : "FRAGMENTOS INTERCEPTADOS // CANAL ABIERTO"
    : state.isPoetic ? t.poetry : t.translation;
  const borderActive = isFinal || isLive;

  return (
    <div
      className="relative rounded border p-3 backdrop-blur-sm transition-all duration-500"
      style={{
        background: "rgba(2, 8, 20, 0.85)",
        borderColor: borderActive ? accentColor + "55" : state.isAnalyzing ? "#ff8c0055" : "#ffffff11",
        boxShadow: borderActive
          ? `0 0 20px ${accentColor}22, inset 0 0 20px ${accentColor}08`
          : state.isAnalyzing
            ? "0 0 14px #ff8c0018, inset 0 0 14px #ff8c0008"
            : "none",
        minHeight: isLive || isFinal ? "6.25rem" : "5.5rem",
      }}
    >
      <div
        className="absolute -top-px left-3 right-3 h-px transition-all duration-500"
        style={{
          background: borderActive
            ? `linear-gradient(90deg, transparent, ${accentColor}cc, transparent)`
            : state.isAnalyzing || state.isListening
              ? "linear-gradient(90deg, transparent, #ff8c00aa, transparent)"
              : "transparent",
        }}
      />
      <div
        className="text-[9px] font-mono tracking-[0.25em] uppercase mb-2 flex items-center gap-2"
        style={{ color: borderActive ? accentColor : state.isAnalyzing || state.isListening ? "#ff8c00" : "#ffffff33" }}
      >
        <div
          className="w-1 h-1 rounded-full transition-all duration-500"
          style={{
            background: borderActive ? accentColor : state.isAnalyzing || state.isListening ? "#ff8c00" : "#ffffff22",
            boxShadow: borderActive ? `0 0 4px ${accentColor}` : state.isAnalyzing || state.isListening ? "0 0 4px #ff8c00" : "none",
          }}
        />
        {state.isAnalyzing && !hasTranslation ? c.reflection : labelText}
        {isLive && <span className="ml-auto text-[8px] tracking-wider text-green-400/70">{c.live}</span>}
        {state.isPoetic && isFinal && (
          <span className="ml-auto text-[8px] tracking-wider text-purple-400/70">{t.rare}</span>
        )}
      </div>

      {(state.isAnalyzing || (state.isListening && !hasTranslation)) && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-1 h-3 rounded-sm"
                  style={{
                    background: "#ff8c00",
                    boxShadow: "0 0 4px #ff8c00",
                    animation: `pulse 0.8s ease-in-out ${i * 0.12}s infinite alternate`,
                    opacity: 0.4,
                  }}
                />
              ))}
            </div>
            <span className="text-[10px] font-mono text-orange-400/70 tracking-wider">{t.decoding}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 pt-1">
            {steps.map((step, index) => {
              const done = index < activeStep;
              const active = index === activeStep;
              return (
                <div
                  key={step}
                  className="flex items-center gap-2 text-[8px] font-mono tracking-[0.08em] transition-all duration-300"
                  style={{ color: done ? "#00ff8899" : active ? "#ff8c00dd" : "#ffffff26" }}
                >
                  <span style={{ width: "0.8rem", display: "inline-block" }}>{done ? "✓" : active ? "◆" : "·"}</span>
                  <span className="truncate">{step}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {(isLive || isFinal) && (
        <div
          className="font-mono text-sm leading-relaxed whitespace-pre-line"
          style={{
            color: state.isPoetic ? "#c4a8ff" : isLive ? "#e9fff4" : "#e2f5ff",
            textShadow: state.isPoetic ? "0 0 12px #9b59ff44" : isLive ? "0 0 10px #00ff8822" : "none",
            fontStyle: state.isPoetic ? "italic" : "normal",
            letterSpacing: state.isPoetic ? "0.02em" : "0.01em",
          }}
        >
          {!displayed && (
            <span className="text-cyan-400/50 tracking-[0.22em] uppercase text-[10px]">
              {c.transmission}
            </span>
          )}
          {state.isPoetic && displayed && isFinal && <span className="text-purple-400/60 mr-1">&ldquo;</span>}
          {displayed}
          {cursor && isFinal && displayed.length < state.translation.length && <span style={{ color: accentColor }}>█</span>}
          {isLive && cursor && <span style={{ color: accentColor }}> ▌</span>}
          {state.isPoetic && isFinal && displayed.length === state.translation.length && <span className="text-purple-400/60 ml-1">&rdquo;</span>}
        </div>
      )}

      {!hasTranslation && !state.isAnalyzing && !state.isListening && (
        <div className="text-[10px] font-mono text-gray-600 tracking-widest pt-2">
          {t.awaiting}
        </div>
      )}

      {(isLive || isFinal) && (
        <div className="mt-2 pt-2 border-t border-white/5 flex items-center gap-3 flex-wrap">
          {state.species && (
            <span className="text-[8px] font-mono text-gray-500 tracking-wider">SRC: {state.species.name}</span>
          )}
          <span className="text-[8px] font-mono text-gray-600 tracking-wider">{t.confidence}: {state.confidence}%</span>
          <span className="text-[8px] font-mono text-gray-600 tracking-wider ml-auto">
            {isLive ? c.fragmentStream : t.institute + " // BLACKLACE-7"}
          </span>
        </div>
      )}
    </div>
  );
}

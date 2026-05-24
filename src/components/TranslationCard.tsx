import { useEffect, useState } from "react";
import { type AnalysisState, UI_LABELS, type Lang } from "../data/translations";

export function TranslationCard({ state, lang }: { state: AnalysisState; lang: Lang }) {
  const t = UI_LABELS[lang];
  const [displayed, setDisplayed] = useState("");
  const [cursor, setCursor] = useState(true);

  useEffect(() => {
    if (!state.isComplete || !state.translation) {
      setDisplayed("");
      return;
    }
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      if (i <= state.translation.length) {
        setDisplayed(state.translation.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 28);
    return () => clearInterval(interval);
  }, [state.translation, state.isComplete]);

  useEffect(() => {
    const interval = setInterval(() => setCursor(c => !c), 500);
    return () => clearInterval(interval);
  }, []);

  const accentColor = state.isPoetic ? "#9b59ff" : "#00d4ff";
  const labelText = state.isPoetic ? t.poetry : t.translation;

  return (
    <div
      className="relative rounded border p-4 backdrop-blur-sm transition-all duration-500"
      style={{
        background: "rgba(2, 8, 20, 0.85)",
        borderColor: state.isComplete ? accentColor + "55" : "#ffffff11",
        boxShadow: state.isComplete
          ? `0 0 24px ${accentColor}22, inset 0 0 24px ${accentColor}08`
          : "none",
        minHeight: "7rem",
      }}
    >
      <div
        className="absolute -top-px left-3 right-3 h-px transition-all duration-500"
        style={{
          background: state.isComplete
            ? `linear-gradient(90deg, transparent, ${accentColor}cc, transparent)`
            : "transparent",
        }}
      />
      <div
        className="text-[9px] font-mono tracking-[0.3em] uppercase mb-3 flex items-center gap-2"
        style={{ color: state.isComplete ? accentColor : "#ffffff33" }}
      >
        <div
          className="w-1 h-1 rounded-full transition-all duration-500"
          style={{
            background: state.isComplete ? accentColor : "#ffffff22",
            boxShadow: state.isComplete ? `0 0 4px ${accentColor}` : "none",
          }}
        />
        {labelText}
        {state.isPoetic && state.isComplete && (
          <span className="ml-auto text-[8px] tracking-wider text-purple-400/70">{t.rare}</span>
        )}
      </div>

      {state.isAnalyzing && (
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="w-1 h-4 rounded-sm"
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
      )}

      {state.isComplete && (
        <div
          className="font-mono text-sm leading-relaxed"
          style={{
            color: state.isPoetic ? "#c4a8ff" : "#e2f5ff",
            textShadow: state.isPoetic ? "0 0 12px #9b59ff44" : "none",
            fontStyle: state.isPoetic ? "italic" : "normal",
            letterSpacing: state.isPoetic ? "0.02em" : "0.01em",
          }}
        >
          {state.isPoetic && <span className="text-purple-400/60 mr-1">&ldquo;</span>}
          {displayed}
          {cursor && displayed.length < state.translation.length && (
            <span style={{ color: accentColor }}>█</span>
          )}
          {state.isPoetic && displayed.length === state.translation.length && (
            <span className="text-purple-400/60 ml-1">&rdquo;</span>
          )}
        </div>
      )}

      {!state.isComplete && !state.isAnalyzing && (
        <div className="text-[10px] font-mono text-gray-600 tracking-widest pt-2">
          {t.awaiting}
        </div>
      )}

      {state.isComplete && (
        <div className="mt-3 pt-2 border-t border-white/5 flex items-center gap-3 flex-wrap">
          {state.species && (
            <span className="text-[8px] font-mono text-gray-500 tracking-wider">
              SRC: {state.species.name}
            </span>
          )}
          <span className="text-[8px] font-mono text-gray-600 tracking-wider">
            {t.confidence}: {state.confidence}%
          </span>
          <span className="text-[8px] font-mono text-gray-600 tracking-wider ml-auto">
            {t.institute} // BLACKLACE-7
          </span>
        </div>
      )}
    </div>
  );
}

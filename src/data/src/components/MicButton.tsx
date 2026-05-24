import { UI_LABELS, type Lang } from "../data/translations";

type Props = {
  isListening: boolean;
  isAnalyzing: boolean;
  isComplete: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  lang: Lang;
};

export function MicButton({ isListening, isAnalyzing, isComplete, onStart, onStop, onReset, lang }: Props) {
  const t = UI_LABELS[lang];
  const label = isAnalyzing
    ? t.analyzing
    : isComplete
    ? t.complete
    : isListening
    ? t.stop
    : t.initiate;

  const handleClick = () => {
    if (isComplete) onReset();
    else if (isListening) onStop();
    else onStart();
  };

  return (
    <div className="relative flex flex-col items-center gap-3">
      {(isListening || isAnalyzing) && (
        <>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-28 h-28 rounded-full border border-cyan-400/30 animate-ping" style={{ animationDuration: "1.5s" }} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-36 h-36 rounded-full border border-orange-500/20 animate-ping" style={{ animationDuration: "2s" }} />
          </div>
        </>
      )}

      <button
        onClick={handleClick}
        disabled={isAnalyzing}
        className={`
          relative z-10 w-20 h-20 rounded-full border-2 flex items-center justify-center
          transition-all duration-300 focus:outline-none
          ${isAnalyzing
            ? "border-orange-500 bg-orange-500/10 cursor-wait"
            : isComplete
            ? "border-green-400 bg-green-400/10 hover:bg-green-400/20 cursor-pointer"
            : isListening
            ? "border-red-500 bg-red-500/10 hover:bg-red-500/20 cursor-pointer"
            : "border-cyan-400 bg-cyan-400/10 hover:bg-cyan-400/20 cursor-pointer"
          }
        `}
        style={{
          boxShadow: isAnalyzing
            ? "0 0 20px #ff8c0066, inset 0 0 20px #ff8c0022"
            : isComplete
            ? "0 0 20px #00ff8866, inset 0 0 20px #00ff8822"
            : isListening
            ? "0 0 20px #ff003366, inset 0 0 20px #ff003322"
            : "0 0 20px #00d4ff44, inset 0 0 20px #00d4ff11",
        }}
      >
        {isAnalyzing ? (
          <svg className="w-8 h-8 text-orange-500 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        ) : isComplete ? (
          <svg className="w-8 h-8 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        ) : isListening ? (
          <div className="w-6 h-6 bg-red-500 rounded-sm" />
        ) : (
          <svg className="w-8 h-8 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
          </svg>
        )}
      </button>

      <span
        className="text-xs tracking-[0.25em] font-mono uppercase"
        style={{
          color: isAnalyzing ? "#ff8c00" : isComplete ? "#00ff88" : isListening ? "#ff4444" : "#00d4ff",
        }}
      >
        {label}
      </span>
    </div>
  );
}

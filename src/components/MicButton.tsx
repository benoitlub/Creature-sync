import { UI_LABELS, type Lang } from "../data/animals";

type Props = {
  isListening: boolean;
  isAnalyzing: boolean;
  isComplete: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  lang: Lang;
  signalQuality?: number;
  habitat?: string;
};

const MIC_COPY: Record<Lang, { listening: string; complete: string; ready: string; sig: string; env: string }> = {
  fr: {
    listening: "CANAL OUVERT // STOP POUR FIGER",
    complete: "RAPPORT FIGÉ // TOUCHER POUR RELANCER",
    ready: "STATION BLACKLACE — PRÊTE",
    sig: "SIG",
    env: "ENV",
  },
  en: {
    listening: "OPEN CHANNEL // STOP TO LOCK",
    complete: "REPORT LOCKED // TAP TO RESTART",
    ready: "BLACKLACE STATION — READY",
    sig: "SIG",
    env: "ENV",
  },
  es: {
    listening: "CANAL ABIERTO // DETENER PARA FIJAR",
    complete: "INFORME FIJADO // TOCAR PARA REINICIAR",
    ready: "ESTACIÓN BLACKLACE — LISTA",
    sig: "SEÑ",
    env: "AMB",
  },
};

function Witness({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="flex items-center gap-1 text-[7px] font-mono tracking-widest uppercase text-gray-500">
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 5px ${color}` }} />
      <span>{label}</span>
      <span style={{ color }}>{value}</span>
    </div>
  );
}

export function MicButton({ isListening, isAnalyzing, isComplete, onStart, onStop, onReset, lang, signalQuality = 0, habitat = "---" }: Props) {
  const t = UI_LABELS[lang];
  const m = MIC_COPY[lang];
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

  const accent = isAnalyzing ? "#ff8c00" : isComplete ? "#00ff88" : isListening ? "#ff4444" : "#00d4ff";
  const status = isListening
    ? m.listening
    : isComplete
    ? m.complete
    : m.ready;

  return (
    <div
      className="fixed left-0 right-0 px-3 z-[999]"
      style={{
        bottom: "env(safe-area-inset-bottom, 0px)",
        pointerEvents: "none",
      }}
    >
      <div
        className="mx-auto max-w-4xl rounded-t-xl rounded-b-none border border-b-0 backdrop-blur-md flex items-center justify-between gap-3 px-3 py-2"
        style={{
          pointerEvents: "auto",
          borderColor: `${accent}66`,
          background: "linear-gradient(180deg, rgba(2,8,20,0.97), rgba(0,10,25,0.94))",
          boxShadow: `0 -10px 28px rgba(0,0,0,0.55), 0 0 24px ${accent}30, inset 0 0 18px ${accent}08`,
        }}
      >
        <div className="min-w-0 flex-1">
          <div className="text-[9px] sm:text-[10px] tracking-[0.28em] font-mono uppercase truncate" style={{ color: accent }}>
            {label}
          </div>
          <div className="text-[7px] sm:text-[8px] font-mono text-gray-600 tracking-widest uppercase truncate mt-0.5">
            {status}
          </div>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
            <Witness label={m.sig} value={`${Math.round(signalQuality)}%`} color="#00d4ff" />
            <Witness label={m.env} value={habitat} color="#ff8c00" />
          </div>
        </div>

        <div className="relative flex items-center justify-center shrink-0">
          {(isListening || isAnalyzing) && (
            <>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full border border-cyan-400/30 animate-ping" style={{ animationDuration: "1.5s" }} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border border-orange-500/20 animate-ping" style={{ animationDuration: "2s" }} />
              </div>
            </>
          )}

          <button
            onClick={handleClick}
            disabled={isAnalyzing}
            className={`
              relative z-10 w-14 h-14 rounded-full border-2 flex items-center justify-center
              transition-all duration-300 focus:outline-none active:scale-95
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
              <svg className="w-6 h-6 text-orange-500 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            ) : isComplete ? (
              <svg className="w-6 h-6 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            ) : isListening ? (
              <div className="w-5 h-5 bg-red-500 rounded-sm" />
            ) : (
              <svg className="w-6 h-6 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

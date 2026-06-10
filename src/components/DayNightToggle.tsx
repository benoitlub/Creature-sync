import { useEffect, useState } from "react";

const STORAGE_KEY = "creature-sync-day-mode";

function readInitialMode() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "day";
  } catch {
    return false;
  }
}

export function DayNightToggle() {
  const [dayMode, setDayMode] = useState(readInitialMode);

  useEffect(() => {
    document.body.classList.toggle("creature-day", dayMode);
    try {
      window.localStorage.setItem(STORAGE_KEY, dayMode ? "day" : "night");
    } catch {
      // localStorage may be unavailable in private/webview contexts.
    }
    return () => document.body.classList.remove("creature-day");
  }, [dayMode]);

  return (
    <button
      type="button"
      onClick={() => setDayMode(value => !value)}
      aria-pressed={dayMode}
      aria-label={dayMode ? "Passer en mode nuit" : "Passer en mode jour"}
      className="fixed right-3 top-3 z-[80] rounded-full border px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-[0.18em] shadow-lg backdrop-blur-sm transition-transform active:scale-95"
      style={{
        borderColor: dayMode ? "rgba(15,23,42,0.55)" : "rgba(255,255,255,0.22)",
        background: dayMode ? "rgba(255,255,255,0.94)" : "rgba(2,8,20,0.86)",
        color: dayMode ? "#06111f" : "#e6faff",
        boxShadow: dayMode ? "0 8px 22px rgba(15,23,42,0.18)" : "0 0 16px rgba(0,212,255,0.18)",
      }}
    >
      {dayMode ? "🌙 Nuit" : "☀️ Jour"}
    </button>
  );
}

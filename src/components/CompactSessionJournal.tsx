import { useEffect, useState } from "react";
import { clearSessionJournal, deleteSessionEntry, getSessionJournal, type SessionJournalEntry } from "../utils/sessionJournal";

const APP_URL = "https://benoitlub.github.io/Creature-sync/";
const DONATE_URL = ["https://www.paypal.com/cgi-bin/webscr?cmd=_donations", "business=benoitlubert@gmail.com", "currency_code=EUR", "item_name=Support+Creature-sync"].join("&");

function formatDate(value: string) {
  try { return new Date(value).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" }); } catch { return value; }
}

function iconFor(name: string) {
  const raw = name.toLowerCase();
  if (raw.includes("perruche") || raw.includes("parakeet")) return "🦜";
  if (raw.includes("corbeau") || raw.includes("corneille") || raw.includes("crow")) return "🐦‍⬛";
  if (raw.includes("pie") || raw.includes("magpie")) return "🐦‍⬛";
  if (raw.includes("merle") || raw.includes("blackbird")) return "🐦‍⬛";
  if (raw.includes("pigeon")) return "🕊️";
  if (raw.includes("canard") || raw.includes("duck")) return "🦆";
  if (raw.includes("hibou") || raw.includes("chouette") || raw.includes("owl")) return "🦉";
  if (raw.includes("chat") || raw.includes("cat")) return "🐈";
  if (raw.includes("chien") || raw.includes("dog")) return "🐕";
  return "🐾";
}

function shareText(entry: SessionJournalEntry) {
  return [
    "Creature Sync a intercepté :",
    `${entry.speciesName} — ${entry.confidence}%`,
    `“${entry.translation}”`,
    `Date : ${formatDate(entry.createdAt)}`,
    "",
    "Écoute toi aussi les conversations non autorisées du vivant :",
    APP_URL,
  ].join("\n");
}

export function CompactSessionJournal({ latestEntry }: { latestEntry: SessionJournalEntry | null }) {
  const [entries, setEntries] = useState<SessionJournalEntry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const next = getSessionJournal();
    setEntries(next);
    if (!selectedId) setSelectedId(latestEntry?.id || next[0]?.id || null);
  }, [latestEntry, selectedId]);

  const selected = entries.find(entry => entry.id === selectedId) || entries[0] || latestEntry || null;

  async function share() {
    if (!selected) { setStatus("Aucune trace à partager."); return; }
    const text = shareText(selected);
    try {
      if (navigator.share) await navigator.share({ title: `Creature Sync — ${selected.speciesName}`, text, url: APP_URL });
      else await navigator.clipboard.writeText(text);
      setStatus("Partage prêt.");
    } catch {
      setStatus("Partage annulé.");
    }
  }

  function donate() { window.open(DONATE_URL, "_blank", "noopener,noreferrer"); }

  async function copyCall() {
    try {
      await navigator.clipboard.writeText(`Soutenir Creature-sync : ${APP_URL}\nDon : benoitlubert@gmail.com`);
      setStatus("Appel copié.");
    } catch { setStatus("Copie impossible."); }
  }

  function removeSelected() {
    if (!selected) return;
    const next = deleteSessionEntry(selected.id);
    setEntries(next);
    setSelectedId(next[0]?.id || null);
  }

  function wipe() {
    const next = clearSessionJournal();
    setEntries(next);
    setSelectedId(null);
  }

  return (
    <div className="rounded border p-2 backdrop-blur-sm" style={{ borderColor: "#00d4ff22", background: "rgba(0,10,25,0.62)" }}>
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[9px] font-mono tracking-[0.32em] uppercase text-cyan-400/80">Journal / partage</div>
          <div className="truncate text-[8px] font-mono tracking-wider text-gray-500">{entries.length} trace{entries.length > 1 ? "s" : ""}{selected ? ` // ${iconFor(selected.speciesName)} ${selected.speciesName}` : ""}</div>
        </div>
        <div className="grid grid-cols-3 gap-1 shrink-0">
          <button type="button" onClick={share} className="rounded border px-2 py-1 text-[8px] font-mono uppercase tracking-wider text-cyan-300" style={{ borderColor: "rgba(0,212,255,0.30)", background: "rgba(0,212,255,0.06)" }}>Partager</button>
          <button type="button" onClick={donate} className="rounded border px-2 py-1 text-[8px] font-mono uppercase tracking-wider text-orange-300" style={{ borderColor: "rgba(255,140,0,0.32)", background: "rgba(255,140,0,0.08)" }}>Don</button>
          <button type="button" onClick={copyCall} className="rounded border px-2 py-1 text-[8px] font-mono uppercase tracking-wider text-green-300" style={{ borderColor: "rgba(0,255,136,0.26)", background: "rgba(0,255,136,0.06)" }}>Copier</button>
        </div>
      </div>
      {status && <div className="pt-1 text-[8px] font-mono text-green-300/70 tracking-wider">{status}</div>}

      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-[210px_1fr]">
        <div className="space-y-1 max-h-28 overflow-auto pr-1">
          {entries.length === 0 && <div className="rounded border p-2 text-[9px] font-mono text-gray-600" style={{ borderColor: "#ffffff11" }}>Aucune trace archivée.</div>}
          {entries.map(entry => (
            <button key={entry.id} type="button" onClick={() => setSelectedId(entry.id)} className="w-full rounded border px-2 py-1 text-left" style={{ borderColor: selected?.id === entry.id ? "#00d4ff66" : "#ffffff11", background: selected?.id === entry.id ? "rgba(0,212,255,0.07)" : "rgba(255,255,255,0.02)" }}>
              <div className="flex items-center justify-between gap-2">
                <span className="min-w-0 flex items-center gap-1 text-[9px] font-mono text-cyan-200 truncate"><span>{iconFor(entry.speciesName)}</span><span className="truncate">{entry.speciesName}</span></span>
                <span className="text-[8px] font-mono text-orange-300">{entry.confidence}%</span>
              </div>
              <div className="text-[8px] font-mono text-gray-500 truncate">{formatDate(entry.createdAt)}</div>
            </button>
          ))}
        </div>
        {selected && (
          <div className="max-h-36 overflow-auto rounded border p-2" style={{ borderColor: "#ffffff12", background: "rgba(2,8,20,0.6)" }}>
            <div className="text-[11px] font-mono font-bold text-white tracking-wider truncate">{iconFor(selected.speciesName)} {selected.speciesName}</div>
            <div className="text-[8px] font-mono text-gray-500 tracking-wider truncate">{formatDate(selected.createdAt)} // {selected.habitat}</div>
            <div className="mt-2 rounded border p-2 text-[10px] font-mono leading-relaxed text-cyan-50/90 whitespace-pre-line" style={{ borderColor: "#00d4ff22" }}>{selected.translation}</div>
            <div className="mt-2 flex justify-between gap-2">
              <button type="button" onClick={removeSelected} className="text-[8px] font-mono uppercase tracking-wider text-red-300/70">Supprimer</button>
              <button type="button" onClick={wipe} className="text-[8px] font-mono uppercase tracking-wider text-gray-500">Effacer tout</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import {
  clearSessionJournal,
  deleteSessionEntry,
  getSessionJournal,
  updateSessionEntry,
  type SessionJournalEntry,
} from "../utils/sessionJournal";

const DONATION_LINE = "Aucun animal n’a été payé pendant cette traduction. Le laboratoire accepte les dons en miettes, en encouragements ou en euros.";

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
  } catch {
    return value;
  }
}

function Metric({ label, value, suffix = "" }: { label: string; value?: number; suffix?: string }) {
  if (value === undefined || value === null) return null;
  return (
    <span className="rounded border px-1.5 py-0.5 text-[8px] font-mono tracking-wider" style={{ borderColor: "#00d4ff22", color: "#8eeaff" }}>
      {label}: {value}{suffix}
    </span>
  );
}

function buildShareText(entry: SessionJournalEntry) {
  const place = entry.locationNote || entry.habitat || "lieu non précisé";
  return [
    "Creature Sync a intercepté :",
    `${entry.speciesName} — ${entry.confidence}%`,
    `“${entry.translation}”`,
    `Lieu : ${place}`,
    `Date : ${formatDate(entry.createdAt)}`,
    "",
    DONATION_LINE,
  ].join("\n");
}

export function SessionJournal({ latestEntry }: { latestEntry: SessionJournalEntry | null }) {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<SessionJournalEntry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [shareStatus, setShareStatus] = useState("");

  useEffect(() => {
    setEntries(getSessionJournal());
  }, [latestEntry]);

  const selected = entries.find(entry => entry.id === selectedId) || entries[0] || null;

  const updateSelected = (patch: Partial<SessionJournalEntry>) => {
    if (!selected) return;
    const next = updateSessionEntry(selected.id, patch);
    setEntries(next);
  };

  const removeSelected = () => {
    if (!selected) return;
    const next = deleteSessionEntry(selected.id);
    setEntries(next);
    setSelectedId(next[0]?.id || null);
  };

  const wipe = () => {
    const ok = window.confirm("Effacer tout le journal local Creature Sync ?");
    if (!ok) return;
    setEntries(clearSessionJournal());
    setSelectedId(null);
  };

  const shareSelected = async () => {
    if (!selected) return;
    const text = buildShareText(selected);
    setShareStatus("");

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Creature Sync — ${selected.speciesName}`,
          text,
        });
        setShareStatus("Traduction partagée. Les pigeons nient toute implication.");
        return;
      }

      await navigator.clipboard.writeText(text);
      setShareStatus("Texte copié. Tu peux le coller où tu veux.");
    } catch {
      try {
        await navigator.clipboard.writeText(text);
        setShareStatus("Partage annulé, mais texte copié dans le presse-papier.");
      } catch {
        setShareStatus("Partage impossible ici. Le laboratoire conserve la trace localement.");
      }
    }
  };

  const copyDonationLine = async () => {
    try {
      await navigator.clipboard.writeText(DONATION_LINE);
      setShareStatus("Phrase de soutien copiée. Aucun animal ne confirmera cette transaction.");
    } catch {
      setShareStatus(DONATION_LINE);
    }
  };

  return (
    <div className="rounded border p-2 backdrop-blur-sm" style={{ borderColor: "#00d4ff22", background: "rgba(0,10,25,0.62)" }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-2 text-left"
      >
        <span className="text-[9px] font-mono tracking-[0.32em] uppercase text-cyan-400/80">Journal des sessions</span>
        <span className="text-[8px] font-mono tracking-wider text-gray-500">
          {entries.length} trace{entries.length > 1 ? "s" : ""} // {open ? "fermer" : "ouvrir"}
        </span>
      </button>

      {latestEntry && !open && (
        <div className="mt-2 text-[8px] font-mono text-green-300/70 tracking-wider">
          Dernière trace sauvegardée : {latestEntry.speciesName} — {latestEntry.confidence}%
        </div>
      )}

      {open && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-3">
          <div className="space-y-1 max-h-64 overflow-auto pr-1">
            {entries.length === 0 && (
              <div className="text-[9px] font-mono text-gray-600 tracking-wider border rounded p-2" style={{ borderColor: "#ffffff11" }}>
                Aucune trace pour le moment. Appuie sur STOP après une captation pour archiver une traduction.
              </div>
            )}
            {entries.map(entry => (
              <button
                key={entry.id}
                type="button"
                onClick={() => setSelectedId(entry.id)}
                className="w-full text-left rounded border px-2 py-1.5 transition-all"
                style={{
                  borderColor: selected?.id === entry.id ? "#00d4ff66" : "#ffffff11",
                  background: selected?.id === entry.id ? "rgba(0,212,255,0.07)" : "rgba(255,255,255,0.02)",
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[9px] font-mono text-cyan-200 truncate">{entry.speciesName}</span>
                  <span className="text-[8px] font-mono text-orange-300">{entry.confidence}%</span>
                </div>
                <div className="text-[8px] font-mono text-gray-500 truncate">{formatDate(entry.createdAt)}</div>
              </button>
            ))}
          </div>

          {selected && (
            <div className="rounded border p-2 space-y-2" style={{ borderColor: "#ffffff12", background: "rgba(2,8,20,0.6)" }}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-mono font-bold text-white tracking-wider">{selected.speciesName}</div>
                  <div className="text-[8px] font-mono text-gray-500 tracking-wider">
                    {formatDate(selected.createdAt)} // {selected.habitat}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => updateSelected({ favorite: !selected.favorite })}
                  className="text-lg leading-none"
                  title="Favori"
                >
                  {selected.favorite ? "★" : "☆"}
                </button>
              </div>

              <div className="rounded border p-2 text-[11px] font-mono leading-relaxed text-cyan-50/90 whitespace-pre-line" style={{ borderColor: "#00d4ff22" }}>
                {selected.translation}
              </div>

              <div className="flex flex-wrap gap-1">
                <Metric label="Freq" value={selected.metrics.dominantFreq} suffix="Hz" />
                <Metric label="Spectre" value={selected.metrics.spectralCentroid} suffix="Hz" />
                <Metric label="Clarté" value={selected.metrics.clarity} suffix="%" />
                <Metric label="Résonance" value={selected.metrics.resonance} suffix="%" />
              </div>

              <label className="block space-y-1">
                <span className="text-[8px] font-mono text-gray-500 tracking-wider uppercase">Lieu / contexte</span>
                <input
                  value={selected.locationNote}
                  onChange={event => updateSelected({ locationNote: event.target.value })}
                  placeholder="Forêt, balcon, parc, ville, cuisine suspecte..."
                  className="w-full rounded border bg-transparent px-2 py-1 text-[10px] font-mono text-gray-200 outline-none"
                  style={{ borderColor: "#ffffff18" }}
                />
              </label>

              <label className="block space-y-1">
                <span className="text-[8px] font-mono text-gray-500 tracking-wider uppercase">Notes</span>
                <textarea
                  value={selected.userNotes}
                  onChange={event => updateSelected({ userNotes: event.target.value })}
                  placeholder="Ex : beaucoup de merles, vent fort, pigeon très sûr de lui..."
                  className="w-full min-h-16 rounded border bg-transparent px-2 py-1 text-[10px] font-mono text-gray-200 outline-none"
                  style={{ borderColor: "#ffffff18" }}
                />
              </label>

              <div className="rounded border p-2 space-y-1" style={{ borderColor: "#ff8c0022", background: "rgba(255,140,0,0.04)" }}>
                <div className="text-[8px] font-mono tracking-[0.22em] uppercase text-orange-300/80">Soutenir le laboratoire</div>
                <div className="text-[9px] font-mono text-orange-100/70 leading-relaxed">{DONATION_LINE}</div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button type="button" onClick={shareSelected} className="text-[8px] font-mono tracking-wider text-cyan-300 uppercase">
                    Partager cette traduction
                  </button>
                  <button type="button" onClick={copyDonationLine} className="text-[8px] font-mono tracking-wider text-orange-300 uppercase">
                    Copier l’appel à dons
                  </button>
                </div>
                {shareStatus && <div className="text-[8px] font-mono text-green-300/70 tracking-wider pt-1">{shareStatus}</div>}
              </div>

              <div className="flex justify-between gap-2 pt-1">
                <button type="button" onClick={removeSelected} className="text-[8px] font-mono tracking-wider text-red-300/70 uppercase">
                  Supprimer
                </button>
                <button type="button" onClick={wipe} className="text-[8px] font-mono tracking-wider text-gray-500 uppercase">
                  Effacer tout
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

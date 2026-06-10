import mediaCache from "../data/speciesMedia.generated.json";
import type { SpeciesCardItem } from "./SpeciesFeuchCard";

type MediaRow = {
  animal_id: string;
  label?: string;
  latin?: string;
  photo?: { url?: string; source?: string; credit?: string; license?: string } | null;
  audio?: { url?: string; source?: string; credit?: string; license?: string; recordingId?: string } | null;
  validated?: boolean;
};

const rows: MediaRow[] = Array.isArray((mediaCache as any).rows) ? (mediaCache as any).rows : [];

function normalize(value = "") {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}

function findMedia(item: SpeciesCardItem) {
  const key = normalize(item.key);
  const label = normalize(item.label);
  const latin = normalize(item.latin);
  return rows.find(row => {
    const rowId = normalize(row.animal_id);
    const rowLabel = normalize(row.label || "");
    const rowLatin = normalize(row.latin || "");
    return rowId === key || rowId === label || rowLatin === latin || (rowLatin && latin.includes(rowLatin)) || (rowLabel && label.includes(rowLabel));
  }) || null;
}

export function SpeciesMediaPanel({ item }: { item: SpeciesCardItem }) {
  const media = findMedia(item);
  if (!media?.photo && !media?.audio) return null;

  return (
    <div className="rounded border p-2 text-[9px] font-mono leading-relaxed text-emerald-50/80" style={{ borderColor: "rgba(0,255,136,0.18)", background: "rgba(0,255,136,0.035)" }}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-[8px] uppercase tracking-[0.22em] text-emerald-300/80">Photo / son</span>
        <span className="text-[7px] uppercase tracking-wider text-emerald-200/35">{media.validated ? "validé" : "à vérifier"}</span>
      </div>

      {media.photo?.url && (
        <div className="overflow-hidden rounded-lg border" style={{ borderColor: "rgba(0,255,136,0.20)", background: "rgba(255,255,255,0.03)" }}>
          <img src={media.photo.url} alt={item.label} className="h-40 w-full object-cover" loading="lazy" />
          <div className="px-2 py-1 text-[7px] uppercase tracking-[0.14em] text-emerald-100/50">
            Photo : {media.photo.credit || "source naturaliste"} — {media.photo.license || "licence à vérifier"}
          </div>
          {media.photo.source && <a href={media.photo.source} target="_blank" rel="noreferrer" className="block px-2 pb-1 text-[7px] uppercase tracking-[0.16em] text-emerald-300/70 underline underline-offset-4">Source photo</a>}
        </div>
      )}

      {media.audio?.url && (
        <div className="mt-2 rounded-lg border p-2" style={{ borderColor: "rgba(0,212,255,0.18)", background: "rgba(0,212,255,0.04)" }}>
          <audio controls preload="none" src={media.audio.url} className="w-full" />
          <div className="mt-1 text-[7px] uppercase tracking-[0.14em] text-cyan-100/55">
            Son : {media.audio.credit || "xeno-canto"} — {media.audio.license || "licence à vérifier"}
          </div>
          {media.audio.source && <a href={media.audio.source} target="_blank" rel="noreferrer" className="mt-1 inline-block text-[7px] uppercase tracking-[0.16em] text-cyan-300/70 underline underline-offset-4">Source audio {media.audio.recordingId ? `· ${media.audio.recordingId}` : ""}</a>}
        </div>
      )}
    </div>
  );
}

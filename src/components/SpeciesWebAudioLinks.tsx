import { getSpeciesWebAudioFallback } from "../data/speciesWebAudioFallbacks";
import type { SpeciesCardItem } from "./SpeciesFeuchCard";

export function SpeciesWebAudioLinks({ item }: { item: SpeciesCardItem }) {
  const fallback = getSpeciesWebAudioFallback(item, "fr");
  if (!fallback) return null;

  return (
    <div className="mt-2 rounded-lg border p-3 text-[9px] font-mono" style={{ borderColor: "rgba(255,140,0,0.28)", background: "rgba(255,140,0,0.045)" }}>
      <div className="mb-1 text-[8px] uppercase tracking-[0.22em] text-orange-200/80">Source sonore web</div>
      <div className="text-[8px] uppercase tracking-[0.14em] text-orange-100/60">
        {fallback.sourceLabel} — {fallback.license}
      </div>
      <a href={fallback.sourceUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-[8px] uppercase tracking-[0.16em] text-orange-200 underline underline-offset-4">
        Ouvrir la source sonore
      </a>
    </div>
  );
}

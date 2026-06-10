import type { Lang } from "../data/translations";
import { WikipediaSpeciesPanel } from "./WikipediaSpeciesPanel";
import { SpeciesMediaPanel } from "./SpeciesMediaPanel";

export type SpeciesCardItem = {
  key: string;
  label: string;
  latin: string;
  icon: string;
  confidence: number;
  hits: number;
};

function query(item: SpeciesCardItem) {
  return encodeURIComponent(`${item.label} ${item.latin}`.replace(/\s+/g, " ").trim());
}

export function SpeciesFeuchCard({ item, lang, onClose }: { item: SpeciesCardItem; lang: Lang; onClose: () => void }) {
  const q = query(item);
  return (
    <div className="mt-2 rounded-xl border p-3" style={{ borderColor: "rgba(0,212,255,0.22)", background: "rgba(2,8,20,0.72)" }}>
      <div className="flex items-start gap-3">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border text-4xl" style={{ borderColor: "rgba(0,255,136,0.22)", background: "rgba(255,255,255,0.04)" }}>{item.icon}</div>
        <div className="min-w-0 flex-1">
          <div className="text-base sm:text-lg font-mono font-bold uppercase tracking-[0.12em] text-green-100 truncate">{item.label}</div>
          <div className="text-[11px] sm:text-xs font-mono italic tracking-[0.08em] text-green-200/70 truncate">{item.latin}</div>
          <div className="mt-1 text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.18em] text-cyan-200/80">{item.confidence}% · {item.hits} traces</div>
        </div>
        <button type="button" onClick={onClose} className="text-[9px] font-mono uppercase tracking-wider text-gray-400">Fermer</button>
      </div>

      <div className="mt-3">
        <SpeciesMediaPanel item={item} />
      </div>

      <div className="mt-3">
        <WikipediaSpeciesPanel item={item} lang={lang} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <a href={`https://www.google.com/search?tbm=isch&q=${q}`} target="_blank" rel="noreferrer" className="rounded border px-2 py-2 text-center text-[9px] font-mono uppercase tracking-wider text-cyan-200" style={{ borderColor: "rgba(0,212,255,0.25)", background: "rgba(0,212,255,0.06)" }}>Galerie</a>
        <a href={`https://www.google.com/search?q=${q}+wikipedia`} target="_blank" rel="noreferrer" className="rounded border px-2 py-2 text-center text-[9px] font-mono uppercase tracking-wider text-green-200" style={{ borderColor: "rgba(0,255,136,0.25)", background: "rgba(0,255,136,0.06)" }}>Recherche fiche</a>
      </div>
    </div>
  );
}

import type { Lang } from "../data/translations";
import { WikipediaSpeciesPanel } from "./WikipediaSpeciesPanel";
import { YouTubeSpeciesEmbeds } from "./YouTubeSpeciesEmbeds";

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

function feuchText(item: SpeciesCardItem, lang: Lang) {
  const raw = `${item.label} ${item.latin}`.toLowerCase();
  const fr = lang === "fr";

  if (raw.includes("merle") || raw.includes("blackbird")) return fr
    ? "Wiki Feuch : le merle ne chante pas, il dépose une plainte mélodique contre l’organisation générale du matin."
    : "Feuch Wiki: the blackbird is filing a melodic complaint against the morning’s management.";

  if (raw.includes("pie") || raw.includes("magpie")) return fr
    ? "Wiki Feuch : la pie collecte les anomalies brillantes, les secrets de balcon et les miettes juridiquement ambiguës."
    : "Feuch Wiki: the magpie collects shiny anomalies, balcony secrets and legally ambiguous crumbs.";

  if (raw.includes("perruche") || raw.includes("parakeet")) return fr
    ? "Wiki Feuch : la perruche est une alarme tropicale ayant obtenu un permis de survol administratif en zone pavillonnaire."
    : "Feuch Wiki: the parakeet is a tropical alarm with an administrative overflight permit.";

  if (raw.includes("corbeau") || raw.includes("corneille") || raw.includes("crow")) return fr
    ? "Wiki Feuch : le corvidé sait quelque chose, mais facture ses révélations en croassements et en regards de travers."
    : "Feuch Wiki: the corvid knows something, but invoices revelations in caws and sideways looks.";

  return fr
    ? `Wiki Feuch : ${item.label} présente une activité compatible avec une réunion de plumes non déclarée.`
    : `Feuch Wiki: ${item.label} shows activity compatible with an undeclared feather meeting.`;
}

export function SpeciesFeuchCard({ item, lang, onClose }: { item: SpeciesCardItem; lang: Lang; onClose: () => void }) {
  const q = query(item);
  return (
    <div className="mt-2 rounded-xl border p-2" style={{ borderColor: "rgba(0,212,255,0.22)", background: "rgba(2,8,20,0.72)" }}>
      <div className="flex items-start gap-3">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border text-4xl" style={{ borderColor: "rgba(0,255,136,0.22)", background: "rgba(255,255,255,0.04)" }}>{item.icon}</div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-mono font-bold uppercase tracking-[0.12em] text-green-100 truncate">{item.label}</div>
          <div className="text-[10px] font-mono italic tracking-[0.08em] text-green-200/50 truncate">{item.latin}</div>
          <div className="mt-1 text-[8px] font-mono uppercase tracking-[0.18em] text-cyan-200/65">{item.confidence}% · {item.hits} traces</div>
        </div>
        <button type="button" onClick={onClose} className="text-[8px] font-mono uppercase tracking-wider text-gray-500">Fermer</button>
      </div>

      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <WikipediaSpeciesPanel item={item} lang={lang} />
        <div className="rounded border p-2 text-[9px] font-mono leading-relaxed text-orange-50/80" style={{ borderColor: "rgba(255,140,0,0.20)", background: "rgba(255,140,0,0.04)" }}>
          <div className="mb-1 text-[8px] uppercase tracking-[0.22em] text-orange-300/85">Wiki Feuch</div>
          {feuchText(item, lang)}
        </div>
      </div>

      <div className="mt-2 rounded border p-2 text-[8px] font-mono leading-relaxed text-gray-400" style={{ borderColor: "rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.02)" }}>
        <span className="uppercase tracking-[0.22em] text-green-300/70">Pourquoi ce candidat ?</span> — Revenu {item.hits} fois dans la mémoire de session. Confiance max : {item.confidence}%. En milieu bruyant, c’est une piste, pas une preuve.
      </div>

      <div className="mt-2">
        <YouTubeSpeciesEmbeds item={item} />
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <a href={`https://www.google.com/search?tbm=isch&q=${q}`} target="_blank" rel="noreferrer" className="rounded border px-2 py-1.5 text-center text-[8px] font-mono uppercase tracking-wider text-cyan-200" style={{ borderColor: "rgba(0,212,255,0.25)", background: "rgba(0,212,255,0.06)" }}>Galerie</a>
        <a href={`https://www.google.com/search?q=${q}+wikipedia`} target="_blank" rel="noreferrer" className="rounded border px-2 py-1.5 text-center text-[8px] font-mono uppercase tracking-wider text-green-200" style={{ borderColor: "rgba(0,255,136,0.25)", background: "rgba(0,255,136,0.06)" }}>Recherche fiche</a>
      </div>
    </div>
  );
}

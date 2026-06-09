import { useEffect, useMemo, useState } from "react";
import type { Lang } from "../data/translations";
import type { SpeciesCardItem } from "./SpeciesFeuchCard";

type WikiSummary = {
  title?: string;
  extract?: string;
  thumbnail?: { source?: string };
  content_urls?: { desktop?: { page?: string } };
};

function wikiLang(lang: Lang) {
  return lang === "fr" ? "fr" : lang === "es" ? "es" : "en";
}

function searchTerm(item: SpeciesCardItem) {
  return (item.label || item.latin).replace(/\s+/g, " ").trim();
}

export function WikipediaSpeciesPanel({ item, lang }: { item: SpeciesCardItem; lang: Lang }) {
  const [summary, setSummary] = useState<WikiSummary | null>(null);
  const [status, setStatus] = useState("loading");
  const term = useMemo(() => searchTerm(item), [item]);
  const hostLang = wikiLang(lang);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setSummary(null);

    async function run() {
      try {
        const searchUrl = `https://${hostLang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(term)}&format=json&origin=*`;
        const searchRes = await fetch(searchUrl);
        const searchData = await searchRes.json();
        const title = searchData?.query?.search?.[0]?.title || term;
        const summaryUrl = `https://${hostLang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
        const summaryRes = await fetch(summaryUrl);
        const data = await summaryRes.json();
        if (!cancelled) {
          setSummary(data);
          setStatus("ready");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    run();
    return () => { cancelled = true; };
  }, [hostLang, term]);

  return (
    <div className="rounded border p-2 text-[9px] font-mono leading-relaxed text-cyan-50/80" style={{ borderColor: "rgba(0,212,255,0.18)", background: "rgba(0,212,255,0.035)" }}>
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-[8px] uppercase tracking-[0.22em] text-cyan-300/80">Base Wikipédia</span>
        <span className="text-[7px] uppercase tracking-wider text-cyan-200/35">{hostLang}.wiki</span>
      </div>

      {status === "loading" && <div className="text-cyan-200/45">Recherche dans la base naturaliste...</div>}
      {status === "error" && <div className="text-orange-200/70">Wikipédia ne répond pas. Le Feuch Institut prend des notes au crayon.</div>}
      {status === "ready" && summary && (
        <div className="space-y-2">
          <div className="flex gap-2">
            {summary.thumbnail?.source && <img src={summary.thumbnail.source} alt="" className="h-16 w-16 rounded object-cover border border-cyan-300/20" loading="lazy" />}
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-[0.12em] text-cyan-100 truncate">{summary.title || term}</div>
              <div className="mt-1 text-cyan-50/75">{summary.extract || "Résumé indisponible pour ce taxon."}</div>
            </div>
          </div>
          {summary.content_urls?.desktop?.page && (
            <a href={summary.content_urls.desktop.page} target="_blank" rel="noreferrer" className="inline-block text-[8px] uppercase tracking-[0.18em] text-cyan-300/80 underline underline-offset-4">Ouvrir la source Wikipédia</a>
          )}
        </div>
      )}
    </div>
  );
}

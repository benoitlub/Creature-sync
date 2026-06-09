import type { SpeciesCardItem } from "./SpeciesFeuchCard";

const VIDEO_MAP: Record<string, string[]> = {
  merle: ["D7L8j7mO7ZQ", "R6Dk8W6oYxI"],
  blackbird: ["D7L8j7mO7ZQ", "R6Dk8W6oYxI"],
  pie: ["8fM8j1YlO6k", "1Y6KqDkL5vE"],
  magpie: ["8fM8j1YlO6k", "1Y6KqDkL5vE"],
  perruche: ["WzjB74p6n8Y", "vG7v2J5ZJ0E"],
  parakeet: ["WzjB74p6n8Y", "vG7v2J5ZJ0E"],
  corbeau: ["hA7atOBr1f0", "5Qq4W6sYkJc"],
  crow: ["hA7atOBr1f0", "5Qq4W6sYkJc"],
  pigeon: ["zLdXq7m2xXU", "4QkqfWbM2C8"],
};

function idsFor(item: SpeciesCardItem) {
  const raw = `${item.label} ${item.latin}`.toLowerCase();
  const match = Object.entries(VIDEO_MAP).find(([key]) => raw.includes(key));
  return match?.[1] || [];
}

function query(item: SpeciesCardItem) {
  return encodeURIComponent(`${item.label} ${item.latin} chant oiseau`.replace(/\s+/g, " ").trim());
}

export function YouTubeSpeciesEmbeds({ item }: { item: SpeciesCardItem }) {
  const ids = idsFor(item);
  const q = query(item);

  return (
    <div className="rounded border p-2" style={{ borderColor: "rgba(255,80,80,0.20)", background: "rgba(255,80,80,0.035)" }}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-[8px] font-mono uppercase tracking-[0.22em] text-red-200/85">Écoute / chant</span>
        <a href={`https://www.youtube.com/results?search_query=${q}`} target="_blank" rel="noreferrer" className="text-[7px] font-mono uppercase tracking-wider text-red-100/45">recherche</a>
      </div>

      {ids.length === 0 ? (
        <a href={`https://www.youtube.com/results?search_query=${q}`} target="_blank" rel="noreferrer" className="block rounded border px-2 py-3 text-center text-[9px] font-mono uppercase tracking-[0.18em] text-red-100/70" style={{ borderColor: "rgba(255,80,80,0.22)" }}>
          Ouvrir le chant sur YouTube
        </a>
      ) : (
        <iframe
          className="h-24 w-full rounded border border-red-200/15 sm:h-28"
          src={`https://www.youtube-nocookie.com/embed/${ids[0]}`}
          title={`Chant ${item.label}`}
          loading="lazy"
          allowFullScreen
        />
      )}
    </div>
  );
}

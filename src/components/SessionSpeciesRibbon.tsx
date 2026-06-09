import { useEffect, useRef, useState } from "react";
import type { LiveCandidate } from "../hooks/useAudioAnalysis";
import type { Lang } from "../data/translations";

type SeenSpecies = {
  key: string;
  label: string;
  latin: string;
  icon: string;
  confidence: number;
  hits: number;
};

const COPY: Record<Lang, { title: string; empty: string; hits: string }> = {
  fr: {
    title: "Bande de session",
    empty: "Les espèces détectées pendant cette écoute apparaîtront ici.",
    hits: "traces",
  },
  en: {
    title: "Session ribbon",
    empty: "Species detected during this listening session will appear here.",
    hits: "hits",
  },
  es: {
    title: "Banda de sesión",
    empty: "Las especies detectadas durante esta escucha aparecerán aquí.",
    hits: "trazas",
  },
};

function getAnimalIcon(id: string, label: string, latin: string) {
  const raw = `${id} ${label} ${latin}`.toLowerCase();
  if (raw.includes("owl") || raw.includes("chouette") || raw.includes("hibou") || raw.includes("strix")) return "🦉";
  if (raw.includes("duck") || raw.includes("canard") || raw.includes("anas")) return "🦆";
  if (raw.includes("cat") || raw.includes("chat") || raw.includes("felis")) return "🐈";
  if (raw.includes("dog") || raw.includes("chien") || raw.includes("canis")) return "🐕";
  if (raw.includes("parakeet") || raw.includes("perruche") || raw.includes("psittacula")) return "🦜";
  if (raw.includes("swift") || raw.includes("martinet") || raw.includes("apus")) return "🪽";
  if (raw.includes("swallow") || raw.includes("hirondelle") || raw.includes("hirundo")) return "🐦";
  if (raw.includes("kestrel") || raw.includes("faucon") || raw.includes("falco")) return "🦅";
  if (raw.includes("dove") || raw.includes("tourterelle") || raw.includes("streptopelia")) return "🕊️";
  if (raw.includes("pigeon") || raw.includes("columba")) return "🕊️";
  if (raw.includes("starling") || raw.includes("étourneau") || raw.includes("sturnus")) return "🐦‍⬛";
  if (raw.includes("magpie") || raw.includes("pie") || raw.includes("pica")) return "🐦‍⬛";
  if (raw.includes("crow") || raw.includes("corbeau") || raw.includes("corneille") || raw.includes("corvus")) return "🐦‍⬛";
  if (raw.includes("blackbird") || raw.includes("merle") || raw.includes("turdus")) return "🐦‍⬛";
  if (raw.includes("robin") || raw.includes("rouge-gorge") || raw.includes("erithacus")) return "🐦";
  if (raw.includes("tit") || raw.includes("mésange") || raw.includes("parus") || raw.includes("cyanistes")) return "🐤";
  if (raw.includes("wren") || raw.includes("troglodyte")) return "🐥";
  if (raw.includes("sparrow") || raw.includes("moineau") || raw.includes("passer")) return "🐦";
  return "🐾";
}

function buildSeenSpecies(state: any, candidates: LiveCandidate[], lang: Lang): SeenSpecies | null {
  const top = candidates[0];
  const id = state.species?.id || top?.id || state.detectedSpecies || "";
  const label = state.species?.scientificName?.[lang] || state.detectedSpecies || top?.name || "";
  const latin = state.species?.name || top?.scientificName || "";
  const confidence = Math.max(0, Math.min(99, Math.round(state.confidence || state.speciesConfidence || top?.confidence || 0)));

  if (!label && !latin) return null;

  const key = (id || latin || label).toLowerCase();
  return {
    key,
    label: label || latin,
    latin: latin || label,
    icon: getAnimalIcon(id, label, latin),
    confidence,
    hits: 1,
  };
}

export function SessionSpeciesRibbon({ state, candidates, lang }: { state: any; candidates: LiveCandidate[]; lang: Lang }) {
  const [seen, setSeen] = useState<SeenSpecies[]>([]);
  const wasListening = useRef(false);
  const copy = COPY[lang];

  useEffect(() => {
    if (state.isListening && !wasListening.current) {
      setSeen([]);
      wasListening.current = true;
    }

    if (!state.isListening && wasListening.current && !state.isAnalyzing) {
      wasListening.current = false;
    }
  }, [state.isListening, state.isAnalyzing]);

  useEffect(() => {
    if (!state.isListening && !state.isAnalyzing && !state.isComplete) return;

    const next = buildSeenSpecies(state, candidates, lang);
    if (!next || next.confidence < 10) return;

    setSeen(prev => {
      const existing = prev.find(item => item.key === next.key);
      if (existing) {
        return prev.map(item => item.key === next.key ? { ...item, confidence: Math.max(item.confidence, next.confidence), hits: item.hits + 1 } : item);
      }
      return [...prev, next].slice(-12);
    });
  }, [state.detectedSpecies, state.species?.id, state.confidence, state.speciesConfidence, state.isListening, state.isAnalyzing, state.isComplete, candidates, lang]);

  return (
    <div className="rounded border px-3 py-2 backdrop-blur-sm" style={{ borderColor: "#00ff8840", background: "rgba(0,10,25,0.62)" }}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="text-[9px] font-mono tracking-[0.32em] uppercase text-green-300/75">{copy.title}</div>
        <div className="text-[8px] font-mono tracking-[0.22em] uppercase text-white/30">{seen.length} taxa</div>
      </div>

      {seen.length === 0 ? (
        <div className="text-[9px] font-mono text-gray-600 tracking-wider">{copy.empty}</div>
      ) : (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {seen.map(item => (
            <div key={item.key} className="min-w-[92px] rounded-xl border px-2 py-2 text-center" style={{ borderColor: "rgba(0,255,136,0.24)", background: "rgba(255,255,255,0.035)" }}>
              <div className="text-3xl leading-none">{item.icon}</div>
              <div className="mt-1 truncate text-[8px] font-mono uppercase tracking-[0.12em] text-green-100">{item.label}</div>
              <div className="truncate text-[7px] font-mono italic tracking-[0.08em] text-green-200/40">{item.latin}</div>
              <div className="mt-1 text-[7px] font-mono tracking-wider text-cyan-200/75">{item.confidence}% · {item.hits} {copy.hits}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

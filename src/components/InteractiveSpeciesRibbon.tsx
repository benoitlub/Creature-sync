import { useEffect, useRef, useState } from "react";
import type { LiveCandidate } from "../hooks/useAudioAnalysis";
import type { Lang } from "../data/translations";
import mediaCache from "../data/speciesMedia.generated.json";
import { SpeciesFeuchCard, type SpeciesCardItem } from "./SpeciesFeuchCard";

type SeenSpecies = SpeciesCardItem;
type MediaRow = {
  animal_id: string;
  label?: string;
  latin?: string;
  audio?: { url?: string; source?: string; credit?: string; license?: string; recordingId?: string } | null;
};

const mediaRows: MediaRow[] = Array.isArray((mediaCache as any).rows) ? (mediaCache as any).rows : [];

const COPY: Record<Lang, { title: string; empty: string; hits: string; listen: string; stop: string }> = {
  fr: { title: "Bande de session", empty: "Les espèces détectées avec un signal stable apparaîtront ici.", hits: "traces", listen: "Écouter", stop: "Stop" },
  en: { title: "Session ribbon", empty: "Stable detected species will appear here.", hits: "hits", listen: "Listen", stop: "Stop" },
  es: { title: "Banda de sesión", empty: "Las especies detectadas con señal estable aparecerán aquí.", hits: "trazas", listen: "Escuchar", stop: "Stop" },
};

function normalize(value = "") {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}

function findAudioUrl(item: SpeciesCardItem) {
  const key = normalize(item.key);
  const label = normalize(item.label);
  const latin = normalize(item.latin);
  const row = mediaRows.find(row => {
    const rowId = normalize(row.animal_id);
    const rowLabel = normalize(row.label || "");
    const rowLatin = normalize(row.latin || "");
    return rowId === key || rowId === label || rowLatin === latin || (rowLatin && latin.includes(rowLatin)) || (rowLabel && label.includes(rowLabel));
  });
  return row?.audio?.url || null;
}

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

function fromCandidate(candidate: LiveCandidate): SeenSpecies | null {
  if (!candidate.name && !candidate.scientificName) return null;
  const confidence = Math.max(0, Math.min(99, Math.round(candidate.confidence || 0)));
  const key = (candidate.id || candidate.scientificName || candidate.name).toLowerCase();
  return { key, label: candidate.name || candidate.scientificName, latin: candidate.scientificName || candidate.name, icon: getAnimalIcon(candidate.id, candidate.name, candidate.scientificName), confidence, hits: 1 };
}

function fromState(state: any, lang: Lang): SeenSpecies | null {
  const id = state.species?.id || state.detectedSpecies || "";
  const label = state.species?.scientificName?.[lang] || state.detectedSpecies || "";
  const latin = state.species?.name || "";
  const confidence = Math.max(0, Math.min(99, Math.round(state.confidence || state.speciesConfidence || 0)));
  if (!label && !latin) return null;
  const key = (id || latin || label).toLowerCase();
  return { key, label: label || latin, latin: latin || label, icon: getAnimalIcon(id, label, latin), confidence, hits: 1 };
}

function hasStableSignal(state: any, candidates: LiveCandidate[]) {
  const progress = Math.round(state.scanProgress || 0);
  const quality = Math.round(state.signalQuality || 0);
  const best = Math.max(...candidates.map(c => c.confidence || 0), state.confidence || 0, state.speciesConfidence || 0, 0);
  return progress >= 26 && quality >= 28 && best >= 42;
}

function buildBatch(state: any, candidates: LiveCandidate[], lang: Lang): SeenSpecies[] {
  if (!hasStableSignal(state, candidates)) return [];
  const primary = fromState(state, lang);
  const strongCandidates = candidates
    .filter(candidate => (candidate.confidence || 0) >= 45)
    .slice(0, primary ? 2 : 3)
    .map(fromCandidate);
  const batch = [primary, ...strongCandidates]
    .filter((item): item is SeenSpecies => Boolean(item))
    .filter(item => item.confidence >= 42);
  const byKey = new Map<string, SeenSpecies>();
  batch.forEach(item => {
    const current = byKey.get(item.key);
    if (!current || item.confidence > current.confidence) byKey.set(item.key, item);
  });
  return Array.from(byKey.values()).slice(0, 3);
}

export function InteractiveSpeciesRibbon({ state, candidates, lang }: { state: any; candidates: LiveCandidate[]; lang: Lang }) {
  const [seen, setSeen] = useState<SeenSpecies[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wasListening = useRef(false);
  const copy = COPY[lang];
  const selected = seen.find(item => item.key === selectedKey) || null;

  useEffect(() => {
    if (state.isListening && !wasListening.current) {
      setSeen([]);
      setSelectedKey(null);
      setPlayingKey(null);
      audioRef.current?.pause();
      wasListening.current = true;
    }
    if (!state.isListening && wasListening.current && !state.isAnalyzing) wasListening.current = false;
  }, [state.isListening, state.isAnalyzing]);

  useEffect(() => {
    if (!state.isListening && !state.isAnalyzing && !state.isComplete) return;
    const nextBatch = buildBatch(state, candidates, lang);
    if (nextBatch.length === 0) return;
    setSeen(prev => {
      const byKey = new Map(prev.map(item => [item.key, item]));
      nextBatch.forEach(next => {
        const existing = byKey.get(next.key);
        byKey.set(next.key, existing ? { ...existing, confidence: Math.max(existing.confidence, next.confidence), hits: existing.hits + 1 } : next);
      });
      return Array.from(byKey.values()).sort((a, b) => b.confidence - a.confidence || b.hits - a.hits).slice(0, 3);
    });
  }, [state.detectedSpecies, state.species?.id, state.confidence, state.speciesConfidence, state.signalQuality, state.scanProgress, state.isListening, state.isAnalyzing, state.isComplete, candidates, lang]);

  const playAudio = async (item: SeenSpecies) => {
    const audioUrl = findAudioUrl(item);
    if (!audioUrl) return;
    if (playingKey === item.key) {
      audioRef.current?.pause();
      setPlayingKey(null);
      return;
    }
    if (!audioRef.current) audioRef.current = new Audio();
    audioRef.current.pause();
    audioRef.current.src = audioUrl;
    audioRef.current.currentTime = 0;
    audioRef.current.onended = () => setPlayingKey(null);
    try {
      await audioRef.current.play();
      setPlayingKey(item.key);
    } catch {
      setPlayingKey(null);
    }
  };

  return (
    <div className="rounded border px-3 py-2 backdrop-blur-sm" style={{ borderColor: "#00ff8840", background: "rgba(0,10,25,0.62)" }}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="text-[9px] font-mono tracking-[0.32em] uppercase text-green-300/75">{copy.title}</div>
        <div className="text-[8px] font-mono tracking-[0.22em] uppercase text-white/30">{seen.length} taxa</div>
      </div>
      {seen.length === 0 ? <div className="text-[9px] font-mono text-gray-600 tracking-wider">{copy.empty}</div> : (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {seen.map(item => {
            const active = selectedKey === item.key;
            const audioUrl = findAudioUrl(item);
            const isPlaying = playingKey === item.key;
            return (
              <div key={item.key} className="min-w-[118px] rounded-xl border px-2 py-2 text-center transition-all" style={{ borderColor: active ? "rgba(0,255,136,0.66)" : "rgba(0,255,136,0.24)", background: active ? "rgba(0,255,136,0.08)" : "rgba(255,255,255,0.035)", boxShadow: active ? "0 0 14px rgba(0,255,136,0.18)" : "none" }}>
                <button type="button" onClick={() => setSelectedKey(active ? null : item.key)} className="block w-full text-center">
                  <div className="text-3xl leading-none">{item.icon}</div>
                  <div className="mt-1 truncate text-[9px] font-mono uppercase tracking-[0.12em] text-green-100">{item.label}</div>
                  <div className="truncate text-[8px] font-mono italic tracking-[0.08em] text-green-200/50">{item.latin}</div>
                  <div className="mt-1 text-[8px] font-mono tracking-wider text-cyan-200/80">{item.confidence}% · {item.hits} {copy.hits}</div>
                </button>
                {audioUrl && (
                  <button type="button" onClick={() => playAudio(item)} className="mt-2 w-full rounded border px-2 py-1.5 text-[8px] font-mono font-bold uppercase tracking-[0.18em]" style={{ borderColor: "rgba(0,212,255,0.48)", background: isPlaying ? "rgba(255,140,0,0.18)" : "rgba(0,212,255,0.12)", color: "#dffbff" }}>
                    {isPlaying ? `■ ${copy.stop}` : `▶ ${copy.listen}`}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
      {selected && <SpeciesFeuchCard item={selected} lang={lang} onClose={() => setSelectedKey(null)} />}
    </div>
  );
}

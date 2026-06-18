import { useCallback, useEffect, useRef, useState } from "react";
import {
  SPECIES,
  extractAudioFeatures,
  getCrypticMessages,
  type AnalysisState,
  type AudioFeatures,
  type Lang,
  type Species,
} from "../data/animals";
import { FOREST_SPECIES } from "../data/forestSpecies";
import { URBAN_BIRD_SPECIES } from "../data/urbanBirdSpecies";
import { getEvolvingTranslation } from "../data/phraseBanks";

const EXTRA_SPECIES = [...FOREST_SPECIES, ...URBAN_BIRD_SPECIES];
const ALL_SPECIES = uniqueSpecies([...SPECIES, ...EXTRA_SPECIES]);

const NOCTURNAL_MAMMAL_IDS = new Set(["red_fox", "hedgehog", "beech_marten"]);
const NOCTURNAL_RAPTOR_IDS = new Set(["tawny_owl", "owl"]);
const MAMMAL_IDS = new Set(["cat", "dog", ...NOCTURNAL_MAMMAL_IDS]);
const NON_BIRD_IDS = new Set([...MAMMAL_IDS]);
const PIGEON_IDS = new Set(["pigeon", "wood_pigeon"]);
const CORVID_IDS = new Set(["crow", "carrion_crow", "magpie", "jay"]);
const PARROT_IDS = new Set(["ring_necked_parakeet"]);
const CLEAR_SONGBIRD_IDS = new Set([
  "blackbird", "robin", "great_tit", "blue_tit", "chaffinch", "wren", "nightingale",
  "song_thrush", "blackcap", "dunnock", "short_toed_treecreeper", "eurasian_nuthatch",
]);

const BIRD_IDS = new Set([
  "crow", "pigeon", "duck", "owl",
  ...FOREST_SPECIES.map(s => s.id),
  ...URBAN_BIRD_SPECIES.map(s => s.id).filter(id => !NON_BIRD_IDS.has(id)),
]);

const MIN_LIVE_RMS = 0.0012;
const MIN_SIGNATURE_ACTIVITY = 0.16;
const MIN_STABLE_SCORE = 0.30;
const AMBIGUITY_MARGIN = 0.08;
const LIVE_CANDIDATE_LIMIT = 5;
const MEMORY_WINDOW_MS = 7000;
const MEMORY_FRAME_LIMIT = 90;

type Habitat = "forest" | "urban" | "mixed" | "quiet" | "indoor" | "night";
type CandidateFrame = { at: number; candidates: { species: Species; score: number }[] };
export type LiveCandidate = { id: string; name: string; scientificName: string; confidence: number };

type CreatureHabit = { total: number; firstSeen: number; lastSeen: number; habitats: Record<string, number> };

type ScoredSpecies = { species: Species; score: number; suspect: boolean };

const INITIAL_STATE: AnalysisState = {
  isListening: false,
  isAnalyzing: false,
  isComplete: false,
  species: null,
  confidence: 0,
  emotionalState: "",
  threatLevel: "MINIMAL",
  biologicalIntent: "",
  neuralResonance: 0,
  signalQuality: 0,
  translation: "",
  environmentalScan: "",
  isPoetic: false,
  glitchActive: false,
  scanProgress: 0,
  detectedSpecies: null,
  speciesConfidence: 0,
  audioFeatures: null,
};

function uniqueSpecies(species: Species[]) {
  const byId = new Map<string, Species>();
  species.forEach(item => byId.set(item.id, item));
  return Array.from(byId.values());
}

function localHour() {
  return new Date().getHours();
}

function isNightNow() {
  const h = localHour();
  return h >= 21 || h < 6;
}

function rangeScore(value: number, min: number, max: number) {
  if (value >= min && value <= max) return 1;
  const mid = (min + max) / 2;
  const range = Math.max(1, (max - min) / 2);
  return Math.max(0, 1 - Math.abs(value - mid) / range);
}

function getAverageFeatures(samples: AudioFeatures[]): AudioFeatures | null {
  if (samples.length === 0) return null;
  const avg = (key: keyof AudioFeatures) => samples.reduce((sum, item) => sum + Number(item[key] || 0), 0) / samples.length;
  return {
    dominantFreq: avg("dominantFreq"),
    spectralCentroid: avg("spectralCentroid"),
    flatness: avg("flatness"),
    lowEnergyRatio: avg("lowEnergyRatio"),
    zcr: avg("zcr"),
    periodicity: avg("periodicity"),
    rms: avg("rms"),
    sampleDuration: samples[0].sampleDuration,
  };
}

function signatureActivity(features: AudioFeatures | null) {
  if (!features) return 0;
  const tonal = Math.max(0, 1 - features.flatness);
  const highBand = features.spectralCentroid > 1200 ? 1 : features.spectralCentroid / 1200;
  const articulation = Math.min(1, features.zcr * 10);
  const repetition = Math.min(1, features.periodicity * 3.2);
  const lowRumblePenalty = features.lowEnergyRatio > 0.72 ? 0.58 : 1;
  const whisperBonus = features.rms > MIN_LIVE_RMS ? 1 : 0.45;
  return Math.max(0, Math.min(1, (tonal * 0.22 + highBand * 0.22 + articulation * 0.20 + repetition * 0.28 + whisperBonus * 0.08) * lowRumblePenalty));
}

function inferHabitat(features: AudioFeatures | null): Habitat {
  if (!features || signatureActivity(features) < 0.11) return isNightNow() ? "indoor" : "quiet";
  if (isNightNow() && features.rms < 0.06 && features.flatness > 0.30 && features.periodicity < 0.25) return "indoor";
  if (features.rms > 0.22 || (features.flatness > 0.60 && features.periodicity < 0.18)) return "urban";
  if (features.spectralCentroid > 1800 && features.lowEnergyRatio < 0.50) return "forest";
  return isNightNow() ? "night" : "mixed";
}

function baseProfileScore(species: Species, features: AudioFeatures) {
  const p = species.acousticProfile;
  const weighted = [
    [rangeScore(features.dominantFreq, p.dominantFreqMin, p.dominantFreqMax), 2.6],
    [rangeScore(features.spectralCentroid, p.spectralCentroidMin, p.spectralCentroidMax), 2.4],
    [rangeScore(features.flatness, p.flatnessMin, p.flatnessMax), 1.4],
    [rangeScore(features.lowEnergyRatio, p.lowEnergyRatioMin, p.lowEnergyRatioMax), 1.8],
    [rangeScore(features.zcr, p.zcrMin, p.zcrMax), 1.7],
    [rangeScore(features.periodicity, p.periodicityMin, p.periodicityMax), 2.2],
    [rangeScore(features.rms, p.rmsMin, p.rmsMax), 0.25],
  ];
  const total = weighted.reduce((sum, [, weight]) => sum + weight, 0);
  return weighted.reduce((sum, [score, weight]) => sum + score * weight, 0) / total;
}

function speciesScore(species: Species, features: AudioFeatures): ScoredSpecies {
  let normalized = baseProfileScore(species, features);
  const habitat = inferHabitat(features);
  const signature = signatureActivity(features);
  const night = isNightNow();
  const highFast = features.spectralCentroid > 2400 && features.zcr > 0.045 && features.lowEnergyRatio < 0.52;
  const melodic = features.periodicity > 0.18 && features.spectralCentroid > 1450 && features.lowEnergyRatio < 0.52 && features.flatness < 0.48;
  const harshChatter = features.flatness > 0.14 && features.zcr > 0.045 && features.spectralCentroid > 900 && features.spectralCentroid < 6800;
  const lowHarsh = features.dominantFreq < 2400 && features.spectralCentroid < 4300 && features.lowEnergyRatio > 0.16 && features.flatness > 0.10;
  const lowRhythmic = features.dominantFreq < 1800 && features.lowEnergyRatio > 0.34 && features.periodicity > 0.14;
  const pigeonLike = features.dominantFreq < 950 && features.spectralCentroid < 1900 && features.lowEnergyRatio > 0.48 && features.periodicity > 0.25;
  const quietIndoorNoise = habitat === "indoor" && features.rms < 0.055;
  let suspect = false;

  if (signature > 0.34) normalized += 0.08;

  if ((habitat === "urban" || habitat === "mixed" || habitat === "forest") && PARROT_IDS.has(species.id) && highFast) normalized += 0.32;
  if (PARROT_IDS.has(species.id) && features.rms > 0.015 && features.flatness > 0.10) normalized += 0.10;

  if (species.id === "magpie" && harshChatter) normalized += 0.24;
  if (species.id === "magpie" && (habitat === "urban" || habitat === "mixed")) normalized += 0.10;
  if (species.id === "jay" && harshChatter && habitat !== "indoor") normalized += 0.12;

  if ((species.id === "crow" || species.id === "carrion_crow") && lowHarsh) normalized += 0.26;
  if ((species.id === "crow" || species.id === "carrion_crow") && highFast) normalized -= 0.18;

  if (CLEAR_SONGBIRD_IDS.has(species.id) && melodic) normalized += 0.18;
  if ((habitat === "forest" || habitat === "mixed") && CLEAR_SONGBIRD_IDS.has(species.id)) normalized += 0.08;

  if (PIGEON_IDS.has(species.id) && !pigeonLike) normalized -= 0.34;
  if (PIGEON_IDS.has(species.id) && signature > 0.32 && features.spectralCentroid > 1700) normalized -= 0.16;

  if (NOCTURNAL_RAPTOR_IDS.has(species.id)) {
    if (night && lowRhythmic) normalized += 0.30;
    if (!night) { normalized -= 0.24; suspect = true; }
    if (features.spectralCentroid > 3200 || highFast) normalized -= 0.22;
  }

  if (NOCTURNAL_MAMMAL_IDS.has(species.id)) {
    const scratchy = features.flatness > 0.24 && features.zcr > 0.015 && features.lowEnergyRatio > 0.18;
    if (night && (scratchy || lowHarsh || quietIndoorNoise)) normalized += 0.28;
    if (species.id === "red_fox" && night && features.rms > 0.012 && features.spectralCentroid > 700 && features.spectralCentroid < 6500) normalized += 0.18;
    if ((species.id === "beech_marten" || species.id === "hedgehog") && scratchy) normalized += 0.18;
    if (!night && !scratchy) { normalized -= 0.26; suspect = true; }
    if (melodic && !scratchy) normalized -= 0.22;
  }

  if (quietIndoorNoise && BIRD_IDS.has(species.id) && !NOCTURNAL_RAPTOR_IDS.has(species.id)) {
    normalized -= 0.22;
    suspect = true;
  }

  return { species, score: Math.max(0, Math.min(1, normalized)), suspect };
}

function classifyLocalSpecies(features: AudioFeatures): ScoredSpecies[] {
  return ALL_SPECIES
    .filter(species => BIRD_IDS.has(species.id) || MAMMAL_IDS.has(species.id) || NOCTURNAL_RAPTOR_IDS.has(species.id))
    .map(species => speciesScore(species, features))
    .filter(entry => entry.score > 0.12)
    .sort((a, b) => b.score - a.score);
}

function scoreToConfidence(score: number, features: AudioFeatures | null, suspect = false) {
  const signature = signatureActivity(features);
  if (!features || signature < MIN_SIGNATURE_ACTIVITY) return 0;
  const signalBonus = Math.min(7, features.rms * 42);
  const structureBonus = Math.min(16, signature * 20);
  const penalty = suspect ? 12 : 0;
  return Math.max(12, Math.min(94, Math.round(score * 74 + signalBonus + structureBonus - penalty)));
}

function instantSpeciesCandidates(features: AudioFeatures | null) {
  if (!features || signatureActivity(features) < MIN_SIGNATURE_ACTIVITY) return [];
  return classifyLocalSpecies(features).slice(0, LIVE_CANDIDATE_LIMIT);
}

function toLiveCandidates(scores: ScoredSpecies[], lang: Lang, features: AudioFeatures | null): LiveCandidate[] {
  const best = scores[0]?.score ?? 0;
  const second = scores[1]?.score ?? 0;
  const ambiguousPenalty = best - second < AMBIGUITY_MARGIN ? 10 : 0;
  return scores.slice(0, LIVE_CANDIDATE_LIMIT).map(({ species, score, suspect }, index) => ({
    id: species.id,
    name: species.scientificName[lang] || species.name,
    scientificName: species.name,
    confidence: Math.max(8, scoreToConfidence(score, features, suspect) - (index === 0 ? ambiguousPenalty : 0)),
  }));
}

function getLiveSpeciesCandidates(features: AudioFeatures | null, lang: Lang) {
  return toLiveCandidates(instantSpeciesCandidates(features), lang, features);
}

function getMemoryCandidates(frames: CandidateFrame[], lang: Lang, features: AudioFeatures | null): LiveCandidate[] {
  if (frames.length === 0) return [];
  const now = Date.now();
  const byId = new Map<string, { species: Species; score: number; hits: number; lastSeen: number }>();
  frames.forEach(frame => {
    const age = now - frame.at;
    const timeWeight = Math.max(0.18, 1 - age / MEMORY_WINDOW_MS);
    frame.candidates.forEach((candidate, index) => {
      const rankWeight = index === 0 ? 1 : index === 1 ? 0.72 : index === 2 ? 0.50 : 0.32;
      const current = byId.get(candidate.species.id) || { species: candidate.species, score: 0, hits: 0, lastSeen: frame.at };
      current.score += candidate.score * timeWeight * rankWeight;
      current.hits += 1;
      current.lastSeen = Math.max(current.lastSeen, frame.at);
      byId.set(candidate.species.id, current);
    });
  });
  const raw = Array.from(byId.values())
    .map(entry => {
      const consistency = Math.min(1, entry.hits / 8);
      const recency = Math.max(0.20, 1 - (now - entry.lastSeen) / MEMORY_WINDOW_MS);
      const antiPigeon = PIGEON_IDS.has(entry.species.id) ? 0.82 : 1;
      return { species: entry.species, score: entry.score * (0.78 + consistency * 0.22) * recency * antiPigeon, suspect: false };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, LIVE_CANDIDATE_LIMIT);
  const max = raw[0]?.score || 1;
  return raw.map(({ species, score }, index) => ({
    id: species.id,
    name: species.scientificName[lang] || species.name,
    scientificName: species.name,
    confidence: Math.max(10, Math.min(94, Math.round((score / max) * 72 + Math.min(18, signatureActivity(features) * 22) - index * 5))),
  }));
}

function getBestLiveCandidate(features: AudioFeatures | null): ScoredSpecies | null {
  if (!features || signatureActivity(features) < MIN_SIGNATURE_ACTIVITY) return null;
  const scores = classifyLocalSpecies(features);
  const best = scores[0];
  if (!best || best.score < MIN_STABLE_SCORE) return null;
  const secondScore = scores[1]?.score ?? 0;
  return { ...best, suspect: best.suspect || Math.abs(best.score - secondScore) < AMBIGUITY_MARGIN };
}

function getHabitatScan(features: AudioFeatures | null, lang: Lang) {
  const habitat = inferHabitat(features);
  const labels = {
    forest: { fr: "AMBIANCE : FORÊT / LISIÈRE — PASSEREAUX POSSIBLES", en: "AMBIENCE: FOREST / EDGE — PASSERINES POSSIBLE", es: "AMBIENTE: BOSQUE / BORDE — PASERIFORMES POSIBLES" },
    urban: { fr: "AMBIANCE : FENÊTRE URBAINE — SIGNAUX MIXTES", en: "AMBIENCE: URBAN WINDOW — MIXED SIGNALS", es: "AMBIENTE: VENTANA URBANA — SEÑALES MIXTAS" },
    mixed: { fr: "AMBIANCE : LISIÈRE URBAINE — TRAFIC AVIAIRE", en: "AMBIENCE: URBAN EDGE — BIRD TRAFFIC", es: "AMBIENTE: BORDE URBANO — TRÁFICO AVIAR" },
    night: { fr: "AMBIANCE : NUIT / LISIÈRE — SIGNAL À CONFIRMER", en: "AMBIENCE: NIGHT / EDGE — SIGNAL TO CONFIRM", es: "AMBIENTE: NOCHE / BORDE — SEÑAL POR CONFIRMAR" },
    indoor: { fr: "AMBIANCE : INTÉRIEUR — TRACE SUSPECTE", en: "AMBIENCE: INDOOR — SUSPECT TRACE", es: "AMBIENTE: INTERIOR — TRAZA SOSPECHOSA" },
    quiet: { fr: "AMBIANCE : ÉCOUTE EN COURS", en: "AMBIENCE: LISTENING", es: "AMBIENTE: ESCUCHANDO" },
  } as const;
  return labels[habitat][lang];
}

function loadHabits(): Record<string, CreatureHabit> {
  try {
    if (typeof window === "undefined") return {};
    return JSON.parse(window.localStorage.getItem("creature-sync-habits") || "{}") || {};
  } catch {
    return {};
  }
}

function saveHabit(species: Species, habitat: Habitat) {
  try {
    if (typeof window === "undefined") return;
    const now = Date.now();
    const habits = loadHabits();
    const current = habits[species.id] || { total: 0, firstSeen: now, lastSeen: now, habitats: {} };
    current.total += 1;
    current.lastSeen = now;
    current.habitats[habitat] = (current.habitats[habitat] || 0) + 1;
    habits[species.id] = current;
    window.localStorage.setItem("creature-sync-habits", JSON.stringify(habits));
  } catch {
    // localStorage unavailable
  }
}

const OCTOPUS_LINES: Record<string, Record<Lang, string[]>> = {
  magpie: {
    fr: ["J'ai classé trois brillances et deux humains suspects.", "Rien n'est volé tant que l'inventaire reste poétique."],
    en: ["I catalogued three shinies and two suspicious humans.", "Nothing is stolen while the inventory remains poetic."],
    es: ["Catalogué tres brillos y dos humanos sospechosos.", "Nada está robado mientras el inventario siga poético."],
  },
  ring_necked_parakeet: {
    fr: ["Je traverse le quartier en surlignant le ciel en vert.", "Trop peu de tropiques ici. Je compense."],
    en: ["I cross the neighborhood highlighting the sky in green.", "Too few tropics here. I compensate."],
    es: ["Cruzo el barrio subrayando el cielo en verde.", "Pocos trópicos por aquí. Compenso."],
  },
  blackbird: {
    fr: ["Je reviens souvent ici. Cette branche commence à connaître mon avocat.", "Le territoire est musical, donc il est déjà presque légal."],
    en: ["I come here often. This branch is getting to know my lawyer.", "The territory is musical, so it is almost legal already."],
    es: ["Vengo a menudo. Esta rama empieza a conocer a mi abogado.", "El territorio es musical, así que ya es casi legal."],
  },
  tawny_owl: {
    fr: ["Si c'est le jour, je conteste discrètement ce résultat.", "La nuit me va mieux. Le jour me rend suspecte."],
    en: ["If it is daytime, I discreetly contest this result.", "Night suits me better. Daylight makes me suspicious."],
    es: ["Si es de día, impugno discretamente este resultado.", "La noche me sienta mejor. El día me vuelve sospechosa."],
  },
  beech_marten: {
    fr: ["Je ne suis pas une chanson. Je suis une hypothèse qui gratte.", "Le plafond a fait un bruit. Je demande un avocat et un grenier."],
    en: ["I am not a song. I am a scratching hypothesis.", "The ceiling made a sound. I request a lawyer and an attic."],
    es: ["No soy una canción. Soy una hipótesis que rasca.", "El techo hizo ruido. Solicito abogado y desván."],
  },
};

function getOctopusTranslation(species: Species, lang: Lang, features: AudioFeatures | null, suspect: boolean) {
  const habitat = inferHabitat(features);
  const habit = loadHabits()[species.id];
  const custom = OCTOPUS_LINES[species.id]?.[lang] || [];
  const base = getEvolvingTranslation(species, lang);
  const pool = [...custom, ...species.translations[lang], base.text].filter(Boolean);
  const count = habit?.total || 0;
  const index = Math.abs((count + localHour() + habitat.length + species.id.length) % pool.length);
  let text = pool[index] || base.text;
  if (suspect) {
    const prefix = {
      fr: "Trace à confirmer : ",
      en: "Trace to confirm: ",
      es: "Traza por confirmar: ",
    }[lang];
    text = `${prefix}${text}`;
  }
  if (count >= 4 && !suspect) {
    const suffix = {
      fr: " Elle commence à avoir des habitudes ici.",
      en: " It is starting to have habits here.",
      es: " Empieza a tener costumbres aquí.",
    }[lang];
    text = `${text}${suffix}`;
  }
  return { text, isPoetic: base.isPoetic || custom.includes(text) };
}

export function useAudioAnalysis() {
  const [lang, setLang] = useState<Lang>("fr");
  const [state, setState] = useState<AnalysisState>(INITIAL_STATE);
  const [micPermission, setMicPermission] = useState<"idle" | "granted" | "denied">("idle");
  const [crypticMessage, setCrypticMessage] = useState("");
  const [waveformData, setWaveformData] = useState<number[]>(Array(64).fill(0));
  const [spectrogramData, setSpectrogramData] = useState<number[][]>([]);
  const [audioFeatures, setAudioFeatures] = useState<AudioFeatures | null>(null);
  const [detectedLabel, setDetectedLabel] = useState<string | null>(null);
  const [liveCandidates, setLiveCandidates] = useState<LiveCandidate[]>([]);

  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef(0);
  const featureIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const glitchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const crypticTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const accumulatedFeaturesRef = useRef<AudioFeatures[]>([]);
  const candidateMemoryRef = useRef<CandidateFrame[]>([]);

  const generateFakeWaveform = useCallback((intensity: number) => Array.from({ length: 64 }, (_, i) => {
    const base = Math.sin(i * 0.3 + Date.now() * 0.002) * 0.3;
    const noise = (Math.random() - 0.5) * intensity;
    const spike = Math.random() < 0.05 ? Math.random() * 0.8 : 0;
    return Math.max(0, Math.min(1, base + noise + spike));
  }), []);

  const animateWaveform = useCallback((intensity: number) => {
    if (analyserRef.current) {
      const data = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(data);
      const normalized = Array.from(data.slice(0, 64)).map(v => v / 255);
      setWaveformData(normalized);
      setSpectrogramData(prev => [...prev, normalized.slice(0, 32)].slice(-40));
    } else {
      const fake = generateFakeWaveform(intensity);
      setWaveformData(fake);
      setSpectrogramData(prev => [...prev, fake.slice(0, 32)].slice(-40));
    }
    animFrameRef.current = requestAnimationFrame(() => animateWaveform(intensity));
  }, [generateFakeWaveform]);

  const triggerGlitch = useCallback(() => {
    setState(s => ({ ...s, glitchActive: true }));
    setTimeout(() => setState(s => ({ ...s, glitchActive: false })), 160 + Math.random() * 220);
    glitchTimerRef.current = setTimeout(triggerGlitch, 3000 + Math.random() * 8000);
  }, []);

  const rotateCrypticMessage = useCallback(() => {
    const msgs = getCrypticMessages(lang);
    setCrypticMessage(msgs[Math.floor(Math.random() * msgs.length)] || "");
    crypticTimerRef.current = setTimeout(rotateCrypticMessage, 4000 + Math.random() * 6000);
  }, [lang]);

  const buildReading = useCallback((result: ScoredSpecies, features: AudioFeatures | null, complete: boolean, confidence?: number) => {
    const species = result.species;
    const translation = getOctopusTranslation(species, lang, features, result.suspect);
    const emotionalPool = species.emotionalStates[lang] || species.emotionalStates.fr;
    const intentPool = species.biologicalIntents[lang] || species.biologicalIntents.fr;
    const conf = confidence ?? scoreToConfidence(result.score, features, result.suspect);
    return {
      species,
      confidence: conf,
      emotionalState: emotionalPool[Math.floor(Math.random() * emotionalPool.length)] || "TRACE",
      threatLevel: result.suspect ? "LOW" : species.threatLevels[Math.floor(Math.random() * species.threatLevels.length)] || "MINIMAL",
      biologicalIntent: intentPool[Math.floor(Math.random() * intentPool.length)] || "SIGNAL",
      neuralResonance: Math.floor(45 + Math.random() * 45),
      signalQuality: Math.max(0, Math.min(99, Math.round(signatureActivity(features) * 100))),
      translation: translation.text,
      environmentalScan: getHabitatScan(features, lang),
      isPoetic: translation.isPoetic,
      isComplete: complete,
      detectedSpecies: species.scientificName[lang] || species.name,
      speciesConfidence: conf,
      audioFeatures: features,
    };
  }, [lang]);

  const publishLiveReading = useCallback((features: AudioFeatures | null, progress: number) => {
    const instant = instantSpeciesCandidates(features);
    const now = Date.now();
    if (instant.length > 0) {
      candidateMemoryRef.current.push({ at: now, candidates: instant });
      candidateMemoryRef.current = candidateMemoryRef.current.filter(frame => now - frame.at <= MEMORY_WINDOW_MS).slice(-MEMORY_FRAME_LIMIT);
    }
    const candidates = getMemoryCandidates(candidateMemoryRef.current, lang, features);
    const bestFromMemory = candidates[0] ? ALL_SPECIES.find(species => species.id === candidates[0].id) : null;
    const best = bestFromMemory ? { species: bestFromMemory, score: (candidates[0].confidence || 0) / 100, suspect: candidates[0].confidence < 64 } : getBestLiveCandidate(features);
    const live = candidates.length ? candidates : getLiveSpeciesCandidates(features, lang);
    setLiveCandidates(live);
    setDetectedLabel(live[0]?.name || null);
    if (!best) {
      setState(s => ({ ...s, isListening: true, scanProgress: Math.max(s.scanProgress, progress), signalQuality: Math.round(signatureActivity(features) * 100), audioFeatures: features }));
      return;
    }
    const confidence = live[0]?.confidence ?? scoreToConfidence(best.score, features, best.suspect);
    setState(s => ({ ...s, ...buildReading(best, features, false, confidence), isListening: true, isAnalyzing: false, scanProgress: Math.max(s.scanProgress, progress) }));
  }, [buildReading, lang]);

  const finalizeReading = useCallback((finalFeatures: AudioFeatures | null) => {
    const memoryCandidates = getMemoryCandidates(candidateMemoryRef.current, lang, finalFeatures);
    const bestFromMemory = memoryCandidates[0] ? ALL_SPECIES.find(species => species.id === memoryCandidates[0].id) : null;
    const best = bestFromMemory ? { species: bestFromMemory, score: (memoryCandidates[0].confidence || 0) / 100, suspect: memoryCandidates[0].confidence < 64 } : getBestLiveCandidate(finalFeatures);
    if (!best) {
      setLiveCandidates([]);
      setDetectedLabel(null);
      setState(s => ({ ...s, isListening: false, isAnalyzing: false, isComplete: false, scanProgress: 0, translation: "" }));
      return;
    }
    const candidates = memoryCandidates.length ? memoryCandidates : getLiveSpeciesCandidates(finalFeatures, lang);
    const confidence = candidates[0]?.confidence ?? scoreToConfidence(best.score, finalFeatures, best.suspect);
    saveHabit(best.species, inferHabitat(finalFeatures));
    setLiveCandidates(candidates);
    setDetectedLabel(null);
    setState(s => ({ ...s, ...buildReading(best, finalFeatures, true, best.suspect ? Math.min(confidence, 68) : confidence), isListening: false, isAnalyzing: false, scanProgress: 100 }));
  }, [buildReading, lang]);

  const startListening = useCallback(async () => {
    cancelAnimationFrame(animFrameRef.current);
    if (featureIntervalRef.current) clearInterval(featureIntervalRef.current);
    if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
    if (crypticTimerRef.current) clearTimeout(crypticTimerRef.current);
    accumulatedFeaturesRef.current = [];
    candidateMemoryRef.current = [];
    setState({ ...INITIAL_STATE, isListening: true, scanProgress: 0 });
    setWaveformData(Array(64).fill(0));
    setSpectrogramData([]);
    setAudioFeatures(null);
    setDetectedLabel(null);
    setLiveCandidates([]);
    rotateCrypticMessage();
    glitchTimerRef.current = setTimeout(triggerGlitch, 2000 + Math.random() * 3000);

    let ctx: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setMicPermission("granted");
      ctx = new AudioContext();
      analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      ctx.createMediaStreamSource(stream).connect(analyser);
      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
    } catch {
      setMicPermission("denied");
    }

    animateWaveform(0.4);
    if (analyser && ctx) {
      let frames = 0;
      featureIntervalRef.current = setInterval(() => {
        if (!analyser || !ctx) return;
        const features = extractAudioFeatures(analyser, ctx);
        const signature = signatureActivity(features);
        setAudioFeatures(features);
        frames += 1;
        if (signature > 0.13 || features.rms > MIN_LIVE_RMS || frames % 8 === 0) {
          accumulatedFeaturesRef.current.push(features);
          if (accumulatedFeaturesRef.current.length > 180) accumulatedFeaturesRef.current = accumulatedFeaturesRef.current.slice(-180);
        }
        const progress = Math.min(96, frames * 0.45 + accumulatedFeaturesRef.current.length * 1.25 + Math.min(24, signature * 30) + Math.min(8, features.rms * 120) + Math.random() * 1.5);
        const avg = getAverageFeatures(accumulatedFeaturesRef.current) || features;
        setState(s => ({ ...s, scanProgress: Math.max(s.scanProgress, progress), audioFeatures: avg, signalQuality: Math.max(s.signalQuality, Math.round(signature * 100)) }));
        if (frames % 6 === 0 && (accumulatedFeaturesRef.current.length > 0 || progress > 8)) publishLiveReading(avg, progress);
      }, 100);
    }
  }, [animateWaveform, publishLiveReading, rotateCrypticMessage, triggerGlitch]);

  const stopListening = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
    if (featureIntervalRef.current) clearInterval(featureIntervalRef.current);
    if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
    if (crypticTimerRef.current) clearTimeout(crypticTimerRef.current);
    let finalFeatures = getAverageFeatures(accumulatedFeaturesRef.current);
    if (!finalFeatures && audioCtxRef.current && analyserRef.current) finalFeatures = extractAudioFeatures(analyserRef.current, audioCtxRef.current);
    streamRef.current?.getTracks().forEach(track => track.stop());
    audioCtxRef.current?.close();
    streamRef.current = null;
    audioCtxRef.current = null;
    analyserRef.current = null;
    finalizeReading(finalFeatures);
  }, [finalizeReading]);

  const reset = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
    if (featureIntervalRef.current) clearInterval(featureIntervalRef.current);
    if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
    if (crypticTimerRef.current) clearTimeout(crypticTimerRef.current);
    streamRef.current?.getTracks().forEach(track => track.stop());
    audioCtxRef.current?.close();
    streamRef.current = null;
    audioCtxRef.current = null;
    analyserRef.current = null;
    accumulatedFeaturesRef.current = [];
    candidateMemoryRef.current = [];
    setWaveformData(Array(64).fill(0));
    setSpectrogramData([]);
    setAudioFeatures(null);
    setDetectedLabel(null);
    setLiveCandidates([]);
    setState(INITIAL_STATE);
    setCrypticMessage("");
  }, []);

  useEffect(() => () => {
    cancelAnimationFrame(animFrameRef.current);
    if (featureIntervalRef.current) clearInterval(featureIntervalRef.current);
    if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
    if (crypticTimerRef.current) clearTimeout(crypticTimerRef.current);
    streamRef.current?.getTracks().forEach(track => track.stop());
    audioCtxRef.current?.close();
  }, []);

  return { state, micPermission, crypticMessage, waveformData, spectrogramData, audioFeatures, detectedLabel, liveCandidates, lang, setLang, startListening, stopListening, reset };
}

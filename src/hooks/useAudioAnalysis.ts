import { useState, useEffect, useRef, useCallback } from "react";
import {
  SPECIES,
  getCrypticMessages,
  extractAudioFeatures,
  type AnalysisState,
  type Lang,
  type AudioFeatures,
  type Species,
} from "../data/animals";
import { getEvolvingTranslation } from "../data/phraseBanks";
import { FOREST_SPECIES } from "../data/forestSpecies";
import { URBAN_BIRD_SPECIES } from "../data/urbanBirdSpecies";

const EXTRA_SPECIES = [...FOREST_SPECIES, ...URBAN_BIRD_SPECIES];
const ALL_SPECIES = [...SPECIES, ...EXTRA_SPECIES];
const PIGEON_IDS = new Set(["pigeon", "wood_pigeon"]);
const BIRD_IDS = new Set([
  "crow", "pigeon", "duck", "owl",
  ...FOREST_SPECIES.map(s => s.id),
  ...URBAN_BIRD_SPECIES.map(s => s.id),
]);
const MAMMAL_IDS = new Set(["cat", "dog"]);

type Habitat = "forest" | "urban" | "mixed" | "quiet";

export type LiveCandidate = {
  id: string;
  name: string;
  scientificName: string;
  confidence: number;
};

// Volume is now only a weak gate. Birds at distance are often quiet but structured.
const MIN_LIVE_RMS = 0.0012;
const MIN_SIGNATURE_ACTIVITY = 0.16;
const MIN_STABLE_SCORE = 0.28;
const AMBIGUITY_MARGIN = 0.08;
const LIVE_CANDIDATE_LIMIT = 4;

function pickRandomSpecies(pool: Species[]): Species {
  return pool[Math.floor(Math.random() * pool.length)] || ALL_SPECIES[0] || SPECIES[0];
}

function getAverageFeatures(samples: AudioFeatures[]): AudioFeatures | null {
  if (samples.length === 0) return null;
  return {
    dominantFreq: samples.reduce((sum, f) => sum + f.dominantFreq, 0) / samples.length,
    spectralCentroid: samples.reduce((sum, f) => sum + f.spectralCentroid, 0) / samples.length,
    flatness: samples.reduce((sum, f) => sum + f.flatness, 0) / samples.length,
    lowEnergyRatio: samples.reduce((sum, f) => sum + f.lowEnergyRatio, 0) / samples.length,
    zcr: samples.reduce((sum, f) => sum + f.zcr, 0) / samples.length,
    periodicity: samples.reduce((sum, f) => sum + f.periodicity, 0) / samples.length,
    rms: samples.reduce((sum, f) => sum + f.rms, 0) / samples.length,
    sampleDuration: samples[0].sampleDuration,
  };
}

function rangeScore(val: number, min: number, max: number): number {
  if (val >= min && val <= max) return 1;
  const mid = (min + max) / 2;
  const range = (max - min) / 2 || 1;
  return Math.max(0, 1 - Math.abs(val - mid) / range);
}

function signatureActivity(features: AudioFeatures | null): number {
  if (!features) return 0;
  const tonal = Math.max(0, 1 - features.flatness);
  const highBand = features.spectralCentroid > 1200 ? 1 : features.spectralCentroid / 1200;
  const articulation = Math.min(1, features.zcr * 10);
  const repetition = Math.min(1, features.periodicity * 3.2);
  const lowRumblePenalty = features.lowEnergyRatio > 0.72 ? 0.55 : 1;
  const whisperBonus = features.rms > MIN_LIVE_RMS ? 1 : 0.45;

  return Math.max(0, Math.min(1, (
    tonal * 0.22 +
    highBand * 0.22 +
    articulation * 0.2 +
    repetition * 0.28 +
    whisperBonus * 0.08
  ) * lowRumblePenalty));
}

function inferHabitat(features: AudioFeatures | null): Habitat {
  if (!features || signatureActivity(features) < 0.12) return "quiet";
  if (features.rms > 0.22 || (features.flatness > 0.6 && features.periodicity < 0.18)) return "urban";
  if (features.spectralCentroid > 1800 && features.lowEnergyRatio < 0.5) return "forest";
  return "mixed";
}

function speciesScore(species: Species, features: AudioFeatures): number {
  const p = species.acousticProfile;
  let score = 0;
  let weight = 0;
  const add = (s: number, w: number) => { score += s * w; weight += w; };

  // Signature first: frequency shape, articulation and repetition matter far more than loudness.
  add(rangeScore(features.dominantFreq, p.dominantFreqMin, p.dominantFreqMax), 2.6);
  add(rangeScore(features.spectralCentroid, p.spectralCentroidMin, p.spectralCentroidMax), 2.4);
  add(rangeScore(features.flatness, p.flatnessMin, p.flatnessMax), 1.4);
  add(rangeScore(features.lowEnergyRatio, p.lowEnergyRatioMin, p.lowEnergyRatioMax), 1.8);
  add(rangeScore(features.zcr, p.zcrMin, p.zcrMax), 1.7);
  add(rangeScore(features.periodicity, p.periodicityMin, p.periodicityMax), 2.2);
  add(rangeScore(features.rms, p.rmsMin, p.rmsMax), 0.25);

  let normalized = score / weight;
  const habitat = inferHabitat(features);
  const signature = signatureActivity(features);

  if (signature > 0.34) normalized += 0.08;

  // Depuis une fenêtre en ville, on privilégie les oiseaux aigus et bavards
  // plutôt que de retomber mécaniquement sur le pigeon.
  if ((habitat === "urban" || habitat === "mixed") && ["ring_necked_parakeet", "house_sparrow", "magpie"].includes(species.id)) normalized += 0.12;
  if ((habitat === "forest" || habitat === "mixed") && ["blackbird", "robin", "great_tit", "blue_tit", "chaffinch", "wren", "nightingale"].includes(species.id)) normalized += 0.12;

  const highFast = features.spectralCentroid > 2400 && features.zcr > 0.045 && features.lowEnergyRatio < 0.52;
  const melodic = features.periodicity > 0.18 && features.spectralCentroid > 1450 && features.lowEnergyRatio < 0.52;
  const pigeonLike = features.dominantFreq < 950 && features.spectralCentroid < 1900 && features.lowEnergyRatio > 0.48 && features.periodicity > 0.25;

  if (species.id === "ring_necked_parakeet" && highFast && features.flatness > 0.1) normalized += 0.22;
  if (species.id === "nightingale" && melodic && features.flatness < 0.45) normalized += 0.18;
  if (["great_tit", "blue_tit", "house_sparrow", "chaffinch", "robin", "blackbird", "wren"].includes(species.id) && (highFast || melodic)) normalized += 0.13;
  if (species.id === "magpie" && features.flatness > 0.14 && features.zcr > 0.045) normalized += 0.12;

  if (PIGEON_IDS.has(species.id) && !pigeonLike) normalized -= 0.34;
  if (PIGEON_IDS.has(species.id) && signature > 0.32 && features.spectralCentroid > 1700) normalized -= 0.16;
  if (species.id === "crow" && features.spectralCentroid > 2400) normalized -= 0.12;

  return Math.max(0, Math.min(1, normalized));
}

function classifyLocalSpecies(features: AudioFeatures): { species: Species; score: number }[] {
  return ALL_SPECIES
    .filter(species => BIRD_IDS.has(species.id) || MAMMAL_IDS.has(species.id))
    .map(species => ({ species, score: speciesScore(species, features) }))
    .sort((a, b) => b.score - a.score);
}

function scoreToConfidence(score: number, features: AudioFeatures | null): number {
  const signature = signatureActivity(features);
  if (!features || signature < MIN_SIGNATURE_ACTIVITY) return 0;
  const signalBonus = Math.min(6, features.rms * 35);
  const structureBonus = Math.min(14, signature * 18);
  return Math.max(12, Math.min(92, Math.round(score * 72 + signalBonus + structureBonus)));
}

function getLiveSpeciesCandidates(features: AudioFeatures | null, lang: Lang): LiveCandidate[] {
  if (!features || signatureActivity(features) < MIN_SIGNATURE_ACTIVITY) return [];

  const scores = classifyLocalSpecies(features).slice(0, LIVE_CANDIDATE_LIMIT);
  const best = scores[0]?.score ?? 0;
  const second = scores[1]?.score ?? 0;
  const ambiguousPenalty = best - second < AMBIGUITY_MARGIN ? 10 : 0;

  return scores.map(({ species, score }, index) => ({
    id: species.id,
    name: species.scientificName[lang] || species.name,
    scientificName: species.name,
    confidence: Math.max(8, scoreToConfidence(score, features) - (index === 0 ? ambiguousPenalty : 0)),
  }));
}

function getBestLiveCandidate(features: AudioFeatures | null): { species: Species; score: number; ambiguous: boolean } {
  const birds = ALL_SPECIES.filter((species) => BIRD_IDS.has(species.id));
  if (!features || signatureActivity(features) < MIN_SIGNATURE_ACTIVITY) {
    return {
      species: pickRandomSpecies(birds.filter(s => !PIGEON_IDS.has(s.id))),
      score: 0,
      ambiguous: true,
    };
  }

  const scores = classifyLocalSpecies(features);
  const bestBird = scores.find((entry) => BIRD_IDS.has(entry.species.id));
  const bestMammal = scores.find((entry) => MAMMAL_IDS.has(entry.species.id));
  const best = bestBird || scores[0];

  let birdLikelihood = 0;
  if (features.dominantFreq >= 650) birdLikelihood += 1;
  if (features.spectralCentroid >= 1000) birdLikelihood += 1;
  if (features.lowEnergyRatio <= 0.68) birdLikelihood += 1;
  if (features.zcr >= 0.03) birdLikelihood += 1;
  if (signatureActivity(features) >= MIN_SIGNATURE_ACTIVITY) birdLikelihood += 2;
  if (features.flatness >= 0.04 && features.flatness <= 0.66) birdLikelihood += 1;

  let mammalLikelihood = 0;
  if (features.rms >= 0.16) mammalLikelihood += 1;
  if (features.dominantFreq <= 650 && features.lowEnergyRatio >= 0.55) mammalLikelihood += 1;
  if (bestMammal && bestMammal.score >= 0.68) mammalLikelihood += 2;

  const secondScore = scores[1]?.score ?? 0;
  const ambiguous = !best || best.score < MIN_STABLE_SCORE || Math.abs((best?.score ?? 0) - secondScore) < AMBIGUITY_MARGIN;

  if (bestBird && (birdLikelihood >= 2 || bestBird.score >= MIN_STABLE_SCORE) && mammalLikelihood < 3) {
    return { species: bestBird.species, score: bestBird.score, ambiguous };
  }

  return {
    species: best?.species || pickRandomSpecies(birds.filter(s => !PIGEON_IDS.has(s.id))),
    score: best?.score ?? 0,
    ambiguous: true,
  };
}

function getBirdNetLiteSpecies(features: AudioFeatures | null): Species {
  return getBestLiveCandidate(features).species;
}
function getHabitatScan(features: AudioFeatures | null, lang: Lang): string {
  const habitat = inferHabitat(features);
  const labels = {
    forest: { fr: "AMBIANCE : FORÊT / LISIÈRE — PASSEREAUX POSSIBLES", en: "AMBIENCE: FOREST / EDGE — PASSERINES POSSIBLE", es: "AMBIENTE: BOSQUE / BORDE — PASERIFORMES POSIBLES" },
    urban: { fr: "AMBIANCE : FENÊTRE URBAINE — SIGNAUX MIXTES", en: "AMBIENCE: URBAN WINDOW — MIXED SIGNALS", es: "AMBIENTE: VENTANA URBANA — SEÑALES MIXTAS" },
    mixed: { fr: "AMBIANCE : LISIÈRE URBAINE — TRAFIC AVIAIRE", en: "AMBIENCE: URBAN EDGE — BIRD TRAFFIC", es: "AMBIENTE: BORDE URBANO — TRÁFICO AVIAR" },
    quiet: { fr: "AMBIANCE : ÉCOUTE EN COURS", en: "AMBIENCE: LISTENING", es: "AMBIENTE: ESCUCHANDO" },
  } as const;
  return labels[habitat][lang];
}

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

export function useAudioAnalysis() {
  const [lang, setLang] = useState<Lang>("fr");
  const [state, setState] = useState<AnalysisState>(INITIAL_STATE);
  const [micPermission, setMicPermission] = useState<"idle" | "granted" | "denied">("idle");
  const [crypticMessage, setCrypticMessage] = useState<string>("");
  const [waveformData, setWaveformData] = useState<number[]>(Array(64).fill(0));
  const [spectrogramData, setSpectrogramData] = useState<number[][]>([]);
  const [audioFeatures, setAudioFeatures] = useState<AudioFeatures | null>(null);
  const [detectedLabel, setDetectedLabel] = useState<string | null>(null);
  const [liveCandidates, setLiveCandidates] = useState<LiveCandidate[]>([]);

  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>(0);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const glitchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const crypticTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const featureIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const accumulatedFeaturesRef = useRef<AudioFeatures[]>([]);

  const generateFakeWaveform = useCallback((intensity: number) => {
    return Array.from({ length: 64 }, (_, i) => {
      const base = Math.sin(i * 0.3 + Date.now() * 0.002) * 0.3;
      const noise = (Math.random() - 0.5) * intensity;
      const spike = Math.random() < 0.05 ? Math.random() * 0.8 : 0;
      return Math.max(0, Math.min(1, base + noise + spike));
    });
  }, []);

  const animateWaveform = useCallback((intensity: number) => {
    if (analyserRef.current) {
      const data = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(data);
      const normalized = Array.from(data.slice(0, 64)).map(v => v / 255);
      setWaveformData(normalized);
      setSpectrogramData(prev => {
        const next = [...prev, normalized.slice(0, 32)];
        return next.slice(-40);
      });
    } else {
      const fake = generateFakeWaveform(intensity);
      setWaveformData(fake);
      setSpectrogramData(prev => {
        const next = [...prev, fake.slice(0, 32)];
        return next.slice(-40);
      });
    }
    animFrameRef.current = requestAnimationFrame(() => animateWaveform(intensity));
  }, [generateFakeWaveform]);

  const triggerGlitch = useCallback(() => {
    setState(s => ({ ...s, glitchActive: true }));
    setTimeout(() => setState(s => ({ ...s, glitchActive: false })), 150 + Math.random() * 200);
    glitchTimerRef.current = setTimeout(triggerGlitch, 3000 + Math.random() * 8000);
  }, []);

  const rotateCrypticMessage = useCallback(() => {
    const msgs = getCrypticMessages(lang);
    const idx = Math.floor(Math.random() * msgs.length);
    setCrypticMessage(msgs[idx]);
    crypticTimerRef.current = setTimeout(rotateCrypticMessage, 4000 + Math.random() * 6000);
  }, [lang]);

  const buildReading = useCallback((species: Species, features: AudioFeatures | null, complete: boolean, confidence?: number) => {
    const { text, isPoetic } = getEvolvingTranslation(species, lang);
    const emotionalIdx = Math.floor(Math.random() * species.emotionalStates[lang].length);
    const threatIdx = Math.floor(Math.random() * species.threatLevels.length);
    const intentIdx = Math.floor(Math.random() * species.biologicalIntents[lang].length);
    const conf = confidence ?? Math.floor(48 + Math.random() * 35);
    return {
      species,
      confidence: conf,
      emotionalState: species.emotionalStates[lang][emotionalIdx],
      threatLevel: species.threatLevels[threatIdx],
      biologicalIntent: species.biologicalIntents[lang][intentIdx],
      neuralResonance: Math.floor(45 + Math.random() * 45),
      signalQuality: Math.floor(55 + Math.random() * 40),
      translation: text,
      environmentalScan: getHabitatScan(features, lang),
      isPoetic,
      isComplete: complete,
      detectedSpecies: species.scientificName[lang] || species.name,
      speciesConfidence: conf,
      audioFeatures: features,
    };
  }, [lang]);

  const publishLiveReading = useCallback((features: AudioFeatures | null, progress: number) => {
    const candidates = getLiveSpeciesCandidates(features, lang);
    const best = getBestLiveCandidate(features);
    const confidence = candidates[0]?.confidence ?? Math.floor(Math.min(55, Math.max(18, progress * 0.45)));

    setLiveCandidates(candidates);
    setDetectedLabel(candidates[0]?.name || null);
    setState(s => ({
      ...s,
      ...buildReading(best.species, features, false, confidence),
      isListening: true,
      isAnalyzing: false,
      scanProgress: Math.max(s.scanProgress, progress),
    }));
  }, [buildReading, lang]);

  const finalizeReading = useCallback((finalFeatures: AudioFeatures | null) => {
    const candidates = getLiveSpeciesCandidates(finalFeatures, lang);
    const best = getBestLiveCandidate(finalFeatures);
    const confidence = candidates[0]?.confidence ?? scoreToConfidence(best.score, finalFeatures);

    setLiveCandidates(candidates);
    setDetectedLabel(null);
    setState(s => ({
      ...s,
      ...buildReading(best.species, finalFeatures, true, best.ambiguous ? Math.min(confidence, 62) : confidence),
      isListening: false,
      isAnalyzing: false,
      scanProgress: 100,
    }));
  }, [buildReading, lang]);

  const startListening = useCallback(async () => {
    cancelAnimationFrame(animFrameRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    if (featureIntervalRef.current) clearInterval(featureIntervalRef.current);
    if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
    if (crypticTimerRef.current) clearTimeout(crypticTimerRef.current);

    accumulatedFeaturesRef.current = [];
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
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);
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
        const feats = extractAudioFeatures(analyser, ctx);
        const signature = signatureActivity(feats);
        setAudioFeatures(feats);
        frames++;
        if (signature > 0.13 || feats.rms > MIN_LIVE_RMS || frames % 8 === 0) {
          accumulatedFeaturesRef.current.push(feats);
          if (accumulatedFeaturesRef.current.length > 180) accumulatedFeaturesRef.current = accumulatedFeaturesRef.current.slice(-180);
        }
        const progress = Math.min(96, frames * 0.45 + accumulatedFeaturesRef.current.length * 1.25 + Math.min(24, signature * 30) + Math.min(8, feats.rms * 120) + Math.random() * 1.5);
        const avg = getAverageFeatures(accumulatedFeaturesRef.current) || feats;
        setState(s => ({ ...s, scanProgress: Math.max(s.scanProgress, progress), audioFeatures: avg }));
        if (frames % 6 === 0 && (accumulatedFeaturesRef.current.length > 0 || progress > 8)) publishLiveReading(avg, progress);
      }, 100);
    }
  }, [animateWaveform, rotateCrypticMessage, triggerGlitch, publishLiveReading]);

  const stopListening = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
    if (featureIntervalRef.current) clearInterval(featureIntervalRef.current);
    if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
    if (crypticTimerRef.current) clearTimeout(crypticTimerRef.current);
    let finalFeatures = getAverageFeatures(accumulatedFeaturesRef.current);
    if (!finalFeatures && audioCtxRef.current && analyserRef.current) finalFeatures = extractAudioFeatures(analyserRef.current, audioCtxRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
    audioCtxRef.current?.close();
    streamRef.current = null;
    audioCtxRef.current = null;
    analyserRef.current = null;
    if (finalFeatures) finalizeReading(finalFeatures);
    else {
      setState(s => ({ ...s, isListening: false, isAnalyzing: false, isComplete: false }));
      setDetectedLabel(null);
      setLiveCandidates([]);
    }
  }, [finalizeReading]);

  const reset = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    if (featureIntervalRef.current) clearInterval(featureIntervalRef.current);
    if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
    if (crypticTimerRef.current) clearTimeout(crypticTimerRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
    audioCtxRef.current?.close();
    streamRef.current = null;
    audioCtxRef.current = null;
    analyserRef.current = null;
    accumulatedFeaturesRef.current = [];
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
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
    if (crypticTimerRef.current) clearTimeout(crypticTimerRef.current);
    if (featureIntervalRef.current) clearInterval(featureIntervalRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
    audioCtxRef.current?.close();
  }, []);

  return { state, micPermission, crypticMessage, waveformData, spectrogramData, audioFeatures, detectedLabel, liveCandidates, lang, setLang, startListening, stopListening, reset };
}

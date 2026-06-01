import { useState, useEffect, useRef, useCallback } from "react";
import {
  SPECIES,
  getCrypticMessages,
  getRandomTranslation,
  getWeightedSpecies,
  extractAudioFeatures,
  classifySpecies,
  type AnalysisState,
  type Lang,
  type AudioFeatures,
  type Species,
} from "../data/animals";

const BIRD_IDS = new Set(["crow", "pigeon", "duck", "owl"]);
const MAMMAL_IDS = new Set(["cat", "dog"]);

function pickRandomSpecies(pool: Species[]): Species {
  return pool[Math.floor(Math.random() * pool.length)] || SPECIES[0];
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

function getBirdNetLiteSpecies(features: AudioFeatures | null): Species {
  const birds = SPECIES.filter((species) => BIRD_IDS.has(species.id));

  if (!features) {
    return Math.random() < 0.78 ? pickRandomSpecies(birds) : getWeightedSpecies(null);
  }

  const scores = classifySpecies(features);
  const bestBird = scores.find((entry) => BIRD_IDS.has(entry.species.id));
  const bestMammal = scores.find((entry) => MAMMAL_IDS.has(entry.species.id));

  let birdLikelihood = 0;
  if (features.dominantFreq >= 700) birdLikelihood += 1;
  if (features.spectralCentroid >= 1000) birdLikelihood += 1;
  if (features.lowEnergyRatio <= 0.62) birdLikelihood += 1;
  if (features.zcr >= 0.045) birdLikelihood += 1;
  if (features.rms <= 0.26) birdLikelihood += 1;
  if (features.flatness >= 0.08 && features.flatness <= 0.5) birdLikelihood += 1;

  let mammalLikelihood = 0;
  if (features.rms >= 0.08) mammalLikelihood += 1;
  if (features.dominantFreq <= 650 && features.lowEnergyRatio >= 0.35) mammalLikelihood += 1;
  if (bestMammal && bestMammal.score >= 0.62) mammalLikelihood += 2;

  if (bestBird && (birdLikelihood >= 3 || bestBird.score >= 0.38) && mammalLikelihood < 3) {
    return bestBird.species;
  }

  if (birdLikelihood >= 2 && mammalLikelihood < 3) {
    return pickRandomSpecies(birds);
  }

  const weighted = getWeightedSpecies(features);
  if (MAMMAL_IDS.has(weighted.id) && birdLikelihood >= 2 && mammalLikelihood < 3) {
    return pickRandomSpecies(birds);
  }

  return weighted;
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

  const runAnalysisSequence = useCallback((finalFeatures: AudioFeatures | null, forcedSpecies?: Species) => {
    const species = forcedSpecies || getBirdNetLiteSpecies(finalFeatures);
    const { text, isPoetic } = getRandomTranslation(species, lang);
    const emotionalIdx = Math.floor(Math.random() * species.emotionalStates[lang].length);
    const threatIdx = Math.floor(Math.random() * species.threatLevels.length);
    const intentIdx = Math.floor(Math.random() * species.biologicalIntents[lang].length);
    const scanIdx = Math.floor(Math.random() * species.environmentalScans[lang].length);

    setState(s => ({ ...s, isListening: false, isAnalyzing: true, isComplete: false, scanProgress: 0 }));
    setDetectedLabel(species.name);

    let progress = 0;
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    progressIntervalRef.current = setInterval(() => {
      progress += Math.random() * 6 + 3;
      if (progress >= 100) {
        progress = 100;
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        const conf = Math.floor(72 + Math.random() * 25);
        setState(s => ({
          ...s,
          isListening: false,
          isAnalyzing: false,
          isComplete: true,
          scanProgress: 100,
          species,
          confidence: conf,
          emotionalState: species.emotionalStates[lang][emotionalIdx],
          threatLevel: species.threatLevels[threatIdx],
          biologicalIntent: species.biologicalIntents[lang][intentIdx],
          neuralResonance: Math.floor(60 + Math.random() * 35),
          signalQuality: Math.floor(75 + Math.random() * 22),
          translation: text,
          environmentalScan: species.environmentalScans[lang][scanIdx],
          isPoetic,
          detectedSpecies: species.name,
          speciesConfidence: conf,
          audioFeatures: finalFeatures,
        }));
        setDetectedLabel(null);
      } else {
        setState(s => ({ ...s, scanProgress: progress }));
      }
    }, 120);
  }, [lang]);

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
        setAudioFeatures(feats);
        frames++;

        if (feats.rms > 0.01) {
          accumulatedFeaturesRef.current.push(feats);
          if (accumulatedFeaturesRef.current.length > 140) {
            accumulatedFeaturesRef.current = accumulatedFeaturesRef.current.slice(-140);
          }
        }

        const progress = Math.min(96, accumulatedFeaturesRef.current.length * 2.5 + Math.random() * 2);
        setState(s => ({ ...s, scanProgress: Math.max(s.scanProgress, progress) }));

        if (frames % 5 === 0 && accumulatedFeaturesRef.current.length > 2) {
          const avg = getAverageFeatures(accumulatedFeaturesRef.current);
          if (avg) {
            const candidate = getBirdNetLiteSpecies(avg);
            setDetectedLabel(candidate.name);
            setState(s => ({
              ...s,
              detectedSpecies: candidate.name,
              speciesConfidence: Math.floor(45 + Math.random() * 45),
              audioFeatures: avg,
            }));
          } else {
            setDetectedLabel(null);
          }
        }
      }, 100);
    }
  }, [animateWaveform, rotateCrypticMessage, triggerGlitch]);

  const stopListening = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
    if (featureIntervalRef.current) clearInterval(featureIntervalRef.current);
    if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
    if (crypticTimerRef.current) clearTimeout(crypticTimerRef.current);

    let finalFeatures = getAverageFeatures(accumulatedFeaturesRef.current);
    if (!finalFeatures && audioCtxRef.current && analyserRef.current) {
      finalFeatures = extractAudioFeatures(analyserRef.current, audioCtxRef.current);
    }

    streamRef.current?.getTracks().forEach(t => t.stop());
    audioCtxRef.current?.close();
    streamRef.current = null;
    audioCtxRef.current = null;
    analyserRef.current = null;

    if (finalFeatures) {
      runAnalysisSequence(finalFeatures);
    } else {
      setState(s => ({ ...s, isListening: false, isAnalyzing: false, isComplete: false }));
      setDetectedLabel(null);
    }
  }, [runAnalysisSequence]);

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
    setState(INITIAL_STATE);
    setCrypticMessage("");
  }, []);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
      if (crypticTimerRef.current) clearTimeout(crypticTimerRef.current);
      if (featureIntervalRef.current) clearInterval(featureIntervalRef.current);
      streamRef.current?.getTracks().forEach(t => t.stop());
      audioCtxRef.current?.close();
    };
  }, []);

  return {
    state,
    micPermission,
    crypticMessage,
    waveformData,
    spectrogramData,
    audioFeatures,
    detectedLabel,
    lang,
    setLang,
    startListening,
    stopListening,
    reset,
  };
}

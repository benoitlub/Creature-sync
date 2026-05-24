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
  const analysisTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const glitchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const crypticTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const featureIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
    const species = forcedSpecies || getWeightedSpecies(finalFeatures);
    const { text, isPoetic } = getRandomTranslation(species, lang);
    const emotionalIdx = Math.floor(Math.random() * species.emotionalStates[lang].length);
    const threatIdx = Math.floor(Math.random() * species.threatLevels.length);
    const intentIdx = Math.floor(Math.random() * species.biologicalIntents[lang].length);
    const scanIdx = Math.floor(Math.random() * species.environmentalScans[lang].length);

    setState(s => ({ ...s, isAnalyzing: true, scanProgress: 0 }));
    setDetectedLabel(species.name);

    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 8 + 2;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);
        const conf = Math.floor(72 + Math.random() * 25);
        setState(s => ({
          ...s,
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
    }, 80);
  }, [lang]);

  const startListening = useCallback(async () => {
    setState({ ...INITIAL_STATE, isListening: true });
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

    // Real-time classification loop during listening phase
    if (analyser && ctx) {
      let frames = 0;
      let accumulated: AudioFeatures[] = [];

      featureIntervalRef.current = setInterval(() => {
        if (!analyser || !ctx) return;
        const feats = extractAudioFeatures(analyser, ctx);
        setAudioFeatures(feats);
        frames++;

        if (feats.rms > 0.01) {
          accumulated.push(feats);
        }

        // Every ~500ms, try to show live detection hint
        if (frames % 5 === 0 && accumulated.length > 2) {
          const avg: AudioFeatures = {
            dominantFreq: accumulated.reduce((s, f) => s + f.dominantFreq, 0) / accumulated.length,
            spectralCentroid: accumulated.reduce((s, f) => s + f.spectralCentroid, 0) / accumulated.length,
            flatness: accumulated.reduce((s, f) => s + f.flatness, 0) / accumulated.length,
            lowEnergyRatio: accumulated.reduce((s, f) => s + f.lowEnergyRatio, 0) / accumulated.length,
            zcr: accumulated.reduce((s, f) => s + f.zcr, 0) / accumulated.length,
            periodicity: accumulated.reduce((s, f) => s + f.periodicity, 0) / accumulated.length,
            rms: accumulated.reduce((s, f) => s + f.rms, 0) / accumulated.length,
            sampleDuration: accumulated[0].sampleDuration,
          };

          // Show tentative detection if confident enough
          const scores = classifySpecies(avg);
          if (scores[0].score > 0.45) {
            setDetectedLabel(scores[0].species.name);
          } else {
            setDetectedLabel(null);
          }
        }
      }, 100);
    }

    // After listening window, run analysis with averaged features
    analysisTimerRef.current = setTimeout(() => {
      let finalFeatures: AudioFeatures | null = null;
      if (audioCtxRef.current && analyserRef.current) {
        finalFeatures = extractAudioFeatures(analyserRef.current, audioCtxRef.current);
      }
      runAnalysisSequence(finalFeatures);
    }, 2500 + Math.random() * 1500);
  }, [animateWaveform, runAnalysisSequence, rotateCrypticMessage, triggerGlitch]);

  const stopListening = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
    if (analysisTimerRef.current) clearTimeout(analysisTimerRef.current);
    if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
    if (crypticTimerRef.current) clearTimeout(crypticTimerRef.current);
    if (featureIntervalRef.current) clearInterval(featureIntervalRef.current);

    streamRef.current?.getTracks().forEach(t => t.stop());
    audioCtxRef.current?.close();
    streamRef.current = null;
    audioCtxRef.current = null;
    analyserRef.current = null;

    setWaveformData(Array(64).fill(0));
    setAudioFeatures(null);
    setDetectedLabel(null);
    setState(INITIAL_STATE);
    setCrypticMessage("");
  }, []);

  const reset = useCallback(() => {
    stopListening();
  }, [stopListening]);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      if (analysisTimerRef.current) clearTimeout(analysisTimerRef.current);
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

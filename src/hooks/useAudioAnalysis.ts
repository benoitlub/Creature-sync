import { useState, useEffect, useRef, useCallback } from "react";
import {
  SPECIES,
  CRYPTIC_MESSAGES,
  getRandomTranslation,
  getRandomSpecies,
  type AnalysisState,
} from "../data/translations";

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
};

export function useAudioAnalysis() {
  const [state, setState] = useState<AnalysisState>(INITIAL_STATE);
  const [micPermission, setMicPermission] = useState<"idle" | "granted" | "denied">("idle");
  const [crypticMessage, setCrypticMessage] = useState<string>("");
  const [waveformData, setWaveformData] = useState<number[]>(Array(64).fill(0));
  const [spectrogramData, setSpectrogramData] = useState<number[][]>([]);

  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>(0);
  const analysisTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const glitchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const crypticTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    const idx = Math.floor(Math.random() * CRYPTIC_MESSAGES.length);
    setCrypticMessage(CRYPTIC_MESSAGES[idx]);
    crypticTimerRef.current = setTimeout(rotateCrypticMessage, 4000 + Math.random() * 6000);
  }, []);

  const runAnalysisSequence = useCallback(() => {
    const species = getRandomSpecies();
    const { text, isPoetic } = getRandomTranslation(species);
    const emotionalIdx = Math.floor(Math.random() * species.emotionalStates.length);
    const threatIdx = Math.floor(Math.random() * species.threatLevels.length);
    const intentIdx = Math.floor(Math.random() * species.biologicalIntents.length);
    const scanIdx = Math.floor(Math.random() * species.environmentalScans.length);

    setState(s => ({ ...s, isAnalyzing: true, scanProgress: 0 }));

    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 8 + 2;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);
        setState(s => ({
          ...s,
          isAnalyzing: false,
          isComplete: true,
          scanProgress: 100,
          species,
          confidence: Math.floor(72 + Math.random() * 25),
          emotionalState: species.emotionalStates[emotionalIdx],
          threatLevel: species.threatLevels[threatIdx],
          biologicalIntent: species.biologicalIntents[intentIdx],
          neuralResonance: Math.floor(60 + Math.random() * 35),
          signalQuality: Math.floor(75 + Math.random() * 22),
          translation: text,
          environmentalScan: species.environmentalScans[scanIdx],
          isPoetic,
        }));
      } else {
        setState(s => ({ ...s, scanProgress: progress }));
      }
    }, 80);
  }, []);

  const startListening = useCallback(async () => {
    setState({ ...INITIAL_STATE, isListening: true });
    rotateCrypticMessage();
    glitchTimerRef.current = setTimeout(triggerGlitch, 2000 + Math.random() * 3000);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setMicPermission("granted");

      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);
      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
    } catch {
      setMicPermission("denied");
    }

    animateWaveform(0.4);
    analysisTimerRef.current = setTimeout(runAnalysisSequence, 2500 + Math.random() * 1500);
  }, [animateWaveform, runAnalysisSequence, rotateCrypticMessage, triggerGlitch]);

  const stopListening = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
    if (analysisTimerRef.current) clearTimeout(analysisTimerRef.current);
    if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
    if (crypticTimerRef.current) clearTimeout(crypticTimerRef.current);

    streamRef.current?.getTracks().forEach(t => t.stop());
    audioCtxRef.current?.close();
    streamRef.current = null;
    audioCtxRef.current = null;
    analyserRef.current = null;

    setWaveformData(Array(64).fill(0));
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
    startListening,
    stopListening,
    reset,
  };
}

import { useEffect, useMemo, useRef, useState } from "react";
import { useAudioAnalysis, type LiveCandidate } from "../hooks/useAudioAnalysis";
import { ParticleField } from "../components/ParticleField";
import { MicButton } from "../components/MicButton";
import { TranslationCard } from "../components/TranslationCard";
import { SessionJournal } from "../components/SessionJournal";
import { SessionSpeciesRibbon } from "../components/SessionSpeciesRibbon";
import { UI_LABELS, type Lang } from "../data/translations";
import {
  SpeciesPanel,
  EmotionalPanel,
  ThreatPanel,
  BiologicalPanel,
  NeuralPanel,
  EnvironmentPanel,
} from "../components/AnalysisPanels";
import {
  createSessionEntryFromState,
  saveSessionEntry,
  type SessionJournalEntry,
} from "../utils/sessionJournal";

const VERSION_LABEL = "V3.3 · NOTION SOURCE / OCTOPUS / WEB AUDIO";

const DASHBOARD_COPY: Record<Lang, {
  bio: string;
  title: string;
  probableSpecies: string;
  none: string;
  birdnet: string;
  possibleCooing: string;
  possiblePsittacidae: string;
  possiblePasserine: string;
  talkativeSignal: string;
  secondaryEcho: string;
  lowFreqLiving: string;
  acquisition: string;
  birdSignature: string;
  habitatForest: string;
  habitatMixed: string;
  habitatUrbanEdge: string;
  habitatUrbanWindow: string;
  habitatListening: string;
}> = {
  fr: {
    bio: "ACTIVITÉ BIOLOGIQUE",
    title: "Signatures & activité biologique",
    probableSpecies: "Espèces probables",
    none: "Aucune espèce stabilisée",
    birdnet: "BirdNET-lite",
    possibleCooing: "ROUCOULEMENT POSSIBLE",
    possiblePsittacidae: "PSITTACIDÉ POSSIBLE",
    possiblePasserine: "PASSEREAU POSSIBLE",
    talkativeSignal: "SIGNAL BAVARD",
    secondaryEcho: "ÉCHO SECONDAIRE",
    lowFreqLiving: "BASSE FRÉQ. / BRUIT VIVANT ?",
    acquisition: "ACQUISITION DU SIGNAL",
    birdSignature: "SIGNATURE AVIAIRE",
    habitatForest: "FORÊT",
    habitatMixed: "MIXTE",
    habitatUrbanEdge: "LISIÈRE URBAINE",
    habitatUrbanWindow: "FENÊTRE URBAINE",
    habitatListening: "ÉCOUTE EN COURS",
  },
  en: {
    bio: "BIOLOGICAL ACTIVITY",
    title: "Signatures & biological activity",
    probableSpecies: "Likely species",
    none: "No stabilized species yet",
    birdnet: "BirdNET-lite",
    possibleCooing: "POSSIBLE COOING",
    possiblePsittacidae: "POSSIBLE PARAKEET",
    possiblePasserine: "POSSIBLE PASSERINE",
    talkativeSignal: "TALKATIVE SIGNAL",
    secondaryEcho: "SECONDARY ECHO",
    lowFreqLiving: "LOW FREQ. / LIVING NOISE?",
    acquisition: "SIGNAL ACQUISITION",
    birdSignature: "BIRD SIGNATURE",
    habitatForest: "FOREST",
    habitatMixed: "MIXED",
    habitatUrbanEdge: "URBAN EDGE",
    habitatUrbanWindow: "URBAN WINDOW",
    habitatListening: "LISTENING",
  },
  es: {
    bio: "ACTIVIDAD BIOLÓGICA",
    title: "Firmas y actividad biológica",
    probableSpecies: "Especies probables",
    none: "Ninguna especie estabilizada",
    birdnet: "BirdNET-lite",
    possibleCooing: "ARRULLO POSIBLE",
    possiblePsittacidae: "PSITÁCIDA POSIBLE",
    possiblePasserine: "PASERIFORME POSIBLE",
    talkativeSignal: "SEÑAL PARLANCHINA",
    secondaryEcho: "ECO SECUNDARIO",
    lowFreqLiving: "BAJA FREC. / RUIDO VIVO?",
    acquisition: "ADQUISICIÓN DE SEÑAL",
    birdSignature: "FIRMA AVIAR",
    habitatForest: "BOSQUE",
    habitatMixed: "MIXTO",
    habitatUrbanEdge: "BORDE URBANO",
    habitatUrbanWindow: "VENTANA URBANA",
    habitatListening: "ESCUCHANDO",
  },
};

function ScannerLines() {
  return <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 1 }}><div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)", backgroundSize: "100% 4px" }} /></div>;
}

function GlitchOverlay({ active }: { active: boolean }) {
  if (!active) return null;
  return <div className="pointer-events-none fixed inset-0" style={{ zIndex: 50, background: "rgba(0, 212, 255, 0.03)", mixBlendMode: "screen" }}><div className="absolute" style={{ top: `${20 + Math.random() * 60}%`, left: 0, right: 0, height: "2px", background: "rgba(255, 140, 0, 0.4)", transform: `translateX(${(Math.random() - 0.5) * 20}px)` }} /><div className="absolute" style={{ top: `${30 + Math.random() * 40}%`, left: 0, right: 0, height: "1px", background: "rgba(0, 212, 255, 0.3)", transform: `translateX(${(Math.random() - 0.5) * 30}px)` }} /></div>;
}

function CrypticTicker({ message }: { message: string }) {
  if (!message) return null;
  return <div className="text-[7px] font-mono tracking-[0.36em] uppercase px-2.5 py-0.5 rounded-sm border leading-tight" style={{ color: "#ff8c0088", borderColor: "#ff8c0022", background: "#ff8c0008", animation: "fadeInOut 4s ease-in-out" }}>▲ {message} ▲</div>;
}

function FeuchEmblem() {
  return <div className="hidden xs:flex w-12 h-12 shrink-0 items-center justify-center rounded-xl border" style={{ borderColor: "#00d4ff55", background: "radial-gradient(circle at 50% 50%, rgba(0,212,255,0.12), rgba(2,8,20,0.3))", boxShadow: "0 0 18px #00d4ff22, inset 0 0 16px #00d4ff11", clipPath: "polygon(18% 0, 82% 0, 100% 30%, 100% 70%, 82% 100%, 18% 100%, 0 70%, 0 30%)" }}><svg viewBox="0 0 64 64" className="w-8 h-8" fill="none" stroke="#00d4ff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 7px #00d4ff88)" }}><path d="M8 36h9l5-16 8 30 8-38 7 24h11" /><path d="M18 48c10 7 19 7 28 0" stroke="#ff8c00" strokeWidth="2" opacity="0.8" /></svg></div>;
}

function LangSelector({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  const opts: { v: Lang; l: string }[] = [{ v: "fr", l: "FR" }, { v: "en", l: "EN" }, { v: "es", l: "ES" }];
  return <div className="flex items-center gap-1.5"><span className="text-[8px] font-mono text-gray-500 tracking-widest">{UI_LABELS[lang].lang}</span>{opts.map(o => <button key={o.v} onClick={() => onChange(o.v)} className="text-[9px] font-mono px-1.5 py-0.5 rounded border transition-all duration-200" style={{ borderColor: lang === o.v ? "#00d4ff55" : "#ffffff11", color: lang === o.v ? "#00d4ff" : "#ffffff44", background: lang === o.v ? "rgba(0,212,255,0.08)" : "transparent", boxShadow: lang === o.v ? "0 0 6px #00d4ff22" : "none" }}>{o.l}</button>)}</div>;
}

function Header({ glitch, lang, onLangChange }: { glitch: boolean; lang: Lang; onLangChange: (l: Lang) => void }) {
  const [blink, setBlink] = useState(true);
  const t = UI_LABELS[lang];
  useEffect(() => { const id = setInterval(() => setBlink(b => !b), 800); return () => clearInterval(id); }, []);
  return <header className="relative px-3 pt-3 pb-2" style={{ zIndex: 3 }}><div className="relative overflow-hidden rounded-b-xl border px-3 py-3" style={{ borderColor: "#00d4ff33", background: "linear-gradient(180deg, rgba(2,10,24,0.98), rgba(0,12,30,0.86))", boxShadow: "0 0 22px rgba(0,212,255,0.12), inset 0 0 22px rgba(0,212,255,0.05)" }}><div className="absolute top-0 left-5 right-5 h-px" style={{ background: "linear-gradient(90deg, transparent, #00d4ff88, transparent)" }} /><div className="absolute -right-10 -top-10 w-32 h-32 rounded-full" style={{ background: "radial-gradient(circle, rgba(0,212,255,0.08), transparent 60%)" }} /><div className="flex items-center gap-3"><FeuchEmblem /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><div className="text-xl sm:text-2xl font-mono font-bold tracking-[0.22em] uppercase leading-none truncate" style={{ color: "#00d4ff", textShadow: "0 0 14px #00d4ff99", filter: glitch ? "blur(0.5px)" : "none" }}>{t.title}</div><span className="rounded border px-2 py-0.5 text-[8px] font-mono uppercase tracking-[0.18em]" style={{ borderColor: "#ff8c0050", color: "#ffbf7a", background: "rgba(255,140,0,0.08)", boxShadow: "0 0 10px rgba(255,140,0,0.10)" }}>{VERSION_LABEL}</span></div><div className="text-[8px] sm:text-[9px] font-mono tracking-[0.34em] text-orange-400/70 uppercase mt-1 truncate">{t.subtitle}</div></div></div><div className="mt-3 flex items-center justify-between gap-2 text-[9px] font-mono text-gray-500 tracking-wider flex-wrap"><LangSelector lang={lang} onChange={onLangChange} /><span className="hidden sm:inline text-gray-700">|</span><span>{t.institute}</span><div className="flex items-center gap-1 ml-auto"><div className="w-1.5 h-1.5 rounded-full" style={{ background: blink ? "#00ff88" : "#00ff8844", boxShadow: blink ? "0 0 6px #00ff88" : "none", transition: "all 0.3s" }} /><span style={{ color: blink ? "#00ff88" : "#00ff8844" }}>{t.online}</span></div></div></div></header>;
}

function LedBar({ value, pending = false }: { value: number; pending?: boolean }) {
  const lit = pending ? 0 : Math.max(0, Math.min(10, Math.round(value / 10)));
  return <div className="flex gap-0.5 w-20 justify-end" aria-label={`${value}%`}>{Array.from({ length: 10 }, (_, i) => <span key={i} className="h-2 w-1.5 rounded-sm transition-all duration-200" style={{ background: i < lit ? (i > 7 ? "#ff8c00" : "#00d4ff") : "rgba(255,255,255,0.08)", boxShadow: i < lit ? `0 0 5px ${i > 7 ? "#ff8c00" : "#00d4ff"}` : "none", opacity: pending ? 0.22 : i < lit ? 0.95 : 0.35 }} />)}</div>;
}

type SignatureRow = { label: string; value: number; tone: "primary" | "secondary" | "warning" | "idle" | "bio"; pending?: boolean };

function inferHabitat(audioFeatures: any, active: boolean) { if (!active && !audioFeatures) return "---"; return (audioFeatures?.spectralCentroid ?? 0) > 1800 && (audioFeatures?.lowEnergyRatio ?? 0.3) < 0.5 ? "forest" : "mixed"; }
function getSignalPercent(audioFeatures: any, progress: number) { const rawSignal = Math.round((audioFeatures?.rms ?? 0) * 420); return Math.min(99, Math.max(0, rawSignal || progress || 0)); }
function getBiologicalActivityPercent(audioFeatures: any, progress: number) { if (!audioFeatures) return Math.min(42, Math.max(0, Math.round(progress * 0.35))); const tonal = Math.max(0, 1 - (audioFeatures.flatness ?? 1)); const repetition = Math.min(1, (audioFeatures.periodicity ?? 0) * 3.4); const articulation = Math.min(1, (audioFeatures.zcr ?? 0) * 9.5); const highBand = Math.min(1, Math.max(0, ((audioFeatures.spectralCentroid ?? 0) - 650) / 2600)); const antiRumble = 1 - Math.min(0.55, Math.max(0, ((audioFeatures.lowEnergyRatio ?? 0) - 0.58) * 1.3)); const whisperPresence = (audioFeatures.rms ?? 0) > 0.0012 ? 0.12 : 0.04; const biological = (tonal * 0.24 + repetition * 0.31 + articulation * 0.2 + highBand * 0.13 + whisperPresence) * antiRumble; return Math.min(99, Math.max(0, Math.round(biological * 100))); }
function isPigeonLike(audioFeatures: any) { if (!audioFeatures) return false; return audioFeatures.dominantFreq < 950 && audioFeatures.spectralCentroid < 1900 && audioFeatures.lowEnergyRatio > 0.45 && audioFeatures.periodicity > 0.22 && audioFeatures.zcr < 0.12; }
function translateHabitat(raw: string, lang: Lang, fallback: "forest" | "mixed" | "quiet" = "mixed") { const copy = DASHBOARD_COPY[lang]; const normalized = raw.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); if (!raw || raw === "---") return fallback === "forest" ? copy.habitatForest : fallback === "quiet" ? copy.habitatListening : copy.habitatMixed; if (normalized.includes("lisiere urbaine") || normalized.includes("urban edge") || normalized.includes("borde urbano")) return copy.habitatUrbanEdge; if (normalized.includes("fenetre urbaine") || normalized.includes("urban window") || normalized.includes("ventana urbana")) return copy.habitatUrbanWindow; if (normalized.includes("foret") || normalized.includes("forest") || normalized.includes("bosque")) return copy.habitatForest; if (normalized.includes("ecoute") || normalized.includes("listening") || normalized.includes("escuch")) return copy.habitatListening; return copy.habitatMixed; }
function getSecondarySignatureLabel(audioFeatures: any, habitat: string, detectedLabel: string | null, gossip: number, signal: number, lang: Lang) { const copy = DASHBOARD_COPY[lang]; const label = (detectedLabel || "").toLowerCase(); const primaryIsPigeon = label.includes("pigeon") || label.includes("columba"); if (primaryIsPigeon || isPigeonLike(audioFeatures)) return copy.possibleCooing; if (audioFeatures?.spectralCentroid > 2800 && audioFeatures?.zcr > 0.08 && audioFeatures?.flatness > 0.12) return copy.possiblePsittacidae; if (habitat === "forest") return copy.possiblePasserine; if (gossip > 62 && signal > 10) return copy.talkativeSignal; return copy.secondaryEcho; }

function SpeciesCandidateList({ candidates, active, lang }: { candidates: LiveCandidate[]; active: boolean; lang: Lang }) {
  const rows = candidates.slice(0, 4);
  const copy = DASHBOARD_COPY[lang];
  return <div className="rounded border px-3 py-2 backdrop-blur-sm" style={{ borderColor: active ? "#00ff8840" : "#ffffff11", background: "rgba(0,10,25,0.58)" }}><div className="flex items-center justify-between mb-1.5"><div className="text-[9px] font-mono tracking-[0.32em] uppercase text-green-300/70">{copy.probableSpecies}</div><div className="text-[8px] font-mono tracking-[0.22em] uppercase text-white/30">{copy.birdnet}</div></div><div className="space-y-1">{rows.length === 0 ? <div className="grid grid-cols-[18px_1fr_42px] items-center gap-2 text-[9px] font-mono tracking-wider text-gray-600"><span>--</span><span className="truncate uppercase">{copy.none}</span><span className="text-right">--</span></div> : rows.map((candidate, index) => <div key={`${candidate.id}-${index}`} className="grid grid-cols-[18px_1fr_auto_38px] items-center gap-2 text-[9px] font-mono tracking-wider"><span className="text-green-300/70">{index + 1}.</span><span className="truncate uppercase text-gray-300">{candidate.name}</span><LedBar value={candidate.confidence} /><span className="text-right text-green-200">{candidate.confidence}%</span></div>)}</div></div>;
}

function LiveSignalDashboard({ active, audioFeatures, detectedLabel, progress, lang }: { active: boolean; audioFeatures: any; detectedLabel: string | null; progress: number; lang: Lang }) {
  const copy = DASHBOARD_COPY[lang];
  const signal = getSignalPercent(audioFeatures, progress);
  const biologicalActivity = getBiologicalActivityPercent(audioFeatures, progress);
  const sharpness = Math.min(99, Math.max(0, Math.round((audioFeatures?.zcr ?? 0) * 420)));
  const gossip = Math.min(99, Math.max(0, Math.round((audioFeatures?.flatness ?? 0) * 180 + sharpness * 0.45)));
  const lowEnergy = Math.min(99, Math.max(0, Math.round((audioFeatures?.lowEnergyRatio ?? 0) * 95)));
  const habitat = inferHabitat(audioFeatures, active);
  const hasSignal = active || progress > 1 || Boolean(detectedLabel);
  const signatureRows = useMemo<SignatureRow[]>(() => {
    if (!hasSignal) return [{ label: copy.bio, value: 0, tone: "idle", pending: true }];
    const rows: SignatureRow[] = [];
    rows.push({ label: copy.bio, value: biologicalActivity, tone: biologicalActivity > 58 ? "bio" : "secondary" });
    const primaryValue = Math.min(96, Math.max(8, Math.round(detectedLabel ? Math.max(progress, biologicalActivity, signal) : Math.max(progress, biologicalActivity, signal * 1.2))));
    rows.push({ label: detectedLabel || (progress > 24 ? copy.birdSignature : copy.acquisition), value: primaryValue, tone: "primary" });
    const secondaryValue = Math.min(82, Math.max(0, Math.round(gossip * 0.48 + biologicalActivity * 0.34 + signal * 0.08)));
    if (progress > 22 || secondaryValue > 28) rows.push({ label: getSecondarySignatureLabel(audioFeatures, habitat, detectedLabel, gossip, signal, lang), value: Math.max(18, secondaryValue), tone: "secondary" });
    const lowBandValue = Math.min(76, Math.max(0, Math.round(lowEnergy * 0.78)));
    if (lowEnergy > 62 && signal > 10 && biologicalActivity < 52) rows.push({ label: copy.lowFreqLiving, value: lowBandValue, tone: "warning" });
    return rows.slice(0, 4);
  }, [hasSignal, detectedLabel, progress, signal, gossip, lowEnergy, habitat, audioFeatures, biologicalActivity, copy, lang]);
  return <div className="rounded border px-3 py-2 backdrop-blur-sm" style={{ borderColor: active ? "#00d4ff44" : "#ffffff11", background: "rgba(0,10,25,0.68)" }}><div className="flex items-center justify-between mb-1.5"><div className="text-[9px] font-mono tracking-[0.32em] uppercase text-cyan-400/70">{copy.title}</div><div className="text-[8px] font-mono tracking-[0.22em] uppercase" style={{ color: active ? "#00ff88" : "#ffffff33" }}>{active ? "LIVE" : "STANDBY"}</div></div><div className="space-y-1">{signatureRows.map(row => { const diode = row.tone === "bio" ? "#00ff88" : row.tone === "primary" ? "#00ff88" : row.tone === "secondary" ? "#00d4ff" : row.tone === "warning" ? "#ff8c00" : "#ffffff33"; return <div key={row.label} className="grid grid-cols-[10px_1fr_auto_34px] items-center gap-2 text-[9px] font-mono tracking-wider"><span className="w-1.5 h-1.5 rounded-full" style={{ background: diode, boxShadow: row.pending ? "none" : `0 0 5px ${diode}` }} /><span className={`truncate uppercase ${row.pending ? "text-gray-600" : "text-gray-300"}`}>{row.label}</span><LedBar value={row.value} pending={row.pending} /><span className={`text-right ${row.pending ? "text-gray-600" : "text-cyan-300"}`}>{row.pending ? "--" : `${row.value}%`}</span></div>; })}</div></div>;
}

export default function Home() {
  const { state, crypticMessage, audioFeatures, detectedLabel, liveCandidates, lang, setLang, startListening, stopListening, reset } = useAudioAnalysis();
  const activeAudioFeatures = audioFeatures || state.audioFeatures;
  const habitatFallback = inferHabitat(activeAudioFeatures, state.isListening || state.isAnalyzing);
  const micSignal = state.isComplete ? state.signalQuality : getBiologicalActivityPercent(activeAudioFeatures, state.scanProgress);
  const micHabitat = state.environmentalScan ? translateHabitat(state.environmentalScan, lang, habitatFallback as "forest" | "mixed" | "quiet") : translateHabitat("", lang, habitatFallback as "forest" | "mixed" | "quiet");
  const [latestEntry, setLatestEntry] = useState<SessionJournalEntry | null>(null);
  const lastSavedTranslationRef = useRef("");

  useEffect(() => {
    if (!state.isComplete || !state.translation) return;
    const signature = `${state.detectedSpecies || state.species?.name || "unknown"}-${state.translation}`;
    if (lastSavedTranslationRef.current === signature) return;
    const entry = createSessionEntryFromState(state, micHabitat);
    if (!entry) return;
    saveSessionEntry(entry);
    setLatestEntry(entry);
    lastSavedTranslationRef.current = signature;
  }, [state.isComplete, state.translation, state.detectedSpecies, state.species, micHabitat, state]);

  return <div className="relative min-h-screen w-full overflow-x-hidden flex flex-col" style={{ background: "radial-gradient(ellipse at 20% 20%, rgba(0,40,80,0.4) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(20,0,40,0.3) 0%, transparent 60%), #02060f", fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace" }}><ParticleField active={state.isListening || state.isAnalyzing} /><ScannerLines /><GlitchOverlay active={state.glitchActive} /><Header glitch={state.glitchActive} lang={lang} onLangChange={setLang} /><main className="relative flex-1 flex flex-col gap-2 p-3 sm:p-4 max-w-4xl mx-auto w-full" style={{ zIndex: 2, paddingBottom: "calc(6rem + env(safe-area-inset-bottom, 0px))" }}><div className="grid grid-cols-1 gap-2 sm:grid-cols-2"><SpeciesPanel state={state} lang={lang} /><LiveSignalDashboard active={state.isListening || state.isAnalyzing} audioFeatures={activeAudioFeatures} detectedLabel={detectedLabel || state.detectedSpecies} progress={state.scanProgress} lang={lang} /></div><TranslationCard state={state} lang={lang} /><SessionSpeciesRibbon state={state} candidates={liveCandidates} lang={lang} /><SpeciesCandidateList candidates={liveCandidates} active={state.isListening || state.isAnalyzing} lang={lang} /><div className="flex justify-center"><CrypticTicker message={crypticMessage} /></div><SessionJournal latestEntry={latestEntry} /><div className="grid grid-cols-2 sm:grid-cols-4 gap-2"><ThreatPanel state={state} lang={lang} /><BiologicalPanel state={state} lang={lang} /><NeuralPanel state={state} lang={lang} /><EnvironmentPanel state={state} lang={lang} /></div><div className="hidden"><EmotionalPanel state={state} lang={lang} /></div><MicButton isListening={state.isListening} isAnalyzing={state.isAnalyzing} isComplete={state.isComplete} onStart={startListening} onStop={stopListening} onReset={reset} lang={lang} signalQuality={micSignal} habitat={micHabitat} /></main></div>;
}

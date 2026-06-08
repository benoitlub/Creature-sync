import { useEffect, useMemo, useRef, useState } from "react";
import { useAudioAnalysis } from "../hooks/useAudioAnalysis";
import { ParticleField } from "../components/ParticleField";
import { MicButton } from "../components/MicButton";
import { TranslationCard } from "../components/TranslationCard";
import { SessionJournal } from "../components/SessionJournal";
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

function ScannerLines() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 1 }}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
          backgroundSize: "100% 4px",
        }}
      />
    </div>
  );
}

function GlitchOverlay({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="pointer-events-none fixed inset-0" style={{ zIndex: 50, background: "rgba(0, 212, 255, 0.03)", mixBlendMode: "screen" }}>
      <div className="absolute" style={{ top: `${20 + Math.random() * 60}%`, left: 0, right: 0, height: "2px", background: "rgba(255, 140, 0, 0.4)", transform: `translateX(${(Math.random() - 0.5) * 20}px)` }} />
      <div className="absolute" style={{ top: `${30 + Math.random() * 40}%`, left: 0, right: 0, height: "1px", background: "rgba(0, 212, 255, 0.3)", transform: `translateX(${(Math.random() - 0.5) * 30}px)` }} />
    </div>
  );
}

function CrypticTicker({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="text-[7px] font-mono tracking-[0.36em] uppercase px-2.5 py-0.5 rounded-sm border leading-tight" style={{ color: "#ff8c0088", borderColor: "#ff8c0022", background: "#ff8c0008", animation: "fadeInOut 4s ease-in-out" }}>
      ▲ {message} ▲
    </div>
  );
}

function FeuchEmblem() {
  return (
    <div
      className="hidden xs:flex w-12 h-12 shrink-0 items-center justify-center rounded-xl border"
      style={{
        borderColor: "#00d4ff55",
        background: "radial-gradient(circle at 50% 50%, rgba(0,212,255,0.12), rgba(2,8,20,0.3))",
        boxShadow: "0 0 18px #00d4ff22, inset 0 0 16px #00d4ff11",
        clipPath: "polygon(18% 0, 82% 0, 100% 30%, 100% 70%, 82% 100%, 18% 100%, 0 70%, 0 30%)",
      }}
    >
      <svg viewBox="0 0 64 64" className="w-8 h-8" fill="none" stroke="#00d4ff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 7px #00d4ff88)" }}>
        <path d="M8 36h9l5-16 8 30 8-38 7 24h11" />
        <path d="M18 48c10 7 19 7 28 0" stroke="#ff8c00" strokeWidth="2" opacity="0.8" />
      </svg>
    </div>
  );
}

function LangSelector({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  const opts: { v: Lang; l: string }[] = [
    { v: "fr", l: "FR" },
    { v: "en", l: "EN" },
    { v: "es", l: "ES" },
  ];
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[8px] font-mono text-gray-500 tracking-widest">{UI_LABELS[lang].lang}</span>
      {opts.map(o => (
        <button key={o.v} onClick={() => onChange(o.v)} className="text-[9px] font-mono px-1.5 py-0.5 rounded border transition-all duration-200" style={{ borderColor: lang === o.v ? "#00d4ff55" : "#ffffff11", color: lang === o.v ? "#00d4ff" : "#ffffff44", background: lang === o.v ? "rgba(0,212,255,0.08)" : "transparent", boxShadow: lang === o.v ? "0 0 6px #00d4ff22" : "none" }}>
          {o.l}
        </button>
      ))}
    </div>
  );
}

function Header({ glitch, lang, onLangChange }: { glitch: boolean; lang: Lang; onLangChange: (l: Lang) => void }) {
  const [blink, setBlink] = useState(true);
  const t = UI_LABELS[lang];

  useEffect(() => {
    const id = setInterval(() => setBlink(b => !b), 800);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="relative px-3 pt-3 pb-2" style={{ zIndex: 3 }}>
      <div
        className="relative overflow-hidden rounded-b-xl border px-3 py-3"
        style={{
          borderColor: "#00d4ff33",
          background: "linear-gradient(180deg, rgba(2,10,24,0.98), rgba(0,12,30,0.86))",
          boxShadow: "0 0 22px rgba(0,212,255,0.12), inset 0 0 22px rgba(0,212,255,0.05)",
        }}
      >
        <div className="absolute top-0 left-5 right-5 h-px" style={{ background: "linear-gradient(90deg, transparent, #00d4ff88, transparent)" }} />
        <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full" style={{ background: "radial-gradient(circle, rgba(0,212,255,0.08), transparent 60%)" }} />
        <div className="flex items-center gap-3">
          <FeuchEmblem />
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-mono font-bold tracking-[0.28em] uppercase text-orange-300/80 leading-none truncate">
              FEUCH INSTITUT · Division d’Écoute Interspécifique
            </div>
            <div className="mt-1 text-xl sm:text-2xl font-mono font-bold tracking-[0.22em] uppercase leading-none truncate" style={{ color: "#00d4ff", textShadow: "0 0 14px #00d4ff99", filter: glitch ? "blur(0.5px)" : "none" }}>
              {t.title}
            </div>
            <div className="text-[8px] sm:text-[9px] font-mono tracking-[0.26em] text-cyan-200/55 uppercase mt-1 truncate">
              Build F-0.9 SHARE · Live candidates · Evolving phrases
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2 text-[9px] font-mono text-gray-500 tracking-wider flex-wrap">
          <LangSelector lang={lang} onChange={onLangChange} />
          <span className="hidden sm:inline text-gray-700">|</span>
          <span>5, chemin des Aventuriers · Ouest Rotas Cedex</span>
          <div className="flex items-center gap-1 ml-auto">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: blink ? "#00ff88" : "#00ff8844", boxShadow: blink ? "0 0 6px #00ff88" : "none", transition: "all 0.3s" }} />
            <span style={{ color: blink ? "#00ff88" : "#00ff8844" }}>{t.online}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function LedBar({ value, pending = false }: { value: number; pending?: boolean }) {
  const lit = pending ? 0 : Math.max(0, Math.min(10, Math.round(value / 10)));
  return (
    <div className="flex gap-0.5 w-20 justify-end" aria-label={`${value}%`}>
      {Array.from({ length: 10 }, (_, i) => (
        <span key={i} className="h-2 w-1.5 rounded-sm transition-all duration-200" style={{ background: i < lit ? (i > 7 ? "#ff8c00" : "#00d4ff") : "rgba(255,255,255,0.08)", boxShadow: i < lit ? `0 0 5px ${i > 7 ? "#ff8c00" : "#00d4ff"}` : "none", opacity: pending ? 0.22 : i < lit ? 0.95 : 0.35 }} />
      ))}
    </div>
  );
}

type SignatureRow = {
  label: string;
  value: number;
  tone: "primary" | "secondary" | "warning" | "idle";
  pending?: boolean;
};

type LiveCandidate = {
  id: string;
  name: string;
  scientificName: string;
  confidence: number;
};


const CREATURE_SYNC_URL = "https://benoitlub.github.io/Creature-sync/";
const PAYPAL_DONATION_URL = "https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=benoitlubert%40gmail.com&currency_code=EUR&item_name=Creature%20Sync%20-%20Feuch%20Institut";

function buildShareText(state: any) {
  const speciesName = state?.species?.name || state?.detectedSpecies || "une créature non officiellement consentante";
  const confidence = state?.confidence ? ` — ${state.confidence}%` : "";
  const translation = state?.translation ? `\n\"${state.translation}\"` : "";
  return `Creature Sync a intercepté :\n${speciesName}${confidence}${translation}\n\nTerminal mobile du Feuch Institut.\n${CREATURE_SYNC_URL}\n\nAucun animal n’a été payé pendant cette traduction. Le laboratoire accepte les dons en miettes, encouragements ou euros.`;
}

function FeuchActionPanel({ state }: { state: any }) {
  const [copied, setCopied] = useState(false);
  const shareText = buildShareText(state);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: "Creature Sync — Feuch Institut", text: shareText, url: CREATURE_SYNC_URL });
        return;
      }
      await navigator.clipboard?.writeText(shareText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      try {
        await navigator.clipboard?.writeText(shareText);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2200);
      } catch {
        setCopied(false);
      }
    }
  };

  return (
    <section
      className="rounded-xl border p-3 backdrop-blur-sm"
      style={{
        borderColor: "#00d4ff33",
        background: "linear-gradient(180deg, rgba(0,20,40,0.78), rgba(0,8,20,0.62))",
        boxShadow: "0 0 18px rgba(0,212,255,0.08), inset 0 0 18px rgba(0,212,255,0.035)",
      }}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="text-[9px] font-mono tracking-[0.32em] uppercase text-cyan-300/80">Transmission externe</div>
        <div className="text-[8px] font-mono tracking-[0.22em] uppercase text-orange-300/60">World Wild Web</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <button
          onClick={handleShare}
          className="group rounded-lg border px-3 py-3 text-left transition-all duration-200 active:scale-[0.99]"
          style={{
            borderColor: "#00d4ff66",
            background: "linear-gradient(135deg, rgba(0,212,255,0.16), rgba(0,212,255,0.04))",
            boxShadow: "0 0 14px rgba(0,212,255,0.14)",
          }}
        >
          <div className="text-sm font-mono font-bold tracking-[0.12em] uppercase text-cyan-200">📤 Partager la détection</div>
          <div className="mt-1 text-[10px] leading-relaxed text-cyan-100/60">
            {copied ? "Rapport copié dans le presse-papiers." : "Envoyer la traduction, le lien Creature Sync et la mention Feuch Institut."}
          </div>
        </button>

        <a
          href={PAYPAL_DONATION_URL}
          target="_blank"
          rel="noreferrer"
          className="group rounded-lg border px-3 py-3 text-left transition-all duration-200 active:scale-[0.99]"
          style={{
            borderColor: "#ff8c0066",
            background: "linear-gradient(135deg, rgba(255,140,0,0.18), rgba(255,140,0,0.04))",
            boxShadow: "0 0 14px rgba(255,140,0,0.12)",
          }}
        >
          <div className="text-sm font-mono font-bold tracking-[0.12em] uppercase text-orange-200">☕ Soutenir le laboratoire</div>
          <div className="mt-1 text-[10px] leading-relaxed text-orange-100/60">
            Creature Sync reste gratuit. Un don libre aide Marty à remplacer les câbles mordillés.
          </div>
        </a>
      </div>
    </section>
  );
}

function FeuchFooter() {
  return (
    <footer className="relative px-3 pb-4 max-w-4xl mx-auto w-full" style={{ zIndex: 2 }}>
      <div
        className="rounded-xl border px-3 py-3 text-center"
        style={{
          borderColor: "#00d4ff22",
          background: "rgba(0,10,25,0.48)",
          boxShadow: "inset 0 0 18px rgba(0,212,255,0.035)",
        }}
      >
        <div className="text-[9px] font-mono tracking-[0.28em] uppercase text-cyan-300/70">Une expérience du Feuch Institut</div>
        <div className="mt-1 text-[8px] font-mono tracking-[0.18em] uppercase text-gray-500 leading-relaxed">
          5, chemin des Aventuriers · Ouest Rotas Cedex · Blacklace Island · World Wild Web
        </div>
        <div className="mt-2 text-[8px] font-mono tracking-[0.2em] uppercase text-orange-300/60">
          Direction scientifique : Dr Nikolas · Assistant de recherche : M. Marty Molla
        </div>
      </div>
    </footer>
  );
}

function inferHabitat(audioFeatures: any, active: boolean) {
  if (!active && !audioFeatures) return "---";
  return (audioFeatures?.spectralCentroid ?? 0) > 1800 && (audioFeatures?.lowEnergyRatio ?? 0.3) < 0.5 ? "FORÊT" : "MIXTE";
}

function getSignalPercent(audioFeatures: any, progress: number) {
  const rawSignal = Math.round((audioFeatures?.rms ?? 0) * 420);
  return Math.min(99, Math.max(0, rawSignal || progress || 0));
}

function isPigeonLike(audioFeatures: any) {
  if (!audioFeatures) return false;
  return (
    audioFeatures.dominantFreq < 950 &&
    audioFeatures.spectralCentroid < 1900 &&
    audioFeatures.lowEnergyRatio > 0.45 &&
    audioFeatures.periodicity > 0.22 &&
    audioFeatures.zcr < 0.12
  );
}

function getSecondarySignatureLabel(audioFeatures: any, habitat: string, detectedLabel: string | null, gossip: number, signal: number) {
  const label = (detectedLabel || "").toLowerCase();
  const primaryIsPigeon = label.includes("pigeon") || label.includes("columba");

  if (primaryIsPigeon || isPigeonLike(audioFeatures)) return "ROUCOULEMENT POSSIBLE";
  if (audioFeatures?.spectralCentroid > 2800 && audioFeatures?.zcr > 0.08 && audioFeatures?.flatness > 0.12) return "PSITTACIDÉ POSSIBLE";
  if (habitat === "FORÊT") return "PASSEREAU POSSIBLE";
  if (gossip > 62 && signal > 10) return "SIGNAL BAVARD";
  return "ÉCHO SECONDAIRE";
}

function LiveSignalDashboard({ active, audioFeatures, detectedLabel, progress, liveCandidates }: { active: boolean; audioFeatures: any; detectedLabel: string | null; progress: number; liveCandidates: LiveCandidate[] }) {
  const signal = getSignalPercent(audioFeatures, progress);
  const sharpness = Math.min(99, Math.max(0, Math.round((audioFeatures?.zcr ?? 0) * 420)));
  const gossip = Math.min(99, Math.max(0, Math.round((audioFeatures?.flatness ?? 0) * 180 + sharpness * 0.45)));
  const lowEnergy = Math.min(99, Math.max(0, Math.round((audioFeatures?.lowEnergyRatio ?? 0) * 95)));
  const habitat = inferHabitat(audioFeatures, active);
  const hasSignal = active || progress > 1 || Boolean(detectedLabel);

  const signatureRows = useMemo<SignatureRow[]>(() => {
    if (!hasSignal) return [{ label: "EMPLACEMENT SIGNATURE", value: 0, tone: "idle", pending: true }];

    const rows: SignatureRow[] = [];
    const primaryValue = Math.min(96, Math.max(8, Math.round(detectedLabel ? Math.max(progress, signal) : Math.max(progress, signal * 1.4))));
    rows.push({ label: detectedLabel || (progress > 24 ? "SIGNATURE AVIAIRE" : "ACQUISITION DU SIGNAL"), value: primaryValue, tone: "primary" });

    const secondaryValue = Math.min(82, Math.max(0, Math.round(gossip * 0.62 + signal * 0.18)));
    if (progress > 22 || secondaryValue > 28) {
      rows.push({
        label: getSecondarySignatureLabel(audioFeatures, habitat, detectedLabel, gossip, signal),
        value: Math.max(18, secondaryValue),
        tone: "secondary",
      });
    }

    const lowBandValue = Math.min(76, Math.max(0, Math.round(lowEnergy * 0.78)));
    if (lowEnergy > 62 && signal > 10) rows.push({ label: "BASSE FRÉQ. / CANIDÉ", value: lowBandValue, tone: "warning" });

    return rows.slice(0, 3);
  }, [hasSignal, detectedLabel, progress, signal, gossip, lowEnergy, habitat, audioFeatures]);

  return (
    <div className="rounded border px-3 py-2 backdrop-blur-sm" style={{ borderColor: active ? "#00d4ff44" : "#ffffff11", background: "rgba(0,10,25,0.68)" }}>
      <div className="flex items-center justify-between mb-1.5">
        <div className="text-[9px] font-mono tracking-[0.32em] uppercase text-cyan-400/70">Signature / Détection / Traduction</div>
        <div className="text-[8px] font-mono tracking-[0.22em] uppercase" style={{ color: active ? "#00ff88" : "#ffffff33" }}>{active ? "LIVE" : "VEILLE"}</div>
      </div>
      <div className="space-y-1">
        {signatureRows.map(row => {
          const diode = row.tone === "primary" ? "#00ff88" : row.tone === "secondary" ? "#00d4ff" : row.tone === "warning" ? "#ff8c00" : "#ffffff33";
          return (
            <div key={row.label} className="grid grid-cols-[10px_1fr_auto_34px] items-center gap-2 text-[9px] font-mono tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: diode, boxShadow: row.pending ? "none" : `0 0 5px ${diode}` }} />
              <span className={`truncate uppercase ${row.pending ? "text-gray-600" : "text-gray-300"}`}>{row.label}</span>
              <LedBar value={row.value} pending={row.pending} />
              <span className={`text-right ${row.pending ? "text-gray-600" : "text-cyan-300"}`}>{row.pending ? "--" : `${row.value}%`}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-2 border-t pt-2" style={{ borderColor: "#00d4ff22" }}>
        <div className="flex items-center justify-between mb-1">
          <div className="text-[8px] font-mono tracking-[0.28em] uppercase text-orange-300/70">Détection live</div>
          <div className="text-[8px] font-mono tracking-[0.2em] uppercase text-cyan-300/60">Build F-0.9</div>
        </div>

        {liveCandidates.length > 0 ? (
          <div className="space-y-1">
            {liveCandidates.slice(0, 4).map((candidate, index) => {
              const dot = index === 0 ? "#00ff88" : index === 1 ? "#00d4ff" : index === 2 ? "#ff8c00" : "#ffffff55";
              return (
                <div key={`${candidate.id}-${index}`} className="grid grid-cols-[10px_1fr_34px] items-center gap-2 text-[9px] font-mono tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: dot, boxShadow: `0 0 5px ${dot}` }} />
                  <span className="truncate uppercase text-gray-300">
                    {candidate.name}
                    <span className="ml-1 text-[8px] text-gray-600 normal-case">{candidate.scientificName}</span>
                  </span>
                  <span className="text-right text-cyan-300">{candidate.confidence}%</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-[9px] font-mono text-gray-600 uppercase tracking-wider">
            En attente de candidats fiables
          </div>
        )}
      </div>

      <div className="mt-2 border-t pt-2" style={{ borderColor: "#00d4ff22" }}>
        <div className="text-[8px] font-mono tracking-[0.28em] uppercase text-orange-300/70 mb-1">Traduction en cours</div>
        <div className="text-[10px] leading-relaxed text-cyan-100/80">
          {detectedLabel || liveCandidates.length > 0
            ? "Analyse du vivant en cours…"
            : "Aucun animal n’a encore accepté de se prononcer officiellement."}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { state, crypticMessage, audioFeatures, detectedLabel, liveCandidates = [], lang, setLang, startListening, stopListening, reset } = useAudioAnalysis();
  const activeAudioFeatures = audioFeatures || state.audioFeatures;
  const micSignal = state.isComplete ? state.signalQuality : getSignalPercent(activeAudioFeatures, state.scanProgress);
  const micHabitat = state.environmentalScan ? state.environmentalScan.split("—")[0].replace("AMBIANCE :", "").trim() : inferHabitat(activeAudioFeatures, state.isListening || state.isAnalyzing);
  const [latestEntry, setLatestEntry] = useState<SessionJournalEntry | null>(null);
  const lastSavedTranslationRef = useRef<string>("");

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

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden flex flex-col" style={{ background: "radial-gradient(ellipse at 20% 20%, rgba(0,40,80,0.4) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(20,0,40,0.3) 0%, transparent 60%), #02060f", fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace" }}>
      <ParticleField active={state.isListening || state.isAnalyzing} />
      <ScannerLines />
      <GlitchOverlay active={state.glitchActive} />
      <Header glitch={state.glitchActive} lang={lang} onLangChange={setLang} />
      <main className="relative flex-1 flex flex-col gap-2 p-3 sm:p-4 max-w-4xl mx-auto w-full" style={{ zIndex: 2, paddingBottom: "calc(6rem + env(safe-area-inset-bottom, 0px))" }}>
        <div className="grid grid-cols-2 gap-2">
          <SpeciesPanel state={state} lang={lang} />
          <EmotionalPanel state={state} lang={lang} />
        </div>
        <LiveSignalDashboard
          active={state.isListening || state.isAnalyzing}
          audioFeatures={activeAudioFeatures}
          detectedLabel={detectedLabel || state.detectedSpecies}
          progress={state.scanProgress}
          liveCandidates={liveCandidates}
        />
        <div className="flex justify-center"><CrypticTicker message={crypticMessage} /></div>
        <TranslationCard state={state} lang={lang} />
        <FeuchActionPanel state={state} />
        <SessionJournal latestEntry={latestEntry} />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <ThreatPanel state={state} lang={lang} />
          <BiologicalPanel state={state} lang={lang} />
          <NeuralPanel state={state} lang={lang} />
          <EnvironmentPanel state={state} lang={lang} />
        </div>
        <MicButton isListening={state.isListening} isAnalyzing={state.isAnalyzing} isComplete={state.isComplete} onStart={startListening} onStop={stopListening} onReset={reset} lang={lang} signalQuality={micSignal} habitat={micHabitat} />
      </main>
      <FeuchFooter />
    </div>
  );
}

import { type AnalysisState } from "../data/animals";
import {
  CREATURE_OBSERVATION_EVENT,
  type CreatureObservationEvent,
} from "../integrations/octopus/contracts";

export type JournalMetrics = {
  dominantFreq?: number;
  spectralCentroid?: number;
  rms?: number;
  clarity?: number;
  resonance?: number;
  signalQuality?: number;
};

export type SessionJournalEntry = {
  id: string;
  createdAt: string;
  title: string;
  speciesName: string;
  speciesLatin?: string;
  confidence: number;
  translation: string;
  habitat: string;
  locationNote: string;
  userNotes: string;
  tags: string[];
  favorite: boolean;
  metrics: JournalMetrics;
};

type LastOctopusObservation = {
  key: string;
  sentAt: number;
  confidence: number;
};

const JOURNAL_KEY = "creature-sync-session-journal-v1";
const OCTOPUS_LAST_OBSERVATION_KEY = "creature-sync-octopus-last-observation-v1";
const MAX_FREE_ENTRIES = 50;
const MIN_OCTOPUS_CONFIDENCE = 70;
const OCTOPUS_DUPLICATE_WINDOW_MS = 30 * 60 * 1000;
const OCTOPUS_CONFIDENCE_UPGRADE = 10;

function safeParse(raw: string | null): SessionJournalEntry[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function storageAvailable() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function normalizeObservationKey(entry: SessionJournalEntry) {
  const species = (entry.speciesLatin || entry.speciesName || "unknown").trim().toLowerCase();
  const habitat = (entry.locationNote || entry.habitat || "unknown").trim().toLowerCase();
  return `${species}::${habitat}`;
}

function getLastOctopusObservation(): LastOctopusObservation | null {
  if (!storageAvailable()) return null;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(OCTOPUS_LAST_OBSERVATION_KEY) || "null");
    if (!parsed || typeof parsed !== "object") return null;
    if (typeof parsed.key !== "string" || typeof parsed.sentAt !== "number" || typeof parsed.confidence !== "number") return null;
    return parsed as LastOctopusObservation;
  } catch {
    return null;
  }
}

function shouldSendToOctopus(entry: SessionJournalEntry) {
  const knownSpecies = Boolean(entry.speciesName && entry.speciesName !== "Signature inconnue");
  if (!knownSpecies || entry.confidence < MIN_OCTOPUS_CONFIDENCE) return false;

  const key = normalizeObservationKey(entry);
  const previous = getLastOctopusObservation();
  if (!previous || previous.key !== key) return true;

  const recentDuplicate = Date.now() - previous.sentAt < OCTOPUS_DUPLICATE_WINDOW_MS;
  const meaningfulUpgrade = entry.confidence >= previous.confidence + OCTOPUS_CONFIDENCE_UPGRADE;
  return !recentDuplicate || meaningfulUpgrade;
}

function rememberOctopusObservation(entry: SessionJournalEntry) {
  if (!storageAvailable()) return;
  const value: LastOctopusObservation = {
    key: normalizeObservationKey(entry),
    sentAt: Date.now(),
    confidence: entry.confidence,
  };
  window.localStorage.setItem(OCTOPUS_LAST_OBSERVATION_KEY, JSON.stringify(value));
}

function emitObservation(entry: SessionJournalEntry) {
  if (typeof window === "undefined" || !shouldSendToOctopus(entry)) return;

  const observation: CreatureObservationEvent = {
    id: entry.id,
    timestamp: entry.createdAt,
    location: entry.locationNote || entry.habitat || undefined,
    source: "audio",
    species: entry.speciesName || undefined,
    scientificName: entry.speciesLatin || undefined,
    category: "animal",
    confidence: entry.confidence,
    rawLabel: entry.speciesName,
    context: entry.translation,
    habitat: entry.habitat,
    metrics: { ...entry.metrics },
  };

  rememberOctopusObservation(entry);
  window.dispatchEvent(new CustomEvent(CREATURE_OBSERVATION_EVENT, { detail: observation }));
}

export function getSessionJournal(): SessionJournalEntry[] {
  if (!storageAvailable()) return [];
  return safeParse(window.localStorage.getItem(JOURNAL_KEY));
}

export function persistSessionJournal(entries: SessionJournalEntry[]) {
  if (!storageAvailable()) return;
  window.localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries.slice(0, MAX_FREE_ENTRIES)));
}

export function createSessionEntryFromState(state: AnalysisState, habitat: string): SessionJournalEntry | null {
  if (!state.isComplete || !state.translation) return null;

  const createdAt = new Date().toISOString();
  const speciesName = state.detectedSpecies || state.species?.scientificName?.fr || state.species?.name || "Signature inconnue";
  const speciesLatin = state.species?.name;
  const confidence = Math.max(0, Math.min(100, Math.round(state.confidence || state.speciesConfidence || 0)));
  const readableDate = new Date(createdAt).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt,
    title: `${speciesName} — ${readableDate}`,
    speciesName,
    speciesLatin,
    confidence,
    translation: state.translation,
    habitat: habitat || state.environmentalScan || "Lieu non précisé",
    locationNote: "",
    userNotes: "",
    tags: [],
    favorite: false,
    metrics: {
      dominantFreq: state.audioFeatures?.dominantFreq ? Math.round(state.audioFeatures.dominantFreq) : undefined,
      spectralCentroid: state.audioFeatures?.spectralCentroid ? Math.round(state.audioFeatures.spectralCentroid) : undefined,
      rms: state.audioFeatures?.rms ? Number(state.audioFeatures.rms.toFixed(4)) : undefined,
      clarity: state.signalQuality ? Math.round(state.signalQuality) : undefined,
      resonance: state.neuralResonance ? Math.round(state.neuralResonance) : undefined,
      signalQuality: state.signalQuality ? Math.round(state.signalQuality) : undefined,
    },
  };
}

export function saveSessionEntry(entry: SessionJournalEntry) {
  const entries = getSessionJournal();
  const next = [entry, ...entries.filter((item) => item.id !== entry.id)].slice(0, MAX_FREE_ENTRIES);
  persistSessionJournal(next);
  emitObservation(entry);
  return next;
}

export function updateSessionEntry(entryId: string, patch: Partial<SessionJournalEntry>) {
  const next = getSessionJournal().map((entry) => entry.id === entryId ? { ...entry, ...patch } : entry);
  persistSessionJournal(next);
  return next;
}

export function deleteSessionEntry(entryId: string) {
  const next = getSessionJournal().filter((entry) => entry.id !== entryId);
  persistSessionJournal(next);
  return next;
}

export function clearSessionJournal() {
  persistSessionJournal([]);
  return [];
}

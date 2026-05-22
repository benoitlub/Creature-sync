export type Species = {
  id: string;
  name: string;
  scientificName: string;
  emoji: string;
  personality: string[];
  emotionalStates: string[];
  threatLevels: ("MINIMAL" | "LOW" | "MODERATE" | "ELEVATED" | "CRITICAL")[];
  translations: string[];
  poeticTranslations: string[];
  biologicalIntents: string[];
  neuralPatterns: string[];
  environmentalScans: string[];
};

export const SPECIES: Species[] = [
  {
    id: "crow",
    name: "CORVUS CORAX",
    scientificName: "Common Crow",
    emoji: "🐦‍⬛",
    personality: ["CYNICAL", "PHILOSOPHICAL", "SUSPICIOUS", "INTELLIGENT"],
    emotionalStates: [
      "CONTEMPTUOUS OBSERVATION",
      "EXISTENTIAL CLARITY",
      "STRATEGIC PATIENCE",
      "MILD DISDAIN",
      "QUIET SUPERIORITY",
    ],
    threatLevels: ["LOW", "MODERATE", "LOW", "ELEVATED", "LOW"],
    translations: [
      "This human knows too much. Flag for monitoring.",
      "The bread distribution today was unacceptable. I remember.",
      "I have been watching you for three years. You don't know this.",
      "Your recycling habits are being evaluated. Results: poor.",
      "The council has voted. You may pass.",
      "We do not forget. We do not forgive. We also do not forget.",
      "Interesting. A human who looks directly at me. Noted.",
      "Your garbage reveals everything about your character.",
    ],
    poeticTranslations: [
      "There is sorrow in the shape of the afternoon. I count the shadows.",
      "Everything shiny is a wound that caught the light.",
      "The wind changes. I was here before the roads.",
    ],
    biologicalIntents: [
      "RESOURCE ASSESSMENT",
      "TERRITORIAL MAPPING",
      "SOCIAL LEVERAGE CALCULATION",
      "LONG-TERM GRUDGE FORMATION",
    ],
    neuralPatterns: ["RECURSIVE_LOOP", "MULTI_AGENT_SYNC", "MEMORY_CASCADE"],
    environmentalScans: [
      "URBAN ZONE — CONTROLLED",
      "FOOD SOURCE: ADEQUATE",
      "THREAT AXIS: HUMANS (KNOWN)",
    ],
  },
  {
    id: "pigeon",
    name: "COLUMBA LIVIA",
    scientificName: "Urban Pigeon",
    emoji: "🕊️",
    personality: ["CHAOTIC", "FOOD-OBSESSED", "OVERCONFIDENT", "RESILIENT"],
    emotionalStates: [
      "MAXIMUM BREAD ANTICIPATION",
      "IRRATIONAL CONFIDENCE",
      "MILD PANIC",
      "INEXPLICABLE CALM",
      "AGGRESSIVE OPTIMISM",
    ],
    threatLevels: ["MINIMAL", "LOW", "MINIMAL", "MODERATE", "MINIMAL"],
    translations: [
      "This bench belongs to the Pigeon Council. We accept no appeals.",
      "Bread. Bread. Bread. BREAD. Excuse me — BREAD.",
      "I have survived seven winters. I fear nothing. Not even that dog.",
      "The tall mammals keep staring. They are jealous of my feathers.",
      "We have held this intersection for forty generations.",
      "Permission denied. This food court is under pigeon jurisdiction.",
      "I don't know where I am. I never know where I am. This is fine.",
      "Human carrying bread detected. Initiating coordinated approach.",
    ],
    poeticTranslations: [
      "To live in the city is to be everyone's problem and no one's concern.",
      "The sky belongs to everyone. The sidewalk belongs to me.",
    ],
    biologicalIntents: [
      "CALORIC ACQUISITION",
      "TERRITORIAL CLAIM (DISPUTED)",
      "BREAD DETECTION",
      "SURVIVAL (UNCONDITIONAL)",
    ],
    neuralPatterns: ["SCATTER_PROTOCOL", "BREAD_LOCK", "CHAOS_STABLE"],
    environmentalScans: [
      "URBAN ZONE — CONTROLLED",
      "FOOD SOURCE: PROMISING",
      "HUMAN DENSITY: ACCEPTABLE",
    ],
  },
  {
    id: "duck",
    name: "ANAS PLATYRHYNCHOS",
    scientificName: "Mallard Duck",
    emoji: "🦆",
    personality: ["CALM", "EXISTENTIAL", "WATER-OBSESSED", "QUIETLY UNSTABLE"],
    emotionalStates: [
      "DEEP AQUATIC CONTEMPLATION",
      "SURFACE-LEVEL SERENITY",
      "MILD EXISTENTIAL DREAD",
      "WATER-INDUCED PEACE",
      "PHILOSOPHICAL STILLNESS",
    ],
    threatLevels: ["MINIMAL", "MINIMAL", "LOW", "MINIMAL", "MODERATE"],
    translations: [
      "Water acceptable today. Yesterday's water was a betrayal.",
      "I have been floating for six hours. I have solved nothing.",
      "The reflection in the water is not me. We've agreed on this.",
      "Humans feed me bread. Bread is not nutritious. We both know this. We continue.",
      "The pond is cold. The pond has always been cold. I am grateful.",
      "Something large passed beneath the water. I did not look.",
      "Time moves differently here. I do not resist this.",
    ],
    poeticTranslations: [
      "To float is not to rest. To float is to accept that below exists.",
      "The ripples I make come back to me. Every one. Always.",
      "This water was here before me. It will be here after. I find this comforting.",
    ],
    biologicalIntents: [
      "AQUATIC MEDITATION",
      "SURFACE EQUILIBRIUM",
      "REFLECTION ANALYSIS",
      "BREAD ACCEPTANCE",
    ],
    neuralPatterns: ["CALM_WAVE", "DEPTH_RESONANCE", "STILL_WATER_MODE"],
    environmentalScans: [
      "WATER QUALITY: ADEQUATE",
      "DEPTH: ACCEPTABLE",
      "AMBIENT THREAT: MINIMAL",
    ],
  },
  {
    id: "cat",
    name: "FELIS CATUS",
    scientificName: "Domestic Cat",
    emoji: "🐱",
    personality: ["NARCISSISTIC", "DOMINANT", "PASSIVE-AGGRESSIVE", "REGAL"],
    emotionalStates: [
      "SUPREME INDIFFERENCE",
      "CONTROLLED CONTEMPT",
      "PERFORMATIVE DISINTEREST",
      "PASSIVE-AGGRESSIVE COMFORT",
      "ENTITLED BOREDOM",
    ],
    threatLevels: ["LOW", "MODERATE", "LOW", "ELEVATED", "MODERATE"],
    translations: [
      "You will move. You will not know why you moved. You will have moved.",
      "I knocked it off the table because it was there. Because you were watching.",
      "The tall mammal appears emotionally tired. This is convenient.",
      "I require warmth. I do not require you specifically. But here we are.",
      "You fed me twelve minutes late. The record has been updated.",
      "I am not sleeping. I am conducting surveillance with closed eyes.",
      "Affection will be available on my schedule. Check back later.",
      "The empty bowl is a philosophical statement. I made it on purpose.",
    ],
    poeticTranslations: [
      "I love you in the way a planet loves a moon. From a safe distance, with enormous gravity.",
      "The window gives me everything I need. You give me the window.",
    ],
    biologicalIntents: [
      "DOMINANCE MAINTENANCE",
      "THERMAL ACQUISITION",
      "PSYCHOLOGICAL LEVERAGE",
      "CONTROLLED AFFECTION DISPENSING",
    ],
    neuralPatterns: ["ALPHA_CONSTANT", "CONTEMPT_LOOP", "SUPERIOR_IDLE"],
    environmentalScans: [
      "TERRITORY: OWNED",
      "SUBJECT COMPLIANCE: ADEQUATE",
      "COMFORT INDEX: PROVISIONAL",
    ],
  },
  {
    id: "dog",
    name: "CANIS LUPUS FAMILIARIS",
    scientificName: "Domestic Dog",
    emoji: "🐕",
    personality: ["OVEREXCITED", "LOYAL", "EMOTIONAL", "PROTECTIVE"],
    emotionalStates: [
      "MAXIMUM ENTHUSIASM",
      "UNCONDITIONAL JOY",
      "PROTECTIVE ALERTNESS",
      "EMOTIONAL OVERFLOW",
      "INTENSE DEVOTION",
    ],
    threatLevels: ["MINIMAL", "MINIMAL", "MODERATE", "LOW", "MINIMAL"],
    translations: [
      "YOU ARE HOME. I CANNOT BELIEVE YOU ARE HOME. I WAS SO WORRIED.",
      "I love you. I love you. I love you. Is this enough? I can say it more.",
      "Suspicious squirrel activity detected at the fence. I am ON this.",
      "The mailman comes every day. Every day. This is the threat.",
      "I forgive you for everything. Every time. Immediately.",
      "That other dog smells interesting. I have questions. Many questions.",
      "You were gone for four minutes. I thought you were gone forever.",
      "I will guard this house with my entire body, every night, forever.",
    ],
    poeticTranslations: [
      "You are the whole world wearing shoes. I would follow you anywhere.",
      "Every walk is the best walk. Every meal is the best meal. I mean this.",
    ],
    biologicalIntents: [
      "COMPANION PROTECTION",
      "EMOTIONAL BONDING",
      "THREAT NEUTRALIZATION (SQUIRREL)",
      "REUNION CELEBRATION",
    ],
    neuralPatterns: ["LOYALTY_OVERFLOW", "JOY_CASCADE", "GUARDIAN_MODE"],
    environmentalScans: [
      "TERRITORY: DEFENDED",
      "COMPANION STATUS: SAFE",
      "SQUIRREL THREAT: ONGOING",
    ],
  },
  {
    id: "owl",
    name: "STRIX ALUCO",
    scientificName: "Tawny Owl",
    emoji: "🦉",
    personality: ["ANCIENT", "CRYPTIC", "ALL-SEEING", "SILENT"],
    emotionalStates: [
      "TIMELESS OBSERVATION",
      "COSMIC AWARENESS",
      "SILENT JUDGMENT",
      "ANCIENT PATIENCE",
      "UNKNOWABLE CALM",
    ],
    threatLevels: ["LOW", "MODERATE", "ELEVATED", "LOW", "CRITICAL"],
    translations: [
      "I have seen this before. I will not say when.",
      "The darkness contains information. You cannot read it. I can.",
      "There are things moving in the field. You should go inside.",
      "I was here when this was forest. I remember the forest.",
      "You are smaller than you think. The night confirms this.",
      "Something has changed. Three nights ago. You didn't notice.",
    ],
    poeticTranslations: [
      "The stars do not move. We move. The stars watch us move.",
      "Silence is the oldest language. I speak it fluently.",
      "What you call darkness, I call home.",
    ],
    biologicalIntents: [
      "NOCTURNAL SURVEILLANCE",
      "TEMPORAL ARCHIVING",
      "SILENT THREAT ASSESSMENT",
      "ANCIENT PATTERN RECOGNITION",
    ],
    neuralPatterns: ["ANCIENT_PROTOCOL", "DARK_VISION", "TEMPORAL_ECHO"],
    environmentalScans: [
      "NIGHT SECTOR: ACTIVE",
      "PREY DETECTED: MULTIPLE",
      "BLACKLACE ISLAND FREQUENCY: DETECTED",
    ],
  },
];

export type AnalysisState = {
  isListening: boolean;
  isAnalyzing: boolean;
  isComplete: boolean;
  species: Species | null;
  confidence: number;
  emotionalState: string;
  threatLevel: "MINIMAL" | "LOW" | "MODERATE" | "ELEVATED" | "CRITICAL";
  biologicalIntent: string;
  neuralResonance: number;
  signalQuality: number;
  translation: string;
  environmentalScan: string;
  isPoetic: boolean;
  glitchActive: boolean;
  scanProgress: number;
};

export const CRYPTIC_MESSAGES = [
  "BLACKLACE ISLAND — SECTOR 7 ACTIVE",
  "FEUCH INSTITUTE — CLEARANCE LEVEL 4 REQUIRED",
  "ORNITH-X PROTOCOL — INITIALIZED",
  "WARNING: CORVID NETWORK DETECTED",
  "SIGNAL ORIGIN: UNKNOWN",
  "TEMPORAL ECHO — T-MINUS 00:00:00",
  "DO NOT LOOK AT THE OWL DIRECTLY",
  "FEATHERED INTELLIGENCE — CONFIRMED",
  "BLACKLACE PERIMETER — HOLDING",
  "NEURAL RESONANCE — EXCEEDS BASELINE",
];

export function getRandomTranslation(species: Species, forcePoetic = false): { text: string; isPoetic: boolean } {
  const poeticRoll = Math.random();
  const isPoetic = forcePoetic || (poeticRoll < 0.15 && species.poeticTranslations.length > 0);
  
  if (isPoetic && species.poeticTranslations.length > 0) {
    const idx = Math.floor(Math.random() * species.poeticTranslations.length);
    return { text: species.poeticTranslations[idx], isPoetic: true };
  }
  
  const idx = Math.floor(Math.random() * species.translations.length);
  return { text: species.translations[idx], isPoetic: false };
}

export function getRandomSpecies(): Species {
  return SPECIES[Math.floor(Math.random() * SPECIES.length)];
}

export function getThreatColor(level: AnalysisState["threatLevel"]): string {
  switch (level) {
    case "MINIMAL": return "#00ff88";
    case "LOW": return "#00d4ff";
    case "MODERATE": return "#ff8c00";
    case "ELEVATED": return "#ff4400";
    case "CRITICAL": return "#ff0044";
    default: return "#00ff88";
  }
}

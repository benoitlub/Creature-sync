import type { Species } from "./animals";

function urbanBird(
  id: string,
  name: string,
  fr: string,
  profile: Species["acousticProfile"],
  mood: string,
  intent: string,
  translations: string[],
): Species {
  return {
    id,
    name,
    scientificName: { en: fr, fr, es: fr },
    emoji: "🐦",
    personality: {
      en: ["URBAN EDGE", "FAST SIGNAL", "WINDOWSIDE"],
      fr: ["LISIÈRE URBAINE", "SIGNAL RAPIDE", "FENÊTRE"],
      es: ["BORDE URBANO", "SEÑAL RÁPIDA", "VENTANA"],
    },
    emotionalStates: {
      en: [mood, "NEIGHBORHOOD BROADCAST", "AERIAL COMMENTARY"],
      fr: [mood, "DIFFUSION DE QUARTIER", "COMMENTAIRE AÉRIEN"],
      es: [mood, "DIFUSIÓN DE BARRIO", "COMENTARIO AÉREO"],
    },
    threatLevels: ["MINIMAL", "LOW", "LOW", "MODERATE"],
    translations: { en: translations, fr: translations, es: translations },
    poetic: {
      en: ["The city has branches if you know where to listen."],
      fr: ["La ville a des branches, si l'on sait où écouter."],
      es: ["La ciudad tiene ramas si sabes escuchar."],
    },
    biologicalIntents: {
      en: [intent, "WINDOWSIDE TERRITORY CHECK", "LOCAL SIGNALING"],
      fr: [intent, "CONTRÔLE DU TERRITOIRE DE FENÊTRE", "SIGNAL LOCAL"],
      es: [intent, "CONTROL DE TERRITORIO DE VENTANA", "SEÑAL LOCAL"],
    },
    neuralPatterns: ["WINDOW_ECHO", "URBAN_CANOPY", "FAST_CALL_SYNC"],
    environmentalScans: {
      en: ["HABITAT: URBAN EDGE", "WINDOW REFLECTION: PRESENT", "MIXED BIRD TRAFFIC"],
      fr: ["HABITAT : LISIÈRE URBAINE", "RÉFLEXION DE FENÊTRE : PRÉSENTE", "TRAFIC AVIAIRE MIXTE"],
      es: ["HÁBITAT: BORDE URBANO", "REFLEJO DE VENTANA: PRESENTE", "TRÁFICO AVIAR MIXTO"],
    },
    acousticProfile: profile,
  };
}

export const URBAN_BIRD_SPECIES: Species[] = [
  urbanBird("ring_necked_parakeet", "PSITTACULA KRAMERI", "Perruche à collier", {
    dominantFreqMin: 1800, dominantFreqMax: 7200,
    spectralCentroidMin: 2800, spectralCentroidMax: 9200,
    flatnessMin: 0.12, flatnessMax: 0.62,
    lowEnergyRatioMin: 0.01, lowEnergyRatioMax: 0.28,
    zcrMin: 0.08, zcrMax: 0.38,
    periodicityMin: 0.04, periodicityMax: 0.55,
    rmsMin: 0.004, rmsMax: 0.22,
    description: "Bright harsh fast calls, common urban parakeet signature around Paris",
  }, "EXUBÉRANCE LASER", "DÉCLARATION VERTE DE VOISINAGE", [
    "Je traverse le quartier comme une alarme tropicale en mission.",
    "Le ciel local manque de vert. J'interviens.",
    "Ce balcon est-il comestible ou simplement insultant ?",
  ]),
  urbanBird("nightingale", "LUSCINIA MEGARHYNCHOS", "Rossignol philomèle", {
    dominantFreqMin: 1200, dominantFreqMax: 6500,
    spectralCentroidMin: 1800, spectralCentroidMax: 8200,
    flatnessMin: 0.05, flatnessMax: 0.36,
    lowEnergyRatioMin: 0.03, lowEnergyRatioMax: 0.32,
    zcrMin: 0.04, zcrMax: 0.25,
    periodicityMin: 0.18, periodicityMax: 0.82,
    rmsMin: 0.004, rmsMax: 0.18,
    description: "Complex melodic phrases, whistles and trills, high detail song",
  }, "DRAME MÉLODIQUE", "PERFORMANCE TERRITORIALE NOCTURNE", [
    "J'ai répété cette phrase pendant trois printemps et personne ne m'applaudit.",
    "La nuit comprend mieux que vous, mais vous pouvez rester.",
    "Je transforme une haie ordinaire en opéra administratif.",
  ]),
  urbanBird("house_sparrow", "PASSER DOMESTICUS", "Moineau domestique", {
    dominantFreqMin: 1800, dominantFreqMax: 6200,
    spectralCentroidMin: 2400, spectralCentroidMax: 7600,
    flatnessMin: 0.12, flatnessMax: 0.55,
    lowEnergyRatioMin: 0.02, lowEnergyRatioMax: 0.35,
    zcrMin: 0.06, zcrMax: 0.32,
    periodicityMin: 0.08, periodicityMax: 0.6,
    rmsMin: 0.004, rmsMax: 0.16,
    description: "Short repetitive chirps, common passerine around buildings",
  }, "BAVARDAGE DE GOUTTIÈRE", "COORDINATION DE MICRO-TROUPE", [
    "Réunion de façade confirmée. Ordre du jour : miettes.",
    "Le grand immeuble produit parfois du pain. Nous surveillons.",
    "Je ne crie pas, je participe à l'urbanisme sonore.",
  ]),
];

import type { Species } from "./animals";
import { EXTENDED_SPECIES } from "./extendedSpecies";

type UrbanCopy = {
  en: string;
  es: string;
  moodEn: string;
  moodEs: string;
  intentEn: string;
  intentEs: string;
  translationsEn: string[];
  translationsEs: string[];
};

const URBAN_COPY: Record<string, UrbanCopy> = {
  ring_necked_parakeet: {
    en: "Ring-necked parakeet",
    es: "Cotorra de Kramer",
    moodEn: "LASER EXUBERANCE",
    moodEs: "EXUBERANCIA LÁSER",
    intentEn: "GREEN NEIGHBORHOOD DECLARATION",
    intentEs: "DECLARACIÓN VERDE DE VECINDARIO",
    translationsEn: [
      "I cross the neighborhood like a tropical alarm on a mission.",
      "The local sky lacks green. I am intervening.",
      "Is this balcony edible, or merely insulting?",
    ],
    translationsEs: [
      "Cruzo el barrio como una alarma tropical en misión.",
      "Al cielo local le falta verde. Intervengo.",
      "¿Este balcón es comestible o simplemente insultante?",
    ],
  },
  nightingale: {
    en: "Common nightingale",
    es: "Ruiseñor común",
    moodEn: "MELODIC DRAMA",
    moodEs: "DRAMA MELÓDICO",
    intentEn: "NOCTURNAL TERRITORIAL PERFORMANCE",
    intentEs: "PERFORMANCE TERRITORIAL NOCTURNA",
    translationsEn: [
      "I rehearsed this phrase for three springs and nobody applauds.",
      "The night understands better than you, but you may stay.",
      "I turn an ordinary hedge into administrative opera.",
    ],
    translationsEs: [
      "He ensayado esta frase durante tres primaveras y nadie aplaude.",
      "La noche entiende mejor que tú, pero puedes quedarte.",
      "Transformo un seto cualquiera en ópera administrativa.",
    ],
  },
  house_sparrow: {
    en: "House sparrow",
    es: "Gorrión común",
    moodEn: "GUTTER CHATTER",
    moodEs: "CHARLA DE CANALÓN",
    intentEn: "MICRO-FLOCK COORDINATION",
    intentEs: "COORDINACIÓN DE MICRO-BANDADA",
    translationsEn: [
      "Facade meeting confirmed. Agenda item: crumbs.",
      "The big building sometimes produces bread. We are monitoring it.",
      "I am not shouting, I am contributing to urban sound planning.",
    ],
    translationsEs: [
      "Reunión de fachada confirmada. Orden del día: migas.",
      "El gran edificio a veces produce pan. Lo vigilamos.",
      "No grito, participo en el urbanismo sonoro.",
    ],
  },
  starling: {
    en: "European starling",
    es: "Estornino pinto",
    moodEn: "METALLIC IMPROVISATION",
    moodEs: "IMPROVISACIÓN METÁLICA",
    intentEn: "NEIGHBORHOOD MIMICRY",
    intentEs: "IMITACIÓN DEL BARRIO",
    translationsEn: [
      "I can copy three alarms, a gate and your lack of concentration.",
      "Shiny meeting on the antenna. Human presence tolerated.",
      "That noise? It may have been me. Or your machine. Productive mystery.",
    ],
    translationsEs: [
      "Puedo copiar tres alarmas, una verja y tu falta de concentración.",
      "Reunión brillante en la antena. Presencia humana tolerada.",
      "¿Ese ruido? Tal vez fui yo. O tu máquina. Misterio productivo.",
    ],
  },
  collared_dove: {
    en: "Eurasian collared dove",
    es: "Tórtola turca",
    moodEn: "DIPLOMATIC COOING",
    moodEs: "ARRULLO DIPLOMÁTICO",
    intentEn: "ROOFTOP ANNOUNCEMENT",
    intentEs: "ANUNCIO DE TEJADO",
    translationsEn: [
      "I repeat the same idea because it is excellent.",
      "The roof is calm. I speak slowly.",
      "Local peace requires three syllables and a lot of insistence.",
    ],
    translationsEs: [
      "Repito la misma idea porque es excelente.",
      "El tejado está tranquilo. Hablo despacio.",
      "La paz local requiere tres sílabas y mucha insistencia.",
    ],
  },
  black_redstart: {
    en: "Black redstart",
    es: "Colirrojo tizón",
    moodEn: "CHARCOAL ON ANTENNA",
    moodEs: "CARBÓN EN ANTENA",
    intentEn: "WALL SURVEILLANCE",
    intentEs: "VIGILANCIA DE MUROS",
    translationsEn: [
      "I sing from the zinc roof. It is more dramatic.",
      "The wall has an opinion. I relay it precisely.",
      "Small black bird, major rooftop security service.",
    ],
    translationsEs: [
      "Canto desde el zinc. Es más dramático.",
      "El muro tiene una opinión. La transmito con precisión.",
      "Pájaro negro pequeño, gran servicio de seguridad de los tejados.",
    ],
  },
  swift: {
    en: "Common swift",
    es: "Vencejo común",
    moodEn: "CAPSLOCK SPEED",
    moodEs: "VELOCIDAD EN MAYÚSCULAS",
    intentEn: "AERIAL PATROL",
    intentEs: "PATRULLA AÉREA",
    translationsEn: [
      "I do not land. Problems are on the ground.",
      "Speed confirmed. Gravity will be handled later.",
      "We cross the sky like a living notification.",
    ],
    translationsEs: [
      "No aterrizo. Los problemas están en el suelo.",
      "Velocidad confirmada. La gravedad se tratará más tarde.",
      "Cruzamos el cielo como una notificación viva.",
    ],
  },
  barn_swallow: {
    en: "Barn swallow",
    es: "Golondrina común",
    moodEn: "TALKATIVE ACROBATICS",
    moodEs: "ACROBACIA PARLANCHINA",
    intentEn: "INSECT CARTOGRAPHY",
    intentEs: "CARTOGRAFÍA DE INSECTOS",
    translationsEn: [
      "I draw roads in the air, please do not walk on them.",
      "Insect intercepted. Choreography validated.",
      "The sky is a seating chart and I know every place.",
    ],
    translationsEs: [
      "Dibujo caminos en el aire, por favor no los pises.",
      "Insecto interceptado. Coreografía validada.",
      "El cielo es un plano de mesa y conozco todos los sitios.",
    ],
  },
  kestrel: {
    en: "Common kestrel",
    es: "Cernícalo vulgar",
    moodEn: "RAPTOR LASER",
    moodEs: "LÁSER DE RAPAZ",
    intentEn: "TARGET LOCK",
    intentEs: "BLOQUEO DE OBJETIVO",
    translationsEn: [
      "I hover motionless. You are the one panicking with gravity.",
      "Potential mouse calculated. Human classified as soft obstacle.",
      "The sky has just put a cursor on something.",
    ],
    translationsEs: [
      "Floto inmóvil. Eres tú quien entra en pánico con la gravedad.",
      "Ratón potencial calculado. Humano clasificado como obstáculo blando.",
      "El cielo acaba de poner un cursor sobre algo.",
    ],
  },
};

function urbanBird(
  id: string,
  name: string,
  fr: string,
  profile: Species["acousticProfile"],
  mood: string,
  intent: string,
  translations: string[],
): Species {
  const copy = URBAN_COPY[id];
  return {
    id,
    name,
    scientificName: { en: copy?.en || fr, fr, es: copy?.es || fr },
    emoji: "🐦",
    personality: {
      en: ["URBAN EDGE", "FAST SIGNAL", "WINDOWSIDE"],
      fr: ["LISIÈRE URBAINE", "SIGNAL RAPIDE", "FENÊTRE"],
      es: ["BORDE URBANO", "SEÑAL RÁPIDA", "VENTANA"],
    },
    emotionalStates: {
      en: [copy?.moodEn || mood, "NEIGHBORHOOD BROADCAST", "AERIAL COMMENTARY"],
      fr: [mood, "DIFFUSION DE QUARTIER", "COMMENTAIRE AÉRIEN"],
      es: [copy?.moodEs || mood, "DIFUSIÓN DE BARRIO", "COMENTARIO AÉREO"],
    },
    threatLevels: ["MINIMAL", "LOW", "LOW", "MODERATE"],
    translations: { en: copy?.translationsEn || translations, fr: translations, es: copy?.translationsEs || translations },
    poetic: {
      en: ["The city has branches if you know where to listen."],
      fr: ["La ville a des branches, si l'on sait où écouter."],
      es: ["La ciudad tiene ramas si sabes escuchar."],
    },
    biologicalIntents: {
      en: [copy?.intentEn || intent, "WINDOWSIDE TERRITORY CHECK", "LOCAL SIGNALING"],
      fr: [intent, "CONTRÔLE DU TERRITOIRE DE FENÊTRE", "SIGNAL LOCAL"],
      es: [copy?.intentEs || intent, "CONTROL DE TERRITORIO DE VENTANA", "SEÑAL LOCAL"],
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

const BASE_URBAN_BIRD_SPECIES: Species[] = [
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
  urbanBird("starling", "STURNUS VULGARIS", "Étourneau sansonnet", {
    dominantFreqMin: 900, dominantFreqMax: 6500,
    spectralCentroidMin: 1400, spectralCentroidMax: 7800,
    flatnessMin: 0.18, flatnessMax: 0.72,
    lowEnergyRatioMin: 0.04, lowEnergyRatioMax: 0.48,
    zcrMin: 0.05, zcrMax: 0.36,
    periodicityMin: 0.04, periodicityMax: 0.58,
    rmsMin: 0.006, rmsMax: 0.22,
    description: "Whistles, clicks and mimicry-like urban phrases",
  }, "IMPROVISATION MÉTALLIQUE", "IMITATION DU QUARTIER", [
    "Je peux copier trois alarmes, un portail et votre manque de concentration.",
    "Réunion brillante sur antenne. Présence humaine tolérée.",
    "Ce bruit ? C'était peut-être moi. Ou votre machine. Mystère productif.",
  ]),
  urbanBird("collared_dove", "STREPTOPELIA DECAOCTO", "Tourterelle turque", {
    dominantFreqMin: 220, dominantFreqMax: 1300,
    spectralCentroidMin: 320, spectralCentroidMax: 1700,
    flatnessMin: 0.02, flatnessMax: 0.20,
    lowEnergyRatioMin: 0.48, lowEnergyRatioMax: 0.92,
    zcrMin: 0.01, zcrMax: 0.10,
    periodicityMin: 0.28, periodicityMax: 0.84,
    rmsMin: 0.004, rmsMax: 0.15,
    description: "Soft repeated low cooing, three-part rhythm",
  }, "ROUCOULEMENT DIPLOMATIQUE", "ANNONCE DE TOITURE", [
    "Je répète la même idée parce qu'elle est excellente.",
    "Le toit est calme. Je prends la parole lentement.",
    "La paix locale passe par trois syllabes et beaucoup d'insistance.",
  ]),
  urbanBird("black_redstart", "PHOENICURUS OCHRUROS", "Rougequeue noir", {
    dominantFreqMin: 1600, dominantFreqMax: 7000,
    spectralCentroidMin: 2200, spectralCentroidMax: 8500,
    flatnessMin: 0.08, flatnessMax: 0.48,
    lowEnergyRatioMin: 0.02, lowEnergyRatioMax: 0.30,
    zcrMin: 0.06, zcrMax: 0.32,
    periodicityMin: 0.08, periodicityMax: 0.62,
    rmsMin: 0.004, rmsMax: 0.16,
    description: "Scratchy song and short calls from roofs and walls",
  }, "CHARBON SUR ANTENNE", "SURVEILLANCE DES MURS", [
    "Je chante depuis le zinc. C'est plus dramatique.",
    "Le mur a une opinion. Je la relaie avec précision.",
    "Petit oiseau noir, grand service de sécurité des toits.",
  ]),
  urbanBird("swift", "APUS APUS", "Martinet noir", {
    dominantFreqMin: 1800, dominantFreqMax: 7600,
    spectralCentroidMin: 2600, spectralCentroidMax: 9000,
    flatnessMin: 0.10, flatnessMax: 0.55,
    lowEnergyRatioMin: 0.01, lowEnergyRatioMax: 0.24,
    zcrMin: 0.07, zcrMax: 0.36,
    periodicityMin: 0.03, periodicityMax: 0.42,
    rmsMin: 0.006, rmsMax: 0.20,
    description: "High screaming calls in fast aerial groups",
  }, "VITESSE EN CAPSLOCK", "PATROUILLE AÉRIENNE", [
    "Je ne me pose pas. Les problèmes sont au sol.",
    "Vitesse confirmée. La gravité sera traitée plus tard.",
    "Nous traversons le ciel comme une notification vivante.",
  ]),
  urbanBird("barn_swallow", "HIRUNDO RUSTICA", "Hirondelle rustique", {
    dominantFreqMin: 1500, dominantFreqMax: 7200,
    spectralCentroidMin: 2300, spectralCentroidMax: 8600,
    flatnessMin: 0.06, flatnessMax: 0.44,
    lowEnergyRatioMin: 0.02, lowEnergyRatioMax: 0.28,
    zcrMin: 0.05, zcrMax: 0.30,
    periodicityMin: 0.12, periodicityMax: 0.70,
    rmsMin: 0.004, rmsMax: 0.18,
    description: "Liquid twittering and aerial chatter",
  }, "ACROBATIE BAVARDE", "CARTOGRAPHIE D'INSECTES", [
    "Je dessine des routes dans l'air, merci de ne pas marcher dessus.",
    "Insecte intercepté. Chorégraphie validée.",
    "Le ciel est un plan de table et je connais toutes les places.",
  ]),
  urbanBird("kestrel", "FALCO TINNUNCULUS", "Faucon crécerelle", {
    dominantFreqMin: 1200, dominantFreqMax: 5200,
    spectralCentroidMin: 1800, spectralCentroidMax: 6800,
    flatnessMin: 0.12, flatnessMax: 0.52,
    lowEnergyRatioMin: 0.03, lowEnergyRatioMax: 0.34,
    zcrMin: 0.06, zcrMax: 0.30,
    periodicityMin: 0.04, periodicityMax: 0.46,
    rmsMin: 0.006, rmsMax: 0.22,
    description: "Sharp repeated ki-ki-ki alarm calls, urban raptor",
  }, "LASER DE RAPACE", "VERROUILLAGE DE CIBLE", [
    "Je flotte immobile. C'est vous qui paniquez avec gravité.",
    "Souris potentielle calculée. Humain classé obstacle mou.",
    "Le ciel vient de mettre un curseur sur quelque chose.",
  ]),
];

export const URBAN_BIRD_SPECIES: Species[] = [
  ...BASE_URBAN_BIRD_SPECIES,
  ...EXTENDED_SPECIES,
];

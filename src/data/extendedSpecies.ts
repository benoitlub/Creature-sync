import type { Species } from "./animals";

type Copy = {
  fr: string;
  en: string;
  es: string;
  mood: Record<"fr" | "en" | "es", string>;
  intent: Record<"fr" | "en" | "es", string>;
  translations: Record<"fr" | "en" | "es", string[]>;
  personality: Record<"fr" | "en" | "es", string[]>;
  environment: Record<"fr" | "en" | "es", string[]>;
  patterns: string[];
  emoji: string;
};

function extendedSpecies(id: string, name: string, copy: Copy, profile: Species["acousticProfile"]): Species {
  return {
    id,
    name,
    scientificName: { fr: copy.fr, en: copy.en, es: copy.es },
    emoji: copy.emoji,
    personality: copy.personality,
    emotionalStates: {
      fr: [copy.mood.fr, "SIGNAL CONTEXTUEL", "OBSERVATION PRUDENTE"],
      en: [copy.mood.en, "CONTEXT SIGNAL", "CAUTIOUS OBSERVATION"],
      es: [copy.mood.es, "SEÑAL CONTEXTUAL", "OBSERVACIÓN PRUDENTE"],
    },
    threatLevels: ["MINIMAL", "LOW", "LOW", "MODERATE"],
    translations: copy.translations,
    poetic: {
      fr: ["La trace sonore hésite, mais elle laisse une empreinte."],
      en: ["The sound trace hesitates, but it leaves a footprint."],
      es: ["La huella sonora duda, pero deja una marca."],
    },
    biologicalIntents: {
      fr: [copy.intent.fr, "VALIDATION DU CONTEXTE", "SIGNAL À CONFIRMER"],
      en: [copy.intent.en, "CONTEXT VALIDATION", "SIGNAL TO CONFIRM"],
      es: [copy.intent.es, "VALIDACIÓN DEL CONTEXTO", "SEÑAL POR CONFIRMAR"],
    },
    neuralPatterns: copy.patterns,
    environmentalScans: copy.environment,
    acousticProfile: profile,
  };
}

export const EXTENDED_SPECIES: Species[] = [
  extendedSpecies("dunnock", "PRUNELLA MODULARIS", {
    fr: "Accenteur mouchet",
    en: "Dunnock",
    es: "Acentor común",
    emoji: "🐦",
    personality: {
      fr: ["HAIE", "DISCRET", "SOUS-BOIS"],
      en: ["HEDGE", "DISCREET", "UNDERGROWTH"],
      es: ["SETO", "DISCRETO", "SOTOBOSQUE"],
    },
    mood: { fr: "DISCRÉTION NERVEUSE", en: "NERVOUS DISCRETION", es: "DISCRECIÓN NERVIOSA" },
    intent: { fr: "INSPECTION DE HAIE", en: "HEDGE INSPECTION", es: "INSPECCIÓN DE SETO" },
    translations: {
      fr: ["Je n'étais pas caché. J'étais correctement intégré au décor.", "La haie a parlé doucement. J'ai pris des notes.", "Petit signal, grande prudence."],
      en: ["I was not hiding. I was properly integrated into the scenery.", "The hedge spoke softly. I took notes.", "Small signal, large caution."],
      es: ["No me escondía. Estaba correctamente integrado en el decorado.", "El seto habló en voz baja. Tomé notas.", "Señal pequeña, gran prudencia."],
    },
    environment: {
      fr: ["HABITAT : HAIE / JARDIN", "SIGNAL : DISCRET", "CONTEXTE : SOUS-BOIS BAS"],
      en: ["HABITAT: HEDGE / GARDEN", "SIGNAL: DISCREET", "CONTEXT: LOW UNDERGROWTH"],
      es: ["HÁBITAT: SETO / JARDÍN", "SEÑAL: DISCRETA", "CONTEXTO: SOTOBOSQUE BAJO"],
    },
    patterns: ["HEDGE_LOW_SIGNAL", "DISCREET_PASSERINE", "UNDERGROWTH_TRACE"],
  }, {
    dominantFreqMin: 1400, dominantFreqMax: 6200,
    spectralCentroidMin: 1800, spectralCentroidMax: 7200,
    flatnessMin: 0.08, flatnessMax: 0.42,
    lowEnergyRatioMin: 0.03, lowEnergyRatioMax: 0.38,
    zcrMin: 0.04, zcrMax: 0.24,
    periodicityMin: 0.10, periodicityMax: 0.62,
    rmsMin: 0.003, rmsMax: 0.15,
    description: "Thin hedge passerine song and calls, discreet garden/woodland edge profile",
  }),
  extendedSpecies("eurasian_nuthatch", "SITTA EUROPAEA", {
    fr: "Sittelle torchepot",
    en: "Eurasian nuthatch",
    es: "Trepador azul",
    emoji: "🐦",
    personality: {
      fr: ["TRONC", "CLAQUANT", "VIEIL ARBRE"],
      en: ["TRUNK", "SHARP", "OLD TREE"],
      es: ["TRONCO", "AGUDO", "ÁRBOL VIEJO"],
    },
    mood: { fr: "ASSURANCE VERTICALE", en: "VERTICAL CONFIDENCE", es: "SEGURIDAD VERTICAL" },
    intent: { fr: "CONTRÔLE DU TRONC", en: "TRUNK CONTROL", es: "CONTROL DEL TRONCO" },
    translations: {
      fr: ["Je monte et je descends. La gravité n'est qu'une suggestion.", "Le tronc est sous contrôle strict.", "Je vérifie l'arbre de haut en bas, parce que personne ne le fait correctement."],
      en: ["I go up and down. Gravity is only a suggestion.", "The trunk is under strict control.", "I check the tree from top to bottom because nobody else does it properly."],
      es: ["Subo y bajo. La gravedad es solo una sugerencia.", "El tronco está bajo control estricto.", "Reviso el árbol de arriba abajo porque nadie lo hace bien."],
    },
    environment: {
      fr: ["HABITAT : VIEUX ARBRES", "ÉCHO : TRONC", "SIGNAL : CLAQUANT"],
      en: ["HABITAT: OLD TREES", "ECHO: TRUNK", "SIGNAL: SHARP"],
      es: ["HÁBITAT: ÁRBOLES VIEJOS", "ECO: TRONCO", "SEÑAL: AGUDA"],
    },
    patterns: ["TRUNK_ECHO", "SHARP_TREE_CALL", "VERTICAL_SCAN"],
  }, {
    dominantFreqMin: 1200, dominantFreqMax: 5600,
    spectralCentroidMin: 1800, spectralCentroidMax: 6600,
    flatnessMin: 0.08, flatnessMax: 0.42,
    lowEnergyRatioMin: 0.05, lowEnergyRatioMax: 0.42,
    zcrMin: 0.04, zcrMax: 0.28,
    periodicityMin: 0.12, periodicityMax: 0.70,
    rmsMin: 0.006, rmsMax: 0.20,
    description: "Sharp repeated calls around old trees and trunks",
  }),
  extendedSpecies("short_toed_treecreeper", "CERTHIA BRACHYDACTYLA", {
    fr: "Grimpereau des jardins",
    en: "Short-toed treecreeper",
    es: "Agateador europeo",
    emoji: "🐦",
    personality: {
      fr: ["ÉCORCE", "FIN", "SPIRALE"],
      en: ["BARK", "THIN", "SPIRAL"],
      es: ["CORTEZA", "FINO", "ESPIRAL"],
    },
    mood: { fr: "ASCENSION MINUSCULE", en: "TINY ASCENT", es: "ASCENSO MINÚSCULO" },
    intent: { fr: "LECTURE DE L'ÉCORCE", en: "BARK READING", es: "LECTURA DE CORTEZA" },
    translations: {
      fr: ["Je lis l'arbre en diagonale.", "L'écorce contient des messages minuscules.", "Mon itinéraire est vertical, mais mes affaires sont discrètes."],
      en: ["I read the tree diagonally.", "The bark contains tiny messages.", "My route is vertical, but my business is discreet."],
      es: ["Leo el árbol en diagonal.", "La corteza contiene mensajes minúsculos.", "Mi ruta es vertical, pero mis asuntos son discretos."],
    },
    environment: {
      fr: ["HABITAT : ÉCORCE / JARDIN", "SIGNAL : FIN", "CONTEXTE : VIEUX TRONCS"],
      en: ["HABITAT: BARK / GARDEN", "SIGNAL: THIN", "CONTEXT: OLD TRUNKS"],
      es: ["HÁBITAT: CORTEZA / JARDÍN", "SEÑAL: FINA", "CONTEXTO: TRONCOS VIEJOS"],
    },
    patterns: ["BARK_TRACE", "THIN_ASCENT", "TREECREEPER_SCAN"],
  }, {
    dominantFreqMin: 3000, dominantFreqMax: 9000,
    spectralCentroidMin: 3600, spectralCentroidMax: 10000,
    flatnessMin: 0.06, flatnessMax: 0.38,
    lowEnergyRatioMin: 0.00, lowEnergyRatioMax: 0.22,
    zcrMin: 0.07, zcrMax: 0.34,
    periodicityMin: 0.08, periodicityMax: 0.58,
    rmsMin: 0.002, rmsMax: 0.12,
    description: "Very thin high calls and song, bark/trunk micro-signal",
  }),
  extendedSpecies("white_wagtail", "MOTACILLA ALBA", {
    fr: "Bergeronnette grise",
    en: "White wagtail",
    es: "Lavandera blanca",
    emoji: "🐦",
    personality: {
      fr: ["SOL", "QUEUE ACTIVE", "BORD D'EAU"],
      en: ["GROUND", "ACTIVE TAIL", "WATER EDGE"],
      es: ["SUELO", "COLA ACTIVA", "ORILLA"],
    },
    mood: { fr: "INSPECTION DU SOL", en: "GROUND INSPECTION", es: "INSPECCIÓN DEL SUELO" },
    intent: { fr: "PATROUILLE DU BORD", en: "EDGE PATROL", es: "PATRULLA DEL BORDE" },
    translations: {
      fr: ["Le sol bouge. Je mène l'enquête avec la queue.", "Je vérifie les bords, les flaques et les humains trop lents.", "Petit pas rapide, verdict rapide."],
      en: ["The ground is moving. I investigate with my tail.", "I check edges, puddles and humans that move too slowly.", "Quick little step, quick verdict."],
      es: ["El suelo se mueve. Investigo con la cola.", "Reviso bordes, charcos y humanos demasiado lentos.", "Pasito rápido, veredicto rápido."],
    },
    environment: {
      fr: ["HABITAT : SOL / BORD D'EAU", "SIGNAL : BREF", "CONTEXTE : OUVERT"],
      en: ["HABITAT: GROUND / WATER EDGE", "SIGNAL: SHORT", "CONTEXT: OPEN"],
      es: ["HÁBITAT: SUELO / ORILLA", "SEÑAL: BREVE", "CONTEXTO: ABIERTO"],
    },
    patterns: ["GROUND_EDGE", "SHORT_CALL", "WAGTAIL_TRACE"],
  }, {
    dominantFreqMin: 1600, dominantFreqMax: 7200,
    spectralCentroidMin: 2400, spectralCentroidMax: 8600,
    flatnessMin: 0.08, flatnessMax: 0.50,
    lowEnergyRatioMin: 0.01, lowEnergyRatioMax: 0.30,
    zcrMin: 0.06, zcrMax: 0.34,
    periodicityMin: 0.04, periodicityMax: 0.48,
    rmsMin: 0.004, rmsMax: 0.18,
    description: "Short high calls from open ground and water edges",
  }),
  extendedSpecies("song_thrush", "TURDUS PHILOMELOS", {
    fr: "Grive musicienne",
    en: "Song thrush",
    es: "Zorzal común",
    emoji: "🐦‍⬛",
    personality: {
      fr: ["CHANT", "RÉPÉTITION", "SOUS-BOIS"],
      en: ["SONG", "REPETITION", "UNDERGROWTH"],
      es: ["CANTO", "REPETICIÓN", "SOTOBOSQUE"],
    },
    mood: { fr: "OBSTINATION MÉLODIQUE", en: "MELODIC STUBBORNNESS", es: "TERQUEDAD MELÓDICA" },
    intent: { fr: "PHRASE RÉPÉTÉE", en: "REPEATED PHRASE", es: "FRASE REPETIDA" },
    translations: {
      fr: ["Je répète parce que la phrase est excellente.", "Chaque motif mérite une seconde chance. Puis une troisième.", "Le bois demande une démonstration claire."],
      en: ["I repeat because the phrase is excellent.", "Every motif deserves a second chance. Then a third.", "The woods require a clear demonstration."],
      es: ["Repito porque la frase es excelente.", "Cada motivo merece una segunda oportunidad. Luego una tercera.", "El bosque exige una demostración clara."],
    },
    environment: {
      fr: ["HABITAT : SOUS-BOIS", "SIGNAL : RÉPÉTÉ", "CONTEXTE : CHANT CLAIR"],
      en: ["HABITAT: UNDERGROWTH", "SIGNAL: REPEATED", "CONTEXT: CLEAR SONG"],
      es: ["HÁBITAT: SOTOBOSQUE", "SEÑAL: REPETIDA", "CONTEXTO: CANTO CLARO"],
    },
    patterns: ["REPEATED_PHRASE", "THRUSH_SONG", "WOODLAND_MOTIF"],
  }, {
    dominantFreqMin: 1200, dominantFreqMax: 6200,
    spectralCentroidMin: 1700, spectralCentroidMax: 7600,
    flatnessMin: 0.04, flatnessMax: 0.34,
    lowEnergyRatioMin: 0.04, lowEnergyRatioMax: 0.38,
    zcrMin: 0.035, zcrMax: 0.24,
    periodicityMin: 0.22, periodicityMax: 0.86,
    rmsMin: 0.006, rmsMax: 0.20,
    description: "Repeated melodic thrush phrases, strong woodland song",
  }),
  extendedSpecies("blackcap", "SYLVIA ATRICAPILLA", {
    fr: "Fauvette à tête noire",
    en: "Blackcap",
    es: "Curruca capirotada",
    emoji: "🐦",
    personality: {
      fr: ["BUISSON", "FLÛTE", "PRINTEMPS"],
      en: ["BUSH", "FLUTE", "SPRING"],
      es: ["ARBUSTO", "FLAUTA", "PRIMAVERA"],
    },
    mood: { fr: "FLÛTE DE BUISSON", en: "BUSH FLUTE", es: "FLAUTA DE ARBUSTO" },
    intent: { fr: "CHANT DE COUVERT", en: "COVER SONG", es: "CANTO DE COBERTURA" },
    translations: {
      fr: ["Je chante depuis le couvert. C'est plus élégant.", "Le buisson me prête une scène et une acoustique.", "Le printemps est un micro ouvert."],
      en: ["I sing from cover. It is more elegant.", "The bush lends me a stage and acoustics.", "Spring is an open microphone."],
      es: ["Canto desde la cobertura. Es más elegante.", "El arbusto me presta escenario y acústica.", "La primavera es un micrófono abierto."],
    },
    environment: {
      fr: ["HABITAT : BUISSON / HAIE", "SIGNAL : FLÛTÉ", "CONTEXTE : COUVERT"],
      en: ["HABITAT: BUSH / HEDGE", "SIGNAL: FLUTED", "CONTEXT: COVER"],
      es: ["HÁBITAT: ARBUSTO / SETO", "SEÑAL: AFlautada", "CONTEXTO: COBERTURA"],
    },
    patterns: ["BUSH_FLUTE", "BLACKCAP_PHRASE", "HEDGE_SONG"],
  }, {
    dominantFreqMin: 1600, dominantFreqMax: 7600,
    spectralCentroidMin: 2200, spectralCentroidMax: 8800,
    flatnessMin: 0.04, flatnessMax: 0.36,
    lowEnergyRatioMin: 0.02, lowEnergyRatioMax: 0.32,
    zcrMin: 0.04, zcrMax: 0.26,
    periodicityMin: 0.12, periodicityMax: 0.76,
    rmsMin: 0.004, rmsMax: 0.17,
    description: "Fluted warbler song from hedges and shrubs",
  }),
  extendedSpecies("tawny_owl", "STRIX ALUCO", {
    fr: "Chouette hulotte",
    en: "Tawny owl",
    es: "Cárabo común",
    emoji: "🦉",
    personality: {
      fr: ["NUIT", "HOU-HOU", "LISIÈRE"],
      en: ["NIGHT", "HOO-HOO", "EDGE"],
      es: ["NOCHE", "UU-UU", "BORDE"],
    },
    mood: { fr: "AUTORITÉ NOCTURNE", en: "NOCTURNAL AUTHORITY", es: "AUTORIDAD NOCTURNA" },
    intent: { fr: "APPEL TERRITORIAL NOCTURNE", en: "NOCTURNAL TERRITORIAL CALL", es: "LLAMADA TERRITORIAL NOCTURNA" },
    translations: {
      fr: ["La nuit a validé mon timbre.", "Je ne crie pas, j'administre l'obscurité.", "Les arbres savent où je suis. Vous, moins."],
      en: ["The night has approved my tone.", "I am not shouting; I administer the dark.", "The trees know where I am. You, less so."],
      es: ["La noche ha aprobado mi tono.", "No grito; administro la oscuridad.", "Los árboles saben dónde estoy. Tú, menos."],
    },
    environment: {
      fr: ["HABITAT : NUIT / BOIS", "SIGNAL : GRAVE", "CONTEXTE : RAPACE NOCTURNE"],
      en: ["HABITAT: NIGHT / WOODS", "SIGNAL: LOW", "CONTEXT: NOCTURNAL RAPTOR"],
      es: ["HÁBITAT: NOCHE / BOSQUE", "SEÑAL: GRAVE", "CONTEXTO: RAPAZ NOCTURNA"],
    },
    patterns: ["NOCTURNAL_LOW_CALL", "OWL_HOOT", "NIGHT_CONTEXT"],
  }, {
    dominantFreqMin: 250, dominantFreqMax: 1800,
    spectralCentroidMin: 350, spectralCentroidMax: 2600,
    flatnessMin: 0.02, flatnessMax: 0.24,
    lowEnergyRatioMin: 0.35, lowEnergyRatioMax: 0.92,
    zcrMin: 0.005, zcrMax: 0.10,
    periodicityMin: 0.16, periodicityMax: 0.78,
    rmsMin: 0.006, rmsMax: 0.24,
    description: "Low nocturnal hoots and owl-like calls",
  }),
  extendedSpecies("red_fox", "VULPES VULPES", {
    fr: "Renard roux",
    en: "Red fox",
    es: "Zorro rojo",
    emoji: "🦊",
    personality: {
      fr: ["NUIT", "GLAPISSEMENT", "LISIÈRE"],
      en: ["NIGHT", "SCREAM", "EDGE"],
      es: ["NOCHE", "GRITO", "BORDE"],
    },
    mood: { fr: "DRAME DE LISIÈRE", en: "EDGE DRAMA", es: "DRAMA DE BORDE" },
    intent: { fr: "APPEL NOCTURNE", en: "NOCTURNAL CALL", es: "LLAMADA NOCTURNA" },
    translations: {
      fr: ["Non, ce n'était pas un humain. C'était pire : moi.", "La nuit dramatise mon message, je n'y peux rien.", "Je passe, je crie un peu, je disparais correctement."],
      en: ["No, that was not a human. Worse: it was me.", "The night dramatizes my message. I cannot help it.", "I pass by, scream a little, and disappear properly."],
      es: ["No, no era un humano. Peor: era yo.", "La noche dramatiza mi mensaje. No puedo evitarlo.", "Paso, grito un poco y desaparezco correctamente."],
    },
    environment: {
      fr: ["HABITAT : NUIT / LISIÈRE", "SIGNAL : CRI", "CONTEXTE : MAMMIFÈRE NOCTURNE"],
      en: ["HABITAT: NIGHT / EDGE", "SIGNAL: SCREAM", "CONTEXT: NOCTURNAL MAMMAL"],
      es: ["HÁBITAT: NOCHE / BORDE", "SEÑAL: GRITO", "CONTEXTO: MAMÍFERO NOCTURNO"],
    },
    patterns: ["FOX_SCREAM", "NOCTURNAL_MAMMAL", "EDGE_CALL"],
  }, {
    dominantFreqMin: 500, dominantFreqMax: 5200,
    spectralCentroidMin: 900, spectralCentroidMax: 7200,
    flatnessMin: 0.12, flatnessMax: 0.70,
    lowEnergyRatioMin: 0.08, lowEnergyRatioMax: 0.62,
    zcrMin: 0.04, zcrMax: 0.34,
    periodicityMin: 0.02, periodicityMax: 0.42,
    rmsMin: 0.010, rmsMax: 0.35,
    description: "Nocturnal fox screams, barks and yelps; broad harsh mammal profile",
  }),
  extendedSpecies("hedgehog", "ERINACEUS EUROPAEUS", {
    fr: "Hérisson commun",
    en: "European hedgehog",
    es: "Erizo europeo",
    emoji: "🦔",
    personality: {
      fr: ["NUIT", "FROTTEMENT", "JARDIN"],
      en: ["NIGHT", "RUSTLE", "GARDEN"],
      es: ["NOCHE", "ROCE", "JARDÍN"],
    },
    mood: { fr: "PETIT VACARME", en: "SMALL RACKET", es: "PEQUEÑO ALBOROTO" },
    intent: { fr: "DÉPLACEMENT NOCTURNE", en: "NOCTURNAL MOVEMENT", es: "DESPLAZAMIENTO NOCTURNO" },
    translations: {
      fr: ["Je ne chante pas. Je froisse le monde lentement.", "Un buisson a bougé ? Probablement ma logistique.", "Le jardin produit une petite boule d'activité."],
      en: ["I do not sing. I crumple the world slowly.", "Did a bush move? Probably my logistics.", "The garden produces a small ball of activity."],
      es: ["No canto. Arrugo el mundo lentamente.", "¿Se movió un arbusto? Probablemente mi logística.", "El jardín produce una pequeña bola de actividad."],
    },
    environment: {
      fr: ["HABITAT : JARDIN NOCTURNE", "SIGNAL : FROTTEMENT", "CONTEXTE : MOUVEMENT AU SOL"],
      en: ["HABITAT: NIGHT GARDEN", "SIGNAL: RUSTLE", "CONTEXT: GROUND MOVEMENT"],
      es: ["HÁBITAT: JARDÍN NOCTURNO", "SEÑAL: ROCE", "CONTEXTO: MOVIMIENTO EN SUELO"],
    },
    patterns: ["GROUND_RUSTLE", "NOCTURNAL_GARDEN", "MAMMAL_MOVEMENT"],
  }, {
    dominantFreqMin: 120, dominantFreqMax: 2500,
    spectralCentroidMin: 250, spectralCentroidMax: 4200,
    flatnessMin: 0.22, flatnessMax: 0.86,
    lowEnergyRatioMin: 0.28, lowEnergyRatioMax: 0.92,
    zcrMin: 0.02, zcrMax: 0.22,
    periodicityMin: 0.01, periodicityMax: 0.26,
    rmsMin: 0.004, rmsMax: 0.24,
    description: "Low noisy nocturnal rustles, sniffles and ground movement, not a vocal song",
  }),
  extendedSpecies("beech_marten", "MARTES FOINA", {
    fr: "Fouine",
    en: "Beech marten",
    es: "Garduña",
    emoji: "🦡",
    personality: {
      fr: ["NUIT", "GRENIER", "GRATTEMENT"],
      en: ["NIGHT", "ATTIC", "SCRATCHING"],
      es: ["NOCHE", "DESVÁN", "RASGUÑO"],
    },
    mood: { fr: "DÉMÉNAGEMENT SUSPECT", en: "SUSPICIOUS MOVING", es: "MUDANZA SOSPECHOSA" },
    intent: { fr: "EXPLORATION DE TOITURE", en: "ROOF EXPLORATION", es: "EXPLORACIÓN DE TEJADO" },
    translations: {
      fr: ["Je ne suis pas un fantôme. Je suis un problème avec des pattes.", "Le plafond a des opinions. Je les déplace.", "Exploration nocturne en cours, merci de rester inquiet."],
      en: ["I am not a ghost. I am a problem with paws.", "The ceiling has opinions. I move them around.", "Nocturnal exploration in progress; please remain concerned."],
      es: ["No soy un fantasma. Soy un problema con patas.", "El techo tiene opiniones. Las desplazo.", "Exploración nocturna en curso; mantente preocupado."],
    },
    environment: {
      fr: ["HABITAT : TOIT / GRENIER", "SIGNAL : CHOCS / GRIFFES", "CONTEXTE : NUIT INTÉRIEURE"],
      en: ["HABITAT: ROOF / ATTIC", "SIGNAL: BUMPS / CLAWS", "CONTEXT: INDOOR NIGHT"],
      es: ["HÁBITAT: TEJADO / DESVÁN", "SEÑAL: GOLPES / GARRAS", "CONTEXTO: NOCHE INTERIOR"],
    },
    patterns: ["ATTIC_SCRATCH", "NOCTURNAL_INDOOR", "MARTEN_MOVEMENT"],
  }, {
    dominantFreqMin: 100, dominantFreqMax: 3600,
    spectralCentroidMin: 220, spectralCentroidMax: 5200,
    flatnessMin: 0.24, flatnessMax: 0.88,
    lowEnergyRatioMin: 0.24, lowEnergyRatioMax: 0.88,
    zcrMin: 0.02, zcrMax: 0.28,
    periodicityMin: 0.01, periodicityMax: 0.30,
    rmsMin: 0.006, rmsMax: 0.35,
    description: "Indoor nocturnal scratching, bumps and movement, broad marten-like non-song profile",
  }),
];

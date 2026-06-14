import type { Species } from "./animals";

type ForestCopy = {
  en: string;
  es: string;
  moodEn: string;
  moodEs: string;
  intentEn: string;
  intentEs: string;
  translationsEn: string[];
  translationsEs: string[];
};

const FOREST_COPY: Record<string, ForestCopy> = {
  blackbird: {
    en: "Common blackbird",
    es: "Mirlo común",
    moodEn: "TERRITORIAL LYRICISM",
    moodEs: "LIRISMO TERRITORIAL",
    intentEn: "HEDGE OWNERSHIP NOTICE",
    intentEs: "DECLARACIÓN DE PROPIEDAD DEL SETO",
    translationsEn: [
      "This branch is officially entered in my personal registry.",
      "The biped is passing through. I note its lack of discretion.",
      "I sing, therefore this clearing temporarily belongs to me.",
    ],
    translationsEs: [
      "Esta rama queda oficialmente inscrita en mi registro personal.",
      "El bípedo pasa. Anoto su falta de discreción.",
      "Canto, luego este claro me pertenece provisionalmente.",
    ],
  },
  robin: {
    en: "European robin",
    es: "Petirrojo europeo",
    moodEn: "MINIATURE COURAGE",
    moodEs: "CORAJE MINIATURA",
    intentEn: "CLAIMING A TINY TERRITORY",
    intentEs: "RECLAMACIÓN DE TERRITORIO MINÚSCULO",
    translationsEn: [
      "I am small, but legally terrifying.",
      "This path is monitored by an orange authority.",
      "Come a little closer and I become administrative.",
    ],
    translationsEs: [
      "Soy pequeño, pero jurídicamente temible.",
      "Este sendero está vigilado por una autoridad naranja.",
      "Acércate un poco más y me vuelvo administrativo.",
    ],
  },
  great_tit: {
    en: "Great tit",
    es: "Carbonero común",
    moodEn: "SHARP INSISTENCE",
    moodEs: "INSISTENCIA AGUDA",
    intentEn: "BRANCH COORDINATION",
    intentEs: "COORDINACIÓN DE RAMA",
    translationsEn: [
      "Everyone needs to know I am here. Several times.",
      "Message repeated for the slow mammals in the sector.",
      "I have important information. Mostly that I exist.",
    ],
    translationsEs: [
      "Todo el mundo debe saber que estoy aquí. Varias veces.",
      "Mensaje repetido para los mamíferos lentos del sector.",
      "Tengo una información importante. Sobre todo que existo.",
    ],
  },
  blue_tit: {
    en: "Blue tit",
    es: "Herrerillo común",
    moodEn: "BRIGHT AGITATION",
    moodEs: "AGITACIÓN LUMINOSA",
    intentEn: "MICRO-BRANCH INSPECTION",
    intentEs: "INSPECCIÓN DE MICRO-RAMAS",
    translationsEn: [
      "I am checking eight things at once and none of them concern you.",
      "The world is too slow. I am accelerating locally.",
      "Small size, large logistics.",
    ],
    translationsEs: [
      "Compruebo ocho cosas a la vez y ninguna te concierne.",
      "El mundo es demasiado lento. Acelero localmente.",
      "Tamaño pequeño, gran logística.",
    ],
  },
  chaffinch: {
    en: "Common chaffinch",
    es: "Pinzón vulgar",
    moodEn: "METHODICAL OPTIMISM",
    moodEs: "OPTIMISMO METÓDICO",
    intentEn: "SPRING DECLARATION",
    intentEs: "DECLARACIÓN DE PRIMAVERA",
    translationsEn: [
      "The morning protocol has begun. Please follow the rhythm.",
      "I announce the weather, love and my approximate position.",
      "Repetition number twelve: still impeccable.",
    ],
    translationsEs: [
      "El protocolo de la mañana ha empezado. Sigue el ritmo, por favor.",
      "Anuncio el tiempo, el amor y mi posición aproximada.",
      "Repetición número doce: aún impecable.",
    ],
  },
  wren: {
    en: "Eurasian wren",
    es: "Chochín común",
    moodEn: "MINIATURE INTENSITY",
    moodEs: "INTENSIDAD MINIATURA",
    intentEn: "AMPLIFYING A TINY PRESENCE",
    intentEs: "AMPLIFICACIÓN DE UNA PRESENCIA MINÚSCULA",
    translationsEn: [
      "I am tiny, so I use the maximum legal volume.",
      "The moss is mine. The trunk too. We will discuss the rest.",
      "Never underestimate a ball of nerves with a beak.",
    ],
    translationsEs: [
      "Soy minúsculo, así que uso el volumen máximo reglamentario.",
      "El musgo es mío. El tronco también. Ya veremos el resto.",
      "Nunca subestimes una bola de nervios con pico.",
    ],
  },
  jay: {
    en: "Eurasian jay",
    es: "Arrendajo euroasiático",
    moodEn: "THEATRICAL ALARM",
    moodEs: "ALARMA TEATRAL",
    intentEn: "OAK SURVEILLANCE",
    intentEs: "VIGILANCIA DE ROBLES",
    translationsEn: [
      "Intruder reported. Possibly dangerous. Possibly just badly groomed.",
      "I am transmitting the information to the higher oaks.",
      "Acorns are counted. Humans too.",
    ],
    translationsEs: [
      "Intruso señalado. Quizá peligroso. Quizá solo mal peinado.",
      "Transmito la información a los robles superiores.",
      "Las bellotas están contadas. Los humanos también.",
    ],
  },
  magpie: {
    en: "Eurasian magpie",
    es: "Urraca común",
    moodEn: "STRATEGIC CHATTER",
    moodEs: "CHARLA ESTRATÉGICA",
    intentEn: "SHINY OBJECT INVENTORY",
    intentEs: "INVENTARIO DE OBJETOS BRILLANTES",
    translationsEn: [
      "I stole nothing. I am reorganizing the light.",
      "Shiny object detected. Diplomatic approach considered.",
      "Conversation in progress with myself. I am winning.",
    ],
    translationsEs: [
      "No he robado nada. Estoy reorganizando la luz.",
      "Objeto brillante detectado. Se contempla un enfoque diplomático.",
      "Conversación en curso conmigo misma. Voy ganando.",
    ],
  },
  carrion_crow: {
    en: "Carrion crow",
    es: "Corneja negra",
    moodEn: "CORVID AUTHORITY",
    moodEs: "AUTORIDAD CÓRVIDA",
    intentEn: "BIPED ASSESSMENT",
    intentEs: "EVALUACIÓN DEL BÍPEDO",
    translationsEn: [
      "The biped is tolerated. For now.",
      "This sector is under black administration.",
      "I am consulting the council. Do not move too much.",
    ],
    translationsEs: [
      "El bípedo queda tolerado. Por ahora.",
      "Este sector está bajo administración negra.",
      "Consulto al consejo. No se muevan demasiado.",
    ],
  },
  wood_pigeon: {
    en: "Common wood pigeon",
    es: "Paloma torcaz",
    moodEn: "PLUMP GRAVITY",
    moodEs: "GRAVEDAD RELLENITA",
    intentEn: "COMFORTABLE BRANCH ANNOUNCEMENT",
    intentEs: "ANUNCIO DE RAMA CÓMODA",
    translationsEn: [
      "This branch accepts my weight with dignity.",
      "I repeat a simple sentence because it is perfect.",
      "Peace means cooing louder than the problems.",
    ],
    translationsEs: [
      "Esta rama acepta mi peso con dignidad.",
      "Repito una frase sencilla porque es perfecta.",
      "La paz consiste en arrullar más fuerte que los problemas.",
    ],
  },
  green_woodpecker: {
    en: "European green woodpecker",
    es: "Pito real europeo",
    moodEn: "UNDERGROWTH LAUGHTER",
    moodEs: "RISA DE SOTOBOSQUE",
    intentEn: "ANT PROSPECTION",
    intentEs: "PROSPECCIÓN DE HORMIGAS",
    translationsEn: [
      "I laugh because the lawn knows things.",
      "Ants probable. Dignity optional.",
      "The trunk confirms it: edible secrets are present.",
    ],
    translationsEs: [
      "Me río porque el césped sabe cosas.",
      "Hormigas probables. Dignidad opcional.",
      "El tronco confirma: hay secretos comestibles.",
    ],
  },
  great_spotted_woodpecker: {
    en: "Great spotted woodpecker",
    es: "Pico picapinos",
    moodEn: "TERRITORIAL PERCUSSION",
    moodEs: "PERCUSIÓN TERRITORIAL",
    intentEn: "TRUNK RESONANCE TEST",
    intentEs: "PRUEBA DE RESONANCIA DEL TRONCO",
    translationsEn: [
      "The wood answers. The conversation is satisfying.",
      "I drum to check the architecture of the world.",
      "Vertical signal confirmed in trunk number three.",
    ],
    translationsEs: [
      "La madera responde. La conversación es satisfactoria.",
      "Golpeo para comprobar la arquitectura del mundo.",
      "Señal vertical confirmada en el tronco número tres.",
    ],
  },
};

function bird(
  id: string,
  name: string,
  fr: string,
  profile: Species["acousticProfile"],
  mood: string,
  intent: string,
  translations: string[],
): Species {
  const copy = FOREST_COPY[id];
  return {
    id,
    name,
    scientificName: { en: copy?.en || fr, fr, es: copy?.es || fr },
    emoji: "🐦",
    personality: {
      en: ["WOODLAND", "ALERT", "FIELD LOG"],
      fr: ["FORESTIER", "VIF", "JOURNAL TERRAIN"],
      es: ["FORESTAL", "ALERTA", "REGISTRO"],
    },
    emotionalStates: {
      en: [copy?.moodEn || mood, "TERRITORIAL SIGNAL", "DISCREET OBSERVATION"],
      fr: [mood, "SIGNAL TERRITORIAL", "OBSERVATION DISCRÈTE"],
      es: [copy?.moodEs || mood, "SEÑAL TERRITORIAL", "OBSERVACIÓN DISCRETA"],
    },
    threatLevels: ["MINIMAL", "LOW", "LOW", "MODERATE"],
    translations: { en: copy?.translationsEn || translations, fr: translations, es: copy?.translationsEs || translations },
    poetic: {
      en: ["The forest repeats my name until the light believes it."],
      fr: ["La forêt répète mon nom jusqu'à ce que la lumière y croie."],
      es: ["El bosque repite mi nombre hasta que la luz lo crea."],
    },
    biologicalIntents: {
      en: [copy?.intentEn || intent, "WOODLAND PERIMETER CHECK", "SOCIAL SIGNAL"],
      fr: [intent, "CONTRÔLE DU PÉRIMÈTRE FORESTIER", "SIGNAL SOCIAL"],
      es: [copy?.intentEs || intent, "CONTROL DEL PERÍMETRO FORESTAL", "SEÑAL SOCIAL"],
    },
    neuralPatterns: ["FOREST_ECHO", "BRANCH_SYNC", "TERRITORY_PULSE"],
    environmentalScans: {
      en: ["HABITAT: TEMPERATE FOREST", "CANOPY ECHO: ACTIVE", "HUMAN NOISE: FILTERED"],
      fr: ["HABITAT : FORÊT TEMPÉRÉE", "ÉCHO DE CANOPÉE : ACTIF", "BRUIT HUMAIN : FILTRÉ"],
      es: ["HÁBITAT: BOSQUE TEMPLADO", "ECO DE DOSEL: ACTIVO", "RUIDO HUMANO: FILTRADO"],
    },
    acousticProfile: profile,
  };
}

export const FOREST_SPECIES: Species[] = [
  bird("blackbird", "TURDUS MERULA", "Merle noir", {
    dominantFreqMin: 1500, dominantFreqMax: 4200,
    spectralCentroidMin: 1800, spectralCentroidMax: 5600,
    flatnessMin: 0.04, flatnessMax: 0.28,
    lowEnergyRatioMin: 0.05, lowEnergyRatioMax: 0.38,
    zcrMin: 0.035, zcrMax: 0.18,
    periodicityMin: 0.18, periodicityMax: 0.72,
    rmsMin: 0.006, rmsMax: 0.18,
    description: "Rich melodic whistles, common in French woodland",
  }, "LYRISME TERRITORIAL", "ANNONCE DE PROPRIÉTÉ DE HAIE", [
    "Cette branche est officiellement inscrite à mon registre personnel.",
    "Le bipède passe. Je note son manque de discrétion.",
    "Je chante, donc cette clairière m'appartient provisoirement.",
  ]),
  bird("robin", "ERITHACUS RUBECULA", "Rouge-gorge familier", {
    dominantFreqMin: 1800, dominantFreqMax: 5200,
    spectralCentroidMin: 2200, spectralCentroidMax: 6500,
    flatnessMin: 0.05, flatnessMax: 0.35,
    lowEnergyRatioMin: 0.03, lowEnergyRatioMax: 0.32,
    zcrMin: 0.04, zcrMax: 0.22,
    periodicityMin: 0.12, periodicityMax: 0.62,
    rmsMin: 0.004, rmsMax: 0.16,
    description: "Thin high melodic phrases",
  }, "COURAGE MINIATURE", "REVENDICATION DE TERRITOIRE MINUSCULE", [
    "Je suis petit, mais juridiquement redoutable.",
    "Ce sentier est surveillé par une autorité orange.",
    "Approche encore un peu et je deviens administratif.",
  ]),
  bird("great_tit", "PARUS MAJOR", "Mésange charbonnière", {
    dominantFreqMin: 2200, dominantFreqMax: 6500,
    spectralCentroidMin: 2800, spectralCentroidMax: 7600,
    flatnessMin: 0.08, flatnessMax: 0.42,
    lowEnergyRatioMin: 0.02, lowEnergyRatioMax: 0.28,
    zcrMin: 0.06, zcrMax: 0.28,
    periodicityMin: 0.2, periodicityMax: 0.75,
    rmsMin: 0.004, rmsMax: 0.15,
    description: "Clear repeated high calls",
  }, "INSISTANCE AIGUË", "COORDINATION DE BRANCHE", [
    "Tout le monde doit savoir que je suis ici. Plusieurs fois.",
    "Message répété pour les mammifères lents du secteur.",
    "Je dispose d'une information importante. C'est surtout mon existence.",
  ]),
  bird("blue_tit", "CYANISTES CAERULEUS", "Mésange bleue", {
    dominantFreqMin: 3000, dominantFreqMax: 8000,
    spectralCentroidMin: 3600, spectralCentroidMax: 9000,
    flatnessMin: 0.08, flatnessMax: 0.48,
    lowEnergyRatioMin: 0.01, lowEnergyRatioMax: 0.22,
    zcrMin: 0.07, zcrMax: 0.32,
    periodicityMin: 0.1, periodicityMax: 0.65,
    rmsMin: 0.003, rmsMax: 0.13,
    description: "Very high bright fast calls",
  }, "AGITATION LUMINEUSE", "INSPECTION DE MICRO-BRANCHES", [
    "Je vérifie huit choses à la fois et aucune ne vous concerne.",
    "Le monde est trop lent. J'accélère localement.",
    "Petite taille, grande logistique.",
  ]),
  bird("chaffinch", "FRINGILLA COELEBS", "Pinson des arbres", {
    dominantFreqMin: 1800, dominantFreqMax: 6000,
    spectralCentroidMin: 2400, spectralCentroidMax: 7200,
    flatnessMin: 0.07, flatnessMax: 0.38,
    lowEnergyRatioMin: 0.04, lowEnergyRatioMax: 0.34,
    zcrMin: 0.05, zcrMax: 0.24,
    periodicityMin: 0.18, periodicityMax: 0.78,
    rmsMin: 0.005, rmsMax: 0.17,
    description: "Repeated woodland song pattern",
  }, "OPTIMISME MÉTHODIQUE", "DÉCLARATION DE PRINTEMPS", [
    "Le protocole du matin est lancé. Merci de suivre le rythme.",
    "J'annonce la météo, l'amour et ma position approximative.",
    "Répétition numéro douze : toujours impeccable.",
  ]),
  bird("wren", "TROGLODYTES TROGLODYTES", "Troglodyte mignon", {
    dominantFreqMin: 3500, dominantFreqMax: 9000,
    spectralCentroidMin: 4200, spectralCentroidMax: 10000,
    flatnessMin: 0.12, flatnessMax: 0.55,
    lowEnergyRatioMin: 0, lowEnergyRatioMax: 0.2,
    zcrMin: 0.09, zcrMax: 0.38,
    periodicityMin: 0.08, periodicityMax: 0.55,
    rmsMin: 0.003, rmsMax: 0.14,
    description: "Tiny bird with loud high trills",
  }, "INTENSITÉ MINIATURE", "AMPLIFICATION D'UNE PRÉSENCE MINUSCULE", [
    "Je suis minuscule, donc j'utilise le volume réglementaire maximal.",
    "La mousse m'appartient. Le tronc aussi. On verra pour le reste.",
    "Ne sous-estimez jamais une boule de nerfs avec un bec.",
  ]),
  bird("jay", "GARRULUS GLANDARIUS", "Geai des chênes", {
    dominantFreqMin: 700, dominantFreqMax: 3500,
    spectralCentroidMin: 1000, spectralCentroidMax: 5000,
    flatnessMin: 0.16, flatnessMax: 0.6,
    lowEnergyRatioMin: 0.08, lowEnergyRatioMax: 0.55,
    zcrMin: 0.06, zcrMax: 0.3,
    periodicityMin: 0.05, periodicityMax: 0.45,
    rmsMin: 0.01, rmsMax: 0.26,
    description: "Harsh woodland corvid-like screeches",
  }, "ALARME THÉÂTRALE", "SURVEILLANCE DES CHÊNES", [
    "Intrus signalé. Peut-être dangereux. Peut-être juste mal coiffé.",
    "Je transmets l'information aux chênes supérieurs.",
    "Les glands sont comptés. Les humains aussi.",
  ]),
  bird("magpie", "PICA PICA", "Pie bavarde", {
    dominantFreqMin: 800, dominantFreqMax: 4500,
    spectralCentroidMin: 1200, spectralCentroidMax: 6000,
    flatnessMin: 0.18, flatnessMax: 0.62,
    lowEnergyRatioMin: 0.06, lowEnergyRatioMax: 0.5,
    zcrMin: 0.07, zcrMax: 0.34,
    periodicityMin: 0.05, periodicityMax: 0.5,
    rmsMin: 0.008, rmsMax: 0.24,
    description: "Chattering bright harsh calls",
  }, "BAVARDAGE STRATÉGIQUE", "INVENTAIRE D'OBJETS BRILLANTS", [
    "Je n'ai rien volé. Je réorganise la lumière.",
    "Objet brillant détecté. Approche diplomatique envisagée.",
    "Conversation en cours avec moi-même. Je gagne.",
  ]),
  bird("carrion_crow", "CORVUS CORONE", "Corneille noire", {
    dominantFreqMin: 350, dominantFreqMax: 2200,
    spectralCentroidMin: 500, spectralCentroidMax: 3200,
    flatnessMin: 0.12, flatnessMax: 0.48,
    lowEnergyRatioMin: 0.22, lowEnergyRatioMax: 0.78,
    zcrMin: 0.03, zcrMax: 0.18,
    periodicityMin: 0.05, periodicityMax: 0.45,
    rmsMin: 0.015, rmsMax: 0.3,
    description: "Lower harsh caws, common French corvid",
  }, "AUTORITÉ CORVIDÉE", "ÉVALUATION DU BIPÈDE", [
    "Le bipède est toléré. Pour l'instant.",
    "Ce secteur est sous administration noire.",
    "Je consulte le conseil. Ne bougez pas trop.",
  ]),
  bird("wood_pigeon", "COLUMBA PALUMBUS", "Pigeon ramier", {
    dominantFreqMin: 150, dominantFreqMax: 900,
    spectralCentroidMin: 250, spectralCentroidMax: 1600,
    flatnessMin: 0.03, flatnessMax: 0.22,
    lowEnergyRatioMin: 0.45, lowEnergyRatioMax: 0.9,
    zcrMin: 0.01, zcrMax: 0.08,
    periodicityMin: 0.25, periodicityMax: 0.85,
    rmsMin: 0.006, rmsMax: 0.2,
    description: "Low rhythmic woodland cooing",
  }, "GRAVITÉ DODUE", "ANNONCE DE BRANCHE CONFORTABLE", [
    "Cette branche accepte mon poids avec dignité.",
    "Je répète une phrase simple parce qu'elle est parfaite.",
    "La paix consiste à roucouler plus fort que les problèmes.",
  ]),
  bird("green_woodpecker", "PICUS VIRIDIS", "Pic vert", {
    dominantFreqMin: 900, dominantFreqMax: 3200,
    spectralCentroidMin: 1300, spectralCentroidMax: 4600,
    flatnessMin: 0.12, flatnessMax: 0.5,
    lowEnergyRatioMin: 0.08, lowEnergyRatioMax: 0.52,
    zcrMin: 0.05, zcrMax: 0.24,
    periodicityMin: 0.08, periodicityMax: 0.45,
    rmsMin: 0.01, rmsMax: 0.26,
    description: "Laughing medium-pitch woodland call",
  }, "RIRE DE SOUS-BOIS", "PROSPECTION DE FOURMIS", [
    "Je ris parce que la pelouse sait des choses.",
    "Fourmis probables. Dignité facultative.",
    "Le tronc confirme : présence de secrets comestibles.",
  ]),
  bird("great_spotted_woodpecker", "DENDROCOPOS MAJOR", "Pic épeiche", {
    dominantFreqMin: 1200, dominantFreqMax: 5000,
    spectralCentroidMin: 1600, spectralCentroidMax: 6500,
    flatnessMin: 0.1, flatnessMax: 0.55,
    lowEnergyRatioMin: 0.04, lowEnergyRatioMax: 0.42,
    zcrMin: 0.05, zcrMax: 0.26,
    periodicityMin: 0.08, periodicityMax: 0.5,
    rmsMin: 0.008, rmsMax: 0.22,
    description: "Sharp calls and drumming-like artifacts",
  }, "PERCUSSION TERRITORIALE", "TEST DE RÉSONANCE DU TRONC", [
    "Le bois répond. La conversation est satisfaisante.",
    "Je frappe pour vérifier l'architecture du monde.",
    "Signal vertical confirmé dans le tronc numéro trois.",
  ]),
];

import type { Lang } from "./animals";
import type { AnimalId } from "./animals";

export type AnimalTextProfile = {
  personality: Record<Lang, string[]>;
  emotionalStates: Record<Lang, string[]>;
  threatLevels: ("MINIMAL" | "LOW" | "MODERATE" | "ELEVATED" | "CRITICAL")[];
  translations: Record<Lang, string[]>;
  poetic: Record<Lang, string[]>;
  biologicalIntents: Record<Lang, string[]>;
  neuralPatterns: string[];
  environmentalScans: Record<Lang, string[]>;
};

export const ANIMAL_TEXTS: Record<AnimalId, AnimalTextProfile> = {
  crow: {
    personality: {
      en: ["CYNICAL", "PHILOSOPHICAL", "SUSPICIOUS", "INTELLIGENT"],
      fr: ["CYNIQUE", "PHILOSOPHE", "MÉFIANT", "INTELLIGENT"],
      es: ["CÍNICO", "FILOSÓFICO", "DESCONFIADO", "INTELIGENTE"],
    },
    emotionalStates: {
      en: ["CONTEMPTUOUS OBSERVATION", "STRATEGIC PATIENCE", "QUIET SUPERIORITY"],
      fr: ["OBSERVATION MÉPRISANTE", "PATIENCE STRATÉGIQUE", "SUPÉRIORITÉ SILENCIEUSE"],
      es: ["OBSERVACIÓN DESPECTIVA", "PACIENCIA ESTRATÉGICA", "SUPERIORIDAD SILENCIOSA"],
    },
    threatLevels: ["LOW", "MODERATE", "LOW", "ELEVATED"],
    translations: {
      en: [
        "This human knows too much. Flag for monitoring.",
        "The council has voted. You may pass.",
        "Your garbage reveals everything about your character.",
        "I have been watching you for three years. You don't know this."
      ],
      fr: [
        "Cet humain en sait trop. Marquer pour surveillance.",
        "Le conseil a délibéré. Vous pouvez passer.",
        "Vos ordures révèlent tout de votre caractère.",
        "Je vous observe depuis trois ans. Vous l'ignorez."
      ],
      es: [
        "Este humano sabe demasiado. Marcar para vigilancia.",
        "El consejo ha votado. Puedes pasar.",
        "Tu basura revela todo sobre tu carácter.",
        "Te observo desde hace tres años. No lo sabes."
      ],
    },
    poetic: {
      en: ["Everything shiny is a wound that caught the light."],
      fr: ["Tout ce qui brille est une blessure qui a attrapé la lumière."],
      es: ["Todo lo que brilla es una herida que atrapó la luz."],
    },
    biologicalIntents: {
      en: ["RESOURCE ASSESSMENT", "TERRITORIAL MAPPING", "LONG-TERM GRUDGE FORMATION"],
      fr: ["ÉVALUATION DES RESSOURCES", "CARTOGRAPHIE TERRITORIALE", "FORMATION DE RANCUNE À LONG TERME"],
      es: ["EVALUACIÓN DE RECURSOS", "MAPEO TERRITORIAL", "FORMACIÓN DE RENCOR A LARGO PLAZO"],
    },
    neuralPatterns: ["RECURSIVE_LOOP", "MEMORY_CASCADE"],
    environmentalScans: {
      en: ["URBAN ZONE — CONTROLLED"],
      fr: ["ZONE URBAINE — CONTRÔLÉE"],
      es: ["ZONA URBANA — CONTROLADA"],
    },
  },

  pigeon: {
    personality: {
      en: ["CHAOTIC", "FOOD-OBSESSED", "OVERCONFIDENT"],
      fr: ["CHAOTIQUE", "OBNUBILÉ PAR LA NOURRITURE", "TROP SÛR DE LUI"],
      es: ["CAÓTICO", "OBSESIONADO CON LA COMIDA", "DEMASIADO CONFIADO"],
    },
    emotionalStates: {
      en: ["MAXIMUM BREAD ANTICIPATION", "IRRATIONAL CONFIDENCE", "MILD PANIC"],
      fr: ["ATTENTE MAXIMALE DU PAIN", "CONFIANCE IRRATIONNELLE", "PANIQUE LÉGÈRE"],
      es: ["ANTICIPACIÓN MÁXIMA DE PAN", "CONFIANZA IRRACIONAL", "PÁNICO LEVE"],
    },
    threatLevels: ["MINIMAL", "LOW", "MINIMAL", "MODERATE"],
    translations: {
      en: [
        "This bench belongs to the Pigeon Council.",
        "Bread. Bread. Bread. Excuse me — BREAD.",
        "Human carrying bread detected. Initiating coordinated approach.",
        "I don't know where I am. This is fine."
      ],
      fr: [
        "Ce banc appartient au Conseil des Pigeons.",
        "Pain. Pain. Pain. Pardonnez-moi — PAIN.",
        "Humain porteur de pain détecté. Approche coordonnée en cours.",
        "Je ne sais pas où je suis. C'est normal."
      ],
      es: [
        "Este banco pertenece al Consejo de Palomas.",
        "Pan. Pan. Pan. Disculpe — PAN.",
        "Humano con pan detectado. Iniciando acercamiento coordinado.",
        "No sé dónde estoy. Está bien."
      ],
    },
    poetic: {
      en: ["The sky belongs to everyone. This sidewalk belongs to me."],
      fr: ["Le ciel appartient à tout le monde. Ce trottoir m'appartient."],
      es: ["El cielo pertenece a todos. Esta acera me pertenece a mí."],
    },
    biologicalIntents: {
      en: ["CALORIC ACQUISITION", "BREAD DETECTION"],
      fr: ["ACQUISITION CALORIQUE", "DÉTECTION DU PAIN"],
      es: ["ADQUISICIÓN CALÓRICA", "DETECCIÓN DE PAN"],
    },
    neuralPatterns: ["SCATTER_PROTOCOL", "BREAD_LOCK"],
    environmentalScans: {
      en: ["FOOD SOURCE: PROMISING"],
      fr: ["SOURCE DE NOURRITURE : PROMETTEUSE"],
      es: ["FUENTE DE ALIMENTO: PROMETEDORA"],
    },
  },

  duck: {
    personality: {
      en: ["CALM", "EXISTENTIAL", "WATER-OBSESSED"],
      fr: ["CALME", "EXISTENTIEL", "OBNUBILÉ PAR L'EAU"],
      es: ["TRANQUILO", "EXISTENCIAL", "OBSESIONADO CON EL AGUA"],
    },
    emotionalStates: {
      en: ["DEEP AQUATIC CONTEMPLATION", "SURFACE-LEVEL SERENITY"],
      fr: ["CONTEMPLATION AQUATIQUE PROFONDE", "SÉRÉNITÉ DE SURFACE"],
      es: ["CONTEMPLACIÓN ACUÁTICA PROFUNDA", "SERENIDAD SUPERFICIAL"],
    },
    threatLevels: ["MINIMAL", "LOW", "MINIMAL"],
    translations: {
      en: [
        "Water acceptable today. Yesterday's water was a betrayal.",
        "I have been floating for six hours. I have solved nothing.",
        "Time moves differently here. I do not resist this."
      ],
      fr: [
        "L'eau est acceptable aujourd'hui. Celle d'hier était une trahison.",
        "Je flotte depuis six heures. Je n'ai rien résolu.",
        "Le temps s'écoule différemment ici. Je ne m'y oppose pas."
      ],
      es: [
        "El agua es aceptable hoy. La de ayer fue una traición.",
        "He estado flotando durante seis horas. No he resuelto nada.",
        "El tiempo se mueve diferente aquí. No me resisto."
      ],
    },
    poetic: {
      en: ["To float is to accept that below exists."],
      fr: ["Flotter, c'est accepter que le dessous existe."],
      es: ["Flotar es aceptar que abajo existe algo."],
    },
    biologicalIntents: {
      en: ["AQUATIC MEDITATION", "BREAD ACCEPTANCE"],
      fr: ["MÉDITATION AQUATIQUE", "ACCEPTATION DU PAIN"],
      es: ["MEDITACIÓN ACUÁTICA", "ACEPTACIÓN DEL PAN"],
    },
    neuralPatterns: ["CALM_WAVE", "STILL_WATER_MODE"],
    environmentalScans: {
      en: ["WATER QUALITY: ADEQUATE"],
      fr: ["QUALITÉ DE L'EAU : ADÉQUATE"],
      es: ["CALIDAD DEL AGUA: ADECUADA"],
    },
  },

  cat: {
    personality: {
      en: ["NARCISSISTIC", "DOMINANT", "PASSIVE-AGGRESSIVE"],
      fr: ["NARCISSIQUE", "DOMINANT", "PASSIF-AGRESSIF"],
      es: ["NARCISISTA", "DOMINANTE", "PASIVO-AGRESIVO"],
    },
    emotionalStates: {
      en: ["SUPREME INDIFFERENCE", "CONTROLLED CONTEMPT"],
      fr: ["INDIFFÉRENCE SUPRÊME", "MÉPRIS CONTRÔLÉ"],
      es: ["INDIFERENCIA SUPREMA", "DESPRECIO CONTROLADO"],
    },
    threatLevels: ["LOW", "MODERATE", "ELEVATED"],
    translations: {
      en: [
        "You will move. You will not know why.",
        "I am not sleeping. I am conducting surveillance with closed eyes.",
        "The empty bowl is a philosophical statement."
      ],
      fr: [
        "Tu vas bouger. Tu ne sauras pas pourquoi.",
        "Je ne dors pas. Je mène une surveillance les yeux fermés.",
        "Le bol vide est une déclaration philosophique."
      ],
      es: [
        "Te moverás. No sabrás por qué.",
        "No estoy durmiendo. Estoy vigilando con los ojos cerrados.",
        "El cuenco vacío es una declaración filosófica."
      ],
    },
    poetic: {
      en: ["The window gives me everything I need. You give me the window."],
      fr: ["La fenêtre me donne tout ce dont j'ai besoin. Toi, tu me donnes la fenêtre."],
      es: ["La ventana me da todo lo que necesito. Tú me das la ventana."],
    },
    biologicalIntents: {
      en: ["DOMINANCE MAINTENANCE", "THERMAL ACQUISITION"],
      fr: ["MAINTIEN DE LA DOMINATION", "ACQUISITION THERMIQUE"],
      es: ["MANTENIMIENTO DE DOMINANCIA", "ADQUISICIÓN TÉRMICA"],
    },
    neuralPatterns: ["ALPHA_CONSTANT", "CONTEMPT_LOOP"],
    environmentalScans: {
      en: ["TERRITORY: OWNED"],
      fr: ["TERRITOIRE : POSSÉDÉ"],
      es: ["TERRITORIO: POSEÍDO"],
    },
  },

  dog: {
    personality: {
      en: ["OVEREXCITED", "LOYAL", "PROTECTIVE"],
      fr: ["SUREXCITÉ", "LOYAL", "PROTECTEUR"],
      es: ["SOBREEXCITADO", "LEAL", "PROTECTOR"],
    },
    emotionalStates: {
      en: ["MAXIMUM ENTHUSIASM", "UNCONDITIONAL JOY"],
      fr: ["ENTHOUSIASME MAXIMAL", "JOIE INCONDITIONNELLE"],
      es: ["ENTUSIASMO MÁXIMO", "ALEGRÍA INCONDICIONAL"],
    },
    threatLevels: ["MINIMAL", "LOW", "MODERATE"],
    translations: {
      en: [
        "YOU ARE HOME. I CANNOT BELIEVE YOU ARE HOME.",
        "Suspicious squirrel activity detected. I am ON this.",
        "You were gone for four minutes. I thought you were gone forever."
      ],
      fr: [
        "TU ES RENTRÉ. JE N'ARRIVE PAS À Y CROIRE.",
        "Activité suspecte d'écureuil détectée. Je suis DESSUS.",
        "Tu es parti quatre minutes. J'ai cru que tu étais parti pour toujours."
      ],
      es: [
        "¡ESTÁS EN CASA! NO PUEDO CREERLO.",
        "Actividad sospechosa de ardilla detectada. ESTOY EN ELLO.",
        "Te fuiste cuatro minutos. Pensé que te habías ido para siempre."
      ],
    },
    poetic: {
      en: ["You are the whole world wearing shoes."],
      fr: ["Tu es le monde entier chaussé de souliers."],
      es: ["Eres el mundo entero usando zapatos."],
    },
    biologicalIntents: {
      en: ["COMPANION PROTECTION", "REUNION CELEBRATION"],
      fr: ["PROTECTION DU COMPAGNON", "CÉLÉBRATION DES RETROUVAILLES"],
      es: ["PROTECCIÓN DEL COMPAÑERO", "CELEBRACIÓN DEL REENCUENTRO"],
    },
    neuralPatterns: ["LOYALTY_OVERFLOW", "JOY_CASCADE"],
    environmentalScans: {
      en: ["TERRITORY: DEFENDED"],
      fr: ["TERRITOIRE : DÉFENDU"],
      es: ["TERRITORIO: DEFENDIDO"],
    },
  },

  owl: {
    personality: {
      en: ["ANCIENT", "CRYPTIC", "ALL-SEEING"],
      fr: ["ANCIEN", "CRYPTIQUE", "OMNISCIENT"],
      es: ["ANTIGUO", "CRÍPTICO", "OMNISCIENTE"],
    },
    emotionalStates: {
      en: ["TIMELESS OBSERVATION", "SILENT JUDGMENT"],
      fr: ["OBSERVATION INTEMPORELLE", "JUGEMENT SILENCIEUX"],
      es: ["OBSERVACIÓN ATEMPORAL", "JUICIO SILENCIOSO"],
    },
    threatLevels: ["LOW", "ELEVATED", "CRITICAL"],
    translations: {
      en: [
        "I have seen this before. I will not say when.",
        "The darkness contains information. You cannot read it. I can.",
        "Something has changed. Three nights ago. You didn't notice."
      ],
      fr: [
        "J'ai déjà vu cela. Je ne dirai pas quand.",
        "L'obscurité contient de l'information. Vous ne pouvez pas la lire. Moi, oui.",
        "Quelque chose a changé. Il y a trois nuits. Tu ne l'as pas remarqué."
      ],
      es: [
        "He visto esto antes. No diré cuándo.",
        "La oscuridad contiene información. Tú no puedes leerla. Yo sí.",
        "Algo ha cambiado. Hace tres noches. No te diste cuenta."
      ],
    },
    poetic: {
      en: ["Silence is the oldest language. I speak it fluently."],
      fr: ["Le silence est le plus vieux langage. Je le parle couramment."],
      es: ["El silencio es el lenguaje más antiguo. Lo hablo con fluidez."],
    },
    biologicalIntents: {
      en: ["NOCTURNAL SURVEILLANCE", "ANCIENT PATTERN RECOGNITION"],
      fr: ["SURVEILLANCE NOCTURNE", "RECONNAISSANCE DE SCHÉMAS ANCIENS"],
      es: ["VIGILANCIA NOCTURNA", "RECONOCIMIENTO DE PATRONES ANTIGUOS"],
    },
    neuralPatterns: ["ANCIENT_PROTOCOL", "TEMPORAL_ECHO"],
    environmentalScans: {
      en: ["NIGHT SECTOR: ACTIVE"],
      fr: ["SECTEUR NOCTURNE : ACTIF"],
      es: ["SECTOR NOCTURNO: ACTIVO"],
    },
  },
};

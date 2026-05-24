export type Lang = "en" | "fr" | "es";

export const UI_LABELS: Record<Lang, Record<string, string>> = {
  en: {
    title: "CREATURE-SYNC",
    subtitle: "// CREATURE-SYNC ANIMAL TRANSLATION PROTOCOL",
    initiate: "INITIATE SCAN",
    stop: "STOP SCAN",
    analyzing: "ANALYZING...",
    complete: "SCAN COMPLETE — RESET",
    awaiting: "AWAITING AUDIO INPUT — PRESS INITIATE SCAN",
    decoding: "DECODING VOCALISATION...",
    translation: "TRANSLATION PROTOCOL",
    poetry: "NEURAL POETRY DETECTED",
    rare: "— RARE EVENT —",
    species: "SPECIES IDENTIFICATION",
    emotional: "EMOTIONAL FREQUENCY",
    threat: "THREAT ASSESSMENT",
    biological: "BIOLOGICAL INTENT",
    neural: "NEURAL RESONANCE",
    environment: "ENVIRONMENTAL SCAN",
    signal: "AUDIO SIGNAL QUALITY",
    strength: "SIGNAL STRENGTH",
    confidence: "CONFIDENCE",
    resonance: "NEURAL RESONANCE",
    clarity: "SIGNAL CLARITY",
    scanning: "SCANNING...",
    noSignal: "NO SIGNAL",
    calibrating: "CALIBRATING...",
    offline: "OFFLINE",
    assessing: "ASSESSING...",
    decoding2: "DECODING...",
    resonating: "RESONATING...",
    envScan: "SCANNING ENVIRONMENT...",
    bioacoustic: "BIOACOUSTIC PATTERN RECOGNITION",
    freq: "FREQ",
    codec: "CODEC",
    footer1: "CREATURE-SYNC v3.7.2 // FEUCH INSTITUTE PROPRIETARY",
    footer2: "CLASSIFICATION: LEVEL-4",
    footer3: "BLACKLACE ISLAND",
    institute: "FEUCH INSTITUTE",
    online: "ONLINE",
    station: "BLACKLACE ISLAND RESEARCH STATION — SECTOR 7",
    lang: "LANG",
    detected: "ACOUSTIC SIGNATURE DETECTED",
    unknown: "UNIDENTIFIED SIGNATURE",
  },
  fr: {
    title: "CREATURE-SYNC",
    subtitle: "// PROTOCOLE CREATURE-SYNC DE TRADUCTION ANIMALE",
    initiate: "LANCER L'ÉCOUTE",
    stop: "ARRÊTER L'ÉCOUTE",
    analyzing: "ANALYSE EN COURS...",
    complete: "ANALYSE TERMINÉE — RÉINITIALISER",
    awaiting: "EN ATTENTE D'UN SIGNAL SONORE — PRESSEZ LANCER",
    decoding: "DÉCODAGE DE LA VOCALISATION...",
    translation: "PROTOCOLE DE TRADUCTION",
    poetry: "POÉSIE NEURALE DÉTECTÉE",
    rare: "— ÉVÉNEMENT RARE —",
    species: "IDENTIFICATION DE L'ESPÈCE",
    emotional: "FRÉQUENCE ÉMOTIONNELLE",
    threat: "ÉVALUATION DE LA MENACE",
    biological: "INTENTION BIOLOGIQUE",
    neural: "RÉSONANCE NEURALE",
    environment: "SCAN ENVIRONNEMENTAL",
    signal: "QUALITÉ DU SIGNAL AUDIO",
    strength: "FORCE DU SIGNAL",
    confidence: "CONFIANCE",
    resonance: "RÉSONANCE NEURALE",
    clarity: "CLARTÉ DU SIGNAL",
    scanning: "ANALYSE...",
    noSignal: "AUCUN SIGNAL",
    calibrating: "CALIBRAGE...",
    offline: "HORS LIGNE",
    assessing: "ÉVALUATION...",
    decoding2: "DÉCODAGE...",
    resonating: "RÉSONANCE...",
    envScan: "SCAN DE L'ENVIRONNEMENT...",
    bioacoustic: "RECONNAISSANCE BIOACOUSTIQUE",
    freq: "FRÉQ",
    codec: "CODEC",
    footer1: "CREATURE-SYNC v3.7.2 // FEUCH INSTITUT — PROPRIÉTAIRE",
    footer2: "CLASSIFICATION : NIVEAU-4",
    footer3: "BLACKLACE ISLAND",
    institute: "FEUCH INSTITUT",
    online: "EN LIGNE",
    station: "STATION DE RECHERCHE BLACKLACE ISLAND — SECTEUR 7",
    lang: "LANGUE",
    detected: "SIGNATURE ACOUSTIQUE DÉTECTÉE",
    unknown: "SIGNATURE NON IDENTIFIÉE",
  },
  es: {
    title: "CREATURE-SYNC",
    subtitle: "// PROTOCOLO CREATURE-SYNC DE TRADUCCIÓN ANIMAL",
    initiate: "INICIAR ESCÁNER",
    stop: "DETENER ESCÁNER",
    analyzing: "ANALIZANDO...",
    complete: "ESCÁNER COMPLETADO — REINICIAR",
    awaiting: "ESPERANDO ENTRADA DE AUDIO — PRESIONE INICIAR",
    decoding: "DECODIFICANDO VOCALIZACIÓN...",
    translation: "PROTOCOLO DE TRADUCCIÓN",
    poetry: "POESÍA NEURAL DETECTADA",
    rare: "— EVENTO RARO —",
    species: "IDENTIFICACIÓN DE ESPECIES",
    emotional: "FRECUENCIA EMOCIONAL",
    threat: "EVALUACIÓN DE AMENAZA",
    biological: "INTENCIÓN BIOLÓGICA",
    neural: "RESONANCIA NEURAL",
    environment: "ESCÁN AMBIENTAL",
    signal: "CALIDAD DE SEÑAL DE AUDIO",
    strength: "FORTALEZA DE SEÑAL",
    confidence: "CONFIANZA",
    resonance: "RESONANCIA NEURAL",
    clarity: "CLARIDAD DE SEÑAL",
    scanning: "ESCANEANDO...",
    noSignal: "SIN SEÑAL",
    calibrating: "CALIBRANDO...",
    offline: "FUERA DE LÍNEA",
    assessing: "EVALUANDO...",
    decoding2: "DECODIFICANDO...",
    resonating: "RESONANDO...",
    envScan: "ESCANEANDO AMBIENTE...",
    bioacoustic: "RECONOCIMIENTO BIOACÚSTICO",
    freq: "FREQ",
    codec: "CODEC",
    footer1: "CREATURE-SYNC v3.7.2 // INSTITUTO FEUCH PROPIETARIO",
    footer2: "CLASIFICACIÓN: NIVEL-4",
    footer3: "ISLA BLACKLACE",
    institute: "INSTITUTO FEUCH",
    online: "EN LÍNEA",
    station: "ESTACIÓN DE INVESTIGACIÓN ISLA BLACKLACE — SECTOR 7",
    lang: "IDIOMA",
    detected: "FIRMA ACÚSTICA DETECTADA",
    unknown: "FIRMA NO IDENTIFICADA",
  },
};

export type Species = {
  id: string;
  name: string;
  scientificName: string;
  emoji: string;
  personality: Record<Lang, string[]>;
  emotionalStates: Record<Lang, string[]>;
  threatLevels: ("MINIMAL" | "LOW" | "MODERATE" | "ELEVATED" | "CRITICAL")[];
  translations: Record<Lang, string[]>;
  poetic: Record<Lang, string[]>;
  biologicalIntents: Record<Lang, string[]>;
  neuralPatterns: string[];
  environmentalScans: Record<Lang, string[]>;
  // Audio classifier fingerprint
  acousticProfile: {
    dominantFreqMin: number;      // Hz
    dominantFreqMax: number;       // Hz
    spectralCentroidMin: number;   // Hz
    spectralCentroidMax: number;     // Hz
    flatnessMin: number;            // 0-1
    flatnessMax: number;             // 0-1
    lowEnergyRatioMin: number;      // 0-1
    lowEnergyRatioMax: number;       // 0-1
    zcrMin: number;                 // 0-1 normalized
    zcrMax: number;                  // 0-1 normalized
    periodicityMin: number;          // 0-1
    periodicityMax: number;           // 0-1
    rmsMin: number;                  // 0-1
    rmsMax: number;                   // 0-1
    description: string;
  };
};

export const SPECIES: Species[] = [
  {
    id: "crow",
    name: "CORVUS CORAX",
    scientificName: {
      en: ["Common Crow",],
      fr: ["Corbeau commun",],
      es: ["cuervo común",],
      },
    emoji: "🐦‍⬛",
    personality: {
      en: ["CYNICAL", "PHILOSOPHICAL", "SUSPICIOUS", "INTELLIGENT"],
      fr: ["CYNIQUE", "PHILOSOPHE", "MÉFIANT", "D'UNE INTELLIGENCE ANCIENNE"],
      es: ["CÍNICO", "FILOSÓFICO", "SOSPECHOSO", "DE SABIDURÍA MILENARIA"],
    },
    emotionalStates: {
      en: ["CONTEMPTUOUS OBSERVATION", "EXISTENTIAL CLARITY", "STRATEGIC PATIENCE", "MILD DISDAIN", "QUIET SUPERIORITY"],
      fr: ["CONTEMPLATION MÉPRISANTE", "CLARTÉ EXISTENTIELLE", "PATIENCE STRATÉGIQUE", "DÉDAIN DOUX", "SUPÉRIORITÉ SILENCIEUSE"],
      es: ["OBSERVACIÓN DESPECTIVA", "CLARIDAD EXISTENCIAL", "PACIENCIA ESTRATÉGICA", "DESDÉN LEVE", "SUPERIORIDAD SILENCIOSA"],
    },
    threatLevels: ["LOW", "MODERATE", "LOW", "ELEVATED", "LOW"],
    translations: {
      en: [
        "This human knows too much. Flag for monitoring.",
        "The bread distribution today was unacceptable. I'll remember this.",
        "I have been watching you for three years. You don't know this.",
        "Your recycling habits are being evaluated. Results: poor.",
        "The council has voted. You may pass.",
        "We do not forget. We do not forgive. We also do not forget.",
        "Interesting. A human who looks directly at me. Noted.",
        "Your garbage reveals everything about your character.",
      ],
      fr: [
        "Cet humain en sait trop. Marquer pour surveillance.",
        "La distribution du pain aujourd'hui était inacceptable. Je m'en souviendrais.",
        "Je vous observe depuis trois ans. Vous l'ignorez.",
        "Vos habitudes de recyclage sont évaluées. Verdict : médiocre.",
        "Le conseil a délibéré. Vous pouvez passer.",
        "Nous n'oublions pas. Nous ne pardonnons pas. Nous n'oublions vraiment pas.",
        "Intéressant. Un humain qui me regarde dans les yeux. Noté.",
        "Vos ordures révèlent tout de votre caractère.",
      ],
      es: [
        "Este humano sabe demasiado. Marcar para vigilancia.",
        "La distribución de pan hoy fue inaceptable. Lo recuerdo.",
        "Te observo desde hace tres años. No lo sabes.",
        "Tus hábitos de reciclaje están siendo evaluados. Resultado: deficiente.",
        "El consejo ha votado. Puedes pasar.",
        "No olvidamos. No perdonamos. Tampoco olvidamos, de verdad.",
        "Interesante. Un humano que me mira directamente. Anotado.",
        "Tu basura revela todo sobre tu carácter.",
      ],
    },
    poetic: {
      en: [
        "There is sorrow in the shape of the afternoon. I count the shadows.",
        "Everything shiny is a wound that caught the light.",
        "The wind changes. I was here before the roads.",
      ],
      fr: [
        "Il y a de la tristesse dans la forme de l'après-midi. Je compte les ombres une par une.",
        "Tout ce qui brille est une blessure qui a attrapé la lumière.",
        "Le vent tourne. J'étais là avant les routes, avant les noms.",
        "Le ciel est un miroir où le temps se regarde. Moi, je regarde le temps.",
        "Dans le silence des branches nues, j'entends le monde se souvenir de lui-même.",
      ],
      es: [
        "Hay tristeza en la forma de la tarde. Cuento las sombras.",
        "Todo lo que brilla es una herida que atrapó la luz.",
        "El viento cambia. Yo estaba aquí antes de los caminos.",
        "El cielo es un espejo donde el tiempo se mira. Yo miro al tiempo.",
        "En el silencio de las ramas desnudas, oigo al mundo recordarse a sí mismo.",
      ],
    },
    biologicalIntents: {
      en: ["RESOURCE ASSESSMENT", "TERRITORIAL MAPPING", "SOCIAL LEVERAGE CALCULATION", "LONG-TERM GRUDGE FORMATION"],
      fr: ["ÉVALUATION DES RESSOURCES", "CARTOGRAPHIE TERRITORIALE", "CALCUL DU LEVIER SOCIAL", "FORMATION DE RANCUNE À LONG TERME"],
      es: ["EVALUACIÓN DE RECURSOS", "MAPEO TERRITORIAL", "CÁLCULO DE PALANCA SOCIAL", "FORMACIÓN DE REncor A LARGO PLAZO"],
    },
    neuralPatterns: ["RECURSIVE_LOOP", "MULTI_AGENT_SYNC", "MEMORY_CASCADE"],
    environmentalScans: {
      en: ["URBAN ZONE — CONTROLLED", "FOOD SOURCE: ADEQUATE", "THREAT AXIS: HUMANS (KNOWN)"],
      fr: ["ZONE URBAINE — CONTRÔLÉE", "SOURCE DE NOURRITURE : ADÉQUATE", "AXE DE MENACE : HUMAINS (CONNUS)"],
      es: ["ZONA URBANA — CONTROLADA", "FUENTE DE ALIMENTO: ADECUADA", "EJE DE AMENAZA: HUMANOS (CONOCIDOS)"],
    },
    acousticProfile: {
      dominantFreqMin: 800, dominantFreqMax: 4000,
      spectralCentroidMin: 1200, spectralCentroidMax: 5000,
      flatnessMin: 0.15, flatnessMax: 0.45,
      lowEnergyRatioMin: 0.1, lowEnergyRatioMax: 0.4,
      zcrMin: 0.08, zcrMax: 0.25,
      periodicityMin: 0.1, periodicityMax: 0.5,
      rmsMin: 0.02, rmsMax: 0.25,
      description: "Harsh, wide-spectrum vocalizations with irregular bursts",
    },
  },
  {
    id: "pigeon",
    name: "COLUMBA LIVIA",
    scientificName: {
      en: ["Urban Pigeon",],
      fr: ["Pigeon Urbain",],
      es: ["paloma urbana",],
      },"",
    emoji: "🕊️",
    personality: {
      en: ["CHAOTIC", "FOOD-OBSESSED", "OVERCONFIDENT", "RESILIENT"],
      fr: ["CHAOTIQUE", "OBNUBLIÉ PAR LA NOURRITURE", "TROP SÛR DE LUI", "RÉSILIENt"],
      es: ["CAÓTICO", "OBSESIONADO CON LA COMIDA", "DEMASIADO CONFIADO", "RESILIENTE"],
    },
    emotionalStates: {
      en: ["MAXIMUM BREAD ANTICIPATION", "IRRATIONAL CONFIDENCE", "MILD PANIC", "INEXPLICABLE CALM", "AGGRESSIVE OPTIMISM"],
      fr: ["ATTENTE MAXIMALE DU PAIN", "CONFIANCE IRRATIONNELLE", "PANIQUE LÉGÈRE", "CALME INEXPLICABLE", "OPTIMISME AGRESSIF"],
      es: ["ANTICIPACIÓN MÁXIMA DE PAN", "CONFIANZA IRRACIONAL", "PÁNICO LEVE", "CALMA INEXPLICABLE", "OPTIMISMO AGRESIVO"],
    },
    threatLevels: ["MINIMAL", "LOW", "MINIMAL", "MODERATE", "MINIMAL"],
    translations: {
      en: [
        "This bench belongs to the Pigeon Council. We accept no appeals.",
        "Bread. Bread. Bread. BREAD. Excuse me — BREAD.",
        "I have survived seven winters. I fear nothing. Not even that dog.",
        "The tall mammals keep staring. They are jealous of my feathers.",
        "We have held this intersection for forty generations.",
        "Permission denied. This food court is under pigeon jurisdiction.",
        "I don't know where I am. I never know where I am. This is fine.",
        "Human carrying bread detected. Initiating coordinated approach.",
      ],
      fr: [
        "Ce banc appartient au Conseil des Pigeons. Nous n'acceptons aucun recours.",
        "Pain. Pain. Pain. PAIN. Pardonnez-moi — PAIN.",
        "J'ai survécu à sept hivers. Je ne crains rien. Pas même ce chien.",
        "Les grands mammifères me fixent. Ils sont jaloux de mes plumes.",
        "Nous tenons cette intersection depuis quarante générations.",
        "Permission refusée. Ce restaurant est sous juridiction pigeon.",
        "Je ne sais pas où je suis. Je ne sais jamais où je suis. C'est normal.",
        "Humain porteur de pain détecté. Approche coordonnée en cours.",
      ],
      es: [
        "Este banco pertenece al Consejo de Palomas. No aceptamos apelaciones.",
        "Pan. Pan. Pan. PAN. Disculpe — PAN.",
        "He sobrevivido siete inviernos. No le temo a nada. Ni siquiera a ese perro.",
        "Los mamíferos altos no dejan de mirarme. Están celosos de mis plumas.",
        "Hemos ocupado esta intersección durante cuarenta generaciones.",
        "Permiso denegado. Esta plaza de comidas está bajo jurisdicción paloma.",
        "No sé dónde estoy. Nunca sé dónde estoy. Está bien.",
        "Humano con pan detectado. Iniciando acercamiento coordinado.",
      ],
    },
    poetic: {
      en: [
        "To live in the city is to be everyone's problem and no one's concern.",
        "The sky belongs to everyone. This sidewalk belongs to me.",
      ],
      fr: [
        "Vivre dans la ville, c'est être le problème de tous et le souci de personne.",
        "Le ciel appartient à tout le monde. Ce trottoir m'appartient.",
        "Je suis le spectateur invisible de toutes vos promesses brisées.",
        "Mon aile effleure le vent comme un souvenir que l'on n'ose prononcer.",
      ],
      es: [
        "Vivir en la ciudad es ser el problema de todos y la preocupación de nadie.",
        "El cielo pertenece a todos. este acera me pertenece a mí.",
        "Soy el espectador invisible de todas tus promesas rotas.",
        "Mi ala acaricia el viento como un recuerdo que no te atreves a pronunciar.",
      ],
    },
    biologicalIntents: {
      en: ["CALORIC ACQUISITION", "TERRITORIAL CLAIM (DISPUTED)", "BREAD DETECTION", "SURVIVAL (UNCONDITIONAL)"],
      fr: ["ACQUISITION CALORIQUE", "REVENDICATION TERRITORIALE (CONTESTÉE)", "DÉTECTION DU PAIN", "SURVIE (INCONDITIONNELLE)"],
      es: ["ADQUISICIÓN CALÓRICA", "RECLAMO TERRITORIAL (DISPUTADO)", "DETECCIÓN DE PAN", "SUPERVIVENCIA (INCONDICIONAL)"],
    },
    neuralPatterns: ["SCATTER_PROTOCOL", "BREAD_LOCK", "CHAOS_STABLE"],
    environmentalScans: {
      en: ["URBAN ZONE — CONTROLLED", "FOOD SOURCE: PROMISING", "HUMAN DENSITY: ACCEPTABLE"],
      fr: ["ZONE URBAINE — CONTRÔLÉE", "SOURCE DE NOURRITURE : PROMETTEUSE", "DENSITÉ HUMAINE : ACCEPTABLE"],
      es: ["ZONA URBANA — CONTROLADA", "FUENTE DE ALIMENTO: PROMETEDORA", "DENSIDAD HUMANA: ACEPTABLE"],
    },
    acousticProfile: {
      dominantFreqMin: 200, dominantFreqMax: 1200,
      spectralCentroidMin: 400, spectralCentroidMax: 2000,
      flatnessMin: 0.05, flatnessMax: 0.25,
      lowEnergyRatioMin: 0.3, lowEnergyRatioMax: 0.7,
      zcrMin: 0.02, zcrMax: 0.12,
      periodicityMin: 0.2, periodicityMax: 0.6,
      rmsMin: 0.01, rmsMax: 0.15,
      description: "Smooth, low-frequency cooing with gentle periodicity",
    },
  },
  {
    id: "duck",
    name: "ANAS PLATYRHYNCHOS",
    scientificName: {
      en: ["Mallard Duck",],
      fr: ["Canard",],
      es: ["Pato",],
      },
    emoji: "🦆",
    personality: {
      en: ["CALM", "EXISTENTIAL", "WATER-OBSESSED", "QUIETLY UNSTABLE"],
      fr: ["CALME", "EXISTENTIEL", "OBNUBLIÉ PAR L'EAU", "INSTABLE EN SILENCE"],
      es: ["TRANQUILO", "EXISTENCIAL", "OBSESIONADO CON EL AGUA", "INESTABLE EN SILENCIO"],
    },
    emotionalStates: {
      en: ["DEEP AQUATIC CONTEMPLATION", "SURFACE-LEVEL SERENITY", "MILD EXISTENTIAL DREAD", "WATER-INDUCED PEACE", "PHILOSOPHICAL STILLNESS"],
      fr: ["CONTEMPLATION AQUATIQUE PROFONDE", "SÉRÉNITÉ DE SURFACE", "ANGOISSE EXISTENTIELLE LÉGÈRE", "PAIX INDUITE PAR L'EAU", "IMMObilitÉ PHILOSOPHIQUE"],
      es: ["CONTEMPLACIÓN ACUÁTICA PROFUNDA", "SERENIDAD SUPERFICIAL", "TEMOR EXISTENCIAL LEVE", "PAZ INDUCIDA POR EL AGUA", "INMOVILIDAD FILOSÓFICA"],
    },
    threatLevels: ["MINIMAL", "MINIMAL", "LOW", "MINIMAL", "MODERATE"],
    translations: {
      en: [
        "Water acceptable today. Yesterday's water was a betrayal.",
        "I have been floating for six hours. I have solved nothing.",
        "The reflection in the water is not me. We've agreed on this.",
        "Humans feed me bread. Bread is not nutritious. We both know this. We continue.",
        "The pond is cold. The pond has always been cold. I am grateful.",
        "Something large passed beneath the water. I did not look.",
        "Time moves differently here. I do not resist this.",
      ],
      fr: [
        "L'eau est acceptable aujourd'hui. Celle d'hier était une trahison.",
        "Je flotte depuis six heures. Je n'ai rien résolu.",
        "Le reflet dans l'eau n'est pas moi. Nous en sommes convenus.",
        "Les humains me donnent du pain. Le pain n'est pas nutritif. Nous le savons tous deux. Nous continuons.",
        "L'étang est froid. L'étang a toujours été froid. J'en suis reconnaissant.",
        "Quelque chose de grand est passé sous l'eau. Je n'ai pas regardé.",
        "Le temps s'écoule différemment ici. Je ne m'y oppose pas.",
      ],
      es: [
        "El agua es aceptable hoy. La de ayer fue una traición.",
        "He estado flotando durante seis horas. No he resuelto nada.",
        "El reflejo en el agua no soy yo. Estamos de acuerdo en eso.",
        "Los humanos me dan pan. El pan no es nutritivo. Ambos lo sabemos. Continuamos.",
        "El estanque está frío. El estanque siempre ha estado frío. Estoy agradecido.",
        "Algo grande pasó bajo el agua. No miré.",
        "El tiempo se mueve diferente aquí. No me resisto.",
      ],
    },
    poetic: {
      en: [
        "To float is not to rest. To float is to accept that below exists.",
        "The ripples I make come back to me. Every one. Always.",
        "This water was here before me. It will be here after. I find this comforting.",
      ],
      fr: [
        "Flotter n'est pas se reposer. Flotter, c'est accepter que le dessous existe.",
        "Les ondulations que je fais me reviennent. Chacune. Toujours.",
        "Cette eau était là avant moi. Elle sera là après. Je trouve cela réconfortant.",
        "Je suis le dernier témoin du silence avant le bruit du monde.",
        "L'eau ne me juge pas. C'est pourquoi je reste.",
      ],
      es: [
        "Flotar no es descansar. Flotar es aceptar que abajo existe algo.",
        "Las ondas que hago regresan a mí. Cada una. Siempre.",
        "Esta agua estaba aquí antes que yo. Estará después. Encuentro consuelo en eso.",
        "Soy el último testigo del silencio antes del ruido del mundo.",
        "El agua no me juzga. Por eso me quedo.",
      ],
    },
    biologicalIntents: {
      en: ["AQUATIC MEDITATION", "SURFACE EQUILIBRIUM", "REFLECTION ANALYSIS", "BREAD ACCEPTANCE"],
      fr: ["MÉDITATION AQUATIQUE", "ÉQUILIBRE DE SURFACE", "ANALYSE DES REFLETS", "ACCEPTATION DU PAIN"],
      es: ["MEDITACIÓN ACUÁTICA", "EQUILIBRIO SUPERFICIAL", "ANÁLISIS DE REFLEJOS", "ACEPTACIÓN DEL PAN"],
    },
    neuralPatterns: ["CALM_WAVE", "DEPTH_RESONANCE", "STILL_WATER_MODE"],
    environmentalScans: {
      en: ["WATER QUALITY: ADEQUATE", "DEPTH: ACCEPTABLE", "AMBIENT THREAT: MINIMAL"],
      fr: ["QUALITÉ DE L'EAU : ADÉQUATE", "PROFONDEUR : ACCEPTABLE", "MENACE AMBIANTE : MINIMALE"],
      es: ["CALIDAD DEL AGUA: ADECUADA", "PROFUNDIDAD: ACEPTABLE", "AMENAZA AMBIENTAL: MÍNIMA"],
    },
    acousticProfile: {
      dominantFreqMin: 300, dominantFreqMax: 1500,
      spectralCentroidMin: 500, spectralCentroidMax: 2500,
      flatnessMin: 0.05, flatnessMax: 0.3,
      lowEnergyRatioMin: 0.25, lowEnergyRatioMax: 0.65,
      zcrMin: 0.03, zcrMax: 0.15,
      periodicityMin: 0.15, periodicityMax: 0.55,
      rmsMin: 0.02, rmsMax: 0.2,
      description: "Quacking with moderate pitch, smooth harmonic structure",
    },
  },
  {
    id: "cat",
    name: "FELIS CATUS",
    scientificName: {
      en: ["Domestic Cat",],
      fr: ["Chat domestique",],
      es: ["Gato domestico",],
      }, 
    emoji: "🐱",
    personality: {
      en: ["NARCISSISTIC", "DOMINANT", "PASSIVE-AGGRESSIVE", "REGAL"],
      fr: ["NARCISSIQUE", "DOMINANT", "PASSIF-AGRESSIF", "ROYAL"],
      es: ["NARCISISTA", "DOMINANTE", "PASIVO-AGRESIVO", "REGIO"],
    },
    emotionalStates: {
      en: ["SUPREME INDIFFERENCE", "CONTROLLED CONTEMPT", "PERFORMATIVE DISINTEREST", "PASSIVE-AGGRESSIVE COMFORT", "ENTITLED BOREDOM"],
      fr: ["INDIFFÉRENCE SUPRÊME", "MÉPRIS CONTRÔLÉ", "DÉSINTÉRÊT PERFORMANT", "CONFORT PASSIF-AGRESSIF", "ENNUI PRIVILÉGIÉ"],
      es: ["INDIFERENCIA SUPREMA", "DESPRECIO CONTROLADO", "DESINTERÉS PERFORMÁTICO", "CONFORT PASIVO-AGRESIVO", "ABURRIMIENTO ENTITULADO"],
    },
    threatLevels: ["LOW", "MODERATE", "LOW", "ELEVATED", "MODERATE"],
    translations: {
      en: [
        "You will move. You will not know why you moved. You will have moved.",
        "I knocked it off the table because it was there. Because you were watching.",
        "The tall mammal appears emotionally tired. This is convenient.",
        "I require warmth. I do not require you specifically. But here we are.",
        "You fed me twelve minutes late. The record has been updated.",
        "I am not sleeping. I am conducting surveillance with closed eyes.",
        "Affection will be available on my schedule. Check back later.",
        "The empty bowl is a philosophical statement. I made it on purpose.",
      ],
      fr: [
        "Tu vas bouger. Tu ne sauras pas pourquoi. Mais tu auras bougé.",
        "J'ai fait tomber ça de la table parce que c'était là. Parce que tu regardais.",
        "Le grand mammifère semble émotionnellement fatigué. C'est commode.",
        "J'ai besoin de chaleur. Pas spécifiquement de toi. Mais nous y sommes.",
        "Tu m'as nourri douze minutes en retard. Le dossier a été mis à jour.",
        "Je ne dors pas. Je mène une surveillance les yeux fermés.",
        "L'affection sera disponible selon mon emploi du temps. Reviens plus tard.",
        "Le bol vide est une déclaration philosophique. Je l'ai fait exprès.",
      ],
      es: [
        "Te moverás. No sabrás por qué te moviste. Pero te habrás movido.",
        "Tiré eso de la mesa porque estaba ahí. Porque me estabas mirando.",
        "El mamífero alto parece emocionalmente cansado. Esto es conveniente.",
        "Requiero calor. No te requiero a ti específicamente. Pero aquí estamos.",
        "Me alimentaste doce minutos tarde. El registro ha sido actualizado.",
        "No estoy durmiendo. Estoy realizando vigilancia con los ojos cerrados.",
        "El afecto estará disponible según mi horario. Vuelve más tarde.",
        "El tazón vacío es una declaración filosófica. Lo hice a propósito.",
      ],
    },
    poetic: {
      en: [
        "I love you in the way a planet loves a moon. From a safe distance, with enormous gravity.",
        "The window gives me everything I need. You give me the window.",
      ],
      fr: [
        "Je t'aime comme une planète aime sa lune. D'une distance sûre, avec une gravité énorme.",
        "La fenêtre me donne tout ce dont j'ai besoin. Toi, tu me donnes la fenêtre.",
        "Je suis le secret que la maison garde entre ses murs. Toi, tu es le mur.",
        "Mon ronronnement est une prière que tu ne comprends pas. C'est mieux ainsi.",
      ],
      es: [
        "Te amo como un planeta ama a su luna. Desde una distancia segura, con gravedad enorme.",
        "La ventana me da todo lo que necesito. Tú me das la ventana.",
        "Soy el secreto que la casa guarda entre sus paredes. Tú eres la pared.",
        "Mi ronroneo es una oración que no entiendes. Es mejor así.",
      ],
    },
    biologicalIntents: {
      en: ["DOMINANCE MAINTENANCE", "THERMAL ACQUISITION", "PSYCHOLOGICAL LEVERAGE", "CONTROLLED AFFECTION DISPENSING"],
      fr: ["MAINTIEN DE LA DOMINATION", "ACQUISITION THERMIQUE", "LEVIER PSYCHOLOGIQUE", "DISTRIBUTION CONTRÔLÉE D'AFFECTION"],
      es: ["MANTENIMIENTO DE DOMINANCIA", "ADQUISICIÓN TÉRMICA", "PALANCA PSICOLÓGICA", "DISTRIBUCIÓN CONTROLADA DE AFECTO"],
    },
    neuralPatterns: ["ALPHA_CONSTANT", "CONTEMPT_LOOP", "SUPERIOR_IDLE"],
    environmentalScans: {
      en: ["TERRITORY: OWNED", "SUBJECT COMPLIANCE: ADEQUATE", "COMFORT INDEX: PROVISIONAL"],
      fr: ["TERRITOIRE : POSSEDÉ", "SOUMISSION DU SUJET : ADÉQUATE", "INDICE DE CONFORT : PROVISOIRE"],
      es: ["TERRITORIO: POSEÍDO", "CUMPLIMIENTO DEL SUJETO: ADECUADO", "ÍNDICE DE CONFORT: PROVISIONAL"],
    },
    acousticProfile: {
      dominantFreqMin: 500, dominantFreqMax: 3000,
      spectralCentroidMin: 800, spectralCentroidMax: 4000,
      flatnessMin: 0.08, flatnessMax: 0.3,
      lowEnergyRatioMin: 0.15, lowEnergyRatioMax: 0.5,
      zcrMin: 0.05, zcrMax: 0.18,
      periodicityMin: 0.1, periodicityMax: 0.6,
      rmsMin: 0.01, rmsMax: 0.2,
      description: "High-pitched meows and purrs, tonal and periodic",
    },
  },
  {
    id: "dog",
    name: "CANIS LUPUS FAMILIARIS",
     scientificName: {
      en: ["Domestic Dog",],
      fr: ["Chien domestique",],
      es: ["Perro domestico",],
      },
    emoji: "🐕",
    personality: {
      en: ["OVEREXCITED", "LOYAL", "EMOTIONAL", "PROTECTIVE"],
      fr: ["SUR-EXCITÉ", "LOYAL", "ÉMOTIONNEL", "PROTECTEUR"],
      es: ["SOBREEXCITADO", "LEAL", "EMOCIONAL", "PROTECTOR"],
    },
    emotionalStates: {
      en: ["MAXIMUM ENTHUSIASM", "UNCONDITIONAL JOY", "PROTECTIVE ALERTNESS", "EMOTIONAL OVERFLOW", "INTENSE DEVOTION"],
      fr: ["ENTHOUSIASME MAXIMAL", "JOIE INCONDITIONNELLE", "VIGILANCE PROTECTRICE", "DÉBORDEMENT ÉMOTIONNEL", "DÉVOTION INTENSE"],
      es: ["ENTUSIASMO MÁXIMO", "ALEGRÍA INCONDICIONAL", "ALERTA PROTECTORA", "DESBORDAMIENTO EMOCIONAL", "DEVOCIÓN INTENSA"],
    },
    threatLevels: ["MINIMAL", "MINIMAL", "MODERATE", "LOW", "MINIMAL"],
    translations: {
      en: [
        "YOU ARE HOME. I CANNOT BELIEVE YOU ARE HOME. I WAS SO WORRIED.",
        "I love you. I love you. I love you. Is this enough? I can say it more.",
        "Suspicious squirrel activity detected at the fence. I am ON this.",
        "The mailman comes every day. Every day. This is the threat.",
        "I forgive you for everything. Every time. Immediately.",
        "That other dog smells interesting. I have questions. Many questions.",
        "You were gone for four minutes. I thought you were gone forever.",
        "I will guard this house with my entire body, every night, forever.",
      ],
      fr: [
        "TU ES RENTRÉ. JE N'ARRIVE PAS À Y CROIRE. J'ÉTAIS SI INQUIET.",
        "Je t'aime. Je t'aime. Je t'aime. C'est assez ? Je peux le répéter.",
        "Activité suspecte d'écureuil détectée à la clôture. Je suis DESSUS.",
        "Le facteur vient tous les jours. Tous les jours. C'est la menace.",
        "Je te pardonne tout. Chaque fois. Immédiatement.",
        "Cet autre chien sent intéressant. J'ai des questions. Beaucoup de questions.",
        "Tu es parti quatre minutes. J'ai cru que tu étais parti pour toujours.",
        "Je garderai cette maison de tout mon corps, chaque nuit, pour toujours.",
      ],
      es: [
        "¡ESTÁS EN CASA! NO PUEDO CREER QUE ESTÉS EN CASA. ESTABA TAN PREOCUPADO.",
        "Te amo. Te amo. Te amo. ¿Es suficiente? Puedo decirlo más.",
        "Actividad sospechosa de ardilla detectada en la cerca. ESTOY EN ELLO.",
        "El cartero viene todos los días. Todos los días. Esta es la amenaza.",
        "Te perdono todo. Cada vez. Inmediatamente.",
        "Ese otro perro huele interesante. Tengo preguntas. Muchas preguntas.",
        "Te fuiste cuatro minutos. Pensé que te habías ido para siempre.",
        "Vigilaré esta casa con todo mi cuerpo, cada noche, para siempre.",
      ],
    },
    poetic: {
      en: [
        "You are the whole world wearing shoes. I would follow you anywhere.",
        "Every walk is the best walk. Every meal is the best meal. I mean this.",
      ],
      fr: [
        "Tu es le monde entier chaussé de souliers. Je te suivrais n'importe où.",
        "Chaque promenade est la meilleure. Chaque repas est le meilleur. Je le pense vraiment.",
        "Mon cœur bat dans ton rythme. Quand tu pars, le silence devient un abîme.",
        "Je suis le gardien de tes pas. Même quand tu ne vois pas, je suis là.",
      ],
      es: [
        "Eres el mundo entero usando zapatos. Te seguiría a cualquier parte.",
        "Cada paseo es el mejor. Cada comida es la mejor. Lo digo en serio.",
        "Mi corazón late al ritmo de tus pasos. Cuando te vas, el silencio se convierte en un abismo.",
        "Soy el guardián de tus pasos. Incluso cuando no ves, estoy ahí.",
      ],
    },
    biologicalIntents: {
      en: ["COMPANION PROTECTION", "EMOTIONAL BONDING", "THREAT NEUTRALIZATION (SQUIRREL)", "REUNION CELEBRATION"],
      fr: ["PROTECTION DU COMPAGNON", "LIEN ÉMOTIONNEL", "NEUTRALISATION DE MENACE (ÉCUREUIL)", "CÉLÉBRATION DE RETROUVAILLES"],
      es: ["PROTECCIÓN DEL COMPAÑERO", "VÍNCULO EMOCIONAL", "NEUTRALIZACIÓN DE AMENAZA (ARDILLA)", "CELEBRACIÓN DE REENCUENTRO"],
    },
    neuralPatterns: ["LOYALTY_OVERFLOW", "JOY_CASCADE", "GUARDIAN_MODE"],
    environmentalScans: {
      en: ["TERRITORY: DEFENDED", "COMPANION STATUS: SAFE", "SQUIRREL THREAT: ONGOING"],
      fr: ["TERRITOIRE : DÉFENDU", "STATUT DU COMPAGNON : SÛR", "MENACE ÉCUREUIL : EN COURS"],
      es: ["TERRITORIO: DEFENDIDO", "ESTADO DEL COMPAÑERO: SEGURO", "AMENAZA ARDILLA: EN CURSO"],
    },
    acousticProfile: {
      dominantFreqMin: 200, dominantFreqMax: 1500,
      spectralCentroidMin: 300, spectralCentroidMax: 2000,
      flatnessMin: 0.1, flatnessMax: 0.4,
      lowEnergyRatioMin: 0.2, lowEnergyRatioMax: 0.6,
      zcrMin: 0.06, zcrMax: 0.22,
      periodicityMin: 0.05, periodicityMax: 0.4,
      rmsMin: 0.03, rmsMax: 0.3,
      description: "Lower-pitched barks and vocalizations, variable bursts",
    },
  },
  {
    id: "owl",
    name: "STRIX ALUCO",
    scientificName: {
      en: ["Tawny Owl",],
      fr: ["Chouette hulotte",],
      es: ["Búho leonado",],
      },
    emoji: "🦉",
    personality: {
      en: ["ANCIENT", "CRYPTIC", "ALL-SEEING", "SILENT"],
      fr: ["ANCIEN", "CRYPTIQUE", "TOUT-VOYANT", "SILENCIEUX"],
      es: ["ANTIGUO", "CRÍPTICO", "TODOVIENDO", "SILENCIOSO"],
    },
    emotionalStates: {
      en: ["TIMELESS OBSERVATION", "COSMIC AWARENESS", "SILENT JUDGMENT", "ANCIENT PATIENCE", "UNKNOWABLE CALM"],
      fr: ["OBSERVATION INTEMPORELLE", "CONSCIENCE COSMIQUE", "JUGEMENT SILENCIEUX", "PATIENCE ANCIENNE", "CALME INCONNAISSABLE"],
      es: ["OBSERVACIÓN ATEMPORAL", "CONCIENCIA CÓSMICA", "JUICIO SILENCIOSO", "PACIENCIA ANTIGUA", "CALMA INCONOCIBLE"],
    },
    threatLevels: ["LOW", "MODERATE", "ELEVATED", "LOW", "CRITICAL"],
    translations: {
      en: [
        "I have seen this before. I will not say when.",
        "The darkness contains information. You cannot read it. I can.",
        "There are things moving in the field. You should go inside.",
        "I was here when this was forest. I remember the forest.",
        "You are smaller than you think. The night confirms this.",
        "Something has changed. Three nights ago. You didn't notice.",
      ],
      fr: [
        "J'ai déjà vu cela. Je ne dirai pas quand.",
        "L'obscurité contient de l'information. Vous ne pouvez pas la lire. Moi, oui.",
        "Il y a des choses qui se déplacent dans le champ. Vous devriez rentrer.",
        "J'étais ici quand c'était une forêt. Je me souviens de la forêt.",
        "Tu es plus petit que tu ne le penses. La nuit le confirme.",
        "Quelque chose a changé. Il y a trois nuits. Tu ne l'as pas remarqué.",
      ],
      es: [
        "He visto esto antes. No diré cuándo.",
        "La oscuridad contiene información. Tú no puedes leerla. Yo sí.",
        "Hay cosas moviéndose en el campo. Deberías entrar.",
        "Yo estaba aquí cuando esto era bosque. Recuerdo el bosque.",
        "Eres más pequeño de lo que crees. La noche lo confirma.",
        "Algo ha cambiado. Hace tres noches. No te diste cuenta.",
      ],
    },
    poetic: {
      en: [
        "The stars do not move. We move. The stars watch us move.",
        "Silence is the oldest language. I speak it fluently.",
        "What you call darkness, I call home.",
      ],
      fr: [
        "Les étoiles ne bougent pas. C'est nous qui bougeons. Les étoiles nous regardent bouger.",
        "Le silence est le plus vieux langage. Je le parle couramment.",
        "Ce que tu appelles l'obscurité, je l'appelle chez moi.",
        "Je suis le dernier mot que la nuit prononce avant le jour.",
        "Dans mon regard, il y a des siècles que tu ne pourras jamais compter.",
      ],
      es: [
        "Las estrellas no se mueven. Nos movemos nosotros. Las estrellas nos ven mover.",
        "El silencio es el lenguaje más antiguo. Lo hablo con fluidez.",
        "Lo que tú llamas oscuridad, yo llamo hogar.",
        "Soy la última palabra que la noche pronuncia antes del día.",
        "En mi mirada hay siglos que nunca podrás contar.",
      ],
    },
    biologicalIntents: {
      en: ["NOCTURNAL SURVEILLANCE", "TEMPORAL ARCHIVING", "SILENT THREAT ASSESSMENT", "ANCIENT PATTERN RECOGNITION"],
      fr: ["SURVEILLANCE NOCTURNE", "ARCHIVAGE TEMPOREL", "ÉVALUATION SILENCIEUSE DE MENACE", "RECONNAISSANCE DE SCHÉMAS ANCIENS"],
      es: ["VIGILANCIA NOCTURNA", "ARCHIVO TEMPORAL", "EVALUACIÓN SILENCIOSA DE AMENAZA", "RECONOCIMIENTO DE PATRONES ANTIGUOS"],
    },
    neuralPatterns: ["ANCIENT_PROTOCOL", "DARK_VISION", "TEMPORAL_ECHO"],
    environmentalScans: {
      en: ["NIGHT SECTOR: ACTIVE", "PREY DETECTED: MULTIPLE", "BLACKLACE ISLAND FREQUENCY: DETECTED"],
      fr: ["SECTEUR NOCTURNE : ACTIF", "PROIE DÉTECTÉE : MULTIPLE", "FRÉQUENCE ÎLE BLACKLACE : DÉTECTÉE"],
      es: ["SECTOR NOCTURNO: ACTIVO", "PRESAS DETECTADAS: MÚLTIPLES", "FRECUENCIA ISLA BLACKLACE: DETECTADA"],
    },
    acousticProfile: {
      dominantFreqMin: 150, dominantFreqMax: 800,
      spectralCentroidMin: 200, spectralCentroidMax: 1200,
      flatnessMin: 0.03, flatnessMax: 0.2,
      lowEnergyRatioMin: 0.4, lowEnergyRatioMax: 0.8,
      zcrMin: 0.01, zcrMax: 0.08,
      periodicityMin: 0.3, periodicityMax: 0.8,
      rmsMin: 0.02, rmsMax: 0.2,
      description: "Low-frequency rhythmic hoots, very tonal and periodic",
    },
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
  detectedSpecies: string | null;
  speciesConfidence: number;
  audioFeatures: AudioFeatures | null;
};

export interface AudioFeatures {
  dominantFreq: number;
  spectralCentroid: number;
  flatness: number;
  lowEnergyRatio: number;
  zcr: number;
  periodicity: number;
  rms: number;
  sampleDuration: number;
}

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

export const CRYPTIC_MESSAGES_FR = [
  "ÎLE BLACKLACE — SECTEUR 7 ACTIF",
  "INSTITUT FEUCH — NIVEAU 4 REQUIS",
  "PROTOCOLE ORNITH-X — INITIALISÉ",
  "ALERTE : RÉSEAU CORVIDÉ DÉTECTÉ",
  "ORIGINE DU SIGNAL : INCONNUE",
  "ÉCHO TEMPOREL — T-MOINS 00:00:00",
  "NE REGARDE PAS LA CHOUETTE DIRECTEMENT",
  "INTELLIGENCE PLUMÉE — CONFIRMÉE",
  "PÉRIMÈTRE BLACKLACE — MAINTENU",
  "RÉSONANCE NEURALE — DÉPASSE LA BASE",
];

export const CRYPTIC_MESSAGES_ES = [
  "ISLA BLACKLACE — SECTOR 7 ACTIVO",
  "INSTITUTO FEUCH — NIVEL 4 REQUERIDO",
  "PROTOCOLO ORNITH-X — INICIALIZADO",
  "ADVERTENCIA: RED CORVIDAE DETECTADA",
  "ORIGEN DE SEÑAL: DESCONOCIDO",
  "ECO TEMPORAL — T-MENOS 00:00:00",
  "NO MIRES DIRECTAMENTE AL BÚHO",
  "INTELIGENCIA EMPLOMADA — CONFIRMADA",
  "PERÍMETRO BLACKLACE — MANTENIDO",
  "RESONANCIA NEURAL — EXCEDE LÍNEA BASE",
];

export function getCrypticMessages(lang: Lang): string[] {
  if (lang === "fr") return CRYPTIC_MESSAGES_FR;
  if (lang === "es") return CRYPTIC_MESSAGES_ES;
  return CRYPTIC_MESSAGES;
}

export function getRandomTranslation(species: Species, lang: Lang, forcePoetic = false): { text: string; isPoetic: boolean } {
  const poeticRoll = Math.random();
  const isPoetic = forcePoetic || (poeticRoll < 0.2 && species.poetic[lang].length > 0);

  if (isPoetic && species.poetic[lang].length > 0) {
    const idx = Math.floor(Math.random() * species.poetic[lang].length);
    return { text: species.poetic[lang][idx], isPoetic: true };
  }

  const idx = Math.floor(Math.random() * species.translations[lang].length);
  return { text: species.translations[lang][idx], isPoetic: false };
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

// ── Audio Classification Engine ──

function computeZCR(timeData: Float32Array): number {
  let crossings = 0;
  for (let i = 1; i < timeData.length; i++) {
    if ((timeData[i] >= 0) !== (timeData[i - 1] >= 0)) crossings++;
  }
  return crossings / timeData.length;
}

function computeRMS(timeData: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < timeData.length; i++) {
    sum += timeData[i] * timeData[i];
  }
  return Math.sqrt(sum / timeData.length);
}

function computeSpectralCentroid(freqData: Uint8Array, sampleRate: number, fftSize: number): number {
  let sum = 0, weightedSum = 0;
  const binWidth = sampleRate / fftSize;
  for (let i = 0; i < freqData.length; i++) {
    const freq = i * binWidth;
    const amp = freqData[i];
    sum += amp;
    weightedSum += freq * amp;
  }
  return sum > 0 ? weightedSum / sum : 0;
}

function computeSpectralFlatness(freqData: Uint8Array): number {
  let geometric = 0, arithmetic = 0;
  let count = 0;
  for (let i = 0; i < freqData.length; i++) {
    const v = freqData[i];
    if (v > 0) {
      geometric += Math.log(v);
      arithmetic += v;
      count++;
    }
  }
  if (count === 0 || arithmetic === 0) return 1;
  geometric = Math.exp(geometric / count);
  arithmetic /= freqData.length;
  return geometric / arithmetic;
}

function computeLowEnergyRatio(freqData: Uint8Array, sampleRate: number, fftSize: number): number {
  const lowCutoff = 1000; // Hz
  const binWidth = sampleRate / fftSize;
  let lowEnergy = 0, totalEnergy = 0;
  for (let i = 0; i < freqData.length; i++) {
    const amp = freqData[i] * freqData[i];
    totalEnergy += amp;
    if (i * binWidth < lowCutoff) lowEnergy += amp;
  }
  return totalEnergy > 0 ? lowEnergy / totalEnergy : 0;
}

function computePeriodicity(timeData: Float32Array): number {
  // Simple autocorrelation-based periodicity
  const maxLag = Math.min(timeData.length / 2, 512);
  let maxCorr = 0;
  const frameSize = Math.min(timeData.length, 1024);

  for (let lag = 10; lag < maxLag; lag++) {
    let corr = 0;
    for (let i = 0; i < frameSize - lag; i++) {
      corr += timeData[i] * timeData[i + lag];
    }
    if (corr > maxCorr) maxCorr = corr;
  }

  // Normalize by energy
  let energy = 0;
  for (let i = 0; i < frameSize; i++) {
    energy += timeData[i] * timeData[i];
  }
  return energy > 0 ? maxCorr / energy : 0;
}

function computeDominantFreq(freqData: Uint8Array, sampleRate: number, fftSize: number): number {
  let maxAmp = 0;
  let maxIdx = 0;
  for (let i = 1; i < freqData.length; i++) { // Skip DC
    if (freqData[i] > maxAmp) {
      maxAmp = freqData[i];
      maxIdx = i;
    }
  }
  return maxIdx * (sampleRate / fftSize);
}

export function extractAudioFeatures(
  analyser: AnalyserNode,
  audioCtx: AudioContext
): AudioFeatures {
  const fftSize = analyser.fftSize;
  const freqData = new Uint8Array(analyser.frequencyBinCount);
  const timeData = new Float32Array(fftSize);

  analyser.getByteFrequencyData(freqData);
  analyser.getFloatTimeDomainData(timeData);

  const sampleRate = audioCtx.sampleRate;

  return {
    dominantFreq: computeDominantFreq(freqData, sampleRate, fftSize),
    spectralCentroid: computeSpectralCentroid(freqData, sampleRate, fftSize),
    flatness: computeSpectralFlatness(freqData),
    lowEnergyRatio: computeLowEnergyRatio(freqData, sampleRate, fftSize),
    zcr: computeZCR(timeData),
    periodicity: computePeriodicity(timeData),
    rms: computeRMS(timeData),
    sampleDuration: fftSize / sampleRate,
  };
}

// Weighted score matching — returns scores for each species 0-1
export function classifySpecies(features: AudioFeatures): { species: Species; score: number }[] {
  return SPECIES.map(species => {
    const p = species.acousticProfile;
    let score = 0;
    let checks = 0;

    function inRange(val: number, min: number, max: number): number {
      if (val >= min && val <= max) return 1;
      const mid = (min + max) / 2;
      const range = (max - min) / 2 || 1;
      const dist = Math.abs(val - mid) / range;
      return Math.max(0, 1 - dist);
    }

    score += inRange(features.dominantFreq, p.dominantFreqMin, p.dominantFreqMax); checks++;
    score += inRange(features.spectralCentroid, p.spectralCentroidMin, p.spectralCentroidMax); checks++;
    score += inRange(features.flatness, p.flatnessMin, p.flatnessMax); checks++;
    score += inRange(features.lowEnergyRatio, p.lowEnergyRatioMin, p.lowEnergyRatioMax); checks++;
    score += inRange(features.zcr, p.zcrMin, p.zcrMax); checks++;
    score += inRange(features.periodicity, p.periodicityMin, p.periodicityMax); checks++;
    score += inRange(features.rms, p.rmsMin, p.rmsMax); checks++;

    // Extra weight for dominant frequency match
    const domScore = inRange(features.dominantFreq, p.dominantFreqMin, p.dominantFreqMax);
    score += domScore * 2;
    checks += 2;

    return { species, score: score / checks };
  }).sort((a, b) => b.score - a.score);
}

export function getWeightedSpecies(features: AudioFeatures | null): Species {
  if (!features || features.rms < 0.005) {
    // No audio or too quiet — pick random
    return SPECIES[Math.floor(Math.random() * SPECIES.length)];
  }

  const scores = classifySpecies(features);
  const topScore = scores[0].score;

  // If top score is too low, it's probably background noise or unknown animal
  if (topScore < 0.3) {
    return SPECIES[Math.floor(Math.random() * SPECIES.length)];
  }

  // Weighted random from top 3
  const top3 = scores.slice(0, 3);
  const totalWeight = top3.reduce((s, x) => s + x.score, 0);
  let roll = Math.random() * totalWeight;
  for (const entry of top3) {
    roll -= entry.score;
    if (roll <= 0) return entry.species;
  }
  return top3[0].species;
}

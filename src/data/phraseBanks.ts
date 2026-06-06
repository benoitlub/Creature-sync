import type { Lang, Species } from "./animals";

type PhraseRarity = "common" | "uncommon" | "rare" | "legendary";
type PhrasePhase = "indifferent" | "minorIrritation" | "curious" | "theory";

export type PhraseEntry = {
  text: string;
  rarity?: PhraseRarity;
  phase?: PhrasePhase;
  seasonal?: Array<"spring" | "summer" | "autumn" | "winter">;
  poetic?: boolean;
};

type PhraseBank = Partial<Record<string, PhraseEntry[]>>;

const RECENT_KEY = "creature-sync-recent-phrases-v1";
const MAX_RECENT_PER_SPECIES = 12;

function entry(text: string, phase: PhrasePhase = "indifferent", rarity: PhraseRarity = "common", poetic = false): PhraseEntry {
  return { text, phase, rarity, poetic };
}

const GENERIC_BIRD_FR: PhraseEntry[] = [
  entry("Le bipède traverse la zone. Les feuilles poursuivent leurs activités."),
  entry("Le mammifère vertical produit du bruit. Aucun ver ne semble impressionné."),
  entry("Le rectangle lumineux attire son regard. La branche conserve l'avantage stratégique."),
  entry("Présence bipède notée. Impact écologique : probablement décoratif."),
  entry("Le bipède semble chercher quelque chose. La mousse refuse de commenter."),
  entry("Les chaussures sont revenues. Les brindilles demandent réparation.", "minorIrritation", "uncommon"),
  entry("Le canidé paraît responsable de la promenade. L'humain attaché ralentit l'ensemble.", "curious", "rare"),
  entry("La vieille rumeur dit qu'un bipède a déjà regardé le ciel sans consulter sa boîte. Témoignage fragile.", "theory", "legendary"),
];

export const PHRASE_BANKS_FR: PhraseBank = {
  blackbird: [
    entry("Cette haie fonctionne parfaitement. Merci de ne pas la traverser avec vos idées."),
    entry("Le bipède traverse ma haie avec son rectangle lumineux. Sa priorité est confuse. La mienne est territoriale."),
    entry("Cette branche, ce rayon de lumière et les trois mètres autour sont sous administration vocale depuis l'aube."),
    entry("Le mammifère vertical traverse mon territoire depuis plusieurs saisons. Je n'ai toujours pas identifié sa fonction écologique.", "curious", "rare"),
    entry("Le bipède croit traverser ma haie. Techniquement, c'est ma haie qui le laisse passer.", "theory", "rare"),
  ],
  robin: [
    entry("Trois vers. Deux feuilles. Un bipède. Je sais déjà ce qui mérite mon attention."),
    entry("Le sentier appartient au matin. Je tolère les bottes, mais seulement si elles ratent les vers."),
    entry("Le bipède consulte sa boîte qui parle. Pendant ce temps, quatre vers non déclarés changent de juridiction."),
    entry("Il a besoin d'une application pour retrouver son chemin. Je suis un gramme de plumes. Nous n'avons pas les mêmes contraintes.", "curious", "rare"),
    entry("Le bipède mesure presque deux mètres. Son efficacité reste théorique.", "minorIrritation", "uncommon"),
  ],
  great_tit: [
    entry("Information prioritaire : je suis ici. Mise à jour : je suis toujours ici. Troisième diffusion dans deux secondes."),
    entry("Message répété pour les mammifères verticaux qui avancent comme des troncs mal informés."),
    entry("J'ai pris dix-sept décisions avant son premier café."),
    entry("Le mammifère géant semble occupé. Je suppose qu'il essaie encore de comprendre une poignée de porte.", "minorIrritation", "uncommon"),
    entry("Le bipède observe son rectangle lumineux. Pendant ce temps, une chenille prend trois décisions importantes.", "curious", "rare"),
  ],
  blue_tit: [
    entry("J'ai inspecté sept brindilles, deux ombres et une gouttière. Le bipède, lui, regarde son caillou lumineux."),
    entry("Le monde est trop lent. J'accélère localement entre la branche, la feuille, la gouttière et une décision minuscule mais urgente."),
    entry("Petite taille, grande logistique. Grand bipède, logistique discutable."),
    entry("Le bipède nourrit son rectangle depuis vingt minutes. Je ne comprends pas son cycle reproductif.", "theory", "rare"),
  ],
  chaffinch: [
    entry("Bulletin du matin : humidité acceptable, rival trop proche, amour probable, bipède sans importance immédiate."),
    entry("Le protocole du matin est lancé. Les feuilles suivent. Les insectes négocient. Les bipèdes arrivent en retard dans leurs propres pensées."),
    entry("Répétition numéro douze : toujours impeccable. Le bipède n'a toujours pas compris le refrain."),
    entry("Le bipède revient souvent. Je crois qu'il collectionne les matins.", "curious", "rare"),
  ],
  wren: [
    entry("J'ai la taille d'une erreur de perspective, mais mon planning territorial est complet jusqu'à midi."),
    entry("La mousse m'appartient. Le tronc aussi. Le bipède peut garder sa boîte parlante, elle ne pond même pas d'insectes."),
    entry("Je suis minuscule, donc j'utilise le volume réglementaire maximal."),
    entry("Le bipède ignore la mousse. Voilà pourquoi il n'est pas consulté.", "minorIrritation", "uncommon"),
  ],
  jay: [
    entry("Grand bipède signalé. Bruit de feuilles élevé, menace faible, coordination des pattes discutable."),
    entry("Transmission aux chênes supérieurs : glands sous surveillance, bipède en transit, aucune intelligence de branche détectée."),
    entry("Les glands sont comptés. Les humains, seulement quand ils gênent."),
    entry("Le bipède croit qu'il m'observe. C'est une interprétation courageuse des événements.", "curious", "rare"),
  ],
  magpie: [
    entry("Je n'ai rien volé. J'ai déplacé une possibilité brillante vers un avenir plus compétent."),
    entry("Le bipède serre un objet brillant contre sa face. Mauvais usage. Très mauvais usage."),
    entry("Conversation en cours avec moi-même. Je gagne avec une marge confortable."),
    entry("Les humains appellent cela de la propriété. Concept fascinant pour une espèce qui perd ses clés.", "theory", "rare"),
    entry("Cet objet brillant était abandonné. Son propriétaire l'ignorait depuis plusieurs jours. Je l'ai adopté.", "theory", "legendary"),
  ],
  carrion_crow: [
    entry("Ce secteur est sous administration noire. Les bipèdes peuvent traverser s'ils évitent de casser le silence avec leurs sacs."),
    entry("Le conseil note un mammifère vertical distrait par sa boîte à attention. Risque : trébuchement. Intérêt : limité."),
    entry("Le bipède a trébuché seul. Aucune intervention extérieure n'a été nécessaire."),
    entry("Le conseil a étudié le comportement humain. Les conclusions sont confidentielles par respect pour les familles.", "theory", "rare"),
    entry("Le bipède pense être l'espèce dominante. Cette théorie circule surtout chez les bipèdes.", "theory", "legendary"),
  ],
  crow: [
    entry("Le conseil a étudié le comportement humain. Les conclusions sont confidentielles par respect pour les familles.", "theory", "rare"),
    entry("Cet humain cherche ses clés depuis huit minutes. Elles sont dans sa main. Le conseil observe en silence.", "curious", "rare"),
    entry("Nous avons simulé une intelligence humaine. Les résultats étaient conformes aux observations.", "theory", "legendary"),
  ],
  wood_pigeon: [
    entry("Cette branche accepte mon poids avec dignité. C'est plus que ce que je peux dire du mobilier humain."),
    entry("La paix consiste à roucouler plus fort que les problèmes, surtout ceux qui portent des chaussures et consultent des rectangles."),
    entry("Le bipède croit avoir choisi ce banc. Le conseil des pigeons avait déjà validé sa réservation."),
    entry("Les humains pensent nous nourrir. Nous les entraînons depuis des générations.", "theory", "rare"),
  ],
  pigeon: [
    entry("Le bipède croit nous nourrir. Nous entretenons son illusion d'utilité."),
    entry("Le pain est temporaire. Les miettes sont éternelles.", "indifferent", "uncommon", true),
    entry("Ce banc était réservé. Le mammifère vertical sert actuellement de paysage."),
    entry("Nous n'avons jamais corrigé l'interprétation humaine de la distribution de pain.", "theory", "rare"),
  ],
  green_woodpecker: [
    entry("La pelouse sait où sont les fourmis. Le bipède croit savoir où il va. Nous avons tous nos fictions."),
    entry("Le sol confirme : secrets comestibles en profondeur. La boîte parlante du bipède ne confirme rien d'utile."),
    entry("Fourmis probables. Dignité facultative."),
  ],
  great_spotted_woodpecker: [
    entry("Je frappe pour vérifier l'architecture du monde. Les bipèdes font pareil sur leurs boîtes plates, mais sans écouter le bois."),
    entry("Tronc numéro trois : réponse claire. Bipède numéro un : gestes larges, signal faible."),
    entry("Le bois répond. C'est déjà plus que certains mammifères."),
  ],
  ring_necked_parakeet: [
    entry("Je traverse le quartier comme une alarme tropicale en mission. Les bipèdes lèvent leurs boîtes. Très bien, qu'ils documentent le vert."),
    entry("Ce balcon est-il comestible, territorialement exploitable, ou seulement une provocation architecturale ?"),
    entry("Je viens d'un autre continent. Pourtant c'est moi qui ai l'air chez moi."),
    entry("Ils me photographient comme une curiosité. Je ressens la même chose à leur sujet.", "curious", "rare"),
    entry("Le bipède habite ici depuis toujours et utilise encore un GPS.", "theory", "legendary"),
  ],
  nightingale: [
    entry("La nuit comprend mieux que vous. Votre boîte lumineuse, elle, n'écoute même pas entre les notes."),
    entry("Je transforme une haie ordinaire en opéra territorial. Les humains appellent ça du bruit parce qu'ils vivent dans des murs."),
    entry("J'ai chanté toute la nuit. Le bipède a sorti son téléphone pour enregistrer. Nous sommes donc deux artistes.", "curious", "rare"),
    entry("Ils appellent cela la nature. C'est adorable.", "theory", "rare"),
  ],
  house_sparrow: [
    entry("Réunion de façade confirmée. Ordre du jour : miettes, gouttière, hiérarchie locale, boîte à sandwich mal fermée."),
    entry("Je ne crie pas, je corrige l'urbanisme sonore. Les bipèdes ajoutent des moteurs, je répare avec du piaillement."),
    entry("Le grand immeuble produit parfois du pain. Nous surveillons avec davantage de sérieux que son gardien."),
  ],
  owl: [
    entry("Le bipède appelle cela la nuit. Terme approximatif, mais l'effort est noté."),
    entry("L'obscurité contient de l'information. Le mammifère vertical a préféré allumer son rectangle."),
    entry("Quelque chose a changé il y a trois nuits. Le bipède n'a remarqué que la batterie de sa boîte."),
  ],
  dog: [
    entry("Je promène mon humain. Il croit tenir la laisse. Cette fiction le rassure."),
    entry("Le bipède attaché avance lentement, mais il ramasse les conséquences. Utile."),
    entry("Activité suspecte d'écureuil détectée. Mon humain n'a rien compris, comme prévu."),
  ],
  cat: [
    entry("Le bipède pense habiter ici. J'apprécie sa confiance."),
    entry("Je ne dors pas. J'évalue les faiblesses du mobilier et du mammifère de service."),
    entry("La fenêtre me donne tout. Le bipède croit me donner la fenêtre."),
  ],
};

function getSeason(date = new Date()): "spring" | "summer" | "autumn" | "winter" {
  const month = date.getMonth() + 1;
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}

function rarityWeight(rarity: PhraseRarity = "common") {
  if (rarity === "legendary") return 0.025;
  if (rarity === "rare") return 0.1;
  if (rarity === "uncommon") return 0.28;
  return 1;
}

function safeReadRecent(): Record<string, string[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function rememberPhrase(speciesId: string, text: string) {
  if (typeof window === "undefined") return;
  try {
    const recent = safeReadRecent();
    const list = [text, ...(recent[speciesId] || []).filter(item => item !== text)].slice(0, MAX_RECENT_PER_SPECIES);
    window.localStorage.setItem(RECENT_KEY, JSON.stringify({ ...recent, [speciesId]: list }));
  } catch {
    // localStorage can fail in private mode; the app should still translate.
  }
}

function pickWeighted(entries: PhraseEntry[]): PhraseEntry {
  const weighted = entries.map(item => ({ item, weight: rarityWeight(item.rarity) }));
  const total = weighted.reduce((sum, item) => sum + item.weight, 0) || 1;
  let cursor = Math.random() * total;
  for (const item of weighted) {
    cursor -= item.weight;
    if (cursor <= 0) return item.item;
  }
  return entries[0];
}

export function getEvolvingTranslation(species: Species, lang: Lang): { text: string; isPoetic: boolean } {
  if (lang !== "fr") {
    const translations = species.translations[lang] || species.translations.fr || [];
    const fallback = translations[Math.floor(Math.random() * translations.length)] || species.name;
    return { text: fallback, isPoetic: false };
  }

  const bank = [...(PHRASE_BANKS_FR[species.id] || []), ...GENERIC_BIRD_FR];
  const season = getSeason();
  const seasonal = bank.filter(item => !item.seasonal || item.seasonal.includes(season));
  const recent = safeReadRecent()[species.id] || [];
  const available = seasonal.filter(item => !recent.includes(item.text));
  const pool = available.length > 0 ? available : seasonal;
  const selected = pickWeighted(pool.length > 0 ? pool : GENERIC_BIRD_FR);
  rememberPhrase(species.id, selected.text);
  return { text: selected.text, isPoetic: Boolean(selected.poetic || selected.rarity === "legendary") };
}

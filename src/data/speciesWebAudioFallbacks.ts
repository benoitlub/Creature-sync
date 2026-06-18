import type { Lang } from "./translations";

type WebAudioFallback = {
  ids: string[];
  latin: string;
  labels: Record<Lang, string>;
  playableUrl?: string;
  sourceUrl: string;
  sourceLabel: string;
  credit: string;
  license: string;
  kind: "playable" | "search";
};

const FALLBACKS: WebAudioFallback[] = [
  {
    ids: ["dunnock", "prunella_modularis"],
    latin: "PRUNELLA MODULARIS",
    labels: { fr: "Accenteur mouchet", en: "Dunnock", es: "Acentor común" },
    playableUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Dunnock%20%28Prunella%20modularis%29%20%28W1CDR0001422%20BD6%29.ogg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Dunnock_(Prunella_modularis)_(W1CDR0001422_BD6).ogg",
    sourceLabel: "Wikimedia Commons",
    credit: "Wikimedia Commons",
    license: "Creative Commons / source à vérifier",
    kind: "playable",
  },
  {
    ids: ["song_thrush", "turdus_philomelos"],
    latin: "TURDUS PHILOMELOS",
    labels: { fr: "Grive musicienne", en: "Song thrush", es: "Zorzal común" },
    playableUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Turdus%20philomelos.ogg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Turdus_philomelos.ogg",
    sourceLabel: "Wikimedia Commons",
    credit: "Wikimedia Commons",
    license: "Creative Commons / source à vérifier",
    kind: "playable",
  },
  {
    ids: ["tawny_owl", "owl", "strix_aluco"],
    latin: "STRIX ALUCO",
    labels: { fr: "Chouette hulotte", en: "Tawny owl", es: "Cárabo común" },
    playableUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Tawny%20Owl%20%28Strix%20aluco%29%20%28W1CDR0001519%20BD8%29.ogg",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Tawny_Owl_(Strix_aluco)_(W1CDR0001519_BD8).ogg",
    sourceLabel: "Wikimedia Commons",
    credit: "Wikimedia Commons",
    license: "Creative Commons / source à vérifier",
    kind: "playable",
  },
  {
    ids: ["red_fox", "fox", "vulpes_vulpes"],
    latin: "VULPES VULPES",
    labels: { fr: "Renard roux", en: "Red fox", es: "Zorro rojo" },
    playableUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/FuchsSchreit.mp3",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:FuchsSchreit.mp3",
    sourceLabel: "Wikimedia Commons",
    credit: "Wikimedia Commons",
    license: "Creative Commons / source à vérifier",
    kind: "playable",
  },
  {
    ids: ["eurasian_nuthatch", "sitta_europaea"],
    latin: "SITTA EUROPAEA",
    labels: { fr: "Sittelle torchepot", en: "Eurasian nuthatch", es: "Trepador azul" },
    sourceUrl: "https://xeno-canto.org/explore?query=Sitta%20europaea",
    sourceLabel: "Xeno-canto search",
    credit: "xeno-canto",
    license: "Creative Commons selon fiche source",
    kind: "search",
  },
  {
    ids: ["short_toed_treecreeper", "certhia_brachydactyla"],
    latin: "CERTHIA BRACHYDACTYLA",
    labels: { fr: "Grimpereau des jardins", en: "Short-toed treecreeper", es: "Agateador europeo" },
    sourceUrl: "https://xeno-canto.org/explore?query=Certhia%20brachydactyla",
    sourceLabel: "Xeno-canto search",
    credit: "xeno-canto",
    license: "Creative Commons selon fiche source",
    kind: "search",
  },
  {
    ids: ["white_wagtail", "motacilla_alba"],
    latin: "MOTACILLA ALBA",
    labels: { fr: "Bergeronnette grise", en: "White wagtail", es: "Lavandera blanca" },
    sourceUrl: "https://xeno-canto.org/explore?query=Motacilla%20alba",
    sourceLabel: "Xeno-canto search",
    credit: "xeno-canto",
    license: "Creative Commons selon fiche source",
    kind: "search",
  },
  {
    ids: ["blackcap", "sylvia_atricapilla"],
    latin: "SYLVIA ATRICAPILLA",
    labels: { fr: "Fauvette à tête noire", en: "Blackcap", es: "Curruca capirotada" },
    sourceUrl: "https://xeno-canto.org/explore?query=Sylvia%20atricapilla",
    sourceLabel: "Xeno-canto search",
    credit: "xeno-canto",
    license: "Creative Commons selon fiche source",
    kind: "search",
  },
  {
    ids: ["beech_marten", "fouine", "martes_foina"],
    latin: "MARTES FOINA",
    labels: { fr: "Fouine", en: "Beech marten", es: "Garduña" },
    sourceUrl: "https://commons.wikimedia.org/w/index.php?search=Martes+foina+sound&title=Special:MediaSearch&type=audio",
    sourceLabel: "Recherche audio Wikimedia Commons",
    credit: "web audio search",
    license: "à vérifier avant import local",
    kind: "search",
  },
  {
    ids: ["hedgehog", "erinaceus_europaeus"],
    latin: "ERINACEUS EUROPAEUS",
    labels: { fr: "Hérisson commun", en: "European hedgehog", es: "Erizo europeo" },
    sourceUrl: "https://commons.wikimedia.org/w/index.php?search=Erinaceus+europaeus+sound&title=Special:MediaSearch&type=audio",
    sourceLabel: "Recherche audio Wikimedia Commons",
    credit: "web audio search",
    license: "à vérifier avant import local",
    kind: "search",
  },
  {
    ids: ["cat", "felis_catus"],
    latin: "FELIS CATUS",
    labels: { fr: "Chat", en: "Cat", es: "Gato" },
    sourceUrl: "https://commons.wikimedia.org/w/index.php?search=Felis+catus+meow&title=Special:MediaSearch&type=audio",
    sourceLabel: "Recherche audio Wikimedia Commons",
    credit: "web audio search",
    license: "à vérifier avant import local",
    kind: "search",
  },
  {
    ids: ["dog", "canis_lupus_familiaris"],
    latin: "CANIS LUPUS FAMILIARIS",
    labels: { fr: "Chien", en: "Dog", es: "Perro" },
    sourceUrl: "https://commons.wikimedia.org/w/index.php?search=dog+bark&title=Special:MediaSearch&type=audio",
    sourceLabel: "Recherche audio Wikimedia Commons",
    credit: "web audio search",
    license: "à vérifier avant import local",
    kind: "search",
  },
];

function normalize(value = "") {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}

export function getSpeciesWebAudioFallback(item: { key?: string; label?: string; latin?: string }, lang: Lang = "fr") {
  const key = normalize(item.key || "");
  const label = normalize(item.label || "");
  const latin = normalize(item.latin || "");

  const fallback = FALLBACKS.find(entry => {
    const entryLatin = normalize(entry.latin);
    const localizedLabel = normalize(entry.labels[lang] || entry.labels.fr);
    return entry.ids.some(id => normalize(id) === key || normalize(id) === label)
      || entryLatin === latin
      || entryLatin === key
      || localizedLabel === label
      || (entryLatin && latin.includes(entryLatin));
  });

  if (!fallback) return null;
  return fallback;
}

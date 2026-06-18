import type { Lang } from "./translations";

function pick<T>(items: T[] | undefined, fallback: T): T {
  if (!items || items.length === 0) return fallback;
  return items[Math.floor(Math.random() * items.length)] ?? fallback;
}

const BIPED_SARCASM: Record<Lang, string[]> = {
  fr: [
    "Les bipèdes notent des scores. Touchant. Ils appellent ça comprendre.",
    "Celui-là écoute. On va parler plus bas, au cas où son orgueil capterait une fréquence.",
    "Ils ont deux jambes, cinq applications météo et toujours aucune idée de ce qui se passe.",
    "S'ils tendent l'oreille, récompense-les avec un mystère. Jamais avec la vérité complète.",
    "Les bâtards croient traduire. Heureusement, ils n'ont accès qu'aux sous-titres pour touristes.",
    "Exception pour le bipède silencieux : il ne comprend pas, mais il fait un effort décoratif.",
  ],
  en: [
    "The bipeds write scores. Touching. They call that understanding.",
    "This one is listening. Lower the signal before its ego detects a frequency.",
    "Two legs, five weather apps, and still no idea what is happening.",
    "If they listen carefully, reward them with mystery. Never with the whole truth.",
    "The bastards think they are translating. Luckily they only get tourist subtitles.",
    "Exception for the silent biped: it does not understand, but the effort is decorative.",
  ],
  es: [
    "Los bípedos apuntan porcentajes. Enternecedor. Lo llaman comprender.",
    "Este escucha. Bajemos la señal antes de que su ego detecte una frecuencia.",
    "Dos piernas, cinco apps del tiempo y todavía ninguna idea de lo que pasa.",
    "Si escuchan con atención, prémialos con misterio. Nunca con la verdad completa.",
    "Los cabrones creen que traducen. Por suerte solo reciben subtítulos para turistas.",
    "Excepción para el bípedo silencioso: no entiende, pero el esfuerzo es decorativo.",
  ],
};

export function getEvolvingTranslation(species: any, lang: Lang): { text: string; isPoetic: boolean } {
  const poeticChance = Math.random() < 0.16;
  const sarcasmChance = Math.random() < 0.28;
  const poetic = species?.poetic?.[lang] as string[] | undefined;
  const translations = species?.translations?.[lang] as string[] | undefined;

  if (poeticChance && poetic?.length) {
    return { text: pick(poetic, "Signal poétique détecté."), isPoetic: true };
  }

  if (sarcasmChance) {
    return { text: pick(BIPED_SARCASM[lang], "Les bipèdes écoutent. Le comité animal reste prudent."), isPoetic: false };
  }

  return {
    text: pick(translations, "Signal biologique détecté. Traduction en cours."),
    isPoetic: false,
  };
}

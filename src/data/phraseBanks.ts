import type { Lang } from "./translations";

function pick<T>(items: T[] | undefined, fallback: T): T {
  if (!items || items.length === 0) return fallback;
  return items[Math.floor(Math.random() * items.length)] ?? fallback;
}

export function getEvolvingTranslation(species: any, lang: Lang): { text: string; isPoetic: boolean } {
  const poeticChance = Math.random() < 0.18;
  const poetic = species?.poetic?.[lang] as string[] | undefined;
  const translations = species?.translations?.[lang] as string[] | undefined;

  if (poeticChance && poetic?.length) {
    return { text: pick(poetic, "Signal poétique détecté."), isPoetic: true };
  }

  return {
    text: pick(translations, "Signal biologique détecté. Traduction en cours."),
    isPoetic: false,
  };
}

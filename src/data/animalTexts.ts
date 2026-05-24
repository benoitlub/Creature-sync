import type { Lang } from "./translations";
import type { AnimalId } from "./animals";

export type AnimalTextProfile = {
  personality: Record<Lang, string[]>;
  emotionalStates: Record<Lang, string[]>;
  translations: Record<Lang, string[]>;
  poetic: Record<Lang, string[]>;
  biologicalIntents: Record<Lang, string[]>;
  environmentalScans: Record<Lang, string[]>;
  neuralPatterns: string[];
};

export const ANIMAL_TEXTS: Record<AnimalId, AnimalTextProfile> = {
  crow: {
    personality: {
      en: ["CYNICAL"],
      fr: ["CYNIQUE"],
      es: ["CÍNICO"]
    },
    emotionalStates: {
      en: ["CONTEMPTUOUS OBSERVATION"],
      fr: ["CONTEMPLATION MÉPRISANTE"],
      es: ["OBSERVACIÓN DESPECTIVA"]
    },
    translations: {
      en: ["This human knows too much. Flag for monitoring."],
      fr: ["Cet humain en sait trop. Marquer pour surveillance."],
      es: ["Este humano sabe demasiado. Marcar para vigilancia."]
    },
    poetic: {
      en: ["Everything shiny is a wound that caught the light."],
      fr: ["Tout ce qui brille est une blessure qui a attrapé la lumière."],
      es: ["Todo lo que brilla es una herida que atrapó la luz."]
    },
    biologicalIntents: {
      en: ["RESOURCE ASSESSMENT"],
      fr: ["ÉVALUATION DES RESSOURCES"],
      es: ["EVALUACIÓN DE RECURSOS"]
    },
    environmentalScans: {
      en: ["URBAN ZONE — CONTROLLED"],
      fr: ["ZONE URBAINE — CONTRÔLÉE"],
      es: ["ZONA URBANA — CONTROLADA"]
    },
    neuralPatterns: ["RECURSIVE_LOOP"]
  }

};

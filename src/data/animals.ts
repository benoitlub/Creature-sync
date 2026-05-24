import type { Lang } from "./animals";
import { ANIMAL_TEXTS } from "./animalTexts";

export type AnimalId = "crow" | "pigeon" | "duck" | "cat" | "dog" | "owl";

export type Animal = {
  id: AnimalId;
  name: string;
  scientificName: Record<Lang, string>;
  emoji: string;
  acousticProfile: {
    dominantFreqMin: number;
    dominantFreqMax: number;
    spectralCentroidMin: number;
    spectralCentroidMax: number;
    flatnessMin: number;
    flatnessMax: number;
    lowEnergyRatioMin: number;
    lowEnergyRatioMax: number;
    zcrMin: number;
    zcrMax: number;
    periodicityMin: number;
    periodicityMax: number;
    rmsMin: number;
    rmsMax: number;
    description: string;
  };
};

export const ANIMALS: Animal[] = [
  {
    id: "crow",
    name: "CORVUS CORAX",
    scientificName: {
      en: "Common Crow",
      fr: "Corbeau commun",
      es: "Cuervo común",
    },
    emoji: "🐦‍⬛",
    acousticProfile: {
      dominantFreqMin: 800,
      dominantFreqMax: 4000,
      spectralCentroidMin: 1200,
      spectralCentroidMax: 5000,
      flatnessMin: 0.15,
      flatnessMax: 0.45,
      lowEnergyRatioMin: 0.1,
      lowEnergyRatioMax: 0.4,
      zcrMin: 0.08,
      zcrMax: 0.25,
      periodicityMin: 0.1,
      periodicityMax: 0.5,
      rmsMin: 0.02,
      rmsMax: 0.25,
      description: "Harsh, wide-spectrum vocalizations with irregular bursts",
    },
  },
  {
    id: "pigeon",
    name: "COLUMBA LIVIA",
    scientificName: {
      en: "Urban Pigeon",
      fr: "Pigeon urbain",
      es: "Paloma urbana",
    },
    emoji: "🕊️",
    acousticProfile: {
      dominantFreqMin: 200,
      dominantFreqMax: 1200,
      spectralCentroidMin: 400,
      spectralCentroidMax: 2000,
      flatnessMin: 0.05,
      flatnessMax: 0.25,
      lowEnergyRatioMin: 0.3,
      lowEnergyRatioMax: 0.7,
      zcrMin: 0.02,
      zcrMax: 0.12,
      periodicityMin: 0.2,
      periodicityMax: 0.6,
      rmsMin: 0.01,
      rmsMax: 0.15,
      description: "Smooth, low-frequency cooing with gentle periodicity",
    },
  },
  {
    id: "duck",
    name: "ANAS PLATYRHYNCHOS",
    scientificName: {
      en: "Mallard Duck",
      fr: "Canard colvert",
      es: "Pato real",
    },
    emoji: "🦆",
    acousticProfile: {
      dominantFreqMin: 300,
      dominantFreqMax: 1500,
      spectralCentroidMin: 500,
      spectralCentroidMax: 2500,
      flatnessMin: 0.05,
      flatnessMax: 0.3,
      lowEnergyRatioMin: 0.25,
      lowEnergyRatioMax: 0.65,
      zcrMin: 0.03,
      zcrMax: 0.15,
      periodicityMin: 0.15,
      periodicityMax: 0.55,
      rmsMin: 0.02,
      rmsMax: 0.2,
      description: "Quacking with moderate pitch, smooth harmonic structure",
    },
  },
  {
    id: "cat",
    name: "FELIS CATUS",
    scientificName: {
      en: "Domestic Cat",
      fr: "Chat domestique",
      es: "Gato doméstico",
    },
    emoji: "🐱",
    acousticProfile: {
      dominantFreqMin: 500,
      dominantFreqMax: 3000,
      spectralCentroidMin: 800,
      spectralCentroidMax: 4000,
      flatnessMin: 0.08,
      flatnessMax: 0.3,
      lowEnergyRatioMin: 0.15,
      lowEnergyRatioMax: 0.5,
      zcrMin: 0.05,
      zcrMax: 0.18,
      periodicityMin: 0.1,
      periodicityMax: 0.6,
      rmsMin: 0.01,
      rmsMax: 0.2,
      description: "High-pitched meows and purrs, tonal and periodic",
    },
  },
  {
    id: "dog",
    name: "CANIS LUPUS FAMILIARIS",
    scientificName: {
      en: "Domestic Dog",
      fr: "Chien domestique",
      es: "Perro doméstico",
    },
    emoji: "🐕",
    acousticProfile: {
      dominantFreqMin: 200,
      dominantFreqMax: 1500,
      spectralCentroidMin: 300,
      spectralCentroidMax: 2000,
      flatnessMin: 0.1,
      flatnessMax: 0.4,
      lowEnergyRatioMin: 0.2,
      lowEnergyRatioMax: 0.6,
      zcrMin: 0.06,
      zcrMax: 0.22,
      periodicityMin: 0.05,
      periodicityMax: 0.4,
      rmsMin: 0.03,
      rmsMax: 0.3,
      description: "Lower-pitched barks and vocalizations, variable bursts",
    },
  },
  {
    id: "owl",
    name: "STRIX ALUCO",
    scientificName: {
      en: "Tawny Owl",
      fr: "Chouette hulotte",
      es: "Cárabo común",
    },
    emoji: "🦉",
    acousticProfile: {
      dominantFreqMin: 150,
      dominantFreqMax: 800,
      spectralCentroidMin: 200,
      spectralCentroidMax: 1200,
      flatnessMin: 0.03,
      flatnessMax: 0.2,
      lowEnergyRatioMin: 0.4,
      lowEnergyRatioMax: 0.8,
      zcrMin: 0.01,
      zcrMax: 0.08,
      periodicityMin: 0.3,
      periodicityMax: 0.8,
      rmsMin: 0.02,
      rmsMax: 0.2,
      description: "Low-frequency rhythmic hoots, very tonal and periodic",
    },
  },
];

export const SPECIES = ANIMALS.map((animal) => ({
  ...animal,
  ...ANIMAL_TEXTS[animal.id],
}));

export type Species = (typeof SPECIES)[number];

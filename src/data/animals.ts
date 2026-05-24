import type { Lang } from "./translations";

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

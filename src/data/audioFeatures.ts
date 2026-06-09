import type { AudioFeatures } from "./translations";

function computeZCR(timeData: Float32Array): number {
  let crossings = 0;
  let active = 0;
  for (let i = 1; i < timeData.length; i++) {
    const a = timeData[i - 1];
    const b = timeData[i];
    if (Math.abs(a) > 0.002 || Math.abs(b) > 0.002) active++;
    if ((b >= 0) !== (a >= 0)) crossings++;
  }
  return active > 0 ? crossings / timeData.length : 0;
}

function computeRMS(timeData: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < timeData.length; i++) sum += timeData[i] * timeData[i];
  return Math.sqrt(sum / timeData.length);
}

function binHz(index: number, sampleRate: number, fftSize: number): number {
  return index * (sampleRate / fftSize);
}

function ampAt(freqData: Uint8Array, index: number): number {
  return freqData[index] || 0;
}

function computeNoiseFloor(freqData: Uint8Array): number {
  const values = Array.from(freqData).sort((a, b) => a - b);
  return values[Math.floor(values.length * 0.55)] || 0;
}

function isBirdBand(freq: number): boolean {
  return freq >= 650 && freq <= 9000;
}

function computeSpectralCentroid(freqData: Uint8Array, sampleRate: number, fftSize: number): number {
  let sum = 0;
  let weightedSum = 0;
  const noiseFloor = computeNoiseFloor(freqData);

  for (let i = 1; i < freqData.length; i++) {
    const freq = binHz(i, sampleRate, fftSize);
    const raw = ampAt(freqData, i);
    const amp = Math.max(0, raw - noiseFloor * 0.65);
    const birdBandBoost = isBirdBand(freq) ? 1.25 : 0.55;
    const weightedAmp = amp * birdBandBoost;
    sum += weightedAmp;
    weightedSum += freq * weightedAmp;
  }

  return sum > 0 ? weightedSum / sum : 0;
}

function computeSpectralFlatness(freqData: Uint8Array, sampleRate: number, fftSize: number): number {
  let geometric = 0;
  let arithmetic = 0;
  let count = 0;
  const noiseFloor = computeNoiseFloor(freqData);

  for (let i = 1; i < freqData.length; i++) {
    const freq = binHz(i, sampleRate, fftSize);
    if (!isBirdBand(freq)) continue;
    const v = Math.max(1, ampAt(freqData, i) - noiseFloor * 0.5);
    geometric += Math.log(v);
    arithmetic += v;
    count++;
  }

  if (count === 0 || arithmetic === 0) return 1;
  return Math.exp(geometric / count) / (arithmetic / count);
}

function computeLowEnergyRatio(freqData: Uint8Array, sampleRate: number, fftSize: number): number {
  const lowCutoff = 1000;
  let lowEnergy = 0;
  let totalEnergy = 0;
  const noiseFloor = computeNoiseFloor(freqData);

  for (let i = 1; i < freqData.length; i++) {
    const freq = binHz(i, sampleRate, fftSize);
    const amp = Math.max(0, ampAt(freqData, i) - noiseFloor * 0.55);
    const energy = amp * amp;
    totalEnergy += energy;
    if (freq < lowCutoff) lowEnergy += energy;
  }

  return totalEnergy > 0 ? lowEnergy / totalEnergy : 0;
}

function computePeriodicity(timeData: Float32Array, sampleRate: number): number {
  // Bird syllables often sit in repeated voiced bursts. Restricting the lags avoids
  // mistaking room rumble for a beautiful tiny opera singer hidden in a hedge.
  const frameSize = Math.min(timeData.length, 1536);
  const minLag = Math.max(6, Math.floor(sampleRate / 9000));
  const maxLag = Math.min(Math.floor(sampleRate / 180), Math.floor(frameSize / 2));
  let maxCorr = 0;
  let secondCorr = 0;

  let energy = 0;
  for (let i = 0; i < frameSize; i++) energy += timeData[i] * timeData[i];
  if (energy <= 0) return 0;

  for (let lag = minLag; lag < maxLag; lag++) {
    let corr = 0;
    for (let i = 0; i < frameSize - lag; i++) corr += timeData[i] * timeData[i + lag];
    const norm = corr / energy;
    if (norm > maxCorr) {
      secondCorr = maxCorr;
      maxCorr = norm;
    } else if (norm > secondCorr) {
      secondCorr = norm;
    }
  }

  const peakClarity = Math.max(0, maxCorr - secondCorr * 0.35);
  return Math.max(0, Math.min(1, peakClarity * 1.35));
}

function computeDominantFreq(freqData: Uint8Array, sampleRate: number, fftSize: number): number {
  const noiseFloor = computeNoiseFloor(freqData);
  let bestScore = 0;
  let bestIdx = 0;

  for (let i = 1; i < freqData.length; i++) {
    const freq = binHz(i, sampleRate, fftSize);
    if (freq < 180 || freq > 10000) continue;
    const amp = Math.max(0, ampAt(freqData, i) - noiseFloor * 0.6);
    const left = ampAt(freqData, i - 1);
    const right = ampAt(freqData, i + 1);
    const localPeak = amp >= left && amp >= right ? 1.15 : 0.8;
    const birdBandBoost = isBirdBand(freq) ? 1.35 : 0.75;
    const score = amp * localPeak * birdBandBoost;
    if (score > bestScore) {
      bestScore = score;
      bestIdx = i;
    }
  }

  return binHz(bestIdx, sampleRate, fftSize);
}

export function extractAudioFeatures(analyser: AnalyserNode, audioCtx: AudioContext): AudioFeatures {
  const fftSize = analyser.fftSize;
  const freqData = new Uint8Array(analyser.frequencyBinCount);
  const timeData = new Float32Array(fftSize);

  analyser.getByteFrequencyData(freqData);
  analyser.getFloatTimeDomainData(timeData);

  const sampleRate = audioCtx.sampleRate;

  return {
    dominantFreq: computeDominantFreq(freqData, sampleRate, fftSize),
    spectralCentroid: computeSpectralCentroid(freqData, sampleRate, fftSize),
    flatness: computeSpectralFlatness(freqData, sampleRate, fftSize),
    lowEnergyRatio: computeLowEnergyRatio(freqData, sampleRate, fftSize),
    zcr: computeZCR(timeData),
    periodicity: computePeriodicity(timeData, sampleRate),
    rms: computeRMS(timeData),
    sampleDuration: fftSize / sampleRate,
  };
}

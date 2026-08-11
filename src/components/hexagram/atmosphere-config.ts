export type AtmosphereLayerTuning = {
  opacity: number;
  objectPosition: string;
};

export type AtmosphereTuning = {
  contrast: number;
  upper: AtmosphereLayerTuning;
  lower: AtmosphereLayerTuning;
};

const atmosphereTuning: Record<string, AtmosphereTuning> = {
  qian: {
    contrast: 0.92,
    upper: { opacity: 0.26, objectPosition: "50% 20%" },
    lower: { opacity: 0.38, objectPosition: "50% 82%" },
  },
  dui: {
    contrast: 0.88,
    upper: { opacity: 0.24, objectPosition: "50% 22%" },
    lower: { opacity: 0.36, objectPosition: "50% 80%" },
  },
  li: {
    contrast: 0.78,
    upper: { opacity: 0.2, objectPosition: "58% 18%" },
    lower: { opacity: 0.27, objectPosition: "42% 82%" },
  },
  zhen: {
    contrast: 0.88,
    upper: { opacity: 0.2, objectPosition: "50% 20%" },
    lower: { opacity: 0.34, objectPosition: "50% 84%" },
  },
  xun: {
    contrast: 0.86,
    upper: { opacity: 0.2, objectPosition: "48% 18%" },
    lower: { opacity: 0.31, objectPosition: "50% 82%" },
  },
  kan: {
    contrast: 0.74,
    upper: { opacity: 0.18, objectPosition: "50% 18%" },
    lower: { opacity: 0.26, objectPosition: "50% 76%" },
  },
  gen: {
    contrast: 0.82,
    upper: { opacity: 0.19, objectPosition: "58% 20%" },
    lower: { opacity: 0.29, objectPosition: "58% 82%" },
  },
  kun: {
    contrast: 0.9,
    upper: { opacity: 0.21, objectPosition: "50% 20%" },
    lower: { opacity: 0.35, objectPosition: "50% 84%" },
  },
};

export function getAtmosphereTuning(trigramId: string) {
  return atmosphereTuning[trigramId] ?? atmosphereTuning.qian;
}

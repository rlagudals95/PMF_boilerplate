import type {
  AbTestVariant,
  ExclusiveAbTestExperiment,
  IndependentAbTestExperiment,
} from "./types";

const toRoll = (randomValue: number) => {
  const normalized = Number.isFinite(randomValue) ? randomValue : 0;
  return Math.min(Math.max(normalized, 0), 0.999999) * 100;
};

export const hasAssignedVariant = (
  experiment: IndependentAbTestExperiment | ExclusiveAbTestExperiment,
  value?: string,
) => experiment.variants.some((variant) => variant.value === value);

export const pickVariant = <Value extends string>(
  variants: readonly AbTestVariant<Value>[],
  randomValue: number,
) => {
  const roll = toRoll(randomValue);
  let cumulative = 0;

  for (const variant of variants) {
    cumulative += variant.weight;
    if (roll < cumulative) {
      return variant.value;
    }
  }

  return variants.at(-1)?.value ?? "";
};

export const pickExclusiveExperiment = (
  experiments: readonly ExclusiveAbTestExperiment[],
  randomValue: number,
) => {
  const roll = toRoll(randomValue);
  let cumulative = 0;

  for (const experiment of experiments) {
    cumulative += experiment.trafficAllocation;
    if (roll < cumulative) {
      return experiment;
    }
  }

  return undefined;
};

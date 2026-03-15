import { AB_TEST_COOKIE_PREFIX, isApproximatelyEqual } from "./constants";
import type {
  AbTestDefinitions,
  AbTestVariant,
  ExclusiveAbTestExperiment,
  IndependentAbTestExperiment,
} from "./types";

const sumVariantWeights = (variants: readonly AbTestVariant[]) =>
  variants.reduce((sum, variant) => sum + variant.weight, 0);

const ensureVariants = (
  experiment: IndependentAbTestExperiment | ExclusiveAbTestExperiment,
) => {
  if (experiment.variants.length === 0) {
    throw new Error(`AB test "${experiment.featureKey}" requires at least one variant.`);
  }

  const values = new Set<string>();

  for (const variant of experiment.variants) {
    if (!Number.isFinite(variant.weight) || variant.weight <= 0) {
      throw new Error(
        `AB test "${experiment.featureKey}" has an invalid weight for variant "${variant.value}".`,
      );
    }

    if (values.has(variant.value)) {
      throw new Error(
        `AB test "${experiment.featureKey}" contains duplicate variant value "${variant.value}".`,
      );
    }

    values.add(variant.value);
  }

  const totalWeight = sumVariantWeights(experiment.variants);
  if (!isApproximatelyEqual(totalWeight, 100)) {
    throw new Error(
      `AB test "${experiment.featureKey}" variant weights must add up to 100. Received ${totalWeight}.`,
    );
  }

  if (experiment.cookie?.maxAge !== undefined && experiment.cookie.maxAge <= 0) {
    throw new Error(`AB test "${experiment.featureKey}" has an invalid cookie maxAge.`);
  }
};

export const validateAbTestDefinitions = (definitions: AbTestDefinitions) => {
  const experiments = [
    ...(definitions.independent ?? []),
    ...(definitions.exclusive ?? []),
  ];

  const featureKeys = new Set<string>();

  for (const experiment of experiments) {
    if (!experiment.featureKey.startsWith(AB_TEST_COOKIE_PREFIX)) {
      throw new Error(
        `AB test feature keys must start with "${AB_TEST_COOKIE_PREFIX}". Received "${experiment.featureKey}".`,
      );
    }

    if (featureKeys.has(experiment.featureKey)) {
      throw new Error(`Duplicate AB test feature key "${experiment.featureKey}".`);
    }

    featureKeys.add(experiment.featureKey);
    ensureVariants(experiment);
  }

  const exclusiveTraffic = (definitions.exclusive ?? []).reduce((sum, experiment) => {
    if (!Number.isFinite(experiment.trafficAllocation)) {
      throw new Error(
        `AB test "${experiment.featureKey}" has an invalid traffic allocation.`,
      );
    }

    if (experiment.trafficAllocation < 0 || experiment.trafficAllocation > 100) {
      throw new Error(
        `AB test "${experiment.featureKey}" traffic allocation must be between 0 and 100.`,
      );
    }

    if (experiment.enabled === false) {
      return sum;
    }

    return sum + experiment.trafficAllocation;
  }, 0);

  if (exclusiveTraffic > 100.001) {
    throw new Error(
      `Exclusive AB test traffic allocation must not exceed 100. Received ${exclusiveTraffic}.`,
    );
  }
};

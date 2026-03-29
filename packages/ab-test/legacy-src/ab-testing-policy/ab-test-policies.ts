import {
  type LegacyExclusivePolicies,
  type LegacyIndependentPolicies,
} from './types';

import expSampleHeroCopy from './ab-testing-policy-item/exp-sample-hero-copy';

/**
 * Legacy reference definitions kept only as a migration example.
 * The current package no longer ships app-specific policies.
 */
export const INDEPENDENT_AB_TEST_POLICIES = [
  expSampleHeroCopy,
] as const satisfies LegacyIndependentPolicies;

/**
 * Legacy reference only. Keep empty to show that exclusive experiments
 * were also supported in the previous package shape.
 */
export const MUTUAL_EXCLUSIVE_AB_TEST_POLICIES =
  [] as const satisfies LegacyExclusivePolicies;

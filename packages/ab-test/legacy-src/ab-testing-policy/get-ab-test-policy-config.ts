import { type LegacyIndependentPolicies } from './types';

import { INDEPENDENT_AB_TEST_POLICIES } from './AB_TEST_POLICIES';

function deepFreeze<T>(obj: T): T {
  if (typeof obj !== 'object' || obj === null || Object.isFrozen(obj)) {
    return obj;
  }

  Object.freeze(obj);

  Object.values(obj).forEach((value) => {
    deepFreeze(value);
  });

  return obj;
}

const frozenAbTestPolicy = deepFreeze(
  JSON.parse(JSON.stringify(INDEPENDENT_AB_TEST_POLICIES)),
) as typeof INDEPENDENT_AB_TEST_POLICIES;

export const getAbTestPolicyConfig = (): LegacyIndependentPolicies => {
  return frozenAbTestPolicy as LegacyIndependentPolicies;
};

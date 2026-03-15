export const AB_TEST_COOKIE_PREFIX = "exp_";
export const DEFAULT_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;
const WEIGHT_EPSILON = 0.001;

export const isApproximatelyEqual = (left: number, right: number) =>
  Math.abs(left - right) <= WEIGHT_EPSILON;

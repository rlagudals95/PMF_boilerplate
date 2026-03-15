export interface LegacyApplyCandidate<Value extends string = string> {
  applyRate: number;
  cookieValue: Value;
}

export interface LegacyPolicy<
  FeatureKey extends string = string,
  Value extends string = string,
> {
  name: string;
  description: string;
  featureKey: FeatureKey;
  eventPropertyKey: string;
  applyCandidates: readonly LegacyApplyCandidate<Value>[];
  expireSeconds?: number;
  logging?: boolean;
}

export type LegacyIndependentPolicies = readonly LegacyPolicy[];

export type LegacyExclusivePolicy = LegacyPolicy & {
  applyRate?: number;
};

export type LegacyExclusivePolicies = readonly LegacyExclusivePolicy[];

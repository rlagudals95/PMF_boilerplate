export interface CookieEntry {
  name: string;
  value: string;
}

export interface CookieReader {
  getAll(): CookieEntry[];
}

export interface CookieOptions {
  maxAge?: number;
  path?: string;
  sameSite?: "lax" | "strict" | "none";
  secure?: boolean;
}

export interface CookieWriter {
  set(name: string, value: string, options?: CookieOptions): void;
  delete(name: string): void;
}

export interface AbTestVariant<Value extends string = string> {
  value: Value;
  weight: number;
}

interface BaseAbTestExperiment<FeatureKey extends string = string, Value extends string = string> {
  featureKey: FeatureKey;
  description?: string;
  enabled?: boolean;
  cookie?: CookieOptions;
  variants: readonly AbTestVariant<Value>[];
}

export type IndependentAbTestExperiment<
  FeatureKey extends string = string,
  Value extends string = string,
> = BaseAbTestExperiment<FeatureKey, Value>;

export interface ExclusiveAbTestExperiment<
  FeatureKey extends string = string,
  Value extends string = string,
> extends BaseAbTestExperiment<FeatureKey, Value> {
  trafficAllocation: number;
}

export interface AbTestDefinitions {
  independent?: readonly IndependentAbTestExperiment[];
  exclusive?: readonly ExclusiveAbTestExperiment[];
}

export type AbTestAssignments = Record<string, string>;

export interface ApplyAbTestResult<Response> {
  response: Response;
  assignments: AbTestAssignments;
}

export interface MiddlewareRequest {
  cookies: CookieReader;
}

export interface MiddlewareResponse {
  cookies: CookieWriter;
}

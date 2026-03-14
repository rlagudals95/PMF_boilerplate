import { describe, expect, it } from "vitest";

import {
  getInitialFunnelStep,
  getNextFunnelStep,
  getPreviousFunnelStep,
  getValidatedFunnelStep,
  validateFunnelSteps,
} from "./use-funnel";

const steps = ["landing", "details", "complete"] as const;

describe("validateFunnelSteps", () => {
  it("accepts a unique step list", () => {
    expect(() => validateFunnelSteps(steps)).not.toThrow();
  });

  it("rejects duplicated steps", () => {
    expect(() =>
      validateFunnelSteps(["landing", "details", "landing"] as const),
    ).toThrowError(/must be unique/);
  });
});

describe("getInitialFunnelStep", () => {
  it("falls back to the first step", () => {
    expect(getInitialFunnelStep(steps)).toBe("landing");
  });

  it("accepts a valid initial step", () => {
    expect(getInitialFunnelStep(steps, "details")).toBe("details");
  });

  it("rejects an unknown initial step", () => {
    expect(() =>
      getInitialFunnelStep(steps, "unknown" as (typeof steps)[number]),
    ).toThrowError(/Invalid initial step/);
  });
});

describe("funnel navigation helpers", () => {
  it("moves forward until the last step", () => {
    expect(getNextFunnelStep(steps, "landing")).toBe("details");
    expect(getNextFunnelStep(steps, "complete")).toBe("complete");
  });

  it("moves backward until the first step", () => {
    expect(getPreviousFunnelStep(steps, "complete")).toBe("details");
    expect(getPreviousFunnelStep(steps, "landing")).toBe("landing");
  });

  it("validates explicit step changes", () => {
    expect(getValidatedFunnelStep(steps, "details")).toBe("details");
    expect(() =>
      getValidatedFunnelStep(steps, "unknown" as (typeof steps)[number]),
    ).toThrowError(/Invalid step/);
  });
});

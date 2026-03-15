import { describe, expect, it } from "vitest";

import {
  getLandingHeroVariant,
  heroCopyExperimentKey,
} from "@/modules/landing/model/hero-copy-experiment";

describe("getLandingHeroVariant", () => {
  it("returns benefit when the experiment assignment matches the variant", () => {
    expect(
      getLandingHeroVariant({
        [heroCopyExperimentKey]: "benefit",
      }),
    ).toBe("benefit");
  });

  it("falls back to control for missing or unknown assignments", () => {
    expect(getLandingHeroVariant({})).toBe("control");
    expect(
      getLandingHeroVariant({
        [heroCopyExperimentKey]: "unexpected",
      }),
    ).toBe("control");
  });
});

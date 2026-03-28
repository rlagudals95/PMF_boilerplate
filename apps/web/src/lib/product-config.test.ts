import { describe, expect, it } from "vitest";

import { productConfig, validateProductConfig } from "./product-config";

describe("productConfig", () => {
  it("keeps the required quality-assurance surfaces populated", () => {
    expect(() => validateProductConfig(productConfig)).not.toThrow();
  });

  it("fails fast when hero highlights are missing", () => {
    expect(() =>
      validateProductConfig({
        ...productConfig,
        landing: {
          ...productConfig.landing,
          heroHighlights:
            [] as unknown as typeof productConfig.landing.heroHighlights,
        },
      }),
    ).toThrow(/landing\.heroHighlights/i);
  });

  it("fails fast when trust signals are missing", () => {
    expect(() =>
      validateProductConfig({
        ...productConfig,
        quality: {
          ...productConfig.quality,
          trustSignals:
            [] as unknown as typeof productConfig.quality.trustSignals,
        },
      }),
    ).toThrow(/quality\.trustSignals/i);
  });
});

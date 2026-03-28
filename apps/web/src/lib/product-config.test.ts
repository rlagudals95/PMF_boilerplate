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

  it("fails fast when active flows do not match the selected MVP shape", () => {
    expect(() =>
      validateProductConfig({
        ...productConfig,
        mvp: {
          ...productConfig.mvp,
          shape: "lead-gen",
          activeFlows: ["landing", "consultation", "admin"],
          deferredFlows: ["lead", "payment", "auth"],
        },
      }),
    ).toThrow(/mvp\.activeFlows/i);
  });

  it("fails fast when the primary route is not active for the selected shape", () => {
    expect(() =>
      validateProductConfig({
        ...productConfig,
        mvp: {
          ...productConfig.mvp,
          primaryRoute: "/pay",
        },
      }),
    ).toThrow(/mvp\.primaryRoute/i);
  });

  it("fails fast when the primary CTA does not point to an active flow", () => {
    expect(() =>
      validateProductConfig({
        ...productConfig,
        mvp: {
          ...productConfig.mvp,
          primaryCta: {
            label: "결제 시작",
            href: "/pay",
          },
        },
      }),
    ).toThrow(/mvp\.primaryCta\.href/i);
  });

  it("fails fast when highlighted admin metrics are missing", () => {
    expect(() =>
      validateProductConfig({
        ...productConfig,
        mvp: {
          ...productConfig.mvp,
          admin: {
            highlightedMetrics:
              ["qualified_leads"] as unknown as typeof productConfig.mvp.admin.highlightedMetrics,
          },
        },
      }),
    ).toThrow(/mvp\.admin\.highlightedMetrics/i);
  });
});

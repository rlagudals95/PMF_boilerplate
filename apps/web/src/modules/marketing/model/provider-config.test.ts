import { describe, expect, it } from "vitest";

import {
  getGoogleAdsConversionSendTo,
  getMarketingProviderNames,
} from "./provider-config";

describe("getMarketingProviderNames", () => {
  it("returns only configured providers", () => {
    expect(
      getMarketingProviderNames({
        metaPixelId: "meta-123",
        kakaoPixelId: "kakao-456",
      }),
    ).toEqual(["meta-pixel", "kakao-pixel"]);
  });

  it("returns an empty list when no provider is configured", () => {
    expect(getMarketingProviderNames({})).toEqual([]);
  });
});

describe("getGoogleAdsConversionSendTo", () => {
  it("builds the Google Ads send_to value when id and label exist", () => {
    expect(getGoogleAdsConversionSendTo("AW-123", "lead_abc")).toBe(
      "AW-123/lead_abc",
    );
  });

  it("returns undefined when configuration is incomplete", () => {
    expect(getGoogleAdsConversionSendTo("AW-123")).toBeUndefined();
    expect(getGoogleAdsConversionSendTo(undefined, "lead_abc")).toBeUndefined();
  });
});

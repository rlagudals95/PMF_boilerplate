import type { PageEvent } from "@pmf/core";

import {
  getGoogleAdsConversionSendTo,
  marketingProviderConfig,
} from "./provider-config";

type MarketingEventName = Exclude<PageEvent["eventName"], "admin_page_viewed">;

export interface MarketingEventInput {
  eventName: MarketingEventName;
  path: string;
  properties?: Record<string, unknown>;
}

interface KakaoPixelTracker {
  pageView?: () => void;
  completeRegistration?: () => void;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    kakaoPixel?: (pixelId: string) => KakaoPixelTracker | undefined;
  }
}

const isMarketingPath = (path: string) => !path.startsWith("/admin");

const buildPageLocation = (path: string) => {
  if (typeof window === "undefined") {
    return path;
  }

  return new URL(path, window.location.origin).toString();
};

const buildProperties = (input: MarketingEventInput) => ({
  path: input.path,
  ...input.properties,
});

const trackMetaPixelEvent = (input: MarketingEventInput) => {
  const pixelId = marketingProviderConfig.metaPixelId;

  if (!pixelId || typeof window === "undefined" || !window.fbq) {
    return;
  }

  const properties = buildProperties(input);

  if (input.eventName === "page_view") {
    window.fbq("track", "PageView");
    return;
  }

  if (input.eventName === "lead_form_submitted") {
    window.fbq("track", "Lead", properties);
  }

  if (input.eventName === "consultation_requested") {
    window.fbq("track", "Contact", properties);
  }

  window.fbq("trackCustom", input.eventName, properties);
};

const trackKakaoPixelEvent = (input: MarketingEventInput) => {
  const pixelId = marketingProviderConfig.kakaoPixelId;

  if (!pixelId || typeof window === "undefined" || !window.kakaoPixel) {
    return;
  }

  const tracker = window.kakaoPixel(pixelId);

  if (!tracker) {
    return;
  }

  if (input.eventName === "page_view") {
    tracker.pageView?.();
    return;
  }

  if (
    input.eventName === "lead_form_submitted" ||
    input.eventName === "consultation_requested"
  ) {
    // Kakao Pixel's common lead-style signal is registration completion.
    tracker.completeRegistration?.();
  }
};

const trackGoogleAdsEvent = (input: MarketingEventInput) => {
  const googleAdsId = marketingProviderConfig.googleAdsId;

  if (!googleAdsId || typeof window === "undefined" || !window.gtag) {
    return;
  }

  if (input.eventName === "page_view") {
    window.gtag("event", "page_view", {
      page_location: buildPageLocation(input.path),
      page_path: input.path,
      send_to: googleAdsId,
    });
    return;
  }

  const sendTo =
    input.eventName === "lead_form_submitted"
      ? getGoogleAdsConversionSendTo(
          googleAdsId,
          marketingProviderConfig.googleAdsLeadConversionLabel,
        )
      : getGoogleAdsConversionSendTo(
          googleAdsId,
          marketingProviderConfig.googleAdsConsultationConversionLabel,
        );

  if (!sendTo) {
    return;
  }

  window.gtag("event", "conversion", {
    send_to: sendTo,
  });
};

export const trackMarketingEvent = (input: MarketingEventInput) => {
  if (!isMarketingPath(input.path) || typeof window === "undefined") {
    return;
  }

  trackMetaPixelEvent(input);
  trackKakaoPixelEvent(input);
  trackGoogleAdsEvent(input);
};

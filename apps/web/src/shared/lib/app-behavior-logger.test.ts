import { beforeEach, describe, expect, it, vi } from "vitest";

import type { BehaviorLogEvent } from "@pmf/user-behavior-log";

import { dispatchBehaviorLogEvent } from "@/shared/lib/app-behavior-logger";

const { trackEventAction, trackMarketingEvent } = vi.hoisted(() => ({
  trackEventAction: vi.fn(),
  trackMarketingEvent: vi.fn(),
}));

vi.mock("@/shared/api/track-event-action", () => ({
  trackEventAction,
}));

vi.mock("@/modules/marketing/model/track-marketing-event", () => ({
  trackMarketingEvent,
}));

const buildEvent = (eventName: string): BehaviorLogEvent => ({
  eventName,
  occurredAt: new Date().toISOString(),
  path: "/pricing",
  sessionId: "anon_123",
  metadata: {
    source: "hero",
  },
  element: {
    id: "cta",
    type: "button",
  },
});

describe("dispatchBehaviorLogEvent", () => {
  beforeEach(() => {
    trackEventAction.mockReset();
    trackMarketingEvent.mockReset();
  });

  it("dispatches supported page events to analytics and marketing", async () => {
    await dispatchBehaviorLogEvent(buildEvent("cta_clicked"));

    expect(trackMarketingEvent).toHaveBeenCalledWith({
      eventName: "cta_clicked",
      path: "/pricing",
      properties: {
        source: "hero",
        elementId: "cta",
        elementType: "button",
      },
    });

    expect(trackEventAction).toHaveBeenCalledWith({
      eventName: "cta_clicked",
      path: "/pricing",
      sessionId: "anon_123",
      properties: {
        source: "hero",
        elementId: "cta",
        elementType: "button",
      },
    });
  });

  it("skips unsupported event names", async () => {
    await dispatchBehaviorLogEvent(buildEvent("impression"));

    expect(trackMarketingEvent).not.toHaveBeenCalled();
    expect(trackEventAction).not.toHaveBeenCalled();
  });

  it("does not forward admin page views to marketing providers", async () => {
    await dispatchBehaviorLogEvent(buildEvent("admin_page_viewed"));

    expect(trackMarketingEvent).not.toHaveBeenCalled();
    expect(trackEventAction).toHaveBeenCalledTimes(1);
  });
});

import { describe, expect, it } from "vitest";

import {
  buildMixpanelProperties,
  getAnalyticsDistinctId,
} from "./mixpanel-adapter";

describe("getAnalyticsDistinctId", () => {
  it("prefers session id for anonymous traffic continuity", () => {
    expect(
      getAnalyticsDistinctId({
        eventName: "page_view",
        path: "/",
        sessionId: "anon_123",
        leadId: "lead_1",
      }),
    ).toBe("anon_123");
  });

  it("falls back to lead id when session id is unavailable", () => {
    expect(
      getAnalyticsDistinctId({
        eventName: "lead_form_submitted",
        path: "/",
        leadId: "lead_1",
      }),
    ).toBe("lead:lead_1");
  });
});

describe("buildMixpanelProperties", () => {
  it("maps shared analytics fields into Mixpanel properties", () => {
    const properties = buildMixpanelProperties({
      eventName: "cta_clicked",
      path: "/",
      sessionId: "anon_123",
      properties: {
        destination: "/consult",
      },
      occurredAt: "2025-01-01T00:00:00.000Z",
    });

    expect(properties.distinct_id).toBe("anon_123");
    expect(properties.path).toBe("/");
    expect(properties["destination"]).toBe("/consult");
    expect(properties.time).toBe(1735689600000);
    expect(properties.$insert_id).toMatch(/[a-f0-9-]{36}/);
  });
});

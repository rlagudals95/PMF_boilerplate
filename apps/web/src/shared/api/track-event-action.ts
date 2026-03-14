"use server";

import { pageEventNameSchema } from "@pmf/core";

import { appAnalytics } from "@/lib/analytics";
import { appErrorLogger } from "@/lib/error-logging";

export interface TrackEventActionInput {
  eventName: string;
  path: string;
  sessionId?: string;
  properties?: Record<string, unknown>;
}

export const trackEventAction = async (input: TrackEventActionInput) => {
  try {
    const eventName = pageEventNameSchema.parse(input.eventName);

    await appAnalytics.track({
      eventName,
      path: input.path,
      sessionId: input.sessionId,
      properties: input.properties,
    });
  } catch (error) {
    await appErrorLogger.report({
      source: "shared.trackEventAction",
      message: "Analytics event tracking failed",
      error,
      level: "warning",
      context: {
        eventName: input.eventName,
        path: input.path,
      },
    });
  }
};

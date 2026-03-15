"use client";

import {
  createBehaviorLogger,
  type BehaviorLogElement,
  type BehaviorLogEvent,
} from "@pmf/user-behavior-log";
import { pageEventNameSchema } from "@pmf/core";

import { trackMarketingEvent } from "@/modules/marketing/model/track-marketing-event";
import { trackEventAction } from "@/shared/api/track-event-action";
import { getAnalyticsSessionId } from "@/shared/lib/analytics-session";

const buildProperties = (
  metadata?: Record<string, unknown>,
  element?: BehaviorLogElement,
) => {
  const properties = {
    ...metadata,
    ...(element?.id ? { elementId: element.id } : {}),
    ...(element?.name ? { elementName: element.name } : {}),
    ...(element?.type ? { elementType: element.type } : {}),
  };

  return Object.keys(properties).length > 0 ? properties : undefined;
};

export const dispatchBehaviorLogEvent = async (event: BehaviorLogEvent) => {
  const parsedEventName = pageEventNameSchema.safeParse(event.eventName);

  if (!parsedEventName.success) {
    return;
  }

  const properties = buildProperties(event.metadata, event.element);
  const path = event.path ?? "/";

  if (parsedEventName.data !== "admin_page_viewed") {
    trackMarketingEvent({
      eventName: parsedEventName.data,
      path,
      properties,
    });
  }

  await trackEventAction({
    eventName: parsedEventName.data,
    path,
    sessionId: event.sessionId,
    properties,
  });
};

export const appBehaviorLogger = createBehaviorLogger({
  getContext: () => ({
    sessionId: getAnalyticsSessionId(),
  }),
  send: dispatchBehaviorLogEvent,
});

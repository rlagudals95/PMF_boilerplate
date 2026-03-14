import {
  ConsoleAnalyticsAdapter,
  createAnalytics,
  type AnalyticsAdapter,
  MixpanelAnalyticsAdapter,
  type TrackEventInput,
} from "@pmf/analytics";
import {
  createPageEvent as buildPageEventRecord,
  type PageEvent,
} from "@pmf/core";
import { createPageEvent as persistPageEvent } from "@pmf/db";

class StoreAnalyticsAdapter implements AnalyticsAdapter {
  name = "store";
  required = true;

  async track(event: TrackEventInput) {
    const record: PageEvent = buildPageEventRecord({
      eventName: event.eventName,
      path: event.path,
      sessionId: event.sessionId,
      leadId: event.leadId,
      experimentId: event.experimentId,
      properties: event.properties,
      occurredAt: event.occurredAt,
    });

    await persistPageEvent(record);
  }
}

const adapters: AnalyticsAdapter[] = [
  new ConsoleAnalyticsAdapter(),
  new StoreAnalyticsAdapter(),
];

if (process.env.MIXPANEL_PROJECT_TOKEN) {
  adapters.push(
    new MixpanelAnalyticsAdapter({
      projectToken: process.env.MIXPANEL_PROJECT_TOKEN,
      apiHost: process.env.MIXPANEL_API_HOST,
      debug: process.env.MIXPANEL_DEBUG === "true",
    }),
  );
}

export const appAnalytics = createAnalytics(adapters);

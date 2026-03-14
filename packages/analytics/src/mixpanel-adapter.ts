import Mixpanel from "mixpanel";

import type { AnalyticsAdapter, TrackEventInput } from "./types";

export interface MixpanelAnalyticsAdapterOptions {
  projectToken: string;
  apiHost?: string;
  debug?: boolean;
}

const buildMixpanelConfig = (
  options: MixpanelAnalyticsAdapterOptions,
): Partial<Mixpanel.InitConfig> => {
  if (!options.apiHost) {
    return {
      debug: options.debug ?? false,
    };
  }

  const url = new URL(options.apiHost);
  const path = url.pathname === "/" ? undefined : url.pathname;

  return {
    debug: options.debug ?? false,
    protocol: url.protocol.replace(":", ""),
    host: url.host,
    path,
  };
};

export const getAnalyticsDistinctId = (event: TrackEventInput) => {
  if (event.sessionId) {
    return event.sessionId;
  }

  if (event.leadId) {
    return `lead:${event.leadId}`;
  }

  if (event.experimentId) {
    return `experiment:${event.experimentId}`;
  }

  return "anonymous";
};

export const buildMixpanelProperties = (
  event: TrackEventInput,
): Record<string, unknown> => ({
  distinct_id: getAnalyticsDistinctId(event),
  $insert_id: crypto.randomUUID(),
  time: new Date(event.occurredAt ?? Date.now()).getTime(),
  path: event.path,
  session_id: event.sessionId,
  lead_id: event.leadId,
  experiment_id: event.experimentId,
  ...event.properties,
});

export class MixpanelAnalyticsAdapter implements AnalyticsAdapter {
  name = "mixpanel";
  required = false;
  private client: Mixpanel.Mixpanel;

  constructor(options: MixpanelAnalyticsAdapterOptions) {
    this.client = Mixpanel.init(
      options.projectToken,
      buildMixpanelConfig(options),
    );
  }

  track(event: TrackEventInput) {
    const properties = buildMixpanelProperties(event);

    return new Promise<void>((resolve, reject) => {
      this.client.track(event.eventName, properties, (error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }
}

import type { PageEvent } from "@pmf/core";

export interface TrackEventInput {
  eventName: PageEvent["eventName"];
  path: string;
  sessionId?: string;
  leadId?: string;
  experimentId?: string;
  properties?: Record<string, unknown>;
  occurredAt?: string;
}

export interface AnalyticsAdapter {
  name: string;
  required?: boolean;
  track: (event: TrackEventInput) => Promise<void> | void;
}

export interface AnalyticsFailure {
  adapterName: string;
  error: unknown;
  required: boolean;
}

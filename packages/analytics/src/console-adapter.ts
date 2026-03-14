import type { AnalyticsAdapter, TrackEventInput } from "./types";

export class ConsoleAnalyticsAdapter implements AnalyticsAdapter {
  name = "console";
  required = false;

  track(event: TrackEventInput) {
    console.log("[analytics]", JSON.stringify(event));
  }
}

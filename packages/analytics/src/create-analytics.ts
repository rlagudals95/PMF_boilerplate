import {
  ConsoleErrorLoggingAdapter,
  createErrorLogger,
} from "@pmf/error-logging";

import type { AnalyticsAdapter, AnalyticsFailure, TrackEventInput } from "./types";

export class AnalyticsDispatchError extends Error {
  failures: AnalyticsFailure[];

  constructor(failures: AnalyticsFailure[]) {
    super(
      `Critical analytics adapters failed: ${failures
        .map((failure) => failure.adapterName)
        .join(", ")}`,
    );
    this.name = "AnalyticsDispatchError";
    this.failures = failures;
  }
}

const buildFailure = (
  adapter: AnalyticsAdapter,
  error: unknown,
): AnalyticsFailure => ({
  adapterName: adapter.name,
  error,
  required: adapter.required ?? false,
});

const internalErrorLogger = createErrorLogger([
  new ConsoleErrorLoggingAdapter(),
]);

export const createAnalytics = (adapters: AnalyticsAdapter[]) => ({
  track: async (event: TrackEventInput) => {
    const settled = await Promise.allSettled(
      adapters.map(async (adapter) => adapter.track(event)),
    );

    const failures = settled.flatMap((result, index) => {
      if (result.status === "fulfilled") {
        return [];
      }

      const adapter = adapters[index];

      if (!adapter) {
        return [];
      }

      return [buildFailure(adapter, result.reason)];
    });

    await Promise.all(
      failures.map((failure) =>
        internalErrorLogger.report({
          source: "analytics.dispatch",
          message: `Analytics adapter "${failure.adapterName}" failed`,
          error: failure.error,
          level: failure.required ? "error" : "warning",
          tags: {
            adapterName: failure.adapterName,
            required: String(failure.required),
          },
          context: {
            eventName: event.eventName,
            path: event.path,
          },
        }),
      ),
    );

    const criticalFailures = failures.filter((failure) => failure.required);

    if (criticalFailures.length > 0) {
      throw new AnalyticsDispatchError(criticalFailures);
    }
  },
});

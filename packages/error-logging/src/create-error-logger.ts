import { normalizeError } from "./normalize-error";
import type {
  ErrorLoggingAdapter,
  ErrorLoggingFailure,
  ErrorLogEvent,
  ReportErrorInput,
} from "./types";

export class ErrorLoggingDispatchError extends Error {
  failures: ErrorLoggingFailure[];

  constructor(failures: ErrorLoggingFailure[]) {
    super(
      `Critical error logging adapters failed: ${failures
        .map((failure) => failure.adapterName)
        .join(", ")}`,
    );
    this.name = "ErrorLoggingDispatchError";
    this.failures = failures;
  }
}

const buildEvent = (input: ReportErrorInput): ErrorLogEvent => ({
  source: input.source,
  message: input.message,
  error: input.error,
  normalizedError: normalizeError(input.error),
  level: input.level ?? "error",
  tags: input.tags,
  context: input.context,
  occurredAt: input.occurredAt ?? new Date().toISOString(),
});

const buildFailure = (
  adapter: ErrorLoggingAdapter,
  error: unknown,
): ErrorLoggingFailure => ({
  adapterName: adapter.name,
  error,
  required: adapter.required ?? false,
});

export const createErrorLogger = (adapters: ErrorLoggingAdapter[]) => ({
  report: async (input: ReportErrorInput) => {
    const event = buildEvent(input);
    const settled = await Promise.allSettled(
      adapters.map(async (adapter) => adapter.report(event)),
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

    const criticalFailures = failures.filter((failure) => failure.required);

    if (criticalFailures.length > 0) {
      throw new ErrorLoggingDispatchError(criticalFailures);
    }
  },
});

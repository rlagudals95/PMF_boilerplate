import type { ErrorLoggingAdapter, ErrorLogEvent } from "./types";

export class ConsoleErrorLoggingAdapter implements ErrorLoggingAdapter {
  name = "console";
  required = true;

  report(event: ErrorLogEvent) {
    const log = event.level === "warning" ? console.warn : console.error;

    log("[error-logging]", {
      level: event.level,
      source: event.source,
      message: event.message,
      tags: event.tags,
      context: event.context,
      error: event.normalizedError,
      occurredAt: event.occurredAt,
    });
  }
}

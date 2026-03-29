import {
  ConsoleErrorLoggingAdapter,
  createErrorLogger,
} from "@pmf/error-logging";

export const appErrorLogger = createErrorLogger([
  new ConsoleErrorLoggingAdapter(),
]);

export type ErrorLogLevel = "warning" | "error" | "critical";

export interface NormalizedError {
  name?: string;
  message: string;
  stack?: string;
}

export interface ReportErrorInput {
  source: string;
  message: string;
  error?: unknown;
  level?: ErrorLogLevel;
  tags?: Record<string, string>;
  context?: Record<string, unknown>;
  occurredAt?: string;
}

export interface ErrorLogEvent {
  source: string;
  message: string;
  error?: unknown;
  normalizedError?: NormalizedError;
  level: ErrorLogLevel;
  tags?: Record<string, string>;
  context?: Record<string, unknown>;
  occurredAt: string;
}

export interface ErrorLoggingAdapter {
  name: string;
  required?: boolean;
  report: (event: ErrorLogEvent) => Promise<void> | void;
}

export interface ErrorLoggingFailure {
  adapterName: string;
  error: unknown;
  required: boolean;
}

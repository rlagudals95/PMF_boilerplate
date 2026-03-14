import { describe, expect, it, vi } from "vitest";

import {
  ConsoleErrorLoggingAdapter,
  createErrorLogger,
  ErrorLoggingDispatchError,
  type ErrorLogEvent,
} from "./index";

describe("createErrorLogger", () => {
  it("dispatches normalized events to adapters", async () => {
    const report = vi.fn<(event: ErrorLogEvent) => void>();
    const logger = createErrorLogger([
      {
        name: "test",
        required: true,
        report,
      },
    ]);

    await logger.report({
      source: "test.source",
      message: "Something failed",
      error: new Error("boom"),
      context: {
        requestId: "req_1",
      },
    });

    const event = report.mock.calls[0]?.[0];

    expect(event).toMatchObject({
        source: "test.source",
        message: "Something failed",
        level: "error",
        normalizedError: {
          name: "Error",
          message: "boom",
        },
        context: {
          requestId: "req_1",
        },
      });
  });

  it("throws when a required adapter fails", async () => {
    const logger = createErrorLogger([
      {
        name: "required",
        required: true,
        report: () => {
          throw new Error("adapter failure");
        },
      },
    ]);

    await expect(
      logger.report({
        source: "test.source",
        message: "Something failed",
      }),
    ).rejects.toBeInstanceOf(ErrorLoggingDispatchError);
  });

  it("ignores optional adapter failures", async () => {
    const report = vi.fn<(event: ErrorLogEvent) => void>();
    const logger = createErrorLogger([
      {
        name: "optional",
        required: false,
        report: () => {
          throw new Error("optional failure");
        },
      },
      {
        name: "required",
        required: true,
        report,
      },
    ]);

    await expect(
      logger.report({
        source: "test.source",
        message: "Something failed",
        level: "warning",
      }),
    ).resolves.toBeUndefined();
    expect(report).toHaveBeenCalledTimes(1);
  });
});

describe("ConsoleErrorLoggingAdapter", () => {
  it("writes warnings via console.warn", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const adapter = new ConsoleErrorLoggingAdapter();

    adapter.report({
      source: "test.source",
      message: "Something degraded",
      level: "warning",
      occurredAt: "2025-01-01T00:00:00.000Z",
    });

    expect(warn).toHaveBeenCalledTimes(1);
    expect(error).not.toHaveBeenCalled();

    warn.mockRestore();
    error.mockRestore();
  });
});

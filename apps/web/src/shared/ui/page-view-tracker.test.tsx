// @vitest-environment jsdom

import { createElement } from "react";
import { cleanup, render, waitFor } from "@testing-library/react";
import { createBehaviorLogger } from "@pmf/user-behavior-log";
import { BehaviorLoggerProvider } from "@pmf/user-behavior-log/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PageViewTracker } from "@/shared/ui/page-view-tracker";

const { usePathname } = vi.hoisted(() => ({
  usePathname: vi.fn<() => string | null>(),
}));
const send = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname,
}));

afterEach(() => {
  cleanup();
});

describe("PageViewTracker", () => {
  beforeEach(() => {
    usePathname.mockReset();
    send.mockReset();
  });

  it("tracks admin page views with the admin event name", async () => {
    usePathname.mockReturnValue("/admin");
    const logger = createBehaviorLogger({
      send,
    });

    render(
      createElement(
        BehaviorLoggerProvider,
        { logger },
        createElement(PageViewTracker),
      ),
    );

    await waitFor(() =>
      expect(send).toHaveBeenCalledWith(
        expect.objectContaining({
          eventName: "admin_page_viewed",
          path: "/admin",
        }),
      ),
    );
  });

  it("tracks regular pages with the default page-view event", async () => {
    usePathname.mockReturnValue("/pay");
    const logger = createBehaviorLogger({
      send,
    });

    render(
      createElement(
        BehaviorLoggerProvider,
        { logger },
        createElement(PageViewTracker),
      ),
    );

    await waitFor(() =>
      expect(send).toHaveBeenCalledWith(
        expect.objectContaining({
          eventName: "page_view",
          path: "/pay",
        }),
      ),
    );
  });

  it("does not track before a pathname is available", async () => {
    usePathname.mockReturnValue(null);
    const logger = createBehaviorLogger({
      send,
    });

    render(
      createElement(
        BehaviorLoggerProvider,
        { logger },
        createElement(PageViewTracker),
      ),
    );

    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });

    expect(send).not.toHaveBeenCalled();
  });
});

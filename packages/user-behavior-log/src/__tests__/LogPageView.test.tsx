// @vitest-environment jsdom

import { render, waitFor } from "@testing-library/react";

import { createBehaviorLogger } from "../create-behavior-logger";
import { BehaviorLoggerProvider } from "../react/context";
import { LogPageView } from "../react/LogPageView";

describe("LogPageView", () => {
  it("sends a page_view event on mount", async () => {
    const send = vi.fn();
    const logger = createBehaviorLogger({
      send,
      getContext: () => ({
        path: "/landing",
      }),
    });

    render(
      <BehaviorLoggerProvider logger={logger}>
        <LogPageView metadata={{ surface: "landing" }} />
      </BehaviorLoggerProvider>,
    );

    await waitFor(() =>
      expect(send).toHaveBeenCalledWith(
        expect.objectContaining({
          eventName: "page_view",
          path: "/landing",
          metadata: {
            surface: "landing",
          },
        }),
      ),
    );
  });
});

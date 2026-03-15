// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { createBehaviorLogger } from "../create-behavior-logger";
import { BehaviorLoggerProvider } from "../react/context";
import { LogClick } from "../react/LogClick";

describe("LogClick", () => {
  it("sends a click event and preserves the child onClick handler", async () => {
    const send = vi.fn();
    const childOnClick = vi.fn();
    const logger = createBehaviorLogger({
      send,
      getContext: () => ({
        path: "/pricing",
      }),
    });

    render(
      <BehaviorLoggerProvider logger={logger}>
        <LogClick
          element={{
            id: "hero-cta",
            type: "button",
          }}
        >
          <button type="button" onClick={childOnClick}>
            상담 신청
          </button>
        </LogClick>
      </BehaviorLoggerProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "상담 신청" }));

    expect(childOnClick).toHaveBeenCalledTimes(1);
    await waitFor(() =>
      expect(send).toHaveBeenCalledWith(
        expect.objectContaining({
          eventName: "click",
          path: "/pricing",
          element: {
            id: "hero-cta",
            type: "button",
          },
        }),
      ),
    );
  });
});

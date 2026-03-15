// @vitest-environment jsdom

import { render, screen, waitFor } from "@testing-library/react";

import { createBehaviorLogger } from "../create-behavior-logger";
import { BehaviorLoggerProvider } from "../react/context";
import { LogImpression } from "../react/LogImpression";

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];

  callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    MockIntersectionObserver.instances.push(this);
  }

  disconnect = vi.fn();
  observe = vi.fn();
  unobserve = vi.fn();
  takeRecords = vi.fn(() => []);

  trigger(entry: Partial<IntersectionObserverEntry>) {
    this.callback([entry as IntersectionObserverEntry], this as unknown as IntersectionObserver);
  }
}

describe("LogImpression", () => {
  beforeEach(() => {
    MockIntersectionObserver.instances = [];
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends an impression event when the target becomes visible", async () => {
    const send = vi.fn();
    const logger = createBehaviorLogger({
      send,
      getContext: () => ({
        path: "/pricing",
      }),
    });

    render(
      <BehaviorLoggerProvider logger={logger}>
        <LogImpression
          element={{
            id: "pricing-card",
            type: "card",
          }}
          threshold={0.2}
        >
          <div>추천 카드</div>
        </LogImpression>
      </BehaviorLoggerProvider>,
    );

    const observer = MockIntersectionObserver.instances[0];
    observer?.trigger({
      isIntersecting: true,
      intersectionRatio: 0.8,
      target: screen.getByText("추천 카드"),
    });

    await waitFor(() =>
      expect(send).toHaveBeenCalledWith(
        expect.objectContaining({
          eventName: "impression",
          path: "/pricing",
          element: {
            id: "pricing-card",
            type: "card",
          },
        }),
      ),
    );
  });
});

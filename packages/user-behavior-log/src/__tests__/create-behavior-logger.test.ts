import { createBehaviorLogger } from "../create-behavior-logger";

describe("createBehaviorLogger", () => {
  it("merges base context with event specific input", async () => {
    const send = vi.fn();
    const logger = createBehaviorLogger({
      send,
      getContext: () => ({
        path: "/pricing",
        sessionId: "sess_123",
        metadata: {
          surface: "hero",
        },
      }),
    });

    const event = await logger.click({
      element: {
        id: "primary-cta",
        type: "button",
      },
      metadata: {
        variant: "benefit",
      },
    });

    expect(send).toHaveBeenCalledWith({
      eventName: "click",
      path: "/pricing",
      sessionId: "sess_123",
      metadata: {
        surface: "hero",
        variant: "benefit",
      },
      element: {
        id: "primary-cta",
        type: "button",
      },
      occurredAt: event.occurredAt,
    });
  });

  it("allows overriding the default click event name", async () => {
    const send = vi.fn();
    const logger = createBehaviorLogger({ send });

    await logger.click({
      eventName: "cta_clicked",
    });

    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: "cta_clicked",
      }),
    );
  });
});

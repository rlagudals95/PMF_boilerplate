// @vitest-environment jsdom

import {
  createElement,
  type MouseEvent,
  type MouseEventHandler,
  type ReactNode,
} from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createBehaviorLogger } from "@pmf/user-behavior-log";
import { BehaviorLoggerProvider } from "@pmf/user-behavior-log/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TrackedLink } from "@/shared/ui/tracked-link";

const { usePathname } = vi.hoisted(() => ({
  usePathname: vi.fn<() => string | null>(),
}));
const send = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname,
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    onClick,
    ...props
  }: {
    children?: ReactNode;
    onClick?: MouseEventHandler<HTMLAnchorElement>;
  }) =>
    createElement(
      "a",
      {
        ...props,
        href: "#",
        onClick,
      },
      children,
    ),
}));

afterEach(() => {
  cleanup();
});

describe("TrackedLink", () => {
  beforeEach(() => {
    usePathname.mockReset();
    send.mockReset();
    usePathname.mockReturnValue("/landing");
  });

  it("forwards pathname and destination metadata to the behavior logger", async () => {
    const logger = createBehaviorLogger({
      send,
    });

    render(
      createElement(
        BehaviorLoggerProvider,
        { logger },
        createElement(
          TrackedLink,
          {
            href: "/pay",
            eventProperties: {
              source: "hero",
            },
          },
          "결제 데모",
        ),
      ),
    );

    fireEvent.click(screen.getByRole("link", { name: "결제 데모" }));

    await waitFor(() =>
      expect(send).toHaveBeenCalledWith(
        expect.objectContaining({
          eventName: "cta_clicked",
          path: "/landing",
          element: {
            id: "/pay",
            type: "link",
          },
          metadata: {
            destination: "/pay",
            source: "hero",
          },
        }),
      ),
    );
  });

  it("skips tracking when the click is prevented by the caller", () => {
    const logger = createBehaviorLogger({
      send,
    });

    render(
      createElement(
        BehaviorLoggerProvider,
        { logger },
        createElement(
          TrackedLink,
          {
            href: "/pay",
            onClick: (
              event: MouseEvent<HTMLAnchorElement> & {
                currentTarget: EventTarget & HTMLAnchorElement;
              },
            ) => {
              event.preventDefault();
            },
          },
          "결제 데모",
        ),
      ),
    );

    fireEvent.click(screen.getByRole("link", { name: "결제 데모" }));

    expect(send).not.toHaveBeenCalled();
  });
});

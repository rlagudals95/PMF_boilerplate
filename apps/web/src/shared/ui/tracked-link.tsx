"use client";

import { createElement, type ComponentPropsWithoutRef, type MouseEvent } from "react";

import { LogClick } from "@pmf/user-behavior-log/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type TrackedLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  eventName?: "cta_clicked";
  eventProperties?: Record<string, unknown>;
};

export function TrackedLink({
  eventName = "cta_clicked",
  eventProperties,
  onClick,
  href,
  ...props
}: TrackedLinkProps) {
  const pathname = usePathname();
  const destination = typeof href === "string" ? href : href.pathname ?? "/";
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
  };

  return createElement(
    LogClick,
    {
      eventName,
      path: pathname || "/",
      element: {
        id: destination,
        type: "link",
      },
      metadata: {
        destination,
        ...eventProperties,
      },
      children: createElement(Link, {
        ...props,
        href,
        onClick: handleClick,
      }),
    },
  );
}

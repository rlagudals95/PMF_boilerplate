"use client";

import type { ComponentPropsWithoutRef, MouseEvent } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { trackMarketingEvent } from "@/modules/marketing/model/track-marketing-event";
import { trackEventAction } from "@/shared/api/track-event-action";
import { getAnalyticsSessionId } from "@/shared/lib/analytics-session";

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

    if (event.defaultPrevented) {
      return;
    }

    trackMarketingEvent({
      eventName,
      path: pathname || "/",
      properties: {
        destination,
        ...eventProperties,
      },
    });

    void trackEventAction({
      eventName,
      path: pathname || "/",
      sessionId: getAnalyticsSessionId(),
      properties: {
        destination,
        ...eventProperties,
      },
    });
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}

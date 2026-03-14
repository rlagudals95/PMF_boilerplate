"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { trackMarketingEvent } from "@/modules/marketing/model/track-marketing-event";
import { trackEventAction } from "@/shared/api/track-event-action";
import { getAnalyticsSessionId } from "@/shared/lib/analytics-session";

export function PageViewTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || lastTrackedPath.current === pathname) {
      return;
    }

    lastTrackedPath.current = pathname;
    trackMarketingEvent({
      eventName: "page_view",
      path: pathname,
    });

    void trackEventAction({
      eventName: pathname.startsWith("/admin") ? "admin_page_viewed" : "page_view",
      path: pathname,
      sessionId: getAnalyticsSessionId(),
    });
  }, [pathname]);

  return null;
}

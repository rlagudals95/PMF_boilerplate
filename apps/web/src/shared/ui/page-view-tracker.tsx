"use client";

import { usePageView } from "@pmf/user-behavior-log/react";
import { usePathname } from "next/navigation";

export function PageViewTracker() {
  const pathname = usePathname();

  usePageView({
    enabled: Boolean(pathname),
    eventName: pathname?.startsWith("/admin") ? "admin_page_viewed" : "page_view",
    path: pathname ?? "/",
    deps: [pathname],
  });

  return null;
}

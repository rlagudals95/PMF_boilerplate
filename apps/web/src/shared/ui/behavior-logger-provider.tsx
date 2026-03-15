"use client";

import type { ReactNode } from "react";

import { BehaviorLoggerProvider } from "@pmf/user-behavior-log/react";

import { appBehaviorLogger } from "@/shared/lib/app-behavior-logger";

export function AppBehaviorLoggerProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <BehaviorLoggerProvider logger={appBehaviorLogger}>
      {children}
    </BehaviorLoggerProvider>
  );
}

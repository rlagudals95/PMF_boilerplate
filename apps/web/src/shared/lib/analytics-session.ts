"use client";

const STORAGE_KEY = "pmf.analytics.session_id";

let memorySessionId: string | undefined;

const createSessionId = () => `anon_${crypto.randomUUID()}`;

export const getAnalyticsSessionId = () => {
  if (typeof window === "undefined") {
    return undefined;
  }

  if (memorySessionId) {
    return memorySessionId;
  }

  try {
    const existing = window.localStorage.getItem(STORAGE_KEY);

    if (existing) {
      memorySessionId = existing;
      return existing;
    }

    const created = createSessionId();
    window.localStorage.setItem(STORAGE_KEY, created);
    memorySessionId = created;
    return created;
  } catch {
    memorySessionId ??= createSessionId();
    return memorySessionId;
  }
};

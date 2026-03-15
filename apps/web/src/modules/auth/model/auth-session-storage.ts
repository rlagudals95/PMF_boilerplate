"use client";

import type { AuthKitSession } from "./auth-session";

const authKitSessionStorageKey = "pmf-auth-kit-session";
const naverStateStorageKey = "pmf-auth-kit-naver-state";

const canUseStorage = () => typeof window !== "undefined";

export const readStoredAuthKitSession = (): AuthKitSession | null => {
  if (!canUseStorage()) {
    return null;
  }

  const raw = window.localStorage.getItem(authKitSessionStorageKey);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthKitSession;
  } catch {
    window.localStorage.removeItem(authKitSessionStorageKey);
    return null;
  }
};

export const writeStoredAuthKitSession = (session: AuthKitSession) => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(authKitSessionStorageKey, JSON.stringify(session));
};

export const clearStoredAuthKitSession = () => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(authKitSessionStorageKey);
};

export const rememberNaverState = (state: string) => {
  if (!canUseStorage()) {
    return;
  }

  window.sessionStorage.setItem(naverStateStorageKey, state);
};

export const readRememberedNaverState = () => {
  if (!canUseStorage()) {
    return null;
  }

  return window.sessionStorage.getItem(naverStateStorageKey);
};

export const clearRememberedNaverState = () => {
  if (!canUseStorage()) {
    return;
  }

  window.sessionStorage.removeItem(naverStateStorageKey);
};

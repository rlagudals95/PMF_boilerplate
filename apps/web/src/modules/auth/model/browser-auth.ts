"use client";

import type { User } from "@supabase/supabase-js";

import { getBrowserSupabaseClient } from "@/lib/supabase/client";

import { buildAuthCallbackUrl, resolveSiteOrigin } from "./auth-routes";
import { createAuthKitSession, type AuthKitSession } from "./auth-session";
import {
  clearRememberedNaverState,
  clearStoredAuthKitSession,
  readRememberedNaverState,
  rememberNaverState,
  writeStoredAuthKitSession,
} from "./auth-session-storage";
import {
  buildNaverAuthorizationUrl,
  readNaverPublicConfig,
} from "./naver-oauth";
import type { AuthProviderId } from "./provider-config";

type SupabaseProvider = Extract<AuthProviderId, "google" | "kakao">;

export type AuthFlowResult = {
  ok: boolean;
  message: string;
  session?: AuthKitSession;
};

const getMetadataString = (user: User, key: string) => {
  const metadata =
    user.user_metadata && typeof user.user_metadata === "object"
      ? (user.user_metadata as Record<string, unknown>)
      : null;
  const value = metadata?.[key];
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
};

const createSupabaseSession = (
  user: User,
  provider: SupabaseProvider,
): AuthKitSession =>
  createAuthKitSession({
    provider,
    userId: user.id,
    email: user.email,
    displayName:
      getMetadataString(user, "name") ??
      getMetadataString(user, "full_name") ??
      getMetadataString(user, "nickname") ??
      getMetadataString(user, "preferred_username") ??
      user.email,
    avatarUrl:
      getMetadataString(user, "avatar_url") ?? getMetadataString(user, "picture"),
  });

const wait = (milliseconds: number) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });

const makeNaverState = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `naver-${Date.now()}`;
};

export const startSupabaseSocialLogin = async (
  provider: SupabaseProvider,
  nextPath?: string,
): Promise<AuthFlowResult> => {
  const supabase = getBrowserSupabaseClient();

  if (!supabase) {
    return {
      ok: false,
      message:
        "Supabase 브라우저 설정이 비어 있습니다. NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY를 확인해 주세요.",
    };
  }

  const redirectTo = buildAuthCallbackUrl({
    origin: resolveSiteOrigin(),
    provider,
    nextPath,
  });
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
    },
  });

  if (error) {
    return {
      ok: false,
      message: error.message,
    };
  }

  if (data.url) {
    window.location.assign(data.url);
  }

  return {
    ok: true,
    message: `${provider} 로그인으로 이동합니다.`,
  };
};

export const startNaverSocialLogin = (nextPath?: string): AuthFlowResult => {
  const naverConfig = readNaverPublicConfig();

  if (!naverConfig) {
    return {
      ok: false,
      message:
        "NEXT_PUBLIC_NAVER_CLIENT_ID가 설정되어 있지 않습니다. 네이버 로그인 starter를 사용할 수 없습니다.",
    };
  }

  const state = makeNaverState();

  rememberNaverState(state);
  window.location.assign(
    buildNaverAuthorizationUrl({
      clientId: naverConfig.clientId,
      siteUrl: resolveSiteOrigin(),
      state,
      nextPath,
    }),
  );

  return {
    ok: true,
    message: "네이버 로그인으로 이동합니다.",
  };
};

export const completeSupabaseSocialLogin = async (
  provider: SupabaseProvider,
): Promise<AuthFlowResult> => {
  const supabase = getBrowserSupabaseClient();

  if (!supabase) {
    return {
      ok: false,
      message:
        "Supabase 브라우저 설정이 비어 있습니다. NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY를 확인해 주세요.",
    };
  }

  for (const delay of [0, 150, 300, 600]) {
    if (delay > 0) {
      await wait(delay);
    }

    const { data, error } = await supabase.auth.getUser();

    if (error) {
      return {
        ok: false,
        message: error.message,
      };
    }

    if (data.user) {
      const session = createSupabaseSession(data.user, provider);
      writeStoredAuthKitSession(session);

      return {
        ok: true,
        message: `${provider} starter session이 준비되었습니다.`,
        session,
      };
    }
  }

  return {
    ok: false,
    message: "로그인 세션을 확인하지 못했습니다. provider 설정과 callback URL을 다시 확인해 주세요.",
  };
};

export const completeNaverSocialLogin = async (input: {
  code: string;
  state: string;
}): Promise<AuthFlowResult> => {
  const expectedState = readRememberedNaverState();

  if (!expectedState || expectedState !== input.state) {
    clearRememberedNaverState();

    return {
      ok: false,
      message: "네이버 로그인 state 검증에 실패했습니다. 다시 시도해 주세요.",
    };
  }

  clearRememberedNaverState();

  const response = await fetch("/api/auth/naver/session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const payload = (await response.json().catch(() => null)) as
    | { ok?: boolean; message?: string; session?: AuthKitSession }
    | null;

  if (!response.ok || !payload?.ok || !payload.session) {
    return {
      ok: false,
      message: payload?.message ?? "네이버 로그인 callback 처리에 실패했습니다.",
    };
  }

  writeStoredAuthKitSession(payload.session);

  return {
    ok: true,
    message: "naver starter session이 준비되었습니다.",
    session: payload.session,
  };
};

export const signOutSocialLogin = async () => {
  clearRememberedNaverState();
  clearStoredAuthKitSession();

  const supabase = getBrowserSupabaseClient();

  if (supabase) {
    await supabase.auth.signOut().catch(() => undefined);
  }
};

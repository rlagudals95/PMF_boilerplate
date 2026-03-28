import { describe, expect, it } from "vitest";

import {
  getAuthProviderStatuses,
  getEnabledAuthProviderNames,
} from "./provider-config";

describe("getAuthProviderStatuses", () => {
  it("enables google and kakao only when Supabase env and feature flags exist", () => {
    expect(
      getEnabledAuthProviderNames({
        NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
        NEXT_PUBLIC_AUTH_GOOGLE_ENABLED: "true",
        NEXT_PUBLIC_AUTH_KAKAO_ENABLED: "true",
      }),
    ).toEqual(["google", "kakao"]);
  });

  it("keeps providers disabled and exposes setup hints when config is incomplete", () => {
    const providers = getAuthProviderStatuses({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
    });

    expect(providers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "google",
          isEnabled: false,
          setupHint:
            "Optional Supabase Auth starter입니다. NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY를 설정하면 Google 로그인을 켤 수 있습니다.",
        }),
        expect.objectContaining({
          id: "naver",
          isEnabled: false,
          setupHint:
            "Optional OAuth starter입니다. NEXT_PUBLIC_NAVER_CLIENT_ID / NAVER_CLIENT_SECRET 설정이 필요합니다.",
        }),
      ]),
    );
  });

  it("keeps google disabled until the optional auth starter flag and provider setup are both ready", () => {
    const providers = getAuthProviderStatuses({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
    });

    expect(providers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "google",
          isEnabled: false,
          setupHint:
            "Optional Supabase Auth starter입니다. Google을 활성화하려면 NEXT_PUBLIC_AUTH_GOOGLE_ENABLED=true 와 Supabase Google provider 설정이 필요합니다.",
        }),
      ]),
    );
  });

  it("enables naver only when both client id and secret exist", () => {
    expect(
      getEnabledAuthProviderNames({
        NEXT_PUBLIC_NAVER_CLIENT_ID: "naver-client",
        NAVER_CLIENT_SECRET: "naver-secret",
      }),
    ).toEqual(["naver"]);
  });
});

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
            "NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY가 필요합니다.",
        }),
        expect.objectContaining({
          id: "naver",
          isEnabled: false,
          setupHint:
            "NEXT_PUBLIC_NAVER_CLIENT_ID / NAVER_CLIENT_SECRET 설정이 필요합니다.",
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

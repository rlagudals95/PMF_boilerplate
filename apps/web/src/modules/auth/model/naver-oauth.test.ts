import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  buildNaverAuthorizationUrl,
  exchangeNaverAuthorizationCode,
} from "./naver-oauth";

describe("buildNaverAuthorizationUrl", () => {
  it("builds the callback URL with provider and next path", () => {
    const authorizationUrl = buildNaverAuthorizationUrl({
      clientId: "naver-client",
      siteUrl: "https://pmf.example.com",
      state: "state-123",
      nextPath: "/auth",
    });

    const url = new URL(authorizationUrl);

    expect(url.origin + url.pathname).toBe("https://nid.naver.com/oauth2.0/authorize");
    expect(url.searchParams.get("client_id")).toBe("naver-client");
    expect(url.searchParams.get("state")).toBe("state-123");
    expect(url.searchParams.get("redirect_uri")).toBe(
      "https://pmf.example.com/auth/callback?provider=naver&next=%2Fauth",
    );
  });
});

describe("exchangeNaverAuthorizationCode", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("normalizes the Naver profile into an auth kit session", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
          access_token: "naver-access-token",
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
          response: {
            id: "naver-user-1",
            email: "naver@example.com",
            name: "홍길동",
            profile_image: "https://example.com/avatar.png",
          },
          }),
      });

    global.fetch = fetchMock as typeof fetch;

    const session = await exchangeNaverAuthorizationCode(
      {
        code: "code-123",
        state: "state-123",
      },
      {
        NEXT_PUBLIC_NAVER_CLIENT_ID: "naver-client",
        NAVER_CLIENT_SECRET: "naver-secret",
        NEXT_PUBLIC_SITE_URL: "https://pmf.example.com",
      },
    );

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(session).toEqual(
      expect.objectContaining({
        provider: "naver",
        userId: "naver-user-1",
        email: "naver@example.com",
        displayName: "홍길동",
        avatarUrl: "https://example.com/avatar.png",
      }),
    );
  });

  it("throws when token exchange fails", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () =>
        Promise.resolve({
          error_description: "invalid_client",
        }),
    }) as typeof fetch;

    await expect(
      exchangeNaverAuthorizationCode(
        {
          code: "code-123",
          state: "state-123",
        },
        {
          NEXT_PUBLIC_NAVER_CLIENT_ID: "naver-client",
          NAVER_CLIENT_SECRET: "naver-secret",
          NEXT_PUBLIC_SITE_URL: "https://pmf.example.com",
        },
      ),
    ).rejects.toThrow("invalid_client");
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });
});

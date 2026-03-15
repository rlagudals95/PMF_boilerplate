import { beforeEach, describe, expect, it, vi } from "vitest";

import { appErrorLogger } from "@/lib/error-logging";
import { exchangeNaverAuthorizationCode } from "@/modules/auth/model/naver-oauth";

import { POST } from "./route";

vi.mock("@/modules/auth/model/naver-oauth", () => ({
  exchangeNaverAuthorizationCode: vi.fn(),
}));

vi.mock("@/lib/error-logging", () => ({
  appErrorLogger: {
    report: vi.fn(),
  },
}));

describe("POST /api/auth/naver/session", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects invalid payload at the route boundary", async () => {
    const request = new Request("http://localhost/api/auth/naver/session", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        code: "code-123",
      }),
    });

    const response = await POST(request as never);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      message: "code와 state가 모두 필요합니다.",
    });
    expect(exchangeNaverAuthorizationCode).not.toHaveBeenCalled();
  });

  it("returns the normalized session when exchange succeeds", async () => {
    vi.mocked(exchangeNaverAuthorizationCode).mockResolvedValue({
      provider: "naver",
      userId: "naver-user-1",
      email: "naver@example.com",
      displayName: "홍길동",
      loggedInAt: "2026-03-15T03:00:00.000Z",
    });

    const request = new Request("http://localhost/api/auth/naver/session", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        code: "code-123",
        state: "state-123",
      }),
    });

    const response = await POST(request as never);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      session: {
        provider: "naver",
        userId: "naver-user-1",
      },
    });
  });

  it("reports and returns 502 when provider exchange fails", async () => {
    vi.mocked(exchangeNaverAuthorizationCode).mockRejectedValue(
      new Error("provider unavailable"),
    );

    const request = new Request("http://localhost/api/auth/naver/session", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        code: "code-123",
        state: "state-123",
      }),
    });

    const response = await POST(request as never);

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      message: "provider unavailable",
    });
    expect(appErrorLogger.report).toHaveBeenCalledWith(
      expect.objectContaining({
        source: "route.api.auth.naver.session.POST",
      }),
    );
  });
});

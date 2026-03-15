import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { appErrorLogger } from "@/lib/error-logging";
import { exchangeNaverAuthorizationCode } from "@/modules/auth/model/naver-oauth";

const asRecord = (value: unknown) =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : {};

const getString = (value: unknown) => (typeof value === "string" ? value : undefined);

export async function POST(request: NextRequest) {
  const payload = asRecord(await request.json().catch(() => null));
  const code = getString(payload.code);
  const state = getString(payload.state);

  if (!code || !state) {
    return NextResponse.json(
      {
        ok: false,
        message: "code와 state가 모두 필요합니다.",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const session = await exchangeNaverAuthorizationCode({
      code,
      state,
    });

    return NextResponse.json({
      ok: true,
      session,
    });
  } catch (error) {
    await appErrorLogger.report({
      source: "route.api.auth.naver.session.POST",
      message: "Naver auth callback handling failed",
      error,
      context: {
        path: "/api/auth/naver/session",
      },
    });

    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "네이버 로그인 처리 중 문제가 발생했습니다.",
      },
      {
        status: 502,
      },
    );
  }
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { appErrorLogger } from "@/lib/error-logging";
import { syncPaymentStatus } from "@/modules/payment/model/sync-payment-status";

const asRecord = (value: unknown) =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : {};

const getString = (value: unknown) => (typeof value === "string" ? value : undefined);

const readCallbackPayload = async (request: NextRequest) => {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return asRecord(await request.json().catch(() => null));
  }

  if (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data")
  ) {
    const formData = await request.formData();
    return Object.fromEntries(formData.entries());
  }

  const raw = await request.text();
  return Object.fromEntries(new URLSearchParams(raw).entries());
};

export async function POST(request: NextRequest) {
  try {
    const payload = await readCallbackPayload(request);
    const orderNo = getString(payload.orderNo);
    const payToken = getString(payload.payToken);
    const status = getString(payload.status) ?? getString(payload.paymentStatus);
    const payMethod = getString(payload.payMethod);

    const payment = await syncPaymentStatus({
      orderNo,
      payToken,
      rawStatus: status,
      payMethod,
      path: "/api/payments/toss/callback",
      metadata: {
        callbackPayload: payload,
      },
    });

    return NextResponse.json({
      ok: true,
      paymentId: payment?.id ?? null,
    });
  } catch (error) {
    await appErrorLogger.report({
      source: "route.api.payments.toss.callback.POST",
      message: "Toss callback handling failed",
      error,
      context: {
        path: "/api/payments/toss/callback",
      },
    });

    return NextResponse.json(
      {
        ok: false,
        message:
          error instanceof Error ? error.message : "Unknown callback failure",
      },
      { status: 500 },
    );
  }
}

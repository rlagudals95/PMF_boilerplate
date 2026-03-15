import { beforeEach, describe, expect, it, vi } from "vitest";

import { appErrorLogger } from "@/lib/error-logging";
import { syncPaymentStatus } from "@/modules/payment/model/sync-payment-status";

import { POST } from "./route";

vi.mock("@/modules/payment/model/sync-payment-status", () => ({
  syncPaymentStatus: vi.fn(),
}));

vi.mock("@/lib/error-logging", () => ({
  appErrorLogger: {
    report: vi.fn(),
  },
}));

describe("POST /api/payments/toss/callback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 404 when the callback does not match an existing payment", async () => {
    vi.mocked(syncPaymentStatus).mockResolvedValue(undefined);

    const request = new Request("http://localhost/api/payments/toss/callback", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        orderNo: "order_missing",
        status: "PAY_COMPLETE",
      }),
    });

    const response = await POST(request as never);

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      message: "매칭되는 결제 기록을 찾지 못했습니다.",
    });
    expect(appErrorLogger.report).toHaveBeenCalledWith(
      expect.objectContaining({
        source: "route.api.payments.toss.callback.POST",
        level: "warning",
      }),
    );
  });

  it("returns the matched payment id when sync succeeds", async () => {
    vi.mocked(syncPaymentStatus).mockResolvedValue({
      id: "payment_test",
    } as Awaited<ReturnType<typeof syncPaymentStatus>>);

    const request = new Request("http://localhost/api/payments/toss/callback", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        orderNo: "order_123",
        status: "PAY_COMPLETE",
      }),
    });

    const response = await POST(request as never);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      paymentId: "payment_test",
    });
  });
});

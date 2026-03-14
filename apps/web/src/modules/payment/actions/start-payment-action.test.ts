import { beforeEach, describe, expect, it, vi } from "vitest";

import { startPaymentAction } from "./start-payment-action";
import { startPayment } from "../model/start-payment";

vi.mock("../model/start-payment", () => ({
  startPayment: vi.fn(),
}));

describe("startPaymentAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects invalid input at the action boundary", async () => {
    const result = await startPaymentAction({
      amount: 0,
      customerName: "홍길동",
      productDescription: "",
    });

    expect(result.ok).toBe(false);
    expect(startPayment).not.toHaveBeenCalled();
  });

  it("passes validated checkout input to the model", async () => {
    const analyticsContext = { sessionId: "anon_test" };
    const input = {
      productDescription: "모두의렌탈 결제 데모",
      amount: 39_000,
      customerName: "홍길동",
      customerEmail: "hong@example.com",
    };

    vi.mocked(startPayment).mockResolvedValue({
      ok: true,
      message: "토스 결제 페이지로 이동합니다.",
      redirectUrl: "https://example.com/checkout",
    });

    const result = await startPaymentAction(input, analyticsContext);

    expect(result.ok).toBe(true);
    expect(startPayment).toHaveBeenCalledWith(input, analyticsContext);
  });
});

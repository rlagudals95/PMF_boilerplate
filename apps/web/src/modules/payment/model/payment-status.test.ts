import { describe, expect, it } from "vitest";

import {
  getPaymentEventName,
  normalizeTossPaymentStatus,
} from "./payment-status";

describe("normalizeTossPaymentStatus", () => {
  it("maps success statuses to paid", () => {
    expect(normalizeTossPaymentStatus("PAY_COMPLETE")).toBe("paid");
    expect(normalizeTossPaymentStatus("approved")).toBe("paid");
  });

  it("maps cancel statuses to cancelled", () => {
    expect(normalizeTossPaymentStatus("PAY_CANCEL")).toBe("cancelled");
    expect(normalizeTossPaymentStatus("cancelled")).toBe("cancelled");
  });

  it("maps failure statuses to failed", () => {
    expect(normalizeTossPaymentStatus("PAY_FAIL")).toBe("failed");
    expect(normalizeTossPaymentStatus("expired")).toBe("failed");
  });

  it("keeps unknown statuses in ready for later callback sync", () => {
    expect(normalizeTossPaymentStatus("WAITING")).toBe("ready");
  });
});

describe("getPaymentEventName", () => {
  it("returns analytics event names for terminal states", () => {
    expect(getPaymentEventName("paid")).toBe("payment_succeeded");
    expect(getPaymentEventName("cancelled")).toBe("payment_cancelled");
    expect(getPaymentEventName("failed")).toBe("payment_failed");
  });

  it("returns null for non-terminal states", () => {
    expect(getPaymentEventName("ready")).toBeNull();
  });
});

import { describe, expect, it } from "vitest";

import {
  consultationRequestInputSchema,
  leadCaptureInputSchema,
  paymentCheckoutInputSchema,
} from "./forms";

describe("leadCaptureInputSchema", () => {
  it("accepts a valid landing lead", () => {
    const result = leadCaptureInputSchema.safeParse({
      name: "홍길동",
      phone: "010-1111-2222",
      email: "hong@example.com",
      productInterest: "정수기 렌탈",
      message: "빠른 상담 요청",
      source: "landing_page",
      consent: true,
    });

    expect(result.success).toBe(true);
  });

  it("rejects missing consent", () => {
    const result = leadCaptureInputSchema.safeParse({
      name: "홍길동",
      phone: "010-1111-2222",
      productInterest: "정수기 렌탈",
      consent: false,
    });

    expect(result.success).toBe(false);
  });
});

describe("consultationRequestInputSchema", () => {
  it("accepts a valid consultation request", () => {
    const result = consultationRequestInputSchema.safeParse({
      name: "홍길동",
      phone: "010-1111-2222",
      email: "hong@example.com",
      productInterest: "안마의자 렌탈",
      consultationType: "call",
      preferredDate: "2025-01-10T09:00:00.000Z",
      rentalPeriod: "24개월",
      budgetRange: "월 5-10만원",
      notes: "주말 오전 선호",
      consent: true,
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid phone values", () => {
    const result = consultationRequestInputSchema.safeParse({
      name: "홍길동",
      phone: "abc",
      productInterest: "안마의자 렌탈",
      consultationType: "call",
      consent: true,
    });

    expect(result.success).toBe(false);
  });
});

describe("paymentCheckoutInputSchema", () => {
  it("accepts a valid payment request", () => {
    const result = paymentCheckoutInputSchema.safeParse({
      productDescription: "모두의렌탈 결제 데모",
      amount: 39000,
      customerName: "홍길동",
      customerEmail: "hong@example.com",
    });

    expect(result.success).toBe(true);
  });

  it("rejects non-positive amounts", () => {
    const result = paymentCheckoutInputSchema.safeParse({
      productDescription: "모두의렌탈 결제 데모",
      amount: 0,
      customerName: "홍길동",
    });

    expect(result.success).toBe(false);
  });
});

import type { ConsultationRequest, Lead } from "@pmf/core";
import { beforeEach, describe, expect, it, vi } from "vitest";

const insertValues = vi.fn(() => Promise.resolve(undefined));
const insert = vi.fn(() => ({
  values: insertValues,
}));
const txInsertValues = vi.fn(() => Promise.resolve(undefined));
const txInsert = vi.fn(() => ({
  values: txInsertValues,
}));
const transaction = vi.fn(async (callback: (tx: { insert: typeof txInsert }) => Promise<void>) =>
  callback({
    insert: txInsert,
  }),
);

vi.mock("./postgres", () => ({
  getDatabase: () => ({
    insert,
    transaction,
  }),
  isDatabaseConfigured: () => true,
}));

describe("postgres repository persistence", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("routes lead creation through the configured postgres client", async () => {
    const { createLead } = await import("./repository");

    const lead: Lead = {
      id: "lead_test",
      name: "홍길동",
      phone: "010-1234-5678",
      email: "hong@example.com",
      productInterest: "업무 자동화",
      source: "landing_page",
      status: "new",
      message: "도입 상담 희망",
      tags: [],
      createdAt: "2026-03-29T00:00:00.000Z",
      updatedAt: "2026-03-29T00:00:00.000Z",
    };

    await createLead(lead);

    expect(insert).toHaveBeenCalledTimes(1);
    expect(insertValues).toHaveBeenCalledWith(lead);
  });

  it("stores the lead and consultation request in one transaction when postgres is configured", async () => {
    const { createLeadWithConsultationRequest } = await import("./repository");

    const lead: Lead = {
      id: "lead_test",
      name: "홍길동",
      phone: "010-1234-5678",
      email: "hong@example.com",
      productInterest: "고객 문의 자동화",
      source: "consult_page",
      status: "new",
      message: "평일 오후 연락 희망",
      tags: [],
      createdAt: "2026-03-29T00:00:00.000Z",
      updatedAt: "2026-03-29T00:00:00.000Z",
    };
    const consultationRequest: ConsultationRequest = {
      id: "consult_test",
      leadId: lead.id,
      productInterest: lead.productInterest,
      consultationType: "call",
      preferredDate: undefined,
      rentalPeriod: "다음 분기",
      budgetRange: "월 10-30만원",
      notes: "평일 오후 연락 희망",
      status: "requested",
      createdAt: "2026-03-29T00:00:00.000Z",
      updatedAt: "2026-03-29T00:00:00.000Z",
    };

    await createLeadWithConsultationRequest(lead, consultationRequest);

    expect(transaction).toHaveBeenCalledTimes(1);
    expect(txInsert).toHaveBeenCalledTimes(2);
    expect(txInsertValues).toHaveBeenNthCalledWith(1, lead);
    expect(txInsertValues).toHaveBeenNthCalledWith(2, consultationRequest);
  });
});

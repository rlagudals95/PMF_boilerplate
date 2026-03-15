import { createLeadWithConsultationRequest } from "@pmf/db";
import { revalidatePath } from "next/cache";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { appAnalytics } from "@/lib/analytics";
import { appErrorLogger } from "@/lib/error-logging";

import { submitConsultationRequest } from "./submit-consultation-request";

vi.mock("@pmf/db", () => ({
  createLeadWithConsultationRequest: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/analytics", () => ({
  appAnalytics: {
    track: vi.fn(),
  },
}));

vi.mock("@/lib/error-logging", () => ({
  appErrorLogger: {
    report: vi.fn(),
  },
}));

const validInput = {
  name: "홍길동",
  phone: "010-1234-5678",
  email: "hong@example.com",
  productInterest: "정수기 렌탈",
  consultationType: "call",
  preferredDate: "",
  rentalPeriod: "36개월",
  budgetRange: "월 3-5만원",
  notes: "평일 오후 연락 희망",
  consent: true,
} as const;

describe("submitConsultationRequest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a failure result instead of throwing when the atomic save fails", async () => {
    vi.mocked(createLeadWithConsultationRequest).mockRejectedValue(
      new Error("db unavailable"),
    );

    const result = await submitConsultationRequest(validInput, {
      sessionId: "anon_test",
    });

    expect(result).toEqual({
      ok: false,
      message: "상담 요청 접수 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
    });
    expect(appErrorLogger.report).toHaveBeenCalledWith(
      expect.objectContaining({
        source: "module.consultation.submitConsultationRequest",
      }),
    );
    expect(appAnalytics.track).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("keeps the submission successful when analytics tracking fails", async () => {
    vi.mocked(createLeadWithConsultationRequest).mockResolvedValue({
      lead: { id: "lead_test" },
      consultationRequest: { id: "consult_test" },
    } as Awaited<ReturnType<typeof createLeadWithConsultationRequest>>);
    vi.mocked(appAnalytics.track).mockRejectedValue(new Error("analytics unavailable"));

    const result = await submitConsultationRequest(validInput, {
      sessionId: "anon_test",
    });

    expect(result).toEqual({
      ok: true,
      message: "상담 요청이 접수되었습니다. 선호한 방식으로 연락드릴게요.",
    });
    expect(appErrorLogger.report).toHaveBeenCalledWith(
      expect.objectContaining({
        source: "module.consultation.submitConsultationRequest.analytics",
        level: "warning",
      }),
    );
    expect(revalidatePath).toHaveBeenCalledWith("/consult");
    expect(revalidatePath).toHaveBeenCalledWith("/admin");
    expect(revalidatePath).toHaveBeenCalledWith("/admin/leads");
  });
});

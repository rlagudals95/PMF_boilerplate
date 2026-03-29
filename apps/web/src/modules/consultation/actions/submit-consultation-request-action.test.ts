import { beforeEach, describe, expect, it, vi } from "vitest";
import { revalidatePath } from "next/cache";

import { submitConsultationRequestAction } from "./submit-consultation-request-action";
import { submitConsultationRequest } from "../model/submit-consultation-request";
import { submitConsultationRequestViaApi } from "@/shared/api/pmf-api-client";

vi.mock("../model/submit-consultation-request", () => ({
  submitConsultationRequest: vi.fn(),
}));

vi.mock("@/shared/api/pmf-api-client", () => ({
  submitConsultationRequestViaApi: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("submitConsultationRequestAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.PMF_API_BASE_URL;
  });

  it("rejects invalid input at the action boundary", async () => {
    const result = await submitConsultationRequestAction({
      name: "",
      phone: "123",
      productInterest: "",
      consultationType: "call",
      consent: false,
    });

    expect(result.ok).toBe(false);
    expect(submitConsultationRequest).not.toHaveBeenCalled();
    expect(submitConsultationRequestViaApi).not.toHaveBeenCalled();
  });

  it("calls the local model when api mode is disabled", async () => {
    const input = {
      name: "홍길동",
      phone: "010-1234-5678",
      email: "hong@example.com",
      productInterest: "고객 문의 자동화",
      consultationType: "call",
      preferredDate: "",
      rentalPeriod: "다음 분기",
      budgetRange: "월 10-30만원",
      notes: "평일 오후 연락 희망",
      consent: true,
    } as const;
    const analyticsContext = { sessionId: "anon_test" };

    vi.mocked(submitConsultationRequest).mockResolvedValue({
      ok: true,
      message: "상담 요청이 접수되었습니다. 선호한 방식으로 연락드릴게요.",
    });

    const result = await submitConsultationRequestAction(input, analyticsContext);

    expect(result.ok).toBe(true);
    expect(submitConsultationRequest).toHaveBeenCalledWith(input, analyticsContext);
    expect(submitConsultationRequestViaApi).not.toHaveBeenCalled();
  });

  it("routes validated consultation submissions through the api when api mode is enabled", async () => {
    process.env.PMF_API_BASE_URL = "http://localhost:4000";

    const input = {
      name: "홍길동",
      phone: "010-1234-5678",
      email: "hong@example.com",
      productInterest: "고객 문의 자동화",
      consultationType: "call",
      preferredDate: "",
      rentalPeriod: "다음 분기",
      budgetRange: "월 10-30만원",
      notes: "평일 오후 연락 희망",
      consent: true,
    } as const;
    const analyticsContext = { sessionId: "anon_test" };

    vi.mocked(submitConsultationRequestViaApi).mockResolvedValue({
      ok: true,
      message: "상담 요청이 접수되었습니다. 선호한 방식으로 연락드릴게요.",
    });

    const result = await submitConsultationRequestAction(input, analyticsContext);

    expect(result.ok).toBe(true);
    expect(submitConsultationRequestViaApi).toHaveBeenCalledWith(
      input,
      analyticsContext,
    );
    expect(submitConsultationRequest).not.toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith("/consult");
    expect(revalidatePath).toHaveBeenCalledWith("/admin");
    expect(revalidatePath).toHaveBeenCalledWith("/admin/leads");
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";
import { revalidatePath } from "next/cache";

import { submitLeadAction } from "./submit-lead-action";
import { submitLead } from "../model/submit-lead";
import { submitLeadViaApi } from "@/shared/api/pmf-api-client";

vi.mock("../model/submit-lead", () => ({
  submitLead: vi.fn(),
}));

vi.mock("@/shared/api/pmf-api-client", () => ({
  submitLeadViaApi: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("submitLeadAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.PMF_API_BASE_URL;
  });

  it("rejects invalid input at the action boundary", async () => {
    const result = await submitLeadAction({
      name: "",
      phone: "123",
      productInterest: "",
      source: "landing_page",
      consent: false,
    });

    expect(result.ok).toBe(false);
    expect(submitLead).not.toHaveBeenCalled();
    expect(submitLeadViaApi).not.toHaveBeenCalled();
  });

  it("calls the local model when api mode is disabled", async () => {
    const input = {
      name: "홍길동",
      phone: "010-1234-5678",
      email: "hong@example.com",
      productInterest: "업무 자동화",
      message: "도입 상담 희망",
      source: "landing_page",
      consent: true,
    } as const;
    const analyticsContext = { sessionId: "anon_test" };

    vi.mocked(submitLead).mockResolvedValue({
      ok: true,
      message: "문의가 접수되었습니다. 빠르게 검토 후 연락드릴게요.",
    });

    const result = await submitLeadAction(input, analyticsContext);

    expect(result.ok).toBe(true);
    expect(submitLead).toHaveBeenCalledWith(input, analyticsContext);
    expect(submitLeadViaApi).not.toHaveBeenCalled();
  });

  it("routes validated submissions through the api when api mode is enabled", async () => {
    process.env.PMF_API_BASE_URL = "http://localhost:4000";

    const input = {
      name: "홍길동",
      phone: "010-1234-5678",
      email: "hong@example.com",
      productInterest: "업무 자동화",
      message: "도입 상담 희망",
      source: "landing_page",
      consent: true,
    } as const;
    const analyticsContext = { sessionId: "anon_test" };

    vi.mocked(submitLeadViaApi).mockResolvedValue({
      ok: true,
      message: "문의가 접수되었습니다. 빠르게 검토 후 연락드릴게요.",
    });

    const result = await submitLeadAction(input, analyticsContext);

    expect(result.ok).toBe(true);
    expect(submitLeadViaApi).toHaveBeenCalledWith(input, analyticsContext);
    expect(submitLead).not.toHaveBeenCalled();
    expect(revalidatePath).toHaveBeenCalledWith("/");
    expect(revalidatePath).toHaveBeenCalledWith("/admin");
    expect(revalidatePath).toHaveBeenCalledWith("/admin/leads");
  });
});

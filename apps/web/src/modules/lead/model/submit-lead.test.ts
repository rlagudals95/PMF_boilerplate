import { createLead } from "@pmf/db";
import { revalidatePath } from "next/cache";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { appAnalytics } from "@/lib/analytics";
import { appErrorLogger } from "@/lib/error-logging";

import { submitLead } from "./submit-lead";

vi.mock("@pmf/db", () => ({
  createLead: vi.fn(),
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
  productInterest: "업무 자동화",
  message: "도입 상담 희망",
  source: "landing_page",
  consent: true,
} as const;

describe("submitLead", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a failure result instead of throwing when lead persistence fails", async () => {
    vi.mocked(createLead).mockRejectedValue(new Error("db unavailable"));

    const result = await submitLead(validInput, { sessionId: "anon_test" });

    expect(result).toEqual({
      ok: false,
      message: "문의 접수 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
    });
    expect(appErrorLogger.report).toHaveBeenCalledWith(
      expect.objectContaining({
        source: "module.lead.submitLead",
      }),
    );
    expect(appAnalytics.track).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("keeps the submission successful when analytics tracking fails", async () => {
    vi.mocked(createLead).mockResolvedValue({
      id: "lead_test",
    } as Awaited<ReturnType<typeof createLead>>);
    vi.mocked(appAnalytics.track).mockRejectedValue(new Error("analytics unavailable"));

    const result = await submitLead(validInput, { sessionId: "anon_test" });

    expect(result).toEqual({
      ok: true,
      message: "문의가 접수되었습니다. 빠르게 검토 후 연락드릴게요.",
    });
    expect(appErrorLogger.report).toHaveBeenCalledWith(
      expect.objectContaining({
        source: "module.lead.submitLead.analytics",
        level: "warning",
      }),
    );
    expect(revalidatePath).toHaveBeenCalledWith("/");
    expect(revalidatePath).toHaveBeenCalledWith("/admin");
    expect(revalidatePath).toHaveBeenCalledWith("/admin/leads");
  });
});

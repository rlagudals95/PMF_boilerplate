import {
  createConsultationRequestFromInput,
  createLeadFromInput,
  type ConsultationRequestInput,
} from "@pmf/core";
import { createLeadWithConsultationRequest } from "@pmf/db";
import { revalidatePath } from "next/cache";

import { appAnalytics } from "@/lib/analytics";
import { appErrorLogger } from "@/lib/error-logging";
import type { ActionResult, AnalyticsContextInput } from "@/shared/types/form-action";

const submitConsultationFailureMessage =
  "상담 요청 접수 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.";

export const submitConsultationRequest = async (
  input: ConsultationRequestInput,
  analyticsContext?: AnalyticsContextInput,
): Promise<ActionResult> => {
  try {
    const lead = createLeadFromInput({
      name: input.name,
      phone: input.phone,
      email: input.email,
      productInterest: input.productInterest,
      message: input.notes,
      source: "consult_page",
      consent: true,
    });

    const consultationRequest = createConsultationRequestFromInput(input, lead.id);

    await createLeadWithConsultationRequest(lead, consultationRequest);

    try {
      await appAnalytics.track({
        eventName: "consultation_requested",
        path: "/consult",
        sessionId: analyticsContext?.sessionId,
        leadId: lead.id,
        properties: {
          consultationType: consultationRequest.consultationType,
          budgetRange: consultationRequest.budgetRange,
          rentalPeriod: consultationRequest.rentalPeriod,
        },
      });
    } catch (error) {
      await appErrorLogger.report({
        source: "module.consultation.submitConsultationRequest.analytics",
        message: "Consultation request was saved but analytics tracking failed",
        error,
        level: "warning",
        context: {
          consultationRequestId: consultationRequest.id,
          leadId: lead.id,
          hasSessionId: Boolean(analyticsContext?.sessionId),
        },
      });
    }

    revalidatePath("/consult");
    revalidatePath("/admin");
    revalidatePath("/admin/leads");

    return {
      ok: true,
      message: "상담 요청이 접수되었습니다. 선호한 방식으로 연락드릴게요.",
    };
  } catch (error) {
    await appErrorLogger.report({
      source: "module.consultation.submitConsultationRequest",
      message: "Consultation request submission failed",
      error,
      context: {
        hasSessionId: Boolean(analyticsContext?.sessionId),
      },
    });

    return {
      ok: false,
      message: submitConsultationFailureMessage,
    };
  }
};

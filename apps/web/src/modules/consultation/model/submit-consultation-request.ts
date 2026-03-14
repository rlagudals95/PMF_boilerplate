import {
  consultationRequestInputSchema,
  createConsultationRequestFromInput,
  createLeadFromInput,
} from "@pmf/core";
import { createConsultationRequest, createLead } from "@pmf/db";
import { revalidatePath } from "next/cache";

import { appAnalytics } from "@/lib/analytics";
import { appErrorLogger } from "@/lib/error-logging";
import {
  createInvalidInputResult,
  type ActionResult,
  type AnalyticsContextInput,
} from "@/shared/types/form-action";

export const submitConsultationRequest = async (
  input: unknown,
  analyticsContext?: AnalyticsContextInput,
): Promise<ActionResult> => {
  try {
    const parsed = consultationRequestInputSchema.safeParse(input);

    if (!parsed.success) {
      return createInvalidInputResult(parsed.error.flatten().fieldErrors);
    }

    const lead = createLeadFromInput({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email,
      productInterest: parsed.data.productInterest,
      message: parsed.data.notes,
      source: "consult_page",
      consent: true,
    });

    const consultationRequest = createConsultationRequestFromInput(parsed.data, lead.id);

    await createLead(lead);
    await createConsultationRequest(consultationRequest);

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

    throw error;
  }
};

import { createLeadFromInput, leadCaptureInputSchema } from "@pmf/core";
import { createLead } from "@pmf/db";
import { revalidatePath } from "next/cache";

import { appAnalytics } from "@/lib/analytics";
import { appErrorLogger } from "@/lib/error-logging";
import {
  createInvalidInputResult,
  type ActionResult,
  type AnalyticsContextInput,
} from "@/shared/types/form-action";

export const submitLead = async (
  input: unknown,
  analyticsContext?: AnalyticsContextInput,
): Promise<ActionResult> => {
  try {
    const parsed = leadCaptureInputSchema.safeParse(input);

    if (!parsed.success) {
      return createInvalidInputResult(parsed.error.flatten().fieldErrors);
    }

    const lead = createLeadFromInput(parsed.data);
    await createLead(lead);

    await appAnalytics.track({
      eventName: "lead_form_submitted",
      path: "/",
      sessionId: analyticsContext?.sessionId,
      leadId: lead.id,
      properties: {
        source: lead.source,
        productInterest: lead.productInterest,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/leads");

    return {
      ok: true,
      message: "문의가 접수되었습니다. 빠르게 검토 후 연락드릴게요.",
    };
  } catch (error) {
    await appErrorLogger.report({
      source: "module.lead.submitLead",
      message: "Lead submission failed",
      error,
      context: {
        hasSessionId: Boolean(analyticsContext?.sessionId),
      },
    });

    throw error;
  }
};

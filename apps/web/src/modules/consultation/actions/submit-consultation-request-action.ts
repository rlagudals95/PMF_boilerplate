"use server";

import { consultationRequestInputSchema } from "@pmf/core";
import { revalidatePath } from "next/cache";

import { submitConsultationRequestViaApi } from "@/shared/api/pmf-api-client";
import type { ActionResult, AnalyticsContextInput } from "@/shared/types/form-action";
import { createInvalidInputResult } from "@/shared/types/form-action";

import { submitConsultationRequest } from "../model/submit-consultation-request";

export const submitConsultationRequestAction = async (
  input: unknown,
  analyticsContext?: AnalyticsContextInput,
): Promise<ActionResult> => {
  const parsed = consultationRequestInputSchema.safeParse(input);

  if (!parsed.success) {
    return createInvalidInputResult(parsed.error.flatten().fieldErrors);
  }

  if (process.env.PMF_API_BASE_URL) {
    const result = await submitConsultationRequestViaApi(
      parsed.data,
      analyticsContext,
    );

    if (result.ok) {
      revalidatePath("/consult");
      revalidatePath("/admin");
      revalidatePath("/admin/leads");
    }

    return result;
  }

  return submitConsultationRequest(parsed.data, analyticsContext);
};

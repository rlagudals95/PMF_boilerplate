"use server";

import { consultationRequestInputSchema } from "@pmf/core";

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

  return submitConsultationRequest(parsed.data, analyticsContext);
};

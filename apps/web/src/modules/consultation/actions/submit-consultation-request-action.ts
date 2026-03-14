"use server";

import type { ActionResult, AnalyticsContextInput } from "@/shared/types/form-action";

import { submitConsultationRequest } from "../model/submit-consultation-request";

export const submitConsultationRequestAction = async (
  input: unknown,
  analyticsContext?: AnalyticsContextInput,
): Promise<ActionResult> => {
  return submitConsultationRequest(input, analyticsContext);
};

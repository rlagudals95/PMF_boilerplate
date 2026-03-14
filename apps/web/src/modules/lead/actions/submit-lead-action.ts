"use server";

import { leadCaptureInputSchema } from "@pmf/core";

import type { ActionResult, AnalyticsContextInput } from "@/shared/types/form-action";
import { createInvalidInputResult } from "@/shared/types/form-action";

import { submitLead } from "../model/submit-lead";

export const submitLeadAction = async (
  input: unknown,
  analyticsContext?: AnalyticsContextInput,
): Promise<ActionResult> => {
  const parsed = leadCaptureInputSchema.safeParse(input);

  if (!parsed.success) {
    return createInvalidInputResult(parsed.error.flatten().fieldErrors);
  }

  return submitLead(parsed.data, analyticsContext);
};

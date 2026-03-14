"use server";

import type { ActionResult, AnalyticsContextInput } from "@/shared/types/form-action";

import { submitLead } from "../model/submit-lead";

export const submitLeadAction = async (
  input: unknown,
  analyticsContext?: AnalyticsContextInput,
): Promise<ActionResult> => {
  return submitLead(input, analyticsContext);
};

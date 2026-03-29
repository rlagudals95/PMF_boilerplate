"use server";

import { leadCaptureInputSchema } from "@pmf/core";
import { revalidatePath } from "next/cache";

import { submitLeadViaApi } from "@/shared/api/pmf-api-client";
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

  if (process.env.PMF_API_BASE_URL) {
    const result = await submitLeadViaApi(parsed.data, analyticsContext);

    if (result.ok) {
      revalidatePath("/");
      revalidatePath("/admin");
      revalidatePath("/admin/leads");
    }

    return result;
  }

  return submitLead(parsed.data, analyticsContext);
};

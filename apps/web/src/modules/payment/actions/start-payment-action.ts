"use server";

import { paymentCheckoutInputSchema } from "@pmf/core";

import type { AnalyticsContextInput } from "@/shared/types/form-action";
import { createInvalidInputResult } from "@/shared/types/form-action";
import {
  startPayment,
  type PaymentActionResult,
} from "@/modules/payment/model/start-payment";

export const startPaymentAction = async (
  input: unknown,
  analyticsContext?: AnalyticsContextInput,
): Promise<PaymentActionResult> => {
  const parsed = paymentCheckoutInputSchema.safeParse(input);

  if (!parsed.success) {
    return createInvalidInputResult(parsed.error.flatten().fieldErrors);
  }

  return startPayment(parsed.data, analyticsContext);
};

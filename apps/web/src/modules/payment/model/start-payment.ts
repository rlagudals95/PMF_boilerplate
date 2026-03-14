import {
  buildId,
  createPaymentFromCheckoutInput,
  type PaymentCheckoutInput,
} from "@pmf/core";
import { createPayment } from "@pmf/db";
import { revalidatePath } from "next/cache";

import { appAnalytics } from "@/lib/analytics";
import { appErrorLogger } from "@/lib/error-logging";
import { createTossCheckout } from "@/modules/payment/lib/toss-payments";
import {
  type ActionResult,
  type AnalyticsContextInput,
} from "@/shared/types/form-action";

export type PaymentActionResult = ActionResult & {
  redirectUrl?: string;
};

export const startPayment = async (
  input: PaymentCheckoutInput,
  analyticsContext?: AnalyticsContextInput,
): Promise<PaymentActionResult> => {
  try {
    const orderNo = buildId("order");
    const tossCheckout = await createTossCheckout({
      orderNo,
      amount: input.amount,
      productDescription: input.productDescription,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
    });

    const payment = createPaymentFromCheckoutInput({
      checkout: input,
      orderNo,
      payToken: tossCheckout.payToken,
      checkoutUrl: tossCheckout.checkoutUrl,
      metadata: {
        tossCreateResponse: tossCheckout.raw,
      },
    });

    await createPayment(payment);

    try {
      await appAnalytics.track({
        eventName: "payment_checkout_started",
        path: "/pay",
        sessionId: analyticsContext?.sessionId,
        properties: {
          amount: payment.amount,
          orderNo: payment.orderNo,
          provider: payment.provider,
        },
      });
    } catch (error) {
      await appErrorLogger.report({
        source: "module.payment.startPayment.analytics",
        message: "Payment was saved but checkout analytics tracking failed",
        error,
        level: "warning",
        context: {
          orderNo: payment.orderNo,
          hasSessionId: Boolean(analyticsContext?.sessionId),
        },
      });
    }

    revalidatePath("/pay");
    revalidatePath("/admin");
    revalidatePath("/admin/payments");

    return {
      ok: true,
      message: "토스 결제 페이지로 이동합니다.",
      redirectUrl: tossCheckout.checkoutUrl,
    };
  } catch (error) {
    await appErrorLogger.report({
      source: "module.payment.startPayment",
      message: "Payment checkout initialization failed",
      error,
      context: {
        hasSessionId: Boolean(analyticsContext?.sessionId),
      },
    });

    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "결제 세션 생성에 실패했습니다.",
    };
  }
};

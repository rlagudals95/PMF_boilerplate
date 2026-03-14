import { findPaymentByOrderNo, findPaymentByPayToken, updatePaymentByOrderNo } from "@pmf/db";
import { revalidatePath } from "next/cache";

import { appAnalytics } from "@/lib/analytics";
import { appErrorLogger } from "@/lib/error-logging";
import {
  getPaymentEventName,
  normalizeTossPaymentStatus,
} from "@/modules/payment/model/payment-status";

type SyncPaymentStatusInput = {
  orderNo?: string;
  payToken?: string;
  rawStatus?: string;
  payMethod?: string;
  path: string;
  metadata?: Record<string, unknown>;
};

const now = () => new Date().toISOString();

export const syncPaymentStatus = async (input: SyncPaymentStatusInput) => {
  const payment =
    (input.orderNo ? await findPaymentByOrderNo(input.orderNo) : undefined) ??
    (input.payToken ? await findPaymentByPayToken(input.payToken) : undefined);

  if (!payment) {
    return undefined;
  }

  const nextStatus = input.rawStatus
    ? normalizeTossPaymentStatus(input.rawStatus)
    : payment.status;
  const nextMetadata = {
    ...payment.metadata,
    ...input.metadata,
    ...(input.rawStatus ? { tossStatus: input.rawStatus } : {}),
  };
  const nextApprovedAt =
    nextStatus === "paid" ? payment.approvedAt ?? now() : payment.approvedAt;

  const updated = await updatePaymentByOrderNo(payment.orderNo, {
    status: nextStatus,
    payMethod: input.payMethod ?? payment.payMethod,
    metadata: nextMetadata,
    approvedAt: nextApprovedAt,
    updatedAt: now(),
  });

  if (updated && updated.status !== payment.status) {
    const eventName = getPaymentEventName(updated.status);

    if (eventName) {
      try {
        await appAnalytics.track({
          eventName,
          path: input.path,
          properties: {
            amount: updated.amount,
            orderNo: updated.orderNo,
            payMethod: updated.payMethod,
            provider: updated.provider,
          },
        });
      } catch (error) {
        await appErrorLogger.report({
          source: "module.payment.syncPaymentStatus.analytics",
          message: "Payment status was updated but analytics tracking failed",
          error,
          level: "warning",
          context: {
            orderNo: updated.orderNo,
            status: updated.status,
            path: input.path,
          },
        });
      }
    }
  }

  revalidatePath("/pay");
  revalidatePath("/pay/result");
  revalidatePath("/admin");
  revalidatePath("/admin/payments");

  return updated;
};

import type { PageEvent, Payment } from "@pmf/core";

const paidStatuses = new Set(["PAY_COMPLETE", "DONE", "APPROVED", "PAID"]);
const cancelledStatuses = new Set(["PAY_CANCEL", "CANCEL", "CANCELED", "CANCELLED"]);
const failedStatuses = new Set(["PAY_FAIL", "FAILED", "FAIL", "EXPIRED"]);

export const normalizeTossPaymentStatus = (
  status?: string,
): Payment["status"] => {
  if (!status) {
    return "failed";
  }

  const normalized = status.toUpperCase();

  if (paidStatuses.has(normalized)) {
    return "paid";
  }

  if (cancelledStatuses.has(normalized)) {
    return "cancelled";
  }

  if (failedStatuses.has(normalized)) {
    return "failed";
  }

  return "ready";
};

export const getPaymentEventName = (
  status: Payment["status"],
): PageEvent["eventName"] | null => {
  switch (status) {
    case "paid":
      return "payment_succeeded";
    case "cancelled":
      return "payment_cancelled";
    case "failed":
      return "payment_failed";
    default:
      return null;
  }
};

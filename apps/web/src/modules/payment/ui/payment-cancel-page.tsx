import { RotateCcw } from "lucide-react";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@pmf/ui";

import { syncPaymentStatus } from "@/modules/payment/model/sync-payment-status";
import { TrackedLink } from "@/shared/ui/tracked-link";

type PaymentCancelPageProps = {
  orderNo?: string;
  payToken?: string;
  payMethod?: string;
};

export default async function PaymentCancelPage({
  orderNo,
  payToken,
  payMethod,
}: PaymentCancelPageProps) {
  const payment = await syncPaymentStatus({
    orderNo,
    payToken,
    rawStatus: "PAY_CANCEL",
    payMethod,
    path: "/pay/cancel",
    metadata: {
      source: "retCancelUrl",
    },
  });

  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-14">
      <Card>
        <CardHeader className="space-y-4">
          <RotateCcw className="h-6 w-6 text-amber-600" />
          <CardTitle className="text-3xl">결제가 취소되었습니다.</CardTitle>
          <p className="text-sm leading-7 text-slate-600">
            결제창에서 취소한 주문은 `cancelled` 상태로 저장됩니다.
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
            <p>주문번호: {payment?.orderNo ?? orderNo ?? "-"}</p>
            <p className="mt-2">상품: {payment?.productDescription ?? "-"}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <TrackedLink
                href="/pay"
                eventProperties={{
                  source: "payment_cancel_retry",
                }}
              >
                결제 데모로 돌아가기
              </TrackedLink>
            </Button>
            <Button asChild variant="outline">
              <TrackedLink
                href="/admin/payments"
                eventProperties={{
                  source: "payment_cancel_admin",
                }}
              >
                저장 상태 확인
              </TrackedLink>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

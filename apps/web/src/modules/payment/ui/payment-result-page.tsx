import { AlertTriangle, CheckCircle2, CircleDashed, RotateCcw } from "lucide-react";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@pmf/ui";

import { StatusBadge } from "@/modules/admin/ui/status-badge";
import { normalizeTossPaymentStatus } from "@/modules/payment/model/payment-status";
import { syncPaymentStatus } from "@/modules/payment/model/sync-payment-status";
import { TrackedLink } from "@/shared/ui/tracked-link";

type PaymentResultPageProps = {
  status?: string;
  orderNo?: string;
  payToken?: string;
  payMethod?: string;
};

const formatCurrency = (value?: number) =>
  typeof value === "number" ? `${value.toLocaleString("ko-KR")}원` : "-";

export default async function PaymentResultPage({
  status,
  orderNo,
  payToken,
  payMethod,
}: PaymentResultPageProps) {
  const syncedPayment = await syncPaymentStatus({
    orderNo,
    payToken,
    rawStatus: status,
    payMethod,
    path: "/pay/result",
    metadata: {
      source: "retUrl",
    },
  });
  const currentStatus = syncedPayment?.status ?? normalizeTossPaymentStatus(status);

  const stateConfig = {
    paid: {
      icon: CheckCircle2,
      title: "결제가 완료되었습니다.",
      description: "retUrl 기준으로 결제 완료를 확인했고 저장소 상태도 동기화했습니다.",
    },
    cancelled: {
      icon: RotateCcw,
      title: "결제가 취소되었습니다.",
      description: "사용자가 결제 흐름을 중단했거나 토스에서 취소 응답을 반환했습니다.",
    },
    failed: {
      icon: AlertTriangle,
      title: "결제가 완료되지 않았습니다.",
      description: "실패 응답이 들어왔습니다. 입력값과 토스 설정을 다시 확인해 주세요.",
    },
    ready: {
      icon: CircleDashed,
      title: "결제 상태를 확인 중입니다.",
      description: "브라우저 복귀 정보만으로 최종 상태가 확정되지 않았습니다. callback을 기다릴 수 있습니다.",
    },
  } as const;

  const state = stateConfig[currentStatus];
  const StateIcon = state.icon;

  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-14">
      <Card className="overflow-hidden border-slate-900 bg-slate-950 text-white">
        <CardHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <StateIcon className="h-6 w-6 text-amber-400" />
            <StatusBadge value={currentStatus} />
          </div>
          <CardTitle className="text-3xl text-white">{state.title}</CardTitle>
          <p className="text-sm leading-7 text-slate-300">{state.description}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                주문번호
              </p>
              <p className="mt-2 font-mono text-sm text-slate-100">
                {syncedPayment?.orderNo ?? orderNo ?? "-"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                결제수단
              </p>
              <p className="mt-2 text-sm text-slate-100">
                {syncedPayment?.payMethod ?? payMethod ?? "-"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                상품
              </p>
              <p className="mt-2 text-sm text-slate-100">
                {syncedPayment?.productDescription ?? "-"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                금액
              </p>
              <p className="mt-2 text-sm text-slate-100">
                {formatCurrency(syncedPayment?.amount)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild className="bg-amber-500 text-slate-950 hover:bg-amber-400">
              <TrackedLink
                href="/admin/payments"
                eventProperties={{
                  source: "payment_result_admin",
                }}
              >
                어드민 결제 내역 보기
              </TrackedLink>
            </Button>
            <Button asChild variant="outline">
              <TrackedLink
                href="/pay"
                eventProperties={{
                  source: "payment_result_retry",
                }}
              >
                다시 결제하기
              </TrackedLink>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

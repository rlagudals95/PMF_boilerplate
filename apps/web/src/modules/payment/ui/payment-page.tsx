import { ArrowRight, CreditCard, ReceiptText, ShieldCheck } from "lucide-react";

import { listPayments } from "@pmf/db";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@pmf/ui";

import { isTossPaymentsConfigured } from "@/modules/payment/lib/toss-payments";
import { PaymentDemoForm } from "@/modules/payment/ui/payment-demo-form";
import { TrackedLink } from "@/shared/ui/tracked-link";

const formatCurrency = (value: number) => `${value.toLocaleString("ko-KR")}원`;

export default async function PaymentPage() {
  const payments = await listPayments();
  const paidPayments = payments.filter((payment) => payment.status === "paid").length;
  const isConfigured = isTossPaymentsConfigured();

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-10">
      <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="space-y-8">
          <div className="space-y-5">
            <Badge variant="accent">Toss Payment Demo</Badge>
            <h1 className="text-5xl font-semibold leading-tight tracking-tight text-slate-950">
              결제 의사까지 검증하는
              <span className="block text-primary">토스 결제 데모 플로우</span>
            </h1>
            <p className="text-lg leading-8 text-slate-600">
              이 보일러플레이트는 랜딩과 상담만이 아니라, 실제 유료 신호를 확인할 수 있도록
              Toss 단건 결제를 서버 생성 방식으로 붙일 수 있게 구성했습니다.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <TrackedLink
                href="/admin/payments"
                eventProperties={{
                  source: "payment_page_admin",
                }}
              >
                결제 어드민 보기
                <ArrowRight className="ml-2 h-4 w-4" />
              </TrackedLink>
            </Button>
            <Button asChild variant="outline" size="lg">
              <TrackedLink
                href="/"
                eventProperties={{
                  source: "payment_page_landing",
                }}
              >
                랜딩으로 돌아가기
              </TrackedLink>
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                label: "Stored payments",
                value: String(payments.length),
                description: "local fallback 또는 postgres에 저장",
              },
              {
                label: "Paid",
                value: String(paidPayments),
                description: "최종 완료 상태로 동기화된 결제",
              },
              {
                label: "Provider",
                value: "Toss",
                description: "서버 생성형 checkout",
              },
              {
                label: "Config",
                value: isConfigured ? "ready" : "missing",
                description: "API key + site URL 여부",
              },
            ].map((item) => (
              <Card key={item.label} className="bg-white/90">
                <CardContent className="space-y-2 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    {item.label}
                  </p>
                  <p className="text-2xl font-semibold tracking-tight text-slate-950">
                    {item.value}
                  </p>
                  <p className="text-sm text-slate-500">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4">
            {[
              {
                icon: CreditCard,
                title: "서버에서 결제 생성",
                description:
                  "브라우저에서 결제 SDK를 직접 붙이지 않고, 서버에서 `pay.toss.im/api/v2/payments`를 호출해 checkout URL을 만듭니다.",
              },
              {
                icon: ReceiptText,
                title: "retUrl + callback 이중 동기화",
                description:
                  "브라우저 복귀 페이지와 `resultCallback` 둘 다 받아 로컬/DB에 상태를 남기도록 구성했습니다.",
              },
              {
                icon: ShieldCheck,
                title: "실험용 fallback 유지",
                description:
                  "DATABASE_URL이 없어도 local JSON에 결제 시도를 저장해 PMF 실험 속도를 유지합니다.",
              },
            ].map((item) => (
              <Card key={item.title}>
                <CardHeader className="pb-3">
                  <item.icon className="h-5 w-5 text-primary" />
                  <CardTitle className="mt-3">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-slate-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <PaymentDemoForm isConfigured={isConfigured} />

          <Card>
            <CardHeader>
              <CardTitle>최근 결제 샘플</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {payments.slice(0, 3).map((payment) => (
                <div
                  key={payment.id}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-slate-950">
                        {payment.productDescription}
                      </p>
                      <p className="text-xs text-slate-500">{payment.orderNo}</p>
                    </div>
                    <p className="text-sm font-medium text-slate-700">
                      {formatCurrency(payment.amount)}
                    </p>
                  </div>
                </div>
              ))}
              {payments.length === 0 ? (
                <p className="text-sm text-slate-500">
                  아직 저장된 결제가 없습니다. 첫 결제를 생성해 보세요.
                </p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

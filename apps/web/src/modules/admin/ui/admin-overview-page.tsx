import { summarizePipeline } from "@pmf/core";
import {
  listConsultationRequests,
  listExperiments,
  listLeads,
  listPageEvents,
  listPayments,
  listProducts,
} from "@pmf/db";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@pmf/ui";

import { appConfig } from "@/lib/app-config";
import {
  buildAdminMetricCards,
  buildCapabilitySetupNotes,
} from "@/lib/mvp-surface";
import { productConfig } from "@/lib/product-config";
import { MetricCard } from "@/modules/admin/ui/metric-card";
import { StatusBadge } from "@/modules/admin/ui/status-badge";

export default async function AdminOverviewPage() {
  const [leads, consultations, products, experiments, pageEvents, payments] =
    await Promise.all([
      listLeads(),
      listConsultationRequests(),
      listProducts(),
      listExperiments(),
      listPageEvents(),
      listPayments(),
    ]);

  const metrics = summarizePipeline({
    leads,
    consultations,
    products,
    experiments,
    pageEvents,
    payments,
  });
  const metricCards = buildAdminMetricCards(metrics, productConfig, appConfig);
  const capabilitySetupNotes = buildCapabilitySetupNotes(productConfig, appConfig);
  const showPaymentPanel = productConfig.mvp.activeFlows.includes("payment");
  const showConsultationPanel =
    productConfig.mvp.activeFlows.includes("consultation");
  const highlightedMetricNames = metricCards
    .filter((card) => card.emphasis === "primary")
    .map((card) => card.title);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((card) => (
          <MetricCard
            key={card.key}
            title={
              card.emphasis === "primary" ? `${card.title} · focus` : card.title
            }
            value={card.value}
            description={card.description}
          />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Latest leads</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>이름</TableHead>
                  <TableHead>관심 제품</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>유입</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.slice(0, 5).map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium text-slate-950">
                      {lead.name}
                    </TableCell>
                    <TableCell>{lead.productInterest}</TableCell>
                    <TableCell>
                      <StatusBadge value={lead.status} />
                    </TableCell>
                    <TableCell>{lead.source}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {capabilitySetupNotes.length > 0 ? (
            <Card className="border-amber-200 bg-amber-50/80">
              <CardHeader>
                <CardTitle>Setup required</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-amber-950">
                {capabilitySetupNotes.map((note) => (
                  <div key={note.capability}>
                    <p className="font-medium">
                      {note.capability === "payment" ? "Payment" : "Auth"}
                    </p>
                    <p>{note.state.requiredEnvVars.join(" / ")}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}

          {showPaymentPanel ? (
            <Card>
              <CardHeader>
                <CardTitle>최근 결제</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {payments.slice(0, 4).map((payment) => (
                  <div
                    key={payment.id}
                    className="rounded-2xl border border-slate-200 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-medium text-slate-950">
                          {payment.productDescription}
                        </p>
                        <p className="text-sm text-slate-500">{payment.orderNo}</p>
                      </div>
                      <StatusBadge value={payment.status} />
                    </div>
                    <p className="mt-3 text-sm text-slate-600">
                      {payment.customerName} ·{" "}
                      {payment.amount.toLocaleString("ko-KR")}원
                    </p>
                  </div>
                ))}
                {payments.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    아직 저장된 결제 시도가 없습니다.
                  </p>
                ) : null}
              </CardContent>
            </Card>
          ) : showConsultationPanel ? (
            <Card>
              <CardHeader>
                <CardTitle>최근 상담 요청</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {consultations.slice(0, 4).map((consultation) => (
                  <div
                    key={consultation.id}
                    className="rounded-2xl border border-slate-200 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-medium text-slate-950">
                          {consultation.productInterest}
                        </p>
                        <p className="text-sm text-slate-500">
                          {consultation.consultationType}
                        </p>
                      </div>
                      <StatusBadge value={consultation.status} />
                    </div>
                    <p className="mt-3 text-sm text-slate-600">
                      {consultation.budgetRange ?? "예산 미정"} ·{" "}
                      {consultation.preferredDate ?? "일정 미정"}
                    </p>
                  </div>
                ))}
                {consultations.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    아직 저장된 상담 요청이 없습니다.
                  </p>
                ) : null}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>현재 MVP focus</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <p>
                  지금 overview는 아래 신호를 먼저 보도록 정렬되어 있습니다.
                </p>
                {highlightedMetricNames.map((metricName) => (
                  <div
                    key={metricName}
                    className="rounded-2xl border border-slate-200 px-4 py-3"
                  >
                    {metricName}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

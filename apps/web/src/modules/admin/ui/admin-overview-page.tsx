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

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total leads"
          value={metrics.totalLeads}
          description="랜딩/상담 흐름을 통해 누적된 전체 리드"
        />
        <MetricCard
          title="Qualified leads"
          value={metrics.qualifiedLeads}
          description="신규를 넘어 후속 액션이 가능한 리드"
        />
        <MetricCard
          title="Consult requests"
          value={metrics.totalConsultations}
          description="강한 의사 신호로 볼 수 있는 상담 요청 수"
        />
        <MetricCard
          title="Payments"
          value={metrics.totalPayments}
          description="결제 생성부터 완료까지 저장된 결제 시도 수"
        />
        <MetricCard
          title="Tracked events"
          value={metrics.trackedEvents}
          description="폼 제출과 핵심 페이지 이벤트 누적치"
        />
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
                  {payment.customerName} · {payment.amount.toLocaleString("ko-KR")}원
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
      </div>
    </div>
  );
}

import { CheckCircle2, Clock3, MessagesSquare } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@pmf/ui";

import { ConsultationRequestForm } from "@/modules/consultation/ui/consultation-request-form";

export default function ConsultPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-20 pt-10">
      <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
              Consult flow
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
              단순 리드보다 더 강한 신호가 필요한 순간을 위한 상담 요청 폼
            </h1>
            <p className="text-lg text-slate-600">
              모두의렌탈처럼 실제 상담 의사와 예산, 선호 채널이 중요한 제품은 별도 상담 흐름이
              있어야 PMF 신호를 더 정확히 읽을 수 있습니다.
            </p>
          </div>

          <div className="grid gap-4">
            {[
              {
                icon: MessagesSquare,
                title: "상담 선호 채널 수집",
                description: "전화, 카카오, 방문, 이메일 등 실제 선호 접점을 확인합니다.",
              },
              {
                icon: Clock3,
                title: "상담 타이밍 파악",
                description: "희망 일정과 렌탈 기간을 모아 당장 해결하려는 문제인지 구분합니다.",
              },
              {
                icon: CheckCircle2,
                title: "리드 품질 상향",
                description: "예산과 세부 요구를 함께 받아 후속 인터뷰 우선순위를 쉽게 정합니다.",
              },
            ].map((item) => (
              <Card key={item.title}>
                <CardHeader className="pb-3">
                  <item.icon className="h-5 w-5 text-primary" />
                  <CardTitle className="mt-3">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <ConsultationRequestForm />
      </section>
    </div>
  );
}

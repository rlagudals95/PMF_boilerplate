import { Layers3, Route, Sparkles } from "lucide-react";

import { Badge, Card, CardContent, CardHeader, CardTitle } from "@pmf/ui";

import { FunnelDemo } from "@/modules/demo-funnel/ui/funnel-demo";

const exampleSnippet = `const funnel = useFunnel({
  steps: ["product", "budget", "done"] as const,
});

const { Funnel } = funnel;

return (
  <>
    <Funnel>
      <Funnel.Step name="product">...</Funnel.Step>
      <Funnel.Step name="budget">...</Funnel.Step>
      <Funnel.Step name="done">...</Funnel.Step>
    </Funnel>

    <Button onClick={funnel.next}>다음</Button>
  </>
);`;

export default function DemoFunnelPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-20 pt-10">
      <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="space-y-6">
          <div className="space-y-4">
            <Badge variant="accent">useFunnel Example</Badge>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
              단계형 제품 흐름을 빠르게 조립하는{" "}
              <span className="font-mono text-primary">useFunnel</span> 데모
            </h1>
            <p className="text-lg text-slate-600">
              이번 예시는 데스크톱용 step 카드가 아니라, CTA 버튼으로 다음 화면으로 넘어가는
              모바일 퍼널 레이아웃에 맞춰 구성했습니다. 실제 제품처럼 한 질문씩 보여주고,
              하단 고정 CTA가 다음 스텝 전환을 담당합니다.
            </p>
          </div>

          <div className="grid gap-4">
            {[
              {
                icon: Layers3,
                title: "모바일 한 화면에 한 질문",
                description:
                  "스크롤이 길어지지 않게 질문 하나, 선택지 몇 개, 하단 CTA 하나로 화면을 쪼갰습니다.",
              },
              {
                icon: Route,
                title: "CTA가 다음 step을 트리거",
                description:
                  "선택이나 입력이 완료되기 전까지 CTA를 비활성화해 실제 퍼널 전환 조건처럼 동작합니다.",
              },
              {
                icon: Sparkles,
                title: "실험용 프로토타입에 적합",
                description:
                  "온보딩, 견적 질문, 상담 사전수집처럼 모바일 전환율을 보려는 플로우에 바로 적용할 수 있습니다.",
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

          <Card className="overflow-hidden bg-slate-950 text-white">
            <CardHeader>
              <CardTitle className="text-white">Minimal Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto rounded-2xl bg-white/5 p-4 text-sm leading-6 text-slate-100">
                <code>{exampleSnippet}</code>
              </pre>
            </CardContent>
          </Card>
        </div>

        <FunnelDemo />
      </section>
    </div>
  );
}

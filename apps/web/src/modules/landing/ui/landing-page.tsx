import {
  ArrowRight,
  CheckCircle2,
  Database,
  FlaskConical,
  LayoutTemplate,
  MessageSquare,
  PanelsTopLeft,
  ShieldCheck,
} from "lucide-react";

import { listExperiments, listProducts } from "@pmf/db";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@pmf/ui";

import { LeadCaptureForm } from "@/modules/lead/ui/lead-capture-form";
import { appConfig } from "@/lib/app-config";
import { TrackedLink } from "@/shared/ui/tracked-link";

export default async function LandingPage() {
  const [products, experiments] = await Promise.all([listProducts(), listExperiments()]);
  const activeProduct = products[0];
  const sampleProductName = activeProduct?.name ?? appConfig.primaryProduct;
  const analyticsProviders = appConfig.analyticsProviders.join(", ");

  const starterMetrics = [
    {
      label: "Sample product",
      value: sampleProductName,
      description: "seed data included",
    },
    {
      label: "Experiments",
      value: String(experiments.length),
      description: "registered now",
    },
    {
      label: "Analytics",
      value: `${appConfig.analyticsProviders.length} adapters`,
      description: analyticsProviders,
    },
    {
      label: "Data mode",
      value: appConfig.dataMode,
      description: "postgres or local fallback",
    },
  ] as const;

  const includedSurfaces = [
    {
      icon: LayoutTemplate,
      eyebrow: "Included UI",
      title: "랜딩 셸과 CTA 추적",
      description:
        "히어로, 블록 섹션, tracked link 기반 CTA 이벤트 추적이 이미 연결돼 있습니다.",
      href: "/",
      cta: "현재 화면 보기",
    },
    {
      icon: MessageSquare,
      eyebrow: "Included Form",
      title: "리드 캡처 폼",
      description:
        "React Hook Form, Zod, server action 조합으로 가벼운 관심 신호를 바로 수집합니다.",
      href: "/#live-form",
      cta: "라이브 폼 보기",
    },
    {
      icon: PanelsTopLeft,
      eyebrow: "Included Flow",
      title: "상담 요청 페이지",
      description:
        "예산, 희망 일정, 선호 채널까지 받아 더 강한 PMF 신호를 구분할 수 있습니다.",
      href: "/consult",
      cta: "상담 플로우 열기",
    },
    {
      icon: ShieldCheck,
      eyebrow: "Included Admin",
      title: "어드민 조회 화면",
      description:
        "리드, 제품, 실험 데이터를 한 곳에서 확인하는 기본 운영 화면이 포함돼 있습니다.",
      href: "/admin",
      cta: "어드민 보기",
    },
    {
      icon: FlaskConical,
      eyebrow: "Included Discovery",
      title: "useFunnel 데모",
      description:
        "모바일 CTA 기반 단계형 인터랙션을 빠르게 검증할 수 있는 퍼널 예시가 포함됩니다.",
      href: "/demo/funnel",
      cta: "퍼널 데모 보기",
    },
    {
      icon: Database,
      eyebrow: "Included Infra",
      title: "analytics + DB fallback",
      description:
        "console/store/mixpanel 어댑터와 local-json fallback까지 기본으로 준비되어 있습니다.",
      href: "/admin/experiments",
      cta: "실험 레지스트리 보기",
    },
  ] as const;

  const starterFlow = [
    {
      step: "01",
      title: "랜딩 카피 실험",
      description: "랜딩 블록과 CTA를 수정하고 어떤 메시지가 먹히는지 바로 확인합니다.",
    },
    {
      step: "02",
      title: "리드 캡처",
      description: "가벼운 관심 신호를 lead form으로 먼저 모아 초기 수요를 빠르게 봅니다.",
    },
    {
      step: "03",
      title: "상담 의사 확인",
      description: "consult form에서 더 강한 구매 맥락과 후속 인터뷰 우선순위를 정합니다.",
    },
    {
      step: "04",
      title: "어드민 운영",
      description: "들어온 신호와 등록된 실험을 어드민에서 조회하며 다음 액션을 결정합니다.",
    },
  ] as const;

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-10">
      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="space-y-8">
          <div className="space-y-6">
            <Badge variant="warning">PMF Starter Kit</Badge>
            <div className="space-y-5">
              <h1 className="max-w-4xl text-5xl font-semibold leading-tight tracking-tight text-slate-950">
                PMF 탐색용 보일러플레이트가
                <span className="block text-amber-600">기본으로 제공하는 것</span>
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-slate-600">
                이 저장소의 핵심은 특정 제품 소개가 아니라, 실험용 랜딩, 리드 캡처, 상담 요청,
                실험 레지스트리, 어드민 조회, analytics wiring, local fallback을 한 번에
                시작할 수 있는 스타터킷이라는 점입니다. 모두의렌탈은 그 구조를 보여주는 첫 샘플일
                뿐입니다.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <TrackedLink
                  href="/#included-flows"
                  eventProperties={{
                    source: "landing_hero_primary",
                  }}
                >
                  포함된 화면 보기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </TrackedLink>
              </Button>
              <Button asChild variant="outline" size="lg">
                <TrackedLink
                  href="/demo/funnel"
                  eventProperties={{
                    source: "landing_hero_funnel_demo",
                  }}
                >
                  퍼널 데모 보기
                </TrackedLink>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <TrackedLink
                  href="/admin"
                  eventProperties={{
                    source: "landing_hero_secondary",
                  }}
                >
                  어드민 열기
                </TrackedLink>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {starterMetrics.map((item) => (
              <Card key={item.label} className="bg-white/85">
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
        </div>

        <Card className="overflow-hidden border-slate-900 bg-slate-950 text-white shadow-[0_25px_80px_rgba(15,23,42,0.28)]">
          <CardContent className="relative p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.24),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.18),transparent_30%)]" />
            <div className="relative space-y-6">
              <div className="space-y-3">
                <Badge className="bg-white/10 text-white">Out of the box</Badge>
                <h2 className="text-3xl font-semibold tracking-tight">
                  저장소를 띄우자마자 확인할 수 있는 기본 구성
                </h2>
                <p className="text-sm leading-7 text-slate-300">
                  랜딩 UI만 있는 템플릿이 아니라, 신호 수집과 운영 확인까지 이어지는 최소 PMF
                  루프가 이미 들어 있습니다.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  "랜딩 + tracked CTA",
                  "lead capture form",
                  "consultation request form",
                  "admin for leads/products/experiments",
                  `analytics adapters: ${analyticsProviders}`,
                  `data fallback: ${appConfig.dataMode}`,
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400" />
                    <p className="text-sm text-slate-100">{item}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Included sample
                </p>
                <p className="mt-3 text-2xl font-semibold">{sampleProductName}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  샘플 제품과 실험 데이터가 함께 들어 있어 보일러플레이트 구조를 빈 껍데기가 아니라
                  실제 예시와 함께 확인할 수 있습니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="included-flows" className="mt-20 space-y-6">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
            Included Surfaces
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
            보일러플레이트가 바로 제공하는 화면과 기능
          </h2>
          <p className="text-base leading-7 text-slate-600">
            각 블록은 문서 설명이 아니라 실제로 눌러볼 수 있는 페이지이거나, 현재 런타임에 이미
            연결된 기본 기능입니다.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {includedSurfaces.map((item) => (
            <Card
              key={item.title}
              className="group overflow-hidden border-slate-200 bg-white/90 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
            >
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="warning">{item.eyebrow}</Badge>
                  <item.icon className="h-5 w-5 text-amber-600" />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                  <CardDescription className="leading-6">{item.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild variant="secondary" className="w-full justify-between">
                  <TrackedLink
                    href={item.href}
                    eventProperties={{
                      source: `included_surface_${item.title}`,
                    }}
                  >
                    {item.cta}
                    <ArrowRight className="h-4 w-4" />
                  </TrackedLink>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section
        id="live-form"
        className="mt-20 grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-start"
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
              Live Included Form
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
              리드 수집 폼도 이미 동작하는 상태로 포함됩니다
            </h2>
            <p className="text-base leading-7 text-slate-600">
              단순한 와이어프레임이 아니라, 유효성 검증과 server action 제출까지 연결된 실제
              리드 캡처 폼이 기본 제공됩니다. 지금 이 화면에서도 바로 제출해 볼 수 있습니다.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Validation included",
                description: "RHF + Zod 조합으로 필수값과 에러 메시지가 기본 연결됩니다.",
              },
              {
                title: "Server action included",
                description: "폼 제출 이후 저장과 응답 메시지 처리 흐름이 이미 붙어 있습니다.",
              },
              {
                title: "Analytics session included",
                description: "CTA와 제출 이벤트를 같은 session 문맥으로 묶을 수 있습니다.",
              },
              {
                title: "Fallback persistence included",
                description: "DB가 없어도 local-json 모드로 개발과 데모를 계속 진행할 수 있습니다.",
              },
            ].map((item) => (
              <Card key={item.title} className="bg-white/80">
                <CardContent className="space-y-2 p-5">
                  <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                  <p className="text-sm leading-6 text-slate-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <TrackedLink
                href="/consult"
                eventProperties={{
                  source: "landing_live_form_consult",
                }}
              >
                상담 폼도 보기
                <ArrowRight className="ml-2 h-4 w-4" />
              </TrackedLink>
            </Button>
            <Button asChild variant="outline">
              <TrackedLink
                href="/admin/leads"
                eventProperties={{
                  source: "landing_live_form_admin",
                }}
              >
                저장된 리드 보기
              </TrackedLink>
            </Button>
          </div>
        </div>

        <LeadCaptureForm />
      </section>

      <section className="mt-20 space-y-6">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
            Starter Flow
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
            보일러플레이트가 이미 연결해 둔 최소 PMF 루프
          </h2>
          <p className="text-base leading-7 text-slate-600">
            랜딩만 있는 시작점이 아니라, 신호를 모으고 운영 화면에서 확인하는 흐름까지 한 저장소 안에
            묶여 있습니다.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {starterFlow.map((item) => (
            <Card key={item.step} className="bg-white/85">
              <CardHeader className="pb-3">
                <p className="font-mono text-sm text-amber-600">{item.step}</p>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-slate-600">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

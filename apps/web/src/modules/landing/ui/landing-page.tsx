import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Database,
  FileText,
  FlaskConical,
  LayoutTemplate,
  Megaphone,
  Palette,
  PanelsTopLeft,
} from "lucide-react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@pmf/ui";

import { brandTheme } from "@/lib/app-theme";
import { LeadCaptureForm } from "@/modules/lead/ui/lead-capture-form";
import { appConfig } from "@/lib/app-config";
import { BrandThemePlayground } from "@/modules/landing/ui/brand-theme-playground";
import { TrackedLink } from "@/shared/ui/tracked-link";

const featureGroups = [
  {
    icon: PanelsTopLeft,
    eyebrow: "Runtime",
    title: "실행 가능한 제품 흐름",
    description:
      "카피 실험부터 운영 확인까지 이어지는 기본 화면이 이미 연결돼 있습니다.",
    items: [
      {
        title: "랜딩 + 라이브 리드 폼",
        description: "첫 CTA 클릭부터 리드 제출까지 바로 확인할 수 있습니다.",
      },
      {
        title: "상담 요청 플로우",
        description: "더 강한 구매 의사 신호를 별도 흐름으로 수집합니다.",
      },
      {
        title: "토스 결제 데모",
        description: "결제 생성과 결과 동기화까지 실험용으로 검증할 수 있습니다.",
      },
      {
        title: "어드민 화면",
        description: "리드, 제품, 실험, 결제 상태를 같은 앱 안에서 확인합니다.",
      },
      {
        title: "모바일 퍼널 데모",
        description: "단계형 퍼널 UI를 새 제품에 빠르게 복제할 수 있습니다.",
      },
    ],
  },
  {
    icon: Megaphone,
    eyebrow: "Infra",
    title: "추적과 운영 기본선",
    description:
      "실험 운영에 필요한 저장, 추적, 외부 provider 연결 기본값이 준비돼 있습니다.",
    items: [
      {
        title: "Analytics",
        description: `기본 provider: ${appConfig.analyticsProviders.join(", ")}`,
      },
      {
        title: "Marketing Scripts",
        description:
          appConfig.marketingProviders.length > 0
            ? appConfig.marketingProviders.join(", ")
            : "meta / kakao / google wiring ready",
      },
      {
        title: "Error Logging",
        description: appConfig.errorLoggingProviders.join(", "),
      },
      {
        title: "Data Mode",
        description: appConfig.dataMode,
      },
      {
        title: "Auth Starter",
        description:
          appConfig.authProviders.length > 0
            ? appConfig.authProviders.join(", ")
            : "google / kakao / naver starter ready",
      },
    ],
  },
  {
    icon: FileText,
    eyebrow: "AI Context",
    title: "문서와 AI 작업 문맥",
    description:
      "구현 규칙과 운영 문서를 저장소 안에 같이 두어 다음 작업도 같은 기준으로 이어집니다.",
    items: [
      {
        title: "ai/context/*",
        description: "프로젝트 목적, 엔지니어링 규칙, spec-driven 기준",
      },
      {
        title: "ai/skills/*",
        description: "반복 작업을 위한 저장소 로컬 스킬",
      },
      {
        title: "docs/architecture.md",
        description: "현재 구조와 트레이드오프 설명",
      },
      {
        title: "docs/agent-context.md",
        description: "플랫폼 간 공통 컨텍스트 운영 방식",
      },
    ],
  },
] as const;

const runtimeEntries = [
  {
    icon: LayoutTemplate,
    title: "랜딩 + CTA 추적",
    description:
      "히어로, 정보 블록, tracked link 기반 CTA 흐름이 이미 연결돼 있습니다.",
    href: "/#live-form",
    cta: "라이브 리드 폼 보기",
  },
  {
    icon: CheckCircle2,
    title: "소셜 로그인 키트",
    description:
      "Google, Kakao, Naver login starter와 callback demo를 바로 검증할 수 있습니다.",
    href: "/auth",
    cta: "auth demo 열기",
  },
  {
    icon: FlaskConical,
    title: "모바일 퍼널 데모",
    description:
      "CTA 버튼으로 다음 step으로 넘어가는 모바일 퍼널 예시를 바로 확인할 수 있습니다.",
    href: "/demo/funnel",
    cta: "퍼널 데모 보기",
  },
  {
    icon: PanelsTopLeft,
    title: "상담 요청 플로우",
    description:
      "예산, 일정, 선호 채널까지 포함한 더 강한 신호 수집 화면이 준비돼 있습니다.",
    href: "/consult",
    cta: "상담 플로우 열기",
  },
  {
    icon: CreditCard,
    title: "토스 결제 데모",
    description:
      "서버에서 결제를 생성하고 retUrl/resultCallback까지 확인할 수 있는 실제 결제 데모입니다.",
    href: "/pay",
    cta: "결제 데모 열기",
  },
  {
    icon: Database,
    title: "어드민 운영 화면",
    description:
      "리드, 제품, 실험 데이터를 조회하며 다음 액션을 정할 수 있는 운영 화면입니다.",
    href: "/admin",
    cta: "어드민 열기",
  },
] as const;

const liveFormFeatures = [
  {
    title: "입력 검증",
    description: "RHF + Zod 기반 폼 검증",
  },
  {
    title: "제출 방식",
    description: "server action 기반 제출 흐름",
  },
  {
    title: "세션 추적",
    description: "analytics session 연결 포함",
  },
  {
    title: "마케팅 브리지",
    description: "provider event hook 연결 포함",
  },
  {
    title: "저장 fallback",
    description: "local-json 모드에서도 바로 동작",
  },
  {
    title: "실패 처리",
    description: "field error와 메시지 매핑 포함",
  },
] as const;

const heroHighlights = [
  {
    title: "바로 실행 가능",
    description: "랜딩, 폼, 결제 데모, 어드민을 바로 띄울 수 있습니다.",
  },
  {
    title: "실험에 필요한 기본선",
    description: "analytics, marketing, error logging, fallback 저장이 준비돼 있습니다.",
  },
  {
    title: "복제 가능한 구조",
    description: "theme, seed, 카피를 바꿔 다음 제품으로 옮기기 쉽습니다.",
  },
  {
    title: "문서 포함",
    description: "architecture, spec-driven, AI context 문서가 같이 들어 있습니다.",
  },
] as const;

const starterSteps = [
  {
    step: "01",
    title: "카피와 CTA를 바꾼다",
    description: "랜딩 메시지와 링크 이벤트를 수정해 실험 가설을 빠르게 반영합니다.",
  },
  {
    step: "02",
    title: "폼으로 신호를 받는다",
    description: "가벼운 관심과 더 강한 상담 의사를 각각 다른 흐름으로 수집합니다.",
  },
  {
    step: "03",
    title: "결제 의사를 확인한다",
    description: "토스 결제 데모로 실제 유료 전환 신호가 나오는지 검증합니다.",
  },
  {
    step: "04",
    title: "운영 화면에서 확인한다",
    description: "들어온 신호와 실험 등록 상태를 어드민에서 바로 검토합니다.",
  },
  {
    step: "05",
    title: "다음 제품으로 복제한다",
    description: "카피와 seed를 바꾸고 같은 보일러플레이트 구조를 새 제품에 재사용합니다.",
  },
] as const;

const themeFilePath = "apps/web/src/lib/app-theme.ts";
const themeSteps = [
  "아래 Theme Quick Edit 섹션에서 먼저 hex 색을 맞춘다",
  "스니펫을 복사해 app-theme.ts의 brandTheme에 붙여 넣는다",
  "새로고침해서 버튼, 배지, 헤더, 입력 focus ring이 함께 바뀌는지 확인한다",
] as const;

const themeSurfaces = [
  "Button / CTA 강조색",
  "Accent badge",
  "입력 필드 focus ring",
  "헤더 마크와 hero highlight",
  "랜딩 배경 glow와 hover shadow",
] as const;

const themeTokens = [
  {
    label: "Primary",
    preview: brandTheme.primary,
    description: "CTA, 강조 텍스트, hover glow",
  },
  {
    label: "Primary FG",
    preview: brandTheme.primaryForeground,
    description: "primary 버튼 위 텍스트 색",
  },
  {
    label: brandTheme.accent ? "Accent" : "Accent = Primary",
    preview: brandTheme.accent ?? brandTheme.primary,
    description: brandTheme.accent
      ? "보조 강조색으로 따로 분리됩니다"
      : "accent를 비우면 primary를 그대로 재사용합니다",
  },
] as const;

const themeSnippet = [
  "export const brandTheme = {",
  `  primary: "${brandTheme.primary}",`,
  `  primaryForeground: "${brandTheme.primaryForeground}",`,
  brandTheme.accent
    ? `  accent: "${brandTheme.accent}",`
    : "  // accent is optional. omit it to reuse primary,",
  ...(brandTheme.accentForeground
    ? [`  accentForeground: "${brandTheme.accentForeground}",`]
    : []),
  "};",
].join("\n");

export default function LandingPage() {
  const starterSnapshot = [
    {
      label: "Runtime",
      value: "landing / lead / consult / pay / admin",
    },
    {
      label: "Payments",
      value: "toss checkout demo flow",
    },
    {
      label: "Providers",
      value: "analytics / payment / marketing / error logging",
    },
    {
      label: "Context",
      value: "ai/context + docs + skills",
    },
    {
      label: "Fallback",
      value: appConfig.dataMode,
    },
  ] as const;

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-10">
      <section className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
        <div className="space-y-8">
          <div className="space-y-6">
            <Badge variant="accent">PMF Boilerplate</Badge>
            <div className="space-y-4">
              <h1 className="max-w-4xl text-5xl font-semibold leading-tight tracking-tight text-slate-950">
                PMF 실험용 보일러플레이트가
                <span className="block text-primary">기본으로 제공하는 기능</span>
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-slate-600">
                이 저장소는 특정 도메인 소개 페이지가 아니라, 랜딩, 리드 수집, 상담 요청, 어드민
                운영, 추적 wiring, AI 문맥 문서까지 묶어 둔 스타터입니다. 제품 이름보다
                무엇이 이미 들어 있는지를 먼저 파악할 수 있게 랜딩 구조를 정리했습니다.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {heroHighlights.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3 rounded-2xl border border-border bg-white/85 px-4 py-4"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    <p className="text-sm leading-6 text-slate-700">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <TrackedLink
                  href="/#feature-map"
                  eventProperties={{
                    source: "landing_hero_primary",
                  }}
                >
                  기능 맵 보기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </TrackedLink>
              </Button>
              <Button asChild variant="outline" size="lg">
                <TrackedLink
                  href="/#theme-quick-edit"
                  eventProperties={{
                    source: "landing_hero_theme_quick_edit",
                  }}
                >
                  테마 바로 바꾸기
                </TrackedLink>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <TrackedLink
                  href="/pay"
                  eventProperties={{
                    source: "landing_hero_payment_demo",
                  }}
                >
                  결제 데모 열기
                </TrackedLink>
              </Button>
            </div>
          </div>
        </div>

        <Card className="overflow-hidden border-foreground bg-foreground text-background shadow-[0_25px_80px_hsl(var(--foreground)/0.28)]">
          <CardContent className="relative p-8">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at top right, hsl(var(--primary) / 0.24), transparent 28%), radial-gradient(circle at bottom left, hsl(var(--accent) / 0.18), transparent 30%)",
              }}
            />
            <div className="relative space-y-6">
              <div className="space-y-3">
                <Badge className="bg-white/10 text-white">Starter Snapshot</Badge>
                <h2 className="text-3xl font-semibold tracking-tight">
                  한 화면으로 보는 기본 제공 범위
                </h2>
                <p className="text-sm leading-7 text-slate-300">
                  화면, 추적, 운영, 문서 문맥까지 포함된 상태에서 시작할 수 있도록 범위를 명확히
                  잡아 둔 보일러플레이트입니다.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {starterSnapshot.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-100">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  What this is optimized for
                </p>
                <p className="mt-3 text-2xl font-semibold">빠른 PMF 실험 반복</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  카피 실험, 리드 수집, 상담 의사 확인, 운영 리뷰 같은 초기 실험 루프를 빠르게
                  돌리는 데 초점을 맞춥니다.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                      Brand Theme Quick Edit
                    </p>
                    <p className="text-lg font-semibold">서비스 색상은 한 파일에서 바꿉니다</p>
                    <p className="text-sm leading-6 text-slate-300">
                      보일러플레이트를 새 서비스로 복제할 때는 theme 파일 한 곳에 hex 컬러만
                      먼저 바꾸면 주요 강조색이 같이 업데이트됩니다.
                    </p>
                  </div>
                  <Palette className="mt-1 h-5 w-5 shrink-0 text-primary" />
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-black/15 px-4 py-3 font-mono text-xs text-slate-200">
                  {themeFilePath}
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {themeTokens.map((token) => (
                    <div
                      key={token.label}
                      className="rounded-2xl border border-white/10 bg-white/5 p-3"
                    >
                      <div
                        className="h-10 rounded-xl border border-white/10"
                        style={{ backgroundColor: token.preview }}
                      />
                      <p className="mt-3 text-sm font-semibold">{token.label}</p>
                      <p className="mt-1 text-xs text-slate-300">{token.description}</p>
                    </div>
                  ))}
                </div>

                <Button asChild variant="secondary" size="sm" className="mt-4">
                  <TrackedLink
                    href="/#theme-quick-edit"
                    eventProperties={{
                      source: "landing_snapshot_theme_editor",
                    }}
                  >
                    테마 에디터 바로 열기
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </TrackedLink>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="feature-map" className="mt-20 space-y-6">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
            Feature Map
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
            보일러플레이트가 이미 포함하는 범위
          </h2>
          <p className="text-base leading-7 text-slate-600">
            화면만 있는 템플릿이 아니라, 실행 가능한 UI와 추적 wiring, 운영 화면, AI 문맥 문서가
            함께 들어 있습니다.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {featureGroups.map((group) => (
            <Card key={group.title} className="bg-white/90">
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="accent">{group.eyebrow}</Badge>
                  <group.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-xl">{group.title}</CardTitle>
                  <CardDescription className="leading-6">{group.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {group.items.map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                      <p className="text-sm leading-6 text-slate-700">{item.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section
        id="theme-quick-edit"
        className="mt-20 grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start"
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
              Theme Quick Edit
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
              새 서비스로 바꿀 때 가장 먼저 바꾸는 파일
            </h2>
            <p className="text-base leading-7 text-slate-600">
              이 보일러플레이트는 runtime theme switcher를 두지 않고, 정적 설정 파일 하나에서
              서비스별 브랜드색을 바꾸는 방식을 기본값으로 둡니다. 복제 후 가장 먼저{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground">
                {themeFilePath}
              </code>
              만 수정하면 됩니다.
            </p>
          </div>

          <Card className="bg-white/90">
            <CardHeader>
              <Badge variant="accent" className="w-fit">
                Edit One File
              </Badge>
              <CardTitle className="text-xl">{themeFilePath}</CardTitle>
              <CardDescription>
                <code className="font-mono text-xs">primary</code>는 필수이고{" "}
                <code className="font-mono text-xs">accent</code>는 선택입니다. 비워두면{" "}
                <code className="font-mono text-xs">primary</code>가 그대로 재사용됩니다. 입력은
                hex, 내부 토큰은 HSL로 변환됩니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <pre className="overflow-x-auto rounded-2xl bg-foreground p-4 text-sm leading-6 text-background">
                <code>{themeSnippet}</code>
              </pre>
              <div className="space-y-3">
                {themeSteps.map((step, index) => (
                  <div key={step} className="flex items-start gap-3">
                    <div className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-6 text-slate-700">{step}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <BrandThemePlayground
          themeFilePath={themeFilePath}
          themeSteps={themeSteps}
          themeSurfaces={themeSurfaces}
        />
      </section>

      <section className="mt-20 space-y-6">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
            Try The Included Screens
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
            바로 눌러볼 수 있는 화면
          </h2>
          <p className="text-base leading-7 text-slate-600">
            아래 카드는 설명용 목업이 아니라 현재 프로젝트 안에 포함된 실제 화면으로 연결됩니다.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {runtimeEntries.map((item) => (
            <Card
              key={item.title}
              className="group overflow-hidden border-border bg-white/90 transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-glow"
            >
              <CardHeader className="space-y-4">
                <item.icon className="h-5 w-5 text-primary" />
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
                      source: `landing_runtime_${item.title}`,
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
        className="mt-20 grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-start"
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
              Live Preview
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
              기본 제공 리드 폼을 이 화면에서 바로 확인할 수 있습니다
            </h2>
            <p className="text-base leading-7 text-slate-600">
              리드 폼은 단순 시안이 아니라 검증, 제출, 에러 처리, marketing event hook까지 붙은
              실제 흐름입니다. 라이브 예시를 그대로 보고 다른 제품으로 바꾸면 됩니다.
            </p>
          </div>

          <div className="grid gap-3">
            {liveFormFeatures.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-2xl border border-border bg-white/85 px-4 py-4"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="text-sm leading-6 text-slate-700">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <LeadCaptureForm />
      </section>

      <section className="mt-20 space-y-6">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
            Reuse Flow
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
            다음 제품으로 옮길 때 보는 최소 순서
          </h2>
          <p className="text-base leading-7 text-slate-600">
            이 보일러플레이트는 새 도메인에 맞춰 카피와 seed를 교체하고, 같은 실험 루프를 반복하는
            흐름에 맞춰 설계돼 있습니다.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {starterSteps.map((item) => (
            <Card key={item.step} className="bg-white/85">
              <CardHeader className="pb-3">
                <p className="font-mono text-sm text-primary">{item.step}</p>
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

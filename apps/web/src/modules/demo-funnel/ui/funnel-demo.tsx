"use client";

import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  CircleDollarSign,
  PackageSearch,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

import { Badge, Button, Card, CardContent, Textarea } from "@pmf/ui";

import { useFunnel } from "@/shared/lib/use-funnel";
import { TrackedLink } from "@/shared/ui/tracked-link";

const funnelSteps = ["product", "budget", "done"] as const;

const stepMeta = {
  product: {
    eyebrow: "Step 1",
    title: "어떤 렌탈을 찾고 있나요?",
    description: "모바일 퍼널 첫 화면처럼 하나의 질문과 하나의 CTA만 보여줍니다.",
    cta: "이 제품으로 다음",
  },
  budget: {
    eyebrow: "Step 2",
    title: "예산과 상담 맥락을 알려주세요",
    description: "필수 정보만 먼저 받고, CTA 버튼으로 다음 화면으로 넘깁니다.",
    cta: "조건 확인하고 다음",
  },
  done: {
    eyebrow: "Step 3",
    title: "바로 상담으로 이어질 수 있습니다",
    description: "마지막 화면에서 요약과 다음 액션 CTA를 붙입니다.",
    cta: "상담 페이지로 이동",
  },
} satisfies Record<
  (typeof funnelSteps)[number],
  { eyebrow: string; title: string; description: string; cta: string }
>;

const productOptions = [
  {
    value: "정수기 렌탈",
    title: "정수기 렌탈",
    description: "가정용 빠른 비교가 필요한 경우",
    icon: PackageSearch,
  },
  {
    value: "안마의자 렌탈",
    title: "안마의자 렌탈",
    description: "예산과 브랜드 상담이 중요한 경우",
    icon: Sparkles,
  },
  {
    value: "법인 대량 렌탈",
    title: "법인 대량 렌탈",
    description: "여러 대를 묶어서 검토해야 하는 경우",
    icon: CircleDollarSign,
  },
] as const;

const budgetOptions = ["월 3만원 이하", "월 3-5만원", "월 5-10만원", "월 10만원 이상"] as const;

type DemoDraft = {
  product: string;
  budget: string;
  notes: string;
};

const defaultDraft: DemoDraft = {
  product: "",
  budget: "",
  notes: "",
};

export function FunnelDemo() {
  const funnel = useFunnel({
    steps: funnelSteps,
  });
  const { Funnel } = funnel;
  const [draft, setDraft] = useState(defaultDraft);

  const currentStepMeta = stepMeta[funnel.currentStep];
  const progress = ((funnel.currentIndex + 1) / funnel.stepCount) * 100;
  const isProductReady = draft.product.length > 0;
  const isBudgetReady = draft.budget.length > 0;

  const setField = <TKey extends keyof DemoDraft>(key: TKey, value: DemoDraft[TKey]) => {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handlePrimaryClick = () => {
    if (funnel.currentStep === "product" && isProductReady) {
      funnel.next();
      return;
    }

    if (funnel.currentStep === "budget" && isBudgetReady) {
      funnel.next();
    }
  };

  const isPrimaryDisabled =
    (funnel.currentStep === "product" && !isProductReady) ||
    (funnel.currentStep === "budget" && !isBudgetReady);

  return (
    <div className="mx-auto w-full max-w-sm space-y-4" data-testid="funnel-demo">
      <div
        className="rounded-[40px] p-3 shadow-[0_30px_80px_hsl(var(--foreground)/0.2)]"
        style={{
          backgroundImage:
            "radial-gradient(circle at top, hsl(var(--primary) / 0.22), transparent 42%), linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--background-alt)) 100%)",
        }}
      >
        <div className="overflow-hidden rounded-[32px] border-[10px] border-slate-950 bg-white">
          <div className="flex min-h-[720px] flex-col">
            <div className="border-b border-slate-200 bg-white px-5 pb-4 pt-5">
              <div className="flex items-center justify-between text-[11px] font-semibold tracking-[0.3em] text-slate-400">
                <span>9:41</span>
                <span>5G</span>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={funnel.prev}
                  disabled={!funnel.canGoPrev}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition disabled:opacity-30"
                  aria-label="이전 단계"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
                    {currentStepMeta.eyebrow}
                  </p>
                  <p className="truncate text-sm font-semibold text-slate-950">
                    렌탈 상담 미니 퍼널
                  </p>
                </div>
                <Badge variant="accent">Mobile</Badge>
              </div>
              <div className="mt-4 h-2 rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-slate-950 transition-[width] duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex-1 bg-slate-50 px-5 py-6">
              <div className="space-y-2">
                <h2 className="text-[28px] font-semibold leading-tight tracking-tight text-slate-950">
                  {currentStepMeta.title}
                </h2>
                <p className="text-sm leading-6 text-slate-600">
                  {currentStepMeta.description}
                </p>
              </div>

              <div className="mt-6">
                <Funnel>
                  <Funnel.Step name="product">
                    <div className="space-y-3">
                      {productOptions.map((option) => {
                        const isSelected = draft.product === option.value;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setField("product", option.value)}
                            className={`w-full rounded-[28px] border px-4 py-4 text-left transition ${
                              isSelected
                                ? "border-slate-950 bg-slate-950 text-white shadow-lg"
                                : "border-slate-200 bg-white text-slate-700"
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              <div
                                className={`rounded-2xl p-3 ${
                                  isSelected
                                    ? "bg-white/15 text-primary"
                                    : "bg-primary/10 text-primary"
                                }`}
                              >
                                <option.icon className="h-5 w-5" />
                              </div>
                              <div className="space-y-1">
                                <p className="text-base font-semibold">{option.title}</p>
                                <p
                                  className={`text-sm leading-5 ${
                                    isSelected ? "text-slate-200" : "text-slate-500"
                                  }`}
                                >
                                  {option.description}
                                </p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </Funnel.Step>

                  <Funnel.Step name="budget">
                    <div className="space-y-5">
                      <div className="rounded-[28px] border border-slate-200 bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                          선택한 제품
                        </p>
                        <p className="mt-2 text-base font-semibold text-slate-950">
                          {draft.product || "아직 선택되지 않았습니다."}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-slate-700">월 예산</p>
                        <div className="grid grid-cols-2 gap-2">
                          {budgetOptions.map((option) => {
                            const isSelected = draft.budget === option;

                            return (
                              <button
                                key={option}
                                type="button"
                                onClick={() => setField("budget", option)}
                                className={`rounded-2xl border px-3 py-3 text-sm font-medium transition ${
                                  isSelected
                                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                    : "border-slate-200 bg-white text-slate-700"
                                }`}
                              >
                                {option}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700" htmlFor="demo-notes">
                          추가 메모
                        </label>
                        <Textarea
                          id="demo-notes"
                          value={draft.notes}
                          onChange={(event) => setField("notes", event.target.value)}
                          placeholder="선호 브랜드, 설치 시기, 연락 가능 시간을 적어주세요."
                          className="min-h-28 bg-white"
                        />
                      </div>
                    </div>
                  </Funnel.Step>

                  <Funnel.Step name="done">
                    <div className="space-y-4">
                      <div className="rounded-[28px] bg-slate-950 p-5 text-white">
                        <div className="flex items-start gap-3">
                          <div className="rounded-full bg-emerald-500 p-2 text-white">
                            <CheckCircle2 className="h-5 w-5" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-base font-semibold">CTA로 자연스럽게 다음 단계에 도달했습니다.</p>
                            <p className="text-sm leading-6 text-slate-300">
                              선택과 입력은 한 화면 안에서 끝내고, 마지막에 강한 전환 CTA를 보여주는 구조입니다.
                            </p>
                          </div>
                        </div>
                      </div>

                      <Card className="rounded-[28px] border-slate-200 shadow-none">
                        <CardContent className="space-y-4 p-5">
                          <SummaryRow label="제품" value={draft.product} />
                          <SummaryRow label="예산" value={draft.budget} />
                          <SummaryRow label="메모" value={draft.notes || "추가 메모 없음"} />
                        </CardContent>
                      </Card>

                      <div className="rounded-[28px] border border-primary/20 bg-primary/10 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                          Hook Snapshot
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <StateChip label="currentStep" value={funnel.currentStep} />
                          <StateChip label="currentIndex" value={String(funnel.currentIndex)} />
                          <StateChip label="canGoPrev" value={String(funnel.canGoPrev)} />
                          <StateChip label="isLastStep" value={String(funnel.isLastStep)} />
                        </div>
                      </div>
                    </div>
                  </Funnel.Step>
                </Funnel>
              </div>
            </div>

            <div className="border-t border-slate-200 bg-white p-4">
              {funnel.currentStep !== "done" ? (
                <div className="space-y-3">
                  {funnel.currentStep === "budget" ? (
                    <button
                      type="button"
                      onClick={() => funnel.setStep("product")}
                      className="w-full rounded-full border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600"
                    >
                      제품 다시 고르기
                    </button>
                  ) : null}

                  <Button
                    type="button"
                    size="lg"
                    className="w-full"
                    onClick={handlePrimaryClick}
                    disabled={isPrimaryDisabled}
                  >
                    {currentStepMeta.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button asChild size="lg" className="w-full">
                    <TrackedLink
                      href="/consult"
                      eventProperties={{
                        source: "funnel_demo_mobile_complete",
                      }}
                    >
                      {currentStepMeta.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </TrackedLink>
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    className="w-full"
                    onClick={funnel.reset}
                  >
                    처음부터 다시 보기
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white/90 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          CTA Transition Pattern
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <MetaChip label="screen" value={`${funnel.currentIndex + 1}/${funnel.stepCount}`} />
          <MetaChip label="product" value={draft.product || "none"} />
          <MetaChip label="budget" value={draft.budget || "none"} />
          <MetaChip label="notes" value={draft.notes ? "filled" : "empty"} />
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{label}</p>
      <p className="text-sm leading-6 text-slate-700">{value}</p>
    </div>
  );
}

function StateChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white px-3 py-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-400">{label}</p>
      <p className="mt-2 font-mono text-xs text-slate-950">{value}</p>
    </div>
  );
}

function MetaChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 truncate text-sm font-medium text-slate-700">{value}</p>
    </div>
  );
}

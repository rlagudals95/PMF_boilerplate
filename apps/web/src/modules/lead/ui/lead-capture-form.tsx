"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type LeadCaptureInput, leadCaptureInputSchema } from "@pmf/core";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Textarea } from "@pmf/ui";
import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";

import { submitLeadAction } from "@/modules/lead/actions/submit-lead-action";
import { defaultLeadCaptureValues } from "@/modules/lead/model/lead-form";
import { trackMarketingEvent } from "@/modules/marketing/model/track-marketing-event";
import { getAnalyticsSessionId } from "@/shared/lib/analytics-session";
import { applyActionErrors } from "@/shared/lib/apply-action-errors";
import { FieldError } from "@/shared/ui/field-error";

export function LeadCaptureForm() {
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<LeadCaptureInput>({
    resolver: zodResolver(leadCaptureInputSchema),
    defaultValues: defaultLeadCaptureValues,
  });

  const onSubmit = handleSubmit((values) => {
    setServerMessage(null);
    setIsPending(true);

    startTransition(async () => {
      const result = await submitLeadAction(values, {
        sessionId: getAnalyticsSessionId(),
      });
      setIsPending(false);

      if (!result.ok) {
        applyActionErrors(setError, result.errors);
        setServerMessage(result.message);
        return;
      }

      trackMarketingEvent({
        eventName: "lead_form_submitted",
        path: "/",
        properties: {
          productInterest: values.productInterest,
          source: values.source,
        },
      });

      reset(defaultLeadCaptureValues);
      setServerMessage(result.message);
    });
  });

  return (
    <Card className="border-slate-900/10 bg-white/95 shadow-glow">
      <CardHeader>
        <CardTitle className="text-2xl">빠른 리드 캡처</CardTitle>
        <p className="text-sm text-slate-600">
          관심 제품과 연락처만 남기면 모두의렌탈 상담 흐름을 바로 검증할 수 있습니다.
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={onSubmit} data-testid="lead-form">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="lead-name">이름</Label>
              <Input id="lead-name" placeholder="홍길동" {...register("name")} />
              <FieldError message={errors.name?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-phone">전화번호</Label>
              <Input
                id="lead-phone"
                placeholder="010-1234-5678"
                {...register("phone")}
              />
              <FieldError message={errors.phone?.message} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="lead-email">이메일</Label>
              <Input
                id="lead-email"
                type="email"
                placeholder="hello@example.com"
                {...register("email")}
              />
              <FieldError message={errors.email?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-interest">관심 제품</Label>
              <Input
                id="lead-interest"
                placeholder="정수기 렌탈"
                {...register("productInterest")}
              />
              <FieldError message={errors.productInterest?.message} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lead-message">문의 메모</Label>
            <Textarea
              id="lead-message"
              placeholder="원하는 렌탈 품목, 예산, 설치 일정 등을 남겨 주세요."
              {...register("message")}
            />
            <FieldError message={errors.message?.message} />
          </div>

          <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-slate-300"
              {...register("consent")}
            />
            개인정보 수집 및 상담 연락에 동의합니다.
          </label>
          <FieldError message={errors.consent?.message} />

          <Button type="submit" className="w-full" disabled={isPending} data-testid="lead-submit">
            {isPending ? "접수 중..." : "문의 남기기"}
          </Button>

          {serverMessage ? (
            <p className="text-sm text-slate-600" data-testid="lead-message">
              {serverMessage}
            </p>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}

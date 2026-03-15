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

const consentClassName =
  "flex items-start gap-3 rounded-2xl border border-border bg-muted/70 px-4 py-3 text-sm text-muted-foreground";
const checkboxClassName =
  "mt-1 h-4 w-4 rounded border-border text-primary accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20";
const submitFailureMessage = "문의 접수 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.";

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
      try {
        const result = await submitLeadAction(values, {
          sessionId: getAnalyticsSessionId(),
        });

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
      } catch {
        setServerMessage(submitFailureMessage);
      } finally {
        setIsPending(false);
      }
    });
  });

  return (
    <Card className="border-primary/15 bg-surface/95 shadow-glow">
      <CardHeader>
        <CardTitle className="text-2xl">빠른 리드 캡처</CardTitle>
        <p className="text-sm text-muted-foreground">
          관심 주제와 연락처만 남기면 기본 리드 수집 흐름을 바로 검증할 수 있습니다.
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
              <Label htmlFor="lead-interest">관심 주제</Label>
              <Input
                id="lead-interest"
                placeholder="예: 업무 자동화, B2B SaaS, 내부 운영 툴"
                {...register("productInterest")}
              />
              <FieldError message={errors.productInterest?.message} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lead-message">문의 메모</Label>
            <Textarea
              id="lead-message"
              placeholder="문제 상황, 도입 시기, 예산, 원하는 후속 액션 등을 남겨 주세요."
              {...register("message")}
            />
            <FieldError message={errors.message?.message} />
          </div>

          <label className={consentClassName}>
            <input
              type="checkbox"
              className={checkboxClassName}
              {...register("consent")}
            />
            개인정보 수집 및 후속 연락에 동의합니다.
          </label>
          <FieldError message={errors.consent?.message} />

          <Button type="submit" className="w-full" disabled={isPending} data-testid="lead-submit">
            {isPending ? "접수 중..." : "리드 남기기"}
          </Button>

          {serverMessage ? (
            <p className="text-sm text-muted-foreground" data-testid="lead-message">
              {serverMessage}
            </p>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}

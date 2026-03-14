"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  consultationRequestInputSchema,
  type ConsultationRequestInput,
} from "@pmf/core";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Textarea } from "@pmf/ui";
import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";

import { submitConsultationRequestAction } from "@/modules/consultation/actions/submit-consultation-request-action";
import { defaultConsultationRequestValues } from "@/modules/consultation/model/consultation-form";
import { trackMarketingEvent } from "@/modules/marketing/model/track-marketing-event";
import { getAnalyticsSessionId } from "@/shared/lib/analytics-session";
import { applyActionErrors } from "@/shared/lib/apply-action-errors";
import { FieldError } from "@/shared/ui/field-error";

export function ConsultationRequestForm() {
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ConsultationRequestInput>({
    resolver: zodResolver(consultationRequestInputSchema),
    defaultValues: defaultConsultationRequestValues,
  });

  const onSubmit = handleSubmit((values) => {
    setServerMessage(null);
    setIsPending(true);

    startTransition(async () => {
      const result = await submitConsultationRequestAction(values, {
        sessionId: getAnalyticsSessionId(),
      });
      setIsPending(false);

      if (!result.ok) {
        applyActionErrors(setError, result.errors);
        setServerMessage(result.message);
        return;
      }

      trackMarketingEvent({
        eventName: "consultation_requested",
        path: "/consult",
        properties: {
          budgetRange: values.budgetRange,
          consultationType: values.consultationType,
          productInterest: values.productInterest,
          rentalPeriod: values.rentalPeriod,
        },
      });

      reset(defaultConsultationRequestValues);
      setServerMessage(result.message);
    });
  });

  return (
    <Card className="border-slate-900/10 bg-white shadow-glow">
      <CardHeader>
        <CardTitle className="text-2xl">상담 요청</CardTitle>
        <p className="text-sm text-slate-600">
          리드만 보는 수준을 넘어, 실제 상담 의사와 맥락까지 확인하는 검증 단계입니다.
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={onSubmit} data-testid="consult-form">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="consult-name">이름</Label>
              <Input id="consult-name" placeholder="홍길동" {...register("name")} />
              <FieldError message={errors.name?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="consult-phone">전화번호</Label>
              <Input
                id="consult-phone"
                placeholder="010-1234-5678"
                {...register("phone")}
              />
              <FieldError message={errors.phone?.message} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="consult-email">이메일</Label>
              <Input
                id="consult-email"
                type="email"
                placeholder="hello@example.com"
                {...register("email")}
              />
              <FieldError message={errors.email?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="consult-interest">상담 제품</Label>
              <Input
                id="consult-interest"
                placeholder="정수기 렌탈"
                {...register("productInterest")}
              />
              <FieldError message={errors.productInterest?.message} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="consult-type">상담 방식</Label>
              <select
                id="consult-type"
                className="flex h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none focus-visible:border-slate-950 focus-visible:ring-2 focus-visible:ring-slate-900/10"
                {...register("consultationType")}
              >
                <option value="call">전화</option>
                <option value="kakao">카카오</option>
                <option value="visit">방문</option>
                <option value="email">이메일</option>
              </select>
              <FieldError message={errors.consultationType?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="consult-date">희망 일정</Label>
              <Input
                id="consult-date"
                type="datetime-local"
                {...register("preferredDate")}
              />
              <FieldError message={errors.preferredDate?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="consult-budget">예산 범위</Label>
              <Input
                id="consult-budget"
                placeholder="월 3-5만원"
                {...register("budgetRange")}
              />
              <FieldError message={errors.budgetRange?.message} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="consult-period">렌탈 기간</Label>
            <Input
              id="consult-period"
              placeholder="24개월 / 36개월"
              {...register("rentalPeriod")}
            />
            <FieldError message={errors.rentalPeriod?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="consult-notes">상세 요구사항</Label>
            <Textarea
              id="consult-notes"
              placeholder="설치 장소, 선호 브랜드, 예산, 원하는 상담 시간 등을 남겨 주세요."
              {...register("notes")}
            />
            <FieldError message={errors.notes?.message} />
          </div>

          <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-slate-300"
              {...register("consent")}
            />
            상담 진행을 위한 개인정보 수집 및 연락에 동의합니다.
          </label>
          <FieldError message={errors.consent?.message} />

          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
            data-testid="consult-submit"
          >
            {isPending ? "상담 요청 중..." : "상담 요청 보내기"}
          </Button>

          {serverMessage ? (
            <p className="text-sm text-slate-600" data-testid="consult-message">
              {serverMessage}
            </p>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}

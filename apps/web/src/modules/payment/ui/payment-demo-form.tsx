"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  paymentCheckoutInputSchema,
  type PaymentCheckoutInput,
} from "@pmf/core";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@pmf/ui";
import { startTransition, useState } from "react";
import { useForm } from "react-hook-form";

import { startPaymentAction } from "@/modules/payment/actions/start-payment-action";
import { defaultPaymentCheckoutValues } from "@/modules/payment/model/payment-form";
import { getAnalyticsSessionId } from "@/shared/lib/analytics-session";
import { applyActionErrors } from "@/shared/lib/apply-action-errors";
import { FieldError } from "@/shared/ui/field-error";

const submitFailureMessage =
  "결제 세션 생성 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.";

export function PaymentDemoForm({ isConfigured }: { isConfigured: boolean }) {
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<PaymentCheckoutInput>({
    resolver: zodResolver(paymentCheckoutInputSchema),
    defaultValues: defaultPaymentCheckoutValues,
  });

  const onSubmit = handleSubmit((values) => {
    setServerMessage(null);
    setIsPending(true);

    startTransition(async () => {
      try {
        const result = await startPaymentAction(values, {
          sessionId: getAnalyticsSessionId(),
        });

        if (!result.ok) {
          applyActionErrors(setError, result.errors);
          setServerMessage(result.message);
          return;
        }

        if (!result.redirectUrl) {
          setServerMessage("결제 페이지 URL을 받아오지 못했습니다.");
          return;
        }

        window.location.assign(result.redirectUrl);
      } catch {
        setServerMessage(submitFailureMessage);
      } finally {
        setIsPending(false);
      }
    });
  });

  return (
    <Card className="border-slate-900 bg-slate-950 text-white shadow-[0_24px_70px_rgba(15,23,42,0.32)]">
      <CardHeader className="space-y-3">
        <CardTitle className="text-2xl text-white">Toss 결제 데모</CardTitle>
        <p className="text-sm leading-6 text-slate-300">
          서버에서 결제를 생성한 뒤 Toss 체크아웃 페이지로 이동합니다.
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="payment-product" className="text-white">
              상품 설명
            </Label>
            <Input
              id="payment-product"
              placeholder="모두의렌탈 결제 데모"
              className="border-white/10 bg-white/5 text-white placeholder:text-slate-400"
              {...register("productDescription")}
            />
            <FieldError message={errors.productDescription?.message} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="payment-amount" className="text-white">
                결제 금액
              </Label>
              <Input
                id="payment-amount"
                type="number"
                min={1000}
                step={1000}
                className="border-white/10 bg-white/5 text-white placeholder:text-slate-400"
                {...register("amount", { valueAsNumber: true })}
              />
              <FieldError message={errors.amount?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment-name" className="text-white">
                구매자 이름
              </Label>
              <Input
                id="payment-name"
                placeholder="홍길동"
                className="border-white/10 bg-white/5 text-white placeholder:text-slate-400"
                {...register("customerName")}
              />
              <FieldError message={errors.customerName?.message} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-email" className="text-white">
              구매자 이메일
            </Label>
            <Input
              id="payment-email"
              type="email"
              placeholder="hello@example.com"
              className="border-white/10 bg-white/5 text-white placeholder:text-slate-400"
              {...register("customerEmail")}
            />
            <FieldError message={errors.customerEmail?.message} />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
            <p>필수 환경변수: `TOSS_PAYMENTS_API_KEY`, `NEXT_PUBLIC_SITE_URL`</p>
            <p className="mt-1">
              현재 상태: {isConfigured ? "설정됨" : "미설정"}
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-amber-500 text-slate-950 hover:bg-amber-400"
            disabled={isPending || !isConfigured}
            data-testid="payment-submit"
          >
            {isPending ? "결제 세션 생성 중..." : "토스 결제 시작"}
          </Button>

          {serverMessage ? (
            <p className="text-sm text-slate-300" data-testid="payment-message">
              {serverMessage}
            </p>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}

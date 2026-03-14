import { z } from "zod";

import { leadSourceSchema } from "./common";

const phoneRegex = /^[0-9+()\-\s]{8,20}$/;

export const leadCaptureInputSchema = z.object({
  name: z.string().trim().min(2, "이름을 입력해 주세요."),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "전화번호 형식을 확인해 주세요."),
  email: z.email("이메일 형식을 확인해 주세요.").optional().or(z.literal("")),
  productInterest: z.string().trim().min(2, "관심 제품을 입력해 주세요."),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
  source: leadSourceSchema,
  consent: z.boolean().refine((value) => value, {
    message: "개인정보 수집 및 상담 연락 동의가 필요합니다.",
  }),
});

export const consultationRequestInputSchema = z.object({
  name: z.string().trim().min(2, "이름을 입력해 주세요."),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "전화번호 형식을 확인해 주세요."),
  email: z.email("이메일 형식을 확인해 주세요.").optional().or(z.literal("")),
  productInterest: z.string().trim().min(2, "상담 대상 제품을 입력해 주세요."),
  consultationType: z.enum(["call", "kakao", "visit", "email"]),
  preferredDate: z.string().optional().or(z.literal("")),
  rentalPeriod: z.string().trim().max(100).optional().or(z.literal("")),
  budgetRange: z.string().trim().max(100).optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
  consent: z.boolean().refine((value) => value, {
    message: "상담 요청을 위해 동의가 필요합니다.",
  }),
});

export const paymentCheckoutInputSchema = z.object({
  productDescription: z.string().trim().min(2, "상품 설명을 입력해 주세요."),
  amount: z
    .number({
      error: "결제 금액을 숫자로 입력해 주세요.",
    })
    .int("결제 금액은 정수여야 합니다.")
    .positive("결제 금액은 0원보다 커야 합니다.")
    .max(10_000_000, "테스트 결제 금액은 1,000만원 이하로 입력해 주세요."),
  customerName: z.string().trim().min(2, "구매자 이름을 입력해 주세요."),
  customerEmail: z
    .email("이메일 형식을 확인해 주세요.")
    .optional()
    .or(z.literal("")),
});

export type LeadCaptureInput = z.infer<typeof leadCaptureInputSchema>;
export type ConsultationRequestInput = z.infer<
  typeof consultationRequestInputSchema
>;
export type PaymentCheckoutInput = z.infer<typeof paymentCheckoutInputSchema>;

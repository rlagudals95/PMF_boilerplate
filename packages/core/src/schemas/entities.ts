import { z } from "zod";

import {
  consultationStatusSchema,
  experimentChannelSchema,
  experimentStatusSchema,
  isoDateTimeSchema,
  leadSourceSchema,
  leadStatusSchema,
  pageEventNameSchema,
  paymentProviderSchema,
  paymentStatusSchema,
  productStageSchema,
} from "./common";

export const leadSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2),
  phone: z.string().min(8),
  email: z.email().optional(),
  productInterest: z.string().min(2),
  source: leadSourceSchema,
  status: leadStatusSchema,
  message: z.string().max(1000).optional(),
  tags: z.array(z.string()).default([]),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
});

export const consultationRequestSchema = z.object({
  id: z.string().min(1),
  leadId: z.string().min(1),
  productInterest: z.string().min(2),
  consultationType: z.enum(["call", "kakao", "visit", "email"]),
  preferredDate: z.string().optional(),
  rentalPeriod: z.string().max(100).optional(),
  budgetRange: z.string().max(100).optional(),
  notes: z.string().max(1000).optional(),
  status: consultationStatusSchema,
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
});

export const productSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(2),
  category: z.string().min(2),
  oneLiner: z.string().min(5),
  stage: productStageSchema,
  valueProps: z.array(z.string()).min(1),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
});

export const experimentSchema = z.object({
  id: z.string().min(1),
  productId: z.string().min(1),
  code: z.string().min(1),
  name: z.string().min(2),
  hypothesis: z.string().min(10),
  channel: experimentChannelSchema,
  status: experimentStatusSchema,
  successMetric: z.string().min(3),
  owner: z.string().min(2),
  notes: z.string().max(1000).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
});

export const pageEventSchema = z.object({
  id: z.string().min(1),
  path: z.string().min(1),
  eventName: pageEventNameSchema,
  sessionId: z.string().optional(),
  leadId: z.string().optional(),
  experimentId: z.string().optional(),
  properties: z.record(z.string(), z.unknown()).default({}),
  occurredAt: isoDateTimeSchema,
});

export const paymentSchema = z.object({
  id: z.string().min(1),
  provider: paymentProviderSchema,
  orderNo: z.string().min(1),
  productDescription: z.string().min(2),
  amount: z.number().int().positive(),
  currency: z.literal("KRW"),
  status: paymentStatusSchema,
  customerName: z.string().min(2),
  customerEmail: z.email().optional(),
  payToken: z.string().optional(),
  checkoutUrl: z.url().optional(),
  payMethod: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).default({}),
  approvedAt: isoDateTimeSchema.optional(),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
});

export type LeadEntity = z.infer<typeof leadSchema>;
export type ConsultationRequestEntity = z.infer<
  typeof consultationRequestSchema
>;
export type ProductEntity = z.infer<typeof productSchema>;
export type ExperimentEntity = z.infer<typeof experimentSchema>;
export type PageEventEntity = z.infer<typeof pageEventSchema>;
export type PaymentEntity = z.infer<typeof paymentSchema>;

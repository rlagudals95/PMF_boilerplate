import { z } from "zod";

export const leadSourceSchema = z.enum([
  "landing_page",
  "consult_page",
  "manual",
  "referral",
  "import",
]);

export const leadStatusSchema = z.enum([
  "new",
  "qualified",
  "contacted",
  "converted",
  "lost",
]);

export const consultationStatusSchema = z.enum([
  "requested",
  "scheduled",
  "completed",
  "cancelled",
]);

export const paymentProviderSchema = z.enum(["toss"]);

export const paymentStatusSchema = z.enum([
  "ready",
  "paid",
  "cancelled",
  "failed",
]);

export const productStageSchema = z.enum(["idea", "active", "paused", "sunset"]);

export const experimentStatusSchema = z.enum([
  "draft",
  "running",
  "paused",
  "won",
  "lost",
  "archived",
]);

export const experimentChannelSchema = z.enum([
  "seo",
  "meta_ads",
  "google_ads",
  "community",
  "referral",
  "partner",
  "email",
  "manual",
]);

export const pageEventNameSchema = z.enum([
  "page_view",
  "cta_clicked",
  "lead_form_submitted",
  "consultation_requested",
  "payment_checkout_started",
  "payment_succeeded",
  "payment_cancelled",
  "payment_failed",
  "admin_page_viewed",
]);

export const isoDateTimeSchema = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), "유효한 ISO 날짜여야 합니다.");

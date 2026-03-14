import { relations } from "drizzle-orm";
import {
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: varchar("id", { length: 64 }).primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  category: varchar("category", { length: 120 }).notNull(),
  oneLiner: text("one_liner").notNull(),
  stage: varchar("stage", { length: 20 }).notNull(),
  valueProps: jsonb("value_props").$type<string[]>().notNull().default([]),
  createdAt: timestamp("created_at", {
    mode: "string",
    withTimezone: true,
  }).notNull(),
  updatedAt: timestamp("updated_at", {
    mode: "string",
    withTimezone: true,
  }).notNull(),
});

export const experiments = pgTable("experiments", {
  id: varchar("id", { length: 64 }).primaryKey(),
  productId: varchar("product_id", { length: 64 })
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  code: varchar("code", { length: 40 }).notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  hypothesis: text("hypothesis").notNull(),
  channel: varchar("channel", { length: 40 }).notNull(),
  status: varchar("status", { length: 20 }).notNull(),
  successMetric: varchar("success_metric", { length: 200 }).notNull(),
  owner: varchar("owner", { length: 120 }).notNull(),
  notes: text("notes"),
  startDate: varchar("start_date", { length: 40 }),
  endDate: varchar("end_date", { length: 40 }),
  createdAt: timestamp("created_at", {
    mode: "string",
    withTimezone: true,
  }).notNull(),
  updatedAt: timestamp("updated_at", {
    mode: "string",
    withTimezone: true,
  }).notNull(),
});

export const leads = pgTable("leads", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull(),
  email: varchar("email", { length: 160 }),
  productInterest: varchar("product_interest", { length: 160 }).notNull(),
  source: varchar("source", { length: 40 }).notNull(),
  status: varchar("status", { length: 20 }).notNull(),
  message: text("message"),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  createdAt: timestamp("created_at", {
    mode: "string",
    withTimezone: true,
  }).notNull(),
  updatedAt: timestamp("updated_at", {
    mode: "string",
    withTimezone: true,
  }).notNull(),
});

export const consultationRequests = pgTable("consultation_requests", {
  id: varchar("id", { length: 64 }).primaryKey(),
  leadId: varchar("lead_id", { length: 64 })
    .notNull()
    .references(() => leads.id, { onDelete: "cascade" }),
  productInterest: varchar("product_interest", { length: 160 }).notNull(),
  consultationType: varchar("consultation_type", { length: 20 }).notNull(),
  preferredDate: varchar("preferred_date", { length: 80 }),
  rentalPeriod: varchar("rental_period", { length: 80 }),
  budgetRange: varchar("budget_range", { length: 80 }),
  notes: text("notes"),
  status: varchar("status", { length: 20 }).notNull(),
  createdAt: timestamp("created_at", {
    mode: "string",
    withTimezone: true,
  }).notNull(),
  updatedAt: timestamp("updated_at", {
    mode: "string",
    withTimezone: true,
  }).notNull(),
});

export const pageEvents = pgTable("page_events", {
  id: varchar("id", { length: 64 }).primaryKey(),
  path: varchar("path", { length: 160 }).notNull(),
  eventName: varchar("event_name", { length: 40 }).notNull(),
  sessionId: varchar("session_id", { length: 120 }),
  leadId: varchar("lead_id", { length: 64 }),
  experimentId: varchar("experiment_id", { length: 64 }),
  properties: jsonb("properties")
    .$type<Record<string, unknown>>()
    .notNull()
    .default({}),
  occurredAt: timestamp("occurred_at", {
    mode: "string",
    withTimezone: true,
  }).notNull(),
});

export const payments = pgTable("payments", {
  id: varchar("id", { length: 64 }).primaryKey(),
  provider: varchar("provider", { length: 20 }).notNull(),
  orderNo: varchar("order_no", { length: 120 }).notNull(),
  productDescription: varchar("product_description", { length: 160 }).notNull(),
  amount: integer("amount").notNull(),
  currency: varchar("currency", { length: 10 }).notNull(),
  status: varchar("status", { length: 20 }).notNull(),
  customerName: varchar("customer_name", { length: 120 }).notNull(),
  customerEmail: varchar("customer_email", { length: 160 }),
  payToken: varchar("pay_token", { length: 160 }),
  checkoutUrl: text("checkout_url"),
  payMethod: varchar("pay_method", { length: 80 }),
  metadata: jsonb("metadata")
    .$type<Record<string, unknown>>()
    .notNull()
    .default({}),
  approvedAt: timestamp("approved_at", {
    mode: "string",
    withTimezone: true,
  }),
  createdAt: timestamp("created_at", {
    mode: "string",
    withTimezone: true,
  }).notNull(),
  updatedAt: timestamp("updated_at", {
    mode: "string",
    withTimezone: true,
  }).notNull(),
});

export const productRelations = relations(products, ({ many }) => ({
  experiments: many(experiments),
}));

export const experimentRelations = relations(experiments, ({ one }) => ({
  product: one(products, {
    fields: [experiments.productId],
    references: [products.id],
  }),
}));

export const leadRelations = relations(leads, ({ many }) => ({
  consultations: many(consultationRequests),
}));

export const consultationRequestRelations = relations(
  consultationRequests,
  ({ one }) => ({
    lead: one(leads, {
      fields: [consultationRequests.leadId],
      references: [leads.id],
    }),
  }),
);

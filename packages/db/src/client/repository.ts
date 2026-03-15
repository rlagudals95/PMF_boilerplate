import { desc, eq } from "drizzle-orm";

import {
  consultationRequestSchema,
  experimentSchema,
  leadSchema,
  pageEventSchema,
  paymentSchema,
  productSchema,
  type ConsultationRequest,
  type Experiment,
  type Lead,
  type PageEvent,
  type Payment,
  type Product,
} from "@pmf/core";

import { getDatabase, isDatabaseConfigured } from "./postgres";
import { readLocalStore, updateLocalStore } from "./local-store";
import {
  consultationRequests,
  experiments,
  leads,
  pageEvents,
  payments,
  products,
} from "../schema";

const sortByNewest = <T extends { createdAt?: string; occurredAt?: string }>(
  items: T[],
) =>
  [...items].sort((left, right) => {
    const leftValue = left.createdAt ?? left.occurredAt ?? "";
    const rightValue = right.createdAt ?? right.occurredAt ?? "";

    return rightValue.localeCompare(leftValue);
  });

const leadListSchema = leadSchema.array();
const consultationListSchema = consultationRequestSchema.array();
const productListSchema = productSchema.array();
const experimentListSchema = experimentSchema.array();
const pageEventListSchema = pageEventSchema.array();
const paymentListSchema = paymentSchema.array();

const optional = <T>(value: T | null | undefined) => value ?? undefined;

type PaymentUpdateInput = Partial<Omit<Payment, "id" | "provider" | "orderNo" | "createdAt">>;

const mapPaymentRow = (row: typeof payments.$inferSelect): Payment => ({
  ...row,
  provider: row.provider as Payment["provider"],
  currency: row.currency as Payment["currency"],
  status: row.status as Payment["status"],
  customerEmail: optional(row.customerEmail),
  payToken: optional(row.payToken),
  checkoutUrl: optional(row.checkoutUrl),
  payMethod: optional(row.payMethod),
  approvedAt: optional(row.approvedAt),
});

const buildPaymentUpdateValues = (updates: PaymentUpdateInput) => {
  const values: Record<string, unknown> = {};

  if ("productDescription" in updates) {
    values.productDescription = updates.productDescription;
  }

  if ("amount" in updates) {
    values.amount = updates.amount;
  }

  if ("currency" in updates) {
    values.currency = updates.currency;
  }

  if ("status" in updates) {
    values.status = updates.status;
  }

  if ("customerName" in updates) {
    values.customerName = updates.customerName;
  }

  if ("customerEmail" in updates) {
    values.customerEmail = updates.customerEmail ?? null;
  }

  if ("payToken" in updates) {
    values.payToken = updates.payToken ?? null;
  }

  if ("checkoutUrl" in updates) {
    values.checkoutUrl = updates.checkoutUrl ?? null;
  }

  if ("payMethod" in updates) {
    values.payMethod = updates.payMethod ?? null;
  }

  if ("metadata" in updates) {
    values.metadata = updates.metadata ?? {};
  }

  if ("approvedAt" in updates) {
    values.approvedAt = updates.approvedAt ?? null;
  }

  if ("updatedAt" in updates) {
    values.updatedAt = updates.updatedAt;
  }

  return values;
};

export const listLeads = async (): Promise<Lead[]> => {
  if (!isDatabaseConfigured()) {
    const store = await readLocalStore();
    return sortByNewest(leadListSchema.parse(store.leads));
  }

  const rows = await getDatabase().select().from(leads).orderBy(desc(leads.createdAt));

  return leadListSchema.parse(
    rows.map((row) => ({
      ...row,
      email: optional(row.email),
      message: optional(row.message),
    })),
  );
};

export const listConsultationRequests = async (): Promise<
  ConsultationRequest[]
> => {
  if (!isDatabaseConfigured()) {
    const store = await readLocalStore();
    return sortByNewest(consultationListSchema.parse(store.consultationRequests));
  }

  const rows = await getDatabase()
    .select()
    .from(consultationRequests)
    .orderBy(desc(consultationRequests.createdAt));

  return consultationListSchema.parse(
    rows.map((row) => ({
      ...row,
      preferredDate: optional(row.preferredDate),
      rentalPeriod: optional(row.rentalPeriod),
      budgetRange: optional(row.budgetRange),
      notes: optional(row.notes),
    })),
  );
};

export const listProducts = async (): Promise<Product[]> => {
  if (!isDatabaseConfigured()) {
    const store = await readLocalStore();
    return sortByNewest(productListSchema.parse(store.products));
  }

  const rows = await getDatabase()
    .select()
    .from(products)
    .orderBy(desc(products.createdAt));

  return productListSchema.parse(rows);
};

export const listExperiments = async (): Promise<Experiment[]> => {
  if (!isDatabaseConfigured()) {
    const store = await readLocalStore();
    return sortByNewest(experimentListSchema.parse(store.experiments));
  }

  const rows = await getDatabase()
    .select()
    .from(experiments)
    .orderBy(desc(experiments.createdAt));

  return experimentListSchema.parse(
    rows.map((row) => ({
      ...row,
      notes: optional(row.notes),
      startDate: optional(row.startDate),
      endDate: optional(row.endDate),
    })),
  );
};

export const listPageEvents = async (): Promise<PageEvent[]> => {
  if (!isDatabaseConfigured()) {
    const store = await readLocalStore();
    return sortByNewest(pageEventListSchema.parse(store.pageEvents));
  }

  const rows = await getDatabase()
    .select()
    .from(pageEvents)
    .orderBy(desc(pageEvents.occurredAt));

  return pageEventListSchema.parse(
    rows.map((row) => ({
      ...row,
      sessionId: optional(row.sessionId),
      leadId: optional(row.leadId),
      experimentId: optional(row.experimentId),
    })),
  );
};

export const listPayments = async (): Promise<Payment[]> => {
  if (!isDatabaseConfigured()) {
    const store = await readLocalStore();
    return sortByNewest(paymentListSchema.parse(store.payments));
  }

  const rows = await getDatabase().select().from(payments).orderBy(desc(payments.createdAt));

  return paymentListSchema.parse(rows.map(mapPaymentRow));
};

export const findPaymentByOrderNo = async (
  orderNo: string,
): Promise<Payment | undefined> => {
  if (!isDatabaseConfigured()) {
    const store = await readLocalStore();
    return paymentSchema
      .optional()
      .parse(store.payments.find((payment) => payment.orderNo === orderNo));
  }

  const [row] = await getDatabase()
    .select()
    .from(payments)
    .where(eq(payments.orderNo, orderNo))
    .limit(1);

  return paymentSchema.optional().parse(row ? mapPaymentRow(row) : undefined);
};

export const findPaymentByPayToken = async (
  payToken: string,
): Promise<Payment | undefined> => {
  if (!isDatabaseConfigured()) {
    const store = await readLocalStore();
    return paymentSchema
      .optional()
      .parse(store.payments.find((payment) => payment.payToken === payToken));
  }

  const [row] = await getDatabase()
    .select()
    .from(payments)
    .where(eq(payments.payToken, payToken))
    .limit(1);

  return paymentSchema.optional().parse(row ? mapPaymentRow(row) : undefined);
};

export const createLead = async (lead: Lead) => {
  if (!isDatabaseConfigured()) {
    return updateLocalStore((store) => {
      store.leads.unshift(lead);
      return lead;
    });
  }

  await getDatabase().insert(leads).values(lead);
  return lead;
};

export const createConsultationRequest = async (
  consultationRequest: ConsultationRequest,
) => {
  if (!isDatabaseConfigured()) {
    return updateLocalStore((store) => {
      store.consultationRequests.unshift(consultationRequest);
      return consultationRequest;
    });
  }

  await getDatabase()
    .insert(consultationRequests)
    .values(consultationRequest);
  return consultationRequest;
};

export const createLeadWithConsultationRequest = async (
  lead: Lead,
  consultationRequest: ConsultationRequest,
) => {
  if (!isDatabaseConfigured()) {
    return updateLocalStore((store) => {
      store.leads.unshift(lead);
      store.consultationRequests.unshift(consultationRequest);

      return {
        lead,
        consultationRequest,
      };
    });
  }

  await getDatabase().transaction(async (tx) => {
    await tx.insert(leads).values(lead);
    await tx.insert(consultationRequests).values(consultationRequest);
  });

  return {
    lead,
    consultationRequest,
  };
};

export const createPageEvent = async (pageEvent: PageEvent) => {
  if (!isDatabaseConfigured()) {
    return updateLocalStore((store) => {
      store.pageEvents.unshift(pageEvent);
      return pageEvent;
    });
  }

  await getDatabase().insert(pageEvents).values(pageEvent);
  return pageEvent;
};

export const createPayment = async (payment: Payment) => {
  if (!isDatabaseConfigured()) {
    return updateLocalStore((store) => {
      store.payments.unshift(payment);
      return payment;
    });
  }

  await getDatabase().insert(payments).values(payment);
  return payment;
};

export const updatePaymentByOrderNo = async (
  orderNo: string,
  updates: PaymentUpdateInput,
) => {
  if (!isDatabaseConfigured()) {
    return updateLocalStore((store) => {
      const index = store.payments.findIndex((payment) => payment.orderNo === orderNo);

      if (index < 0) {
        return undefined;
      }

      const current = store.payments[index]!;
      const next: Payment = {
        ...current,
        ...updates,
        updatedAt: updates.updatedAt ?? current.updatedAt,
      };

      store.payments[index] = next;
      return next;
    });
  }

  await getDatabase()
    .update(payments)
    .set(buildPaymentUpdateValues(updates))
    .where(eq(payments.orderNo, orderNo));

  return findPaymentByOrderNo(orderNo);
};

export const updatePaymentByPayToken = async (
  payToken: string,
  updates: PaymentUpdateInput,
) => {
  if (!isDatabaseConfigured()) {
    return updateLocalStore((store) => {
      const index = store.payments.findIndex((payment) => payment.payToken === payToken);

      if (index < 0) {
        return undefined;
      }

      const current = store.payments[index]!;
      const next: Payment = {
        ...current,
        ...updates,
        updatedAt: updates.updatedAt ?? current.updatedAt,
      };

      store.payments[index] = next;
      return next;
    });
  }

  await getDatabase()
    .update(payments)
    .set(buildPaymentUpdateValues(updates))
    .where(eq(payments.payToken, payToken));

  return findPaymentByPayToken(payToken);
};

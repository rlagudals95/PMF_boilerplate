import { desc } from "drizzle-orm";

import {
  consultationRequestSchema,
  experimentSchema,
  leadSchema,
  pageEventSchema,
  productSchema,
  type ConsultationRequest,
  type Experiment,
  type Lead,
  type PageEvent,
  type Product,
} from "@pmf/core";

import { getDatabase, isDatabaseConfigured } from "./postgres";
import { readLocalStore, writeLocalStore } from "./local-store";
import {
  consultationRequests,
  experiments,
  leads,
  pageEvents,
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

const optional = <T>(value: T | null | undefined) => value ?? undefined;

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

export const createLead = async (lead: Lead) => {
  if (!isDatabaseConfigured()) {
    const store = await readLocalStore();
    store.leads.unshift(lead);
    await writeLocalStore(store);
    return lead;
  }

  await getDatabase().insert(leads).values(lead);
  return lead;
};

export const createConsultationRequest = async (
  consultationRequest: ConsultationRequest,
) => {
  if (!isDatabaseConfigured()) {
    const store = await readLocalStore();
    store.consultationRequests.unshift(consultationRequest);
    await writeLocalStore(store);
    return consultationRequest;
  }

  await getDatabase()
    .insert(consultationRequests)
    .values(consultationRequest);
  return consultationRequest;
};

export const createPageEvent = async (pageEvent: PageEvent) => {
  if (!isDatabaseConfigured()) {
    const store = await readLocalStore();
    store.pageEvents.unshift(pageEvent);
    await writeLocalStore(store);
    return pageEvent;
  }

  await getDatabase().insert(pageEvents).values(pageEvent);
  return pageEvent;
};

import type {
  ConsultationRequest,
  Experiment,
  Lead,
  PageEvent,
  Payment,
  Product,
} from "../domain/types";
import type {
  ConsultationRequestInput,
  LeadCaptureInput,
  PaymentCheckoutInput,
} from "../schemas/forms";

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const buildId = (prefix: string) =>
  `${prefix}_${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;

const now = () => new Date().toISOString();

const optionalString = (value?: string) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

export const createLeadFromInput = (input: LeadCaptureInput): Lead => {
  const timestamp = now();

  return {
    id: buildId("lead"),
    name: input.name.trim(),
    phone: input.phone.trim(),
    email: optionalString(input.email),
    productInterest: input.productInterest.trim(),
    source: input.source,
    status: "new",
    message: optionalString(input.message),
    tags: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};

export const createConsultationRequestFromInput = (
  input: ConsultationRequestInput,
  leadId: string,
): ConsultationRequest => {
  const timestamp = now();

  return {
    id: buildId("consult"),
    leadId,
    productInterest: input.productInterest.trim(),
    consultationType: input.consultationType,
    preferredDate: optionalString(input.preferredDate),
    rentalPeriod: optionalString(input.rentalPeriod),
    budgetRange: optionalString(input.budgetRange),
    notes: optionalString(input.notes),
    status: "requested",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};

export const createPageEvent = (
  input: Pick<PageEvent, "eventName" | "path"> &
    Partial<
      Pick<
        PageEvent,
        "sessionId" | "leadId" | "experimentId" | "occurredAt" | "properties"
      >
    >,
): PageEvent => ({
  id: buildId("event"),
  eventName: input.eventName,
  path: input.path,
  sessionId: input.sessionId,
  leadId: input.leadId,
  experimentId: input.experimentId,
  properties: input.properties ?? {},
  occurredAt: input.occurredAt ?? now(),
});

export const createProduct = (input: {
  name: string;
  category: string;
  oneLiner: string;
  valueProps: string[];
  stage?: Product["stage"];
}): Product => {
  const timestamp = now();

  return {
    id: buildId("product"),
    slug: slugify(input.name),
    name: input.name,
    category: input.category,
    oneLiner: input.oneLiner,
    stage: input.stage ?? "idea",
    valueProps: input.valueProps,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};

export const createPaymentFromCheckoutInput = (input: {
  checkout: PaymentCheckoutInput;
  orderNo: string;
  provider?: Payment["provider"];
  payToken?: string;
  checkoutUrl?: string;
  status?: Payment["status"];
  payMethod?: string;
  approvedAt?: string;
  metadata?: Record<string, unknown>;
}): Payment => {
  const timestamp = now();

  return {
    id: buildId("payment"),
    provider: input.provider ?? "toss",
    orderNo: input.orderNo,
    productDescription: input.checkout.productDescription.trim(),
    amount: input.checkout.amount,
    currency: "KRW",
    status: input.status ?? "ready",
    customerName: input.checkout.customerName.trim(),
    customerEmail: optionalString(input.checkout.customerEmail),
    payToken: input.payToken,
    checkoutUrl: input.checkoutUrl,
    payMethod: input.payMethod,
    metadata: input.metadata ?? {},
    approvedAt: input.approvedAt,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};

export const createExperiment = (input: {
  productId: string;
  code: string;
  name: string;
  hypothesis: string;
  channel: Experiment["channel"];
  successMetric: string;
  owner: string;
  status?: Experiment["status"];
  notes?: string;
}): Experiment => {
  const timestamp = now();

  return {
    id: buildId("experiment"),
    productId: input.productId,
    code: input.code,
    name: input.name,
    hypothesis: input.hypothesis,
    channel: input.channel,
    status: input.status ?? "draft",
    successMetric: input.successMetric,
    owner: input.owner,
    notes: input.notes,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};

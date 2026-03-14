import type {
  ConsultationRequest,
  Experiment,
  Lead,
  PageEvent,
  Payment,
  Product,
} from "../domain/types";

export const summarizePipeline = (input: {
  leads: Lead[];
  consultations: ConsultationRequest[];
  products: Product[];
  experiments: Experiment[];
  pageEvents: PageEvent[];
  payments: Payment[];
}) => ({
  totalLeads: input.leads.length,
  qualifiedLeads: input.leads.filter((lead) => lead.status !== "new").length,
  totalConsultations: input.consultations.length,
  totalPayments: input.payments.length,
  paidPayments: input.payments.filter((payment) => payment.status === "paid").length,
  activeProducts: input.products.filter((product) => product.stage === "active")
    .length,
  activeExperiments: input.experiments.filter(
    (experiment) => experiment.status === "running",
  ).length,
  trackedEvents: input.pageEvents.length,
});

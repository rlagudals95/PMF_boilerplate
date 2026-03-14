import type { ConsultationRequestInput } from "@pmf/core";

export const defaultConsultationRequestValues: ConsultationRequestInput = {
  name: "",
  phone: "",
  email: "",
  productInterest: "",
  consultationType: "call",
  preferredDate: "",
  rentalPeriod: "",
  budgetRange: "",
  notes: "",
  consent: false,
};

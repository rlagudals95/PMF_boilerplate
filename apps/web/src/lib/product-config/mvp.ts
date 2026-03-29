import type { FlowId, MvpShape, ProductConfig } from "./types";

export const allFlowIds = [
  "landing",
  "lead",
  "consultation",
  "payment",
  "admin",
  "auth",
] as const satisfies readonly FlowId[];

export const shapeRequiredFlowMap = {
  "lead-gen": ["landing", "lead", "admin"],
  consultation: ["landing", "consultation", "admin"],
  "comparison-routing": ["landing", "lead", "consultation", "admin"],
  "paid-intent": ["landing", "payment", "admin"],
  waitlist: ["landing", "lead", "admin"],
} as const satisfies Record<MvpShape, readonly FlowId[]>;

export const productMvpConfig = {
  shape: "comparison-routing",
  activeFlows: ["landing", "lead", "consultation", "admin"],
  deferredFlows: ["payment", "auth"],
  primaryRoute: "/",
  primaryCta: {
    label: "핵심 정보 남기기",
    href: "/#live-form",
  },
  navExposure: {
    landing: "primary",
    lead: "hidden",
    consultation: "primary",
    payment: "hidden",
    admin: "primary",
    auth: "hidden",
  },
  capabilities: {
    auth: "off",
    payment: "off",
  },
  admin: {
    highlightedMetrics: [
      "qualified_leads",
      "consult_requests",
      "total_leads",
    ],
  },
} satisfies ProductConfig["mvp"];

import { describe, expect, it } from "vitest";

import type { AppConfig } from "./app-config";
import type { ProductConfig } from "./product-config";
import {
  buildAdminMetricCards,
  buildLandingPrimaryActions,
  buildRuntimeEntries,
  buildStarterSnapshot,
  buildVisibleNavItems,
} from "./mvp-surface";
import { productConfig } from "./product-config";

const baseAppConfig: AppConfig = {
  appName: productConfig.appName,
  primaryProduct: productConfig.primaryProduct,
  description: productConfig.description,
  dataMode: "local-json",
  analyticsProviders: ["console", "store"],
  paymentProviders: [],
  authProviders: [],
  marketingProviders: [],
  errorLoggingProviders: ["console"],
};

function defineTestConfig(config: ProductConfig) {
  return config;
}

describe("mvp surface helpers", () => {
  it("hides non-active consultation, payment, and auth surfaces for lead-gen", () => {
    const leadGenConfig = defineTestConfig({
      ...productConfig,
      mvp: {
        ...productConfig.mvp,
        shape: "lead-gen",
        activeFlows: ["landing", "lead", "admin"],
        deferredFlows: ["consultation", "payment", "auth"],
        primaryRoute: "/",
        primaryCta: {
          label: "핵심 정보 남기기",
          href: "/#live-form",
        },
        navExposure: {
          landing: "primary",
          lead: "hidden",
          consultation: "hidden",
          payment: "hidden",
          admin: "primary",
          auth: "hidden",
        },
        capabilities: {
          auth: "off",
          payment: "off",
        },
        admin: {
          highlightedMetrics: ["qualified_leads", "total_leads"],
        },
      },
    });

    const navItems = buildVisibleNavItems(leadGenConfig, baseAppConfig);
    const runtimeEntries = buildRuntimeEntries(leadGenConfig, baseAppConfig);
    const actions = buildLandingPrimaryActions(leadGenConfig, baseAppConfig);

    expect(navItems.map((item) => item.flowId)).toEqual(["landing", "admin"]);
    expect(runtimeEntries.map((item) => item.flowId)).toEqual(["landing", "admin"]);
    expect(actions.map((item) => item.href)).not.toContain("/consult");
    expect(actions.map((item) => item.href)).not.toContain("/pay");
  });

  it("keeps consultation visible for comparison-routing while payment stays hidden", () => {
    const navItems = buildVisibleNavItems(productConfig, baseAppConfig);
    const runtimeEntries = buildRuntimeEntries(productConfig, baseAppConfig);

    expect(navItems.map((item) => item.flowId)).toContain("consultation");
    expect(navItems.map((item) => item.flowId)).not.toContain("payment");
    expect(runtimeEntries.map((item) => item.flowId)).toContain("consultation");
    expect(runtimeEntries.map((item) => item.flowId)).not.toContain("payment");
  });

  it("marks payment as setup required when the shape needs it but env is missing", () => {
    const paidIntentConfig = defineTestConfig({
      ...productConfig,
      mvp: {
        ...productConfig.mvp,
        shape: "paid-intent",
        activeFlows: ["landing", "payment", "admin"],
        deferredFlows: ["lead", "consultation", "auth"],
        primaryRoute: "/pay",
        primaryCta: {
          label: "결제 의사 확인하기",
          href: "/pay",
        },
        navExposure: {
          landing: "primary",
          lead: "hidden",
          consultation: "hidden",
          payment: "primary",
          admin: "primary",
          auth: "hidden",
        },
        capabilities: {
          auth: "off",
          payment: "primary",
        },
        admin: {
          highlightedMetrics: ["payment_attempts", "paid_payments"],
        },
      },
    });

    const runtimeEntries = buildRuntimeEntries(paidIntentConfig, baseAppConfig);
    const snapshot = buildStarterSnapshot(paidIntentConfig, baseAppConfig);

    expect(runtimeEntries.find((item) => item.flowId === "payment")).toMatchObject({
      setupRequired: true,
    });
    expect(snapshot.find((item) => item.label === "Capabilities")?.value).toContain(
      "payment: setup required",
    );
  });

  it("orders highlighted admin metrics first and hides inactive flow metrics", () => {
    const metricCards = buildAdminMetricCards(
      {
        totalLeads: 10,
        qualifiedLeads: 4,
        totalConsultations: 2,
        totalPayments: 3,
        paidPayments: 1,
        activeProducts: 1,
        activeExperiments: 2,
        trackedEvents: 99,
      },
      productConfig,
      baseAppConfig,
    );

    expect(metricCards.map((card) => card.key).slice(0, 3)).toEqual([
      "qualified_leads",
      "consult_requests",
      "total_leads",
    ]);
    expect(metricCards.map((card) => card.key)).not.toContain("payment_attempts");
  });
});

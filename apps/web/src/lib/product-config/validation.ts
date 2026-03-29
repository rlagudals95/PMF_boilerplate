import { allFlowIds, shapeRequiredFlowMap } from "./mvp";
import type { FlowId, ProductConfig, ProductCopyItem } from "./types";

function assertNonEmptyString(value: string, label: string) {
  if (!value.trim()) {
    throw new Error(`${label} must be a non-empty string.`);
  }
}

function assertMinItems(items: readonly unknown[], minimum: number, label: string) {
  if (items.length < minimum) {
    throw new Error(`${label} must include at least ${minimum} items.`);
  }
}

function assertCopyItems(
  items: readonly ProductCopyItem[],
  minimum: number,
  label: string,
) {
  assertMinItems(items, minimum, label);

  for (const [index, item] of items.entries()) {
    assertNonEmptyString(item.title, `${label}[${index}].title`);
    assertNonEmptyString(item.description, `${label}[${index}].description`);
  }
}

function assertStringItems(items: readonly string[], minimum: number, label: string) {
  assertMinItems(items, minimum, label);

  for (const [index, item] of items.entries()) {
    assertNonEmptyString(item, `${label}[${index}]`);
  }
}

function normalizeFlowIds(flows: readonly FlowId[]) {
  return [...new Set(flows)].sort();
}

function resolveHrefFlowId(href: string): FlowId | null {
  if (href.startsWith("/consult")) {
    return "consultation";
  }

  if (href.startsWith("/pay")) {
    return "payment";
  }

  if (href.startsWith("/auth")) {
    return "auth";
  }

  if (href.startsWith("/admin")) {
    return "admin";
  }

  if (href === "/#live-form") {
    return "lead";
  }

  if (href === "/" || href.startsWith("/#")) {
    return "landing";
  }

  return null;
}

export function validateProductConfig(config: ProductConfig) {
  assertNonEmptyString(config.appName, "appName");
  assertNonEmptyString(config.primaryProduct, "primaryProduct");
  assertNonEmptyString(config.description, "description");
  assertNonEmptyString(config.mvp.primaryCta.label, "mvp.primaryCta.label");
  assertNonEmptyString(config.mvp.primaryCta.href, "mvp.primaryCta.href");
  assertNonEmptyString(config.site.mark, "site.mark");
  assertNonEmptyString(config.site.headerTitle, "site.headerTitle");
  assertNonEmptyString(config.site.headerDescription, "site.headerDescription");
  assertNonEmptyString(config.site.footerDescription, "site.footerDescription");
  assertNonEmptyString(
    config.site.headerPrimaryCtaLabel,
    "site.headerPrimaryCtaLabel",
  );
  assertNonEmptyString(config.landing.productBadge, "landing.productBadge");

  for (const [variant, heroCopy] of Object.entries(config.landing.heroVariants)) {
    assertNonEmptyString(
      heroCopy.title,
      `landing.heroVariants.${variant}.title`,
    );
    assertNonEmptyString(
      heroCopy.emphasis,
      `landing.heroVariants.${variant}.emphasis`,
    );
    assertNonEmptyString(
      heroCopy.description,
      `landing.heroVariants.${variant}.description`,
    );
    assertNonEmptyString(
      heroCopy.badge,
      `landing.heroVariants.${variant}.badge`,
    );
  }

  assertCopyItems(config.landing.heroHighlights, 3, "landing.heroHighlights");

  assertNonEmptyString(config.leadForm.cardTitle, "leadForm.cardTitle");
  assertNonEmptyString(config.leadForm.description, "leadForm.description");
  assertNonEmptyString(
    config.leadForm.productInterestLabel,
    "leadForm.productInterestLabel",
  );
  assertNonEmptyString(
    config.leadForm.productInterestPlaceholder,
    "leadForm.productInterestPlaceholder",
  );
  assertNonEmptyString(config.leadForm.messageLabel, "leadForm.messageLabel");
  assertNonEmptyString(
    config.leadForm.messagePlaceholder,
    "leadForm.messagePlaceholder",
  );
  assertNonEmptyString(config.leadForm.consentLabel, "leadForm.consentLabel");
  assertNonEmptyString(config.leadForm.submitLabel, "leadForm.submitLabel");
  assertNonEmptyString(config.leadForm.pendingLabel, "leadForm.pendingLabel");

  assertNonEmptyString(
    config.consultation.sectionEyebrow,
    "consultation.sectionEyebrow",
  );
  assertNonEmptyString(
    config.consultation.sectionTitle,
    "consultation.sectionTitle",
  );
  assertNonEmptyString(
    config.consultation.sectionDescription,
    "consultation.sectionDescription",
  );
  assertCopyItems(
    config.consultation.benefitCards,
    3,
    "consultation.benefitCards",
  );
  assertNonEmptyString(config.consultation.formTitle, "consultation.formTitle");
  assertNonEmptyString(
    config.consultation.formDescription,
    "consultation.formDescription",
  );
  assertNonEmptyString(
    config.consultation.productInterestLabel,
    "consultation.productInterestLabel",
  );
  assertNonEmptyString(
    config.consultation.productInterestPlaceholder,
    "consultation.productInterestPlaceholder",
  );
  assertNonEmptyString(
    config.consultation.budgetLabel,
    "consultation.budgetLabel",
  );
  assertNonEmptyString(
    config.consultation.budgetPlaceholder,
    "consultation.budgetPlaceholder",
  );
  assertNonEmptyString(
    config.consultation.timelineLabel,
    "consultation.timelineLabel",
  );
  assertNonEmptyString(
    config.consultation.timelinePlaceholder,
    "consultation.timelinePlaceholder",
  );
  assertNonEmptyString(
    config.consultation.notesLabel,
    "consultation.notesLabel",
  );
  assertNonEmptyString(
    config.consultation.notesPlaceholder,
    "consultation.notesPlaceholder",
  );
  assertNonEmptyString(
    config.consultation.consentLabel,
    "consultation.consentLabel",
  );
  assertNonEmptyString(
    config.consultation.submitLabel,
    "consultation.submitLabel",
  );
  assertNonEmptyString(
    config.consultation.pendingLabel,
    "consultation.pendingLabel",
  );

  assertNonEmptyString(config.quality.primaryGoal, "quality.primaryGoal");
  assertStringItems(config.quality.trustSignals, 3, "quality.trustSignals");
  assertStringItems(config.quality.primaryMetrics, 2, "quality.primaryMetrics");
  assertMinItems(config.mvp.activeFlows, 1, "mvp.activeFlows");
  assertStringItems(
    config.mvp.admin.highlightedMetrics,
    2,
    "mvp.admin.highlightedMetrics",
  );

  const expectedActiveFlows = normalizeFlowIds(
    shapeRequiredFlowMap[config.mvp.shape],
  );
  const activeFlows = normalizeFlowIds(config.mvp.activeFlows);
  const extraFlows = activeFlows.filter(
    (flowId) => !expectedActiveFlows.includes(flowId),
  );

  if (config.mvp.capabilities.auth === "off" && extraFlows.includes("auth")) {
    throw new Error(
      "mvp.activeFlows must not include auth when mvp.capabilities.auth is off.",
    );
  }

  if (
    config.mvp.capabilities.payment === "off" &&
    extraFlows.includes("payment")
  ) {
    throw new Error(
      "mvp.activeFlows must not include payment when mvp.capabilities.payment is off.",
    );
  }

  const allowedExtraFlows = extraFlows.filter((flowId) => {
    if (flowId === "auth") {
      return config.mvp.capabilities.auth !== "off";
    }

    if (flowId === "payment") {
      return config.mvp.capabilities.payment !== "off";
    }

    return false;
  });

  if (
    expectedActiveFlows.length + allowedExtraFlows.length !== activeFlows.length ||
    !expectedActiveFlows.every((flowId) => activeFlows.includes(flowId))
  ) {
    throw new Error(
      `mvp.activeFlows must match the ${config.mvp.shape} recipe plus optional auth/payment capability flows.`,
    );
  }

  const unresolvedFlows = allFlowIds.filter(
    (flowId) =>
      !config.mvp.activeFlows.includes(flowId) &&
      !config.mvp.deferredFlows.includes(flowId),
  );

  const overlappingFlows = config.mvp.deferredFlows.filter((flowId) =>
    config.mvp.activeFlows.includes(flowId),
  );

  if (unresolvedFlows.length > 0 || overlappingFlows.length > 0) {
    throw new Error(
      "mvp.deferredFlows must be a non-overlapping complement of mvp.activeFlows.",
    );
  }

  const primaryRouteFlowId = resolveHrefFlowId(config.mvp.primaryRoute);
  if (!primaryRouteFlowId || !config.mvp.activeFlows.includes(primaryRouteFlowId)) {
    throw new Error("mvp.primaryRoute must point to an active flow.");
  }

  const primaryCtaFlowId = resolveHrefFlowId(config.mvp.primaryCta.href);
  if (!primaryCtaFlowId || !config.mvp.activeFlows.includes(primaryCtaFlowId)) {
    throw new Error("mvp.primaryCta.href must point to an active flow.");
  }

  if (
    config.mvp.capabilities.auth === "primary" &&
    !config.mvp.activeFlows.includes("auth")
  ) {
    throw new Error("mvp.capabilities.auth must be active when set to primary.");
  }

  if (
    config.mvp.capabilities.payment === "primary" &&
    !config.mvp.activeFlows.includes("payment")
  ) {
    throw new Error(
      "mvp.capabilities.payment must be active when set to primary.",
    );
  }

  for (const flowId of allFlowIds) {
    if (
      config.mvp.navExposure[flowId] === "primary" &&
      !config.mvp.activeFlows.includes(flowId)
    ) {
      throw new Error(
        `mvp.navExposure.${flowId} must be hidden when the flow is not active.`,
      );
    }
  }

  if (config.mvp.navExposure.lead !== "hidden") {
    throw new Error(
      "mvp.navExposure.lead must stay hidden because it has no standalone route.",
    );
  }
}

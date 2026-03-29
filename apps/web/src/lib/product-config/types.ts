export type ProductHeroVariant = "control" | "benefit";

export type ProductCopyItem = {
  title: string;
  description: string;
};

export type NonEmptyList<T> = [T, ...T[]];

export type FlowId =
  | "landing"
  | "lead"
  | "consultation"
  | "payment"
  | "admin"
  | "auth";
export type MvpShape =
  | "lead-gen"
  | "consultation"
  | "comparison-routing"
  | "paid-intent"
  | "waitlist";
export type SurfaceExposure = "primary" | "hidden";
export type CapabilityMode = "off" | "optional" | "primary";
export type PrimaryRoute = "/" | "/consult" | "/pay";
export type AdminMetricKey =
  | "total_leads"
  | "qualified_leads"
  | "consult_requests"
  | "payment_attempts"
  | "paid_payments"
  | "tracked_events"
  | "active_products"
  | "active_experiments";

export type ProductHeroCopy = {
  title: string;
  emphasis: string;
  description: string;
  badge: string;
};

export type ProductConfig = {
  appName: string;
  primaryProduct: string;
  description: string;
  mvp: {
    shape: MvpShape;
    activeFlows: NonEmptyList<FlowId>;
    deferredFlows: FlowId[];
    primaryRoute: PrimaryRoute;
    primaryCta: {
      label: string;
      href: string;
    };
    navExposure: Record<FlowId, SurfaceExposure>;
    capabilities: {
      auth: CapabilityMode;
      payment: CapabilityMode;
    };
    admin: {
      highlightedMetrics: NonEmptyList<AdminMetricKey>;
    };
  };
  site: {
    mark: string;
    headerTitle: string;
    headerDescription: string;
    footerDescription: string;
    headerPrimaryCtaLabel: string;
  };
  landing: {
    productBadge: string;
    heroVariants: Record<ProductHeroVariant, ProductHeroCopy>;
    heroHighlights: NonEmptyList<ProductCopyItem>;
  };
  leadForm: {
    cardTitle: string;
    description: string;
    productInterestLabel: string;
    productInterestPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    consentLabel: string;
    submitLabel: string;
    pendingLabel: string;
  };
  consultation: {
    sectionEyebrow: string;
    sectionTitle: string;
    sectionDescription: string;
    benefitCards: NonEmptyList<ProductCopyItem>;
    formTitle: string;
    formDescription: string;
    productInterestLabel: string;
    productInterestPlaceholder: string;
    budgetLabel: string;
    budgetPlaceholder: string;
    timelineLabel: string;
    timelinePlaceholder: string;
    notesLabel: string;
    notesPlaceholder: string;
    consentLabel: string;
    submitLabel: string;
    pendingLabel: string;
  };
  quality: {
    primaryGoal: string;
    trustSignals: NonEmptyList<string>;
    primaryMetrics: NonEmptyList<string>;
  };
};

export type ProductConfigBase = Pick<
  ProductConfig,
  "appName" | "primaryProduct" | "description"
>;

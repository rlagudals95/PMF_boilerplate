import { createProductConfig } from "./product-config/compose";
import { productConfigBase } from "./product-config/base";
import { productConsultationConfig } from "./product-config/consultation";
import { productLandingConfig } from "./product-config/landing";
import { productLeadFormConfig } from "./product-config/lead-form";
import { allFlowIds, productMvpConfig, shapeRequiredFlowMap } from "./product-config/mvp";
import { productQualityConfig } from "./product-config/quality";
import { productSiteConfig } from "./product-config/site";
import { validateProductConfig } from "./product-config/validation";

export type {
  AdminMetricKey,
  CapabilityMode,
  FlowId,
  MvpShape,
  PrimaryRoute,
  ProductConfig,
  SurfaceExposure,
} from "./product-config/types";

export { allFlowIds, shapeRequiredFlowMap, validateProductConfig };

export const productConfig = createProductConfig({
  ...productConfigBase,
  mvp: productMvpConfig,
  site: productSiteConfig,
  landing: productLandingConfig,
  leadForm: productLeadFormConfig,
  consultation: productConsultationConfig,
  quality: productQualityConfig,
});

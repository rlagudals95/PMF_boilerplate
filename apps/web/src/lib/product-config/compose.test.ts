import { describe, expect, it } from "vitest";

import { productConfig } from "../product-config";
import { createProductConfig } from "./compose";
import { productConfigBase } from "./base";
import { productConsultationConfig } from "./consultation";
import { productLandingConfig } from "./landing";
import { productLeadFormConfig } from "./lead-form";
import { productMvpConfig } from "./mvp";
import { productQualityConfig } from "./quality";
import { productSiteConfig } from "./site";

describe("createProductConfig", () => {
  it("assembles the same public runtime contract from sub-surfaces", () => {
    expect(
      createProductConfig({
        ...productConfigBase,
        mvp: productMvpConfig,
        site: productSiteConfig,
        landing: productLandingConfig,
        leadForm: productLeadFormConfig,
        consultation: productConsultationConfig,
        quality: productQualityConfig,
      }),
    ).toEqual(productConfig);
  });
});

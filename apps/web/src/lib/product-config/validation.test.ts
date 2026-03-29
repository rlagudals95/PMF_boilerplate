import { describe, expect, it } from "vitest";

import { productConfig } from "../product-config";
import { validateProductConfig } from "./validation";

describe("validateProductConfig module", () => {
  it("accepts the split public product config facade", () => {
    expect(() => validateProductConfig(productConfig)).not.toThrow();
  });

  it("keeps rejecting an inactive primary CTA flow", () => {
    expect(() =>
      validateProductConfig({
        ...productConfig,
        mvp: {
          ...productConfig.mvp,
          primaryCta: {
            label: "결제 시작",
            href: "/pay",
          },
        },
      }),
    ).toThrow(/mvp\.primaryCta\.href/i);
  });
});

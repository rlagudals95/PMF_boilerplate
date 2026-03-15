import { validateAbTestDefinitions } from "../validation";

describe("validateAbTestDefinitions", () => {
  it("rejects feature keys without the exp_ prefix", () => {
    expect(() =>
      validateAbTestDefinitions({
        independent: [
          {
            featureKey: "checkout_copy",
            variants: [{ value: "control", weight: 100 }],
          },
        ],
      }),
    ).toThrow('AB test feature keys must start with "exp_".');
  });

  it("rejects exclusive allocations above 100", () => {
    expect(() =>
      validateAbTestDefinitions({
        exclusive: [
          {
            featureKey: "exp_checkout_copy",
            trafficAllocation: 60,
            variants: [{ value: "control", weight: 100 }],
          },
          {
            featureKey: "exp_checkout_flow",
            trafficAllocation: 50,
            variants: [{ value: "control", weight: 100 }],
          },
        ],
      }),
    ).toThrow("Exclusive AB test traffic allocation must not exceed 100.");
  });
});

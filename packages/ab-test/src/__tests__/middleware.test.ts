import { applyAbTestMiddleware } from "../middleware";
import type {
  CookieEntry,
  CookieOptions,
  ExclusiveAbTestExperiment,
  IndependentAbTestExperiment,
} from "../types";

const createRequest = (entries: CookieEntry[] = []) => ({
  cookies: {
    getAll: () => entries,
  },
});

const createResponse = () => {
  const deleted: string[] = [];
  const setCalls: Array<{ name: string; value: string; options?: CookieOptions }> = [];

  return {
    response: {
      cookies: {
        delete(name: string) {
          deleted.push(name);
        },
        set(name: string, value: string, options?: CookieOptions) {
          setCalls.push({ name, value, options });
        },
      },
    },
    deleted,
    setCalls,
  };
};

describe("applyAbTestMiddleware", () => {
  it("assigns variants for missing independent experiments", () => {
    const experiments: IndependentAbTestExperiment[] = [
      {
        featureKey: "exp_checkout_copy",
        variants: [
          { value: "control", weight: 50 },
          { value: "benefit", weight: 50 },
        ],
      },
    ];
    const { response, setCalls } = createResponse();

    const result = applyAbTestMiddleware(
      createRequest(),
      response,
      { independent: experiments },
      () => 0.75,
    );

    expect(result.assignments).toEqual({
      exp_checkout_copy: "benefit",
    });
    expect(setCalls).toEqual([
      expect.objectContaining({
        name: "exp_checkout_copy",
        value: "benefit",
      }),
    ]);
  });

  it("cleans up disabled experiments", () => {
    const experiments: IndependentAbTestExperiment[] = [
      {
        featureKey: "exp_checkout_copy",
        enabled: false,
        variants: [{ value: "control", weight: 100 }],
      },
    ];
    const { response, deleted, setCalls } = createResponse();

    const result = applyAbTestMiddleware(
      createRequest([{ name: "exp_checkout_copy", value: "control" }]),
      response,
      { independent: experiments },
    );

    expect(result.assignments).toEqual({});
    expect(deleted).toEqual(["exp_checkout_copy"]);
    expect(setCalls).toHaveLength(0);
  });

  it("keeps at most one exclusive experiment assignment", () => {
    const experiments: ExclusiveAbTestExperiment[] = [
      {
        featureKey: "exp_checkout_flow",
        trafficAllocation: 50,
        variants: [{ value: "control", weight: 100 }],
      },
      {
        featureKey: "exp_checkout_layout",
        trafficAllocation: 50,
        variants: [{ value: "stacked", weight: 100 }],
      },
    ];
    const { response, deleted, setCalls } = createResponse();

    const result = applyAbTestMiddleware(
      createRequest([
        { name: "exp_checkout_flow", value: "control" },
        { name: "exp_checkout_layout", value: "stacked" },
      ]),
      response,
      { exclusive: experiments },
      () => 0.2,
    );

    expect(deleted).toEqual(["exp_checkout_flow", "exp_checkout_layout"]);
    expect(result.assignments).toEqual({
      exp_checkout_flow: "control",
    });
    expect(setCalls.at(-1)).toEqual(
      expect.objectContaining({
        name: "exp_checkout_flow",
        value: "control",
      }),
    );
  });
});

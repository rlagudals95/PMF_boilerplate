import { readAbTestAssignmentsFromCookieHeader } from "../client/read-ab-test-assignments";

describe("readAbTestAssignmentsFromCookieHeader", () => {
  it("filters assignments by known experiments when definitions are provided", () => {
    const assignments = readAbTestAssignmentsFromCookieHeader(
      "exp_checkout_copy=benefit; exp_checkout_flow=control; foo=bar",
      {
        independent: [
          {
            featureKey: "exp_checkout_copy",
            variants: [{ value: "benefit", weight: 100 }],
          },
        ],
      },
    );

    expect(assignments).toEqual({
      exp_checkout_copy: "benefit",
    });
  });
});

import { defineAbTestDefinitions, type AbTestAssignments } from "@pmf/ab-test";

export const heroCopyExperimentKey = "exp_landing_hero_copy";

export const appAbTestDefinitions = defineAbTestDefinitions({
  independent: [
    {
      featureKey: heroCopyExperimentKey,
      description: "Sample landing hero copy experiment",
      variants: [
        { value: "control", weight: 50 },
        { value: "benefit", weight: 50 },
      ],
    },
  ],
});

export type LandingHeroVariant =
  (typeof appAbTestDefinitions.independent)[number]["variants"][number]["value"];

export const getLandingHeroVariant = (
  assignments: AbTestAssignments,
): LandingHeroVariant => {
  const assigned = assignments[heroCopyExperimentKey];

  if (assigned === "benefit") {
    return "benefit";
  }

  return "control";
};

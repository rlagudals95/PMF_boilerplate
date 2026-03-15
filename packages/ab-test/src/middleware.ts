import { DEFAULT_COOKIE_MAX_AGE } from "./constants";
import { hasAssignedVariant, pickExclusiveExperiment, pickVariant } from "./assignment";
import { readAssignmentsFromCookieEntries } from "./cookies";
import type {
  AbTestDefinitions,
  ApplyAbTestResult,
  ExclusiveAbTestExperiment,
  IndependentAbTestExperiment,
  MiddlewareRequest,
  MiddlewareResponse,
} from "./types";
import { validateAbTestDefinitions } from "./validation";

const getCookieOptions = (
  experiment: ExclusiveAbTestExperiment | IndependentAbTestExperiment,
) => ({
  maxAge: experiment.cookie?.maxAge ?? DEFAULT_COOKIE_MAX_AGE,
  path: experiment.cookie?.path ?? "/",
  sameSite: experiment.cookie?.sameSite ?? "lax",
  secure: experiment.cookie?.secure,
});

const cleanupExperiment = (
  featureKey: string,
  assignments: Record<string, string>,
  response: MiddlewareResponse,
) => {
  delete assignments[featureKey];
  response.cookies.delete(featureKey);
};

const cleanExclusiveAssignments = (
  experiments: readonly ExclusiveAbTestExperiment[],
  assignments: Record<string, string>,
  response: MiddlewareResponse,
) => {
  const validExperiments: ExclusiveAbTestExperiment[] = [];

  for (const experiment of experiments) {
    const assignedValue = assignments[experiment.featureKey];

    if (experiment.enabled === false) {
      cleanupExperiment(experiment.featureKey, assignments, response);
      continue;
    }

    if (!assignedValue) {
      continue;
    }

    if (!hasAssignedVariant(experiment, assignedValue)) {
      cleanupExperiment(experiment.featureKey, assignments, response);
      continue;
    }

    validExperiments.push(experiment);
  }

  if (validExperiments.length <= 1) {
    return validExperiments[0];
  }

  for (const experiment of validExperiments) {
    cleanupExperiment(experiment.featureKey, assignments, response);
  }

  return undefined;
};

export const applyAbTestMiddleware = <
  Request extends MiddlewareRequest,
  Response extends MiddlewareResponse,
>(
  request: Request,
  response: Response,
  definitions: AbTestDefinitions,
  random: () => number = Math.random,
): ApplyAbTestResult<Response> => {
  validateAbTestDefinitions(definitions);

  const assignments = readAssignmentsFromCookieEntries(request.cookies.getAll());

  for (const experiment of definitions.independent ?? []) {
    const assignedValue = assignments[experiment.featureKey];

    if (experiment.enabled === false) {
      cleanupExperiment(experiment.featureKey, assignments, response);
      continue;
    }

    if (hasAssignedVariant(experiment, assignedValue)) {
      continue;
    }

    const nextValue = pickVariant(experiment.variants, random());
    assignments[experiment.featureKey] = nextValue;
    response.cookies.set(experiment.featureKey, nextValue, getCookieOptions(experiment));
  }

  const enabledExclusiveExperiments = (definitions.exclusive ?? []).filter(
    (experiment) => experiment.enabled !== false,
  );
  const currentExclusiveExperiment = cleanExclusiveAssignments(
    definitions.exclusive ?? [],
    assignments,
    response,
  );

  if (!currentExclusiveExperiment && enabledExclusiveExperiments.length > 0) {
    const selectedExperiment = pickExclusiveExperiment(enabledExclusiveExperiments, random());

    if (selectedExperiment) {
      const nextValue = pickVariant(selectedExperiment.variants, random());
      assignments[selectedExperiment.featureKey] = nextValue;
      response.cookies.set(
        selectedExperiment.featureKey,
        nextValue,
        getCookieOptions(selectedExperiment),
      );
    }
  }

  return {
    response,
    assignments,
  };
};

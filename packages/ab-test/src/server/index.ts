import { collectFeatureKeys, readAssignmentsFromCookieEntries } from "../cookies";
import type { AbTestDefinitions, CookieReader } from "../types";

export const getAbTestAssignments = (
  cookies: CookieReader,
  definitions?: AbTestDefinitions,
) => readAssignmentsFromCookieEntries(cookies.getAll(), collectFeatureKeys(definitions));

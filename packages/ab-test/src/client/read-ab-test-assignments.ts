import { collectFeatureKeys, parseCookieHeader, readAssignmentsFromCookieEntries } from "../cookies";
import type { AbTestDefinitions } from "../types";

export const readAbTestAssignmentsFromCookieHeader = (
  cookieHeader: string,
  definitions?: AbTestDefinitions,
) => readAssignmentsFromCookieEntries(parseCookieHeader(cookieHeader), collectFeatureKeys(definitions));

export const readAbTestAssignments = (definitions?: AbTestDefinitions) => {
  if (typeof document === "undefined") {
    return {};
  }

  return readAbTestAssignmentsFromCookieHeader(document.cookie, definitions);
};

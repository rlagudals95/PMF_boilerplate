import { AB_TEST_COOKIE_PREFIX } from "./constants";
import type { AbTestAssignments, AbTestDefinitions, CookieEntry } from "./types";

const normalizeEntries = (entries: readonly CookieEntry[]) =>
  entries.filter((entry) => entry.name.startsWith(AB_TEST_COOKIE_PREFIX));

export const collectFeatureKeys = (definitions?: AbTestDefinitions) =>
  definitions
    ? [
        ...(definitions.independent ?? []).map((experiment) => experiment.featureKey),
        ...(definitions.exclusive ?? []).map((experiment) => experiment.featureKey),
      ]
    : undefined;

export const readAssignmentsFromCookieEntries = (
  entries: readonly CookieEntry[],
  featureKeys?: readonly string[],
) => {
  const filters = featureKeys ? new Set(featureKeys) : null;

  return normalizeEntries(entries).reduce<AbTestAssignments>((assignments, entry) => {
    if (filters && !filters.has(entry.name)) {
      return assignments;
    }

    assignments[entry.name] = entry.value;
    return assignments;
  }, {});
};

export const parseCookieHeader = (cookieHeader: string) => {
  if (!cookieHeader.trim()) {
    return [];
  }

  return cookieHeader.split(";").reduce<CookieEntry[]>((entries, segment) => {
    const [rawName, ...rawValueParts] = segment.trim().split("=");
    if (!rawName) {
      return entries;
    }

    entries.push({
      name: decodeURIComponent(rawName),
      value: decodeURIComponent(rawValueParts.join("=")),
    });

    return entries;
  }, []);
};

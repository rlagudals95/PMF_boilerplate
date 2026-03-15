"use client";

import { useEffect, useState } from "react";

import type { AbTestAssignments, AbTestDefinitions } from "../types";
import { readAbTestAssignments } from "./read-ab-test-assignments";

const buildDefinitionSignature = (definitions?: AbTestDefinitions) =>
  JSON.stringify({
    independent: (definitions?.independent ?? []).map((experiment) => experiment.featureKey),
    exclusive: (definitions?.exclusive ?? []).map((experiment) => experiment.featureKey),
  });

export const useAbTestAssignments = (definitions?: AbTestDefinitions) => {
  const [assignments, setAssignments] = useState<AbTestAssignments>({});
  const definitionSignature = buildDefinitionSignature(definitions);

  useEffect(() => {
    setAssignments(readAbTestAssignments(definitions));
  }, [definitionSignature]);

  return {
    assignments,
  };
};

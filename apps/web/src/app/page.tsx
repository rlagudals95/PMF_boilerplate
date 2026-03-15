import { cookies } from "next/headers";

import { getAbTestAssignments } from "@pmf/ab-test/server";

import {
  appAbTestDefinitions,
  getLandingHeroVariant,
} from "@/modules/landing/model/hero-copy-experiment";
import LandingPage from "@/modules/landing/ui/landing-page";

export default async function HomePage() {
  const assignments = getAbTestAssignments(await cookies(), appAbTestDefinitions);
  const heroVariant = getLandingHeroVariant(assignments);

  return <LandingPage heroVariant={heroVariant} />;
}

export * from "./middleware";
export * from "./types";
export * from "./validation";

import type { AbTestDefinitions } from "./types";

export const defineAbTestDefinitions = <const T extends AbTestDefinitions>(definitions: T) =>
  definitions;

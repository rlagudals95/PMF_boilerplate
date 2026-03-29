import { validateProductConfig } from "./validation";
import type { ProductConfig } from "./types";

export function createProductConfig(config: ProductConfig) {
  validateProductConfig(config);
  return config;
}

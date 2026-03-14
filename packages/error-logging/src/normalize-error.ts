import type { NormalizedError } from "./types";

const stringifyFallback = (value: unknown) => {
  if (typeof value === "string") {
    return value;
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

export const normalizeError = (error: unknown): NormalizedError | undefined => {
  if (error === undefined) {
    return undefined;
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    message: stringifyFallback(error),
  };
};

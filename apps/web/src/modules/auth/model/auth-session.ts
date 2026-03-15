import type { AuthProviderId } from "./provider-config";

export type AuthKitSession = {
  provider: AuthProviderId;
  userId: string;
  email?: string;
  displayName?: string;
  avatarUrl?: string;
  loggedInAt: string;
};

const optionalString = (value: unknown) => {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();

  return trimmed ? trimmed : undefined;
};

export const createAuthKitSession = (input: {
  provider: AuthProviderId;
  userId: string;
  email?: string;
  displayName?: string;
  avatarUrl?: string;
  loggedInAt?: string;
}): AuthKitSession => ({
  provider: input.provider,
  userId: input.userId,
  email: optionalString(input.email),
  displayName: optionalString(input.displayName),
  avatarUrl: optionalString(input.avatarUrl),
  loggedInAt: input.loggedInAt ?? new Date().toISOString(),
});

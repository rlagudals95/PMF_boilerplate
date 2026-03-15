import type { AuthProviderId } from "./provider-config";

export const defaultAuthNextPath = "/auth";

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

export const sanitizeNextPath = (value?: string) => {
  const trimmed = value?.trim();

  if (!trimmed || !trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return defaultAuthNextPath;
  }

  return trimmed;
};

export const resolveSiteOrigin = () => {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredSiteUrl) {
    return trimTrailingSlash(configuredSiteUrl);
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "http://localhost:3000";
};

export const buildAuthCallbackUrl = ({
  origin,
  provider,
  nextPath,
}: {
  origin: string;
  provider: AuthProviderId;
  nextPath?: string;
}) => {
  const url = new URL("/auth/callback", `${trimTrailingSlash(origin)}/`);

  url.searchParams.set("provider", provider);
  url.searchParams.set("next", sanitizeNextPath(nextPath));

  return url.toString();
};

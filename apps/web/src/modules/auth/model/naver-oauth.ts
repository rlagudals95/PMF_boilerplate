import { buildAuthCallbackUrl } from "./auth-routes";
import { createAuthKitSession, type AuthKitSession } from "./auth-session";

const NAVER_AUTHORIZE_URL = "https://nid.naver.com/oauth2.0/authorize";
const NAVER_TOKEN_URL = "https://nid.naver.com/oauth2.0/token";
const NAVER_PROFILE_URL = "https://openapi.naver.com/v1/nid/me";

type NaverEnv = Record<string, string | undefined> & {
  NEXT_PUBLIC_NAVER_CLIENT_ID?: string;
  NAVER_CLIENT_SECRET?: string;
  NEXT_PUBLIC_SITE_URL?: string;
};

const optionalString = (value: unknown) => {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();

  return trimmed ? trimmed : undefined;
};

const asRecord = (value: unknown) =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : {};

export const readNaverPublicConfig = (env: NaverEnv = process.env) => {
  const clientId = optionalString(env.NEXT_PUBLIC_NAVER_CLIENT_ID);

  if (!clientId) {
    return null;
  }

  return {
    clientId,
  };
};

export const readNaverServerConfig = (env: NaverEnv = process.env) => {
  const clientId = optionalString(env.NEXT_PUBLIC_NAVER_CLIENT_ID);
  const clientSecret = optionalString(env.NAVER_CLIENT_SECRET);
  const siteUrl = optionalString(env.NEXT_PUBLIC_SITE_URL);

  if (!clientId || !clientSecret || !siteUrl) {
    return null;
  }

  return {
    clientId,
    clientSecret,
    siteUrl,
  };
};

export const buildNaverAuthorizationUrl = ({
  clientId,
  siteUrl,
  state,
  nextPath,
}: {
  clientId: string;
  siteUrl: string;
  state: string;
  nextPath?: string;
}) => {
  const url = new URL(NAVER_AUTHORIZE_URL);

  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", buildAuthCallbackUrl({
    origin: siteUrl,
    provider: "naver",
    nextPath,
  }));
  url.searchParams.set("state", state);

  return url.toString();
};

export const exchangeNaverAuthorizationCode = async (
  input: {
    code: string;
    state: string;
  },
  env: NaverEnv = process.env,
): Promise<AuthKitSession> => {
  const config = readNaverServerConfig(env);

  if (!config) {
    throw new Error(
      "네이버 로그인 환경 변수가 설정되어 있지 않습니다. NEXT_PUBLIC_NAVER_CLIENT_ID, NAVER_CLIENT_SECRET, NEXT_PUBLIC_SITE_URL을 확인해 주세요.",
    );
  }

  const tokenBody = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code: input.code,
    state: input.state,
  });

  const tokenResponse = await fetch(NAVER_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: tokenBody.toString(),
    cache: "no-store",
  });

  const tokenPayload = asRecord(await tokenResponse.json().catch(() => null));
  const accessToken = optionalString(tokenPayload.access_token);

  if (!tokenResponse.ok || !accessToken) {
    throw new Error(
      optionalString(tokenPayload.error_description) ??
        optionalString(tokenPayload.error) ??
        "네이버 access token 발급에 실패했습니다.",
    );
  }

  const profileResponse = await fetch(NAVER_PROFILE_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  const profilePayload = asRecord(await profileResponse.json().catch(() => null));
  const profile = asRecord(profilePayload.response);
  const userId = optionalString(profile.id);

  if (!profileResponse.ok || !userId) {
    throw new Error("네이버 사용자 프로필 조회에 실패했습니다.");
  }

  return createAuthKitSession({
    provider: "naver",
    userId,
    email: optionalString(profile.email),
    displayName:
      optionalString(profile.name) ??
      optionalString(profile.nickname) ??
      optionalString(profile.email),
    avatarUrl: optionalString(profile.profile_image),
  });
};

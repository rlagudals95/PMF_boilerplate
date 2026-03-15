export type AuthProviderId = "google" | "kakao" | "naver";

export type AuthProviderStatus = {
  id: AuthProviderId;
  label: string;
  kind: "supabase" | "oauth";
  isEnabled: boolean;
  setupHint?: string;
};

type AuthProviderEnv = Record<string, string | undefined> & {
  NEXT_PUBLIC_SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
  NEXT_PUBLIC_AUTH_GOOGLE_ENABLED?: string;
  NEXT_PUBLIC_AUTH_KAKAO_ENABLED?: string;
  NEXT_PUBLIC_NAVER_CLIENT_ID?: string;
  NAVER_CLIENT_SECRET?: string;
};

const optionalEnv = (value?: string) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

const isEnabledFlag = (value?: string) => optionalEnv(value) === "true";

export const getAuthProviderStatuses = (
  env: AuthProviderEnv = process.env,
): AuthProviderStatus[] => {
  const hasSupabaseClient = Boolean(
    optionalEnv(env.NEXT_PUBLIC_SUPABASE_URL) &&
      optionalEnv(env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  );
  const hasNaverConfig = Boolean(
    optionalEnv(env.NEXT_PUBLIC_NAVER_CLIENT_ID) &&
      optionalEnv(env.NAVER_CLIENT_SECRET),
  );

  return [
    {
      id: "google",
      label: "Google",
      kind: "supabase",
      isEnabled: hasSupabaseClient && isEnabledFlag(env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED),
      setupHint: hasSupabaseClient
        ? "NEXT_PUBLIC_AUTH_GOOGLE_ENABLED=true 와 Supabase Google provider 설정이 필요합니다."
        : "NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY가 필요합니다.",
    },
    {
      id: "kakao",
      label: "Kakao",
      kind: "supabase",
      isEnabled: hasSupabaseClient && isEnabledFlag(env.NEXT_PUBLIC_AUTH_KAKAO_ENABLED),
      setupHint: hasSupabaseClient
        ? "NEXT_PUBLIC_AUTH_KAKAO_ENABLED=true 와 Supabase Kakao provider 설정이 필요합니다."
        : "NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY가 필요합니다.",
    },
    {
      id: "naver",
      label: "Naver",
      kind: "oauth",
      isEnabled: hasNaverConfig,
      setupHint: "NEXT_PUBLIC_NAVER_CLIENT_ID / NAVER_CLIENT_SECRET 설정이 필요합니다.",
    },
  ];
};

export const getEnabledAuthProviderNames = (
  env: AuthProviderEnv = process.env,
): AuthProviderId[] =>
  getAuthProviderStatuses(env)
    .filter((provider) => provider.isEnabled)
    .map((provider) => provider.id);

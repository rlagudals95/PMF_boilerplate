export const appConfig = {
  appName: "PMF Boilerplate",
  primaryProduct: "모두의렌탈",
  description:
    "여러 사이드 프로젝트에서 PMF를 빠르게 탐색하기 위한 랜딩, 리드 캡처, 상담 요청, 실험 운영 기본 골격",
  dataMode: process.env.DATABASE_URL ? "postgres" : "local-json",
  analyticsProviders: [
    "console",
    "store",
    ...(process.env.MIXPANEL_PROJECT_TOKEN ? ["mixpanel"] : []),
  ],
  paymentProviders: [
    ...(process.env.TOSS_PAYMENTS_API_KEY ? ["toss"] : []),
  ],
  authProviders: [
    ...(process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED === "true"
      ? ["google"]
      : []),
    ...(process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_AUTH_KAKAO_ENABLED === "true"
      ? ["kakao"]
      : []),
    ...(process.env.NEXT_PUBLIC_NAVER_CLIENT_ID && process.env.NAVER_CLIENT_SECRET
      ? ["naver"]
      : []),
  ],
  marketingProviders: [
    ...(process.env.NEXT_PUBLIC_META_PIXEL_ID ? ["meta-pixel"] : []),
    ...(process.env.NEXT_PUBLIC_KAKAO_PIXEL_ID ? ["kakao-pixel"] : []),
    ...(process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ? ["google-ads"] : []),
  ],
  errorLoggingProviders: ["console"],
};

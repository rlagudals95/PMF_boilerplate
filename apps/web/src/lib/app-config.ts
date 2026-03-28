import { productConfig } from "@/lib/product-config";

export type AppConfig = {
  appName: string;
  primaryProduct: string;
  description: string;
  dataMode: "postgres" | "local-json";
  analyticsProviders: string[];
  paymentProviders: string[];
  authProviders: string[];
  marketingProviders: string[];
  errorLoggingProviders: string[];
};

export const appConfig: AppConfig = {
  appName: productConfig.appName,
  primaryProduct: productConfig.primaryProduct,
  description: productConfig.description,
  dataMode: process.env.DATABASE_URL ? "postgres" : "local-json",
  analyticsProviders: [
    "console",
    "store",
    ...(process.env.MIXPANEL_PROJECT_TOKEN ? ["mixpanel"] : []),
  ],
  paymentProviders: [...(process.env.TOSS_PAYMENTS_API_KEY ? ["toss"] : [])],
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
    ...(process.env.NEXT_PUBLIC_NAVER_CLIENT_ID &&
    process.env.NAVER_CLIENT_SECRET
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

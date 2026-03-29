export type AppConfig = {
  serviceName: string;
  dataMode: "postgres" | "local-json";
  analyticsProviders: string[];
  errorLoggingProviders: string[];
};

export const getAppConfig = (): AppConfig => ({
  serviceName: "pmf-api",
  dataMode: process.env.DATABASE_URL ? "postgres" : "local-json",
  analyticsProviders: [
    "console",
    "store",
    ...(process.env.MIXPANEL_PROJECT_TOKEN ? ["mixpanel"] : []),
  ],
  errorLoggingProviders: ["console"],
});

import { afterEach, describe, expect, it } from "vitest";

import { getAppConfig } from "./app-config";

const previousDatabaseUrl = process.env.DATABASE_URL;
const previousMixpanelProjectToken = process.env.MIXPANEL_PROJECT_TOKEN;

afterEach(() => {
  if (previousDatabaseUrl) {
    process.env.DATABASE_URL = previousDatabaseUrl;
  } else {
    delete process.env.DATABASE_URL;
  }

  if (previousMixpanelProjectToken) {
    process.env.MIXPANEL_PROJECT_TOKEN = previousMixpanelProjectToken;
  } else {
    delete process.env.MIXPANEL_PROJECT_TOKEN;
  }
});

describe("getAppConfig", () => {
  it("returns local-json mode when DATABASE_URL is absent", () => {
    delete process.env.DATABASE_URL;
    delete process.env.MIXPANEL_PROJECT_TOKEN;

    expect(getAppConfig()).toEqual({
      serviceName: "pmf-api",
      dataMode: "local-json",
      analyticsProviders: ["console", "store"],
      errorLoggingProviders: ["console"],
    });
  });

  it("returns postgres mode and optional analytics providers when DATABASE_URL is present", () => {
    process.env.DATABASE_URL =
      "postgresql://postgres:postgres@127.0.0.1:5432/pmf_boilerplate";
    process.env.MIXPANEL_PROJECT_TOKEN = "test_project_token";

    expect(getAppConfig()).toEqual({
      serviceName: "pmf-api",
      dataMode: "postgres",
      analyticsProviders: ["console", "store", "mixpanel"],
      errorLoggingProviders: ["console"],
    });
  });
});

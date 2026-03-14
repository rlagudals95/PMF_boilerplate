import { NextResponse } from "next/server";

import {
  listExperiments,
  listLeads,
  listPayments,
} from "@pmf/db";

import { appConfig } from "@/lib/app-config";
import { appErrorLogger } from "@/lib/error-logging";

export async function GET() {
  try {
    const [leads, experiments, payments] = await Promise.all([
      listLeads(),
      listExperiments(),
      listPayments(),
    ]);

    return NextResponse.json({
      status: "ok",
      app: appConfig.appName,
      dataMode: appConfig.dataMode,
      analyticsProviders: appConfig.analyticsProviders,
      paymentProviders: appConfig.paymentProviders,
      marketingProviders: appConfig.marketingProviders,
      errorLoggingProviders: appConfig.errorLoggingProviders,
      counts: {
        leads: leads.length,
        experiments: experiments.length,
        payments: payments.length,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    await appErrorLogger.report({
      source: "route.health.GET",
      message: "Health check failed",
      error,
      context: {
        path: "/health",
      },
    });

    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error ? error.message : "Unknown health check failure",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

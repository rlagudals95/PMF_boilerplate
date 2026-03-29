import { Controller, Get, InternalServerErrorException } from "@nestjs/common";
import { listExperiments, listLeads, listPayments } from "@pmf/db";

import { appConfig } from "../../lib/config/app-config";
import { appErrorLogger } from "../../lib/app-error-logging";

@Controller("health")
export class HealthController {
  @Get()
  async getHealth() {
    try {
      const [leads, experiments, payments] = await Promise.all([
        listLeads(),
        listExperiments(),
        listPayments(),
      ]);

      return {
        status: "ok",
        service: appConfig.serviceName,
        dataMode: appConfig.dataMode,
        analyticsProviders: appConfig.analyticsProviders,
        errorLoggingProviders: appConfig.errorLoggingProviders,
        counts: {
          leads: leads.length,
          experiments: experiments.length,
          payments: payments.length,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      await appErrorLogger.report({
        source: "api.health.getHealth",
        message: "API health check failed",
        error,
        context: {
          dataMode: appConfig.dataMode,
        },
      });

      throw new InternalServerErrorException({
        status: "error",
        message:
          error instanceof Error ? error.message : "Unknown health check failure",
        dataMode: appConfig.dataMode,
        timestamp: new Date().toISOString(),
      });
    }
  }
}

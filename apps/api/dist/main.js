var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
var __decorateParam = (index, decorator) => (target, key) => decorator(target, key, index);

// src/main.ts
import "reflect-metadata";
import { NestFactory } from "@nestjs/core";

// src/app.module.ts
import { Module as Module4 } from "@nestjs/common";

// src/modules/consultation/consultation.module.ts
import { Module } from "@nestjs/common";

// src/modules/consultation/application/submit-consultation.use-case.ts
import { Injectable } from "@nestjs/common";
import {
  createConsultationRequestFromInput,
  createLeadFromInput
} from "@pmf/core";
import { createLeadWithConsultationRequest } from "@pmf/db";

// src/lib/app-analytics.ts
import {
  ConsoleAnalyticsAdapter,
  createAnalytics,
  MixpanelAnalyticsAdapter
} from "@pmf/analytics";
import {
  createPageEvent as buildPageEventRecord
} from "@pmf/core";
import { createPageEvent as persistPageEvent } from "@pmf/db";
var StoreAnalyticsAdapter = class {
  constructor() {
    this.name = "store";
    this.required = true;
  }
  async track(event) {
    const record = buildPageEventRecord({
      eventName: event.eventName,
      path: event.path,
      sessionId: event.sessionId,
      leadId: event.leadId,
      experimentId: event.experimentId,
      properties: event.properties,
      occurredAt: event.occurredAt
    });
    await persistPageEvent(record);
  }
};
var adapters = [
  new ConsoleAnalyticsAdapter(),
  new StoreAnalyticsAdapter()
];
if (process.env.MIXPANEL_PROJECT_TOKEN) {
  adapters.push(
    new MixpanelAnalyticsAdapter({
      projectToken: process.env.MIXPANEL_PROJECT_TOKEN,
      apiHost: process.env.MIXPANEL_API_HOST,
      debug: process.env.MIXPANEL_DEBUG === "true"
    })
  );
}
var appAnalytics = createAnalytics(adapters);

// src/lib/app-error-logging.ts
import {
  ConsoleErrorLoggingAdapter,
  createErrorLogger
} from "@pmf/error-logging";
var appErrorLogger = createErrorLogger([
  new ConsoleErrorLoggingAdapter()
]);

// src/modules/consultation/application/submit-consultation.use-case.ts
var submitConsultationFailureMessage = "\uC0C1\uB2F4 \uC694\uCCAD \uC811\uC218 \uC911 \uBB38\uC81C\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4. \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.";
var SubmitConsultationUseCase = class {
  async execute(input, analyticsContext) {
    try {
      const lead = createLeadFromInput({
        name: input.name,
        phone: input.phone,
        email: input.email,
        productInterest: input.productInterest,
        message: input.notes,
        source: "consult_page",
        consent: true
      });
      const consultationRequest = createConsultationRequestFromInput(input, lead.id);
      await createLeadWithConsultationRequest(lead, consultationRequest);
      try {
        await appAnalytics.track({
          eventName: "consultation_requested",
          path: "/consult",
          sessionId: analyticsContext?.sessionId,
          leadId: lead.id,
          properties: {
            consultationType: consultationRequest.consultationType,
            budgetRange: consultationRequest.budgetRange,
            rentalPeriod: consultationRequest.rentalPeriod
          }
        });
      } catch (error) {
        await appErrorLogger.report({
          source: "api.consultation.submitConsultation.analytics",
          message: "Consultation request was saved but analytics tracking failed",
          error,
          level: "warning",
          context: {
            consultationRequestId: consultationRequest.id,
            leadId: lead.id,
            hasSessionId: Boolean(analyticsContext?.sessionId)
          }
        });
      }
      return {
        ok: true,
        message: "\uC0C1\uB2F4 \uC694\uCCAD\uC774 \uC811\uC218\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uC120\uD638\uD55C \uBC29\uC2DD\uC73C\uB85C \uC5F0\uB77D\uB4DC\uB9B4\uAC8C\uC694."
      };
    } catch (error) {
      await appErrorLogger.report({
        source: "api.consultation.submitConsultation",
        message: "Consultation request submission failed",
        error,
        context: {
          hasSessionId: Boolean(analyticsContext?.sessionId)
        }
      });
      return {
        ok: false,
        message: submitConsultationFailureMessage
      };
    }
  }
};
SubmitConsultationUseCase = __decorateClass([
  Injectable()
], SubmitConsultationUseCase);

// src/modules/consultation/consultation.controller.ts
import {
  Controller,
  Headers,
  HttpCode,
  Inject,
  InternalServerErrorException,
  Post
} from "@nestjs/common";
import { Body } from "@nestjs/common";

// src/shared/pipes/zod-validation.pipe.ts
import {
  BadRequestException,
  Injectable as Injectable2
} from "@nestjs/common";
var ZodValidationPipe = class {
  constructor(schema) {
    this.schema = schema;
  }
  transform(value) {
    const parsed = this.schema.safeParse(value);
    if (!parsed.success) {
      throw new BadRequestException({
        ok: false,
        message: "\uC785\uB825\uAC12\uC744 \uB2E4\uC2DC \uD655\uC778\uD574 \uC8FC\uC138\uC694.",
        errors: parsed.error.flatten().fieldErrors
      });
    }
    return parsed.data;
  }
};
ZodValidationPipe = __decorateClass([
  Injectable2()
], ZodValidationPipe);

// src/modules/consultation/dto/submit-consultation.request.ts
import {
  consultationRequestInputSchema
} from "@pmf/core";

// src/modules/consultation/consultation.controller.ts
var ConsultationController = class {
  constructor(submitConsultationUseCase) {
    this.submitConsultationUseCase = submitConsultationUseCase;
  }
  async createConsultationRequest(input, sessionId) {
    const result = await this.submitConsultationUseCase.execute(input, {
      sessionId
    });
    if (!result.ok) {
      throw new InternalServerErrorException(result);
    }
    return result;
  }
};
__decorateClass([
  Post(),
  HttpCode(201),
  __decorateParam(0, Body(new ZodValidationPipe(consultationRequestInputSchema))),
  __decorateParam(1, Headers("x-pmf-session-id"))
], ConsultationController.prototype, "createConsultationRequest", 1);
ConsultationController = __decorateClass([
  Controller("consultations"),
  __decorateParam(0, Inject(SubmitConsultationUseCase))
], ConsultationController);

// src/modules/consultation/consultation.module.ts
var ConsultationModule = class {
};
ConsultationModule = __decorateClass([
  Module({
    controllers: [ConsultationController],
    providers: [SubmitConsultationUseCase]
  })
], ConsultationModule);

// src/modules/health/health.module.ts
import { Module as Module2 } from "@nestjs/common";

// src/modules/health/health.controller.ts
import { Controller as Controller2, Get, InternalServerErrorException as InternalServerErrorException2 } from "@nestjs/common";
import { listExperiments, listLeads, listPayments } from "@pmf/db";

// src/lib/config/app-config.ts
var appConfig = {
  serviceName: "pmf-api",
  dataMode: process.env.DATABASE_URL ? "postgres" : "local-json",
  analyticsProviders: [
    "console",
    "store",
    ...process.env.MIXPANEL_PROJECT_TOKEN ? ["mixpanel"] : []
  ],
  errorLoggingProviders: ["console"]
};

// src/modules/health/health.controller.ts
var HealthController = class {
  async getHealth() {
    try {
      const [leads, experiments, payments] = await Promise.all([
        listLeads(),
        listExperiments(),
        listPayments()
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
          payments: payments.length
        },
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
    } catch (error) {
      await appErrorLogger.report({
        source: "api.health.getHealth",
        message: "API health check failed",
        error,
        context: {
          dataMode: appConfig.dataMode
        }
      });
      throw new InternalServerErrorException2({
        status: "error",
        message: error instanceof Error ? error.message : "Unknown health check failure",
        dataMode: appConfig.dataMode,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
  }
};
__decorateClass([
  Get()
], HealthController.prototype, "getHealth", 1);
HealthController = __decorateClass([
  Controller2("health")
], HealthController);

// src/modules/health/health.module.ts
var HealthModule = class {
};
HealthModule = __decorateClass([
  Module2({
    controllers: [HealthController]
  })
], HealthModule);

// src/modules/lead/lead.module.ts
import { Module as Module3 } from "@nestjs/common";

// src/modules/lead/lead.controller.ts
import {
  Controller as Controller3,
  Headers as Headers2,
  HttpCode as HttpCode2,
  Inject as Inject2,
  InternalServerErrorException as InternalServerErrorException3,
  Post as Post2
} from "@nestjs/common";
import { Body as Body2 } from "@nestjs/common";

// src/modules/lead/application/submit-lead.use-case.ts
import { Injectable as Injectable3 } from "@nestjs/common";
import { createLeadFromInput as createLeadFromInput2 } from "@pmf/core";
import { createLead } from "@pmf/db";
var submitLeadFailureMessage = "\uBB38\uC758 \uC811\uC218 \uC911 \uBB38\uC81C\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4. \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.";
var SubmitLeadUseCase = class {
  async execute(input, analyticsContext) {
    try {
      const lead = createLeadFromInput2(input);
      await createLead(lead);
      try {
        await appAnalytics.track({
          eventName: "lead_form_submitted",
          path: "/",
          sessionId: analyticsContext?.sessionId,
          leadId: lead.id,
          properties: {
            source: lead.source,
            productInterest: lead.productInterest
          }
        });
      } catch (error) {
        await appErrorLogger.report({
          source: "api.lead.submitLead.analytics",
          message: "Lead was saved but analytics tracking failed",
          error,
          level: "warning",
          context: {
            leadId: lead.id,
            hasSessionId: Boolean(analyticsContext?.sessionId)
          }
        });
      }
      return {
        ok: true,
        message: "\uBB38\uC758\uAC00 \uC811\uC218\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uBE60\uB974\uAC8C \uAC80\uD1A0 \uD6C4 \uC5F0\uB77D\uB4DC\uB9B4\uAC8C\uC694."
      };
    } catch (error) {
      await appErrorLogger.report({
        source: "api.lead.submitLead",
        message: "Lead submission failed",
        error,
        context: {
          hasSessionId: Boolean(analyticsContext?.sessionId)
        }
      });
      return {
        ok: false,
        message: submitLeadFailureMessage
      };
    }
  }
};
SubmitLeadUseCase = __decorateClass([
  Injectable3()
], SubmitLeadUseCase);

// src/modules/lead/dto/submit-lead.request.ts
import {
  leadCaptureInputSchema
} from "@pmf/core";

// src/modules/lead/lead.controller.ts
var LeadController = class {
  constructor(submitLeadUseCase) {
    this.submitLeadUseCase = submitLeadUseCase;
  }
  async createLead(input, sessionId) {
    const result = await this.submitLeadUseCase.execute(input, { sessionId });
    if (!result.ok) {
      throw new InternalServerErrorException3(result);
    }
    return result;
  }
};
__decorateClass([
  Post2(),
  HttpCode2(201),
  __decorateParam(0, Body2(new ZodValidationPipe(leadCaptureInputSchema))),
  __decorateParam(1, Headers2("x-pmf-session-id"))
], LeadController.prototype, "createLead", 1);
LeadController = __decorateClass([
  Controller3("leads"),
  __decorateParam(0, Inject2(SubmitLeadUseCase))
], LeadController);

// src/modules/lead/lead.module.ts
var LeadModule = class {
};
LeadModule = __decorateClass([
  Module3({
    controllers: [LeadController],
    providers: [SubmitLeadUseCase]
  })
], LeadModule);

// src/app.module.ts
var AppModule = class {
};
AppModule = __decorateClass([
  Module4({
    imports: [HealthModule, LeadModule, ConsultationModule]
  })
], AppModule);

// src/main.ts
var bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT ?? 4e3);
  await app.listen(port);
};
void bootstrap();

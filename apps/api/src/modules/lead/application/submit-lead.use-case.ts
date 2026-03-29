import { Injectable } from "@nestjs/common";
import { createLeadFromInput } from "@pmf/core";
import { createLead } from "@pmf/db";

import { appAnalytics } from "../../../lib/app-analytics";
import { appErrorLogger } from "../../../lib/app-error-logging";
import type { SubmitLeadRequest } from "../dto/submit-lead.request";
import type { SubmitLeadResponse } from "../dto/submit-lead.response";

type AnalyticsContext = {
  sessionId?: string;
};

const submitLeadFailureMessage =
  "문의 접수 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.";

@Injectable()
export class SubmitLeadUseCase {
  async execute(
    input: SubmitLeadRequest,
    analyticsContext?: AnalyticsContext,
  ): Promise<SubmitLeadResponse> {
    try {
      const lead = createLeadFromInput(input);
      await createLead(lead);

      try {
        await appAnalytics.track({
          eventName: "lead_form_submitted",
          path: "/",
          sessionId: analyticsContext?.sessionId,
          leadId: lead.id,
          properties: {
            source: lead.source,
            productInterest: lead.productInterest,
          },
        });
      } catch (error) {
        await appErrorLogger.report({
          source: "api.lead.submitLead.analytics",
          message: "Lead was saved but analytics tracking failed",
          error,
          level: "warning",
          context: {
            leadId: lead.id,
            hasSessionId: Boolean(analyticsContext?.sessionId),
          },
        });
      }

      return {
        ok: true,
        message: "문의가 접수되었습니다. 빠르게 검토 후 연락드릴게요.",
      };
    } catch (error) {
      await appErrorLogger.report({
        source: "api.lead.submitLead",
        message: "Lead submission failed",
        error,
        context: {
          hasSessionId: Boolean(analyticsContext?.sessionId),
        },
      });

      return {
        ok: false,
        message: submitLeadFailureMessage,
      };
    }
  }
}

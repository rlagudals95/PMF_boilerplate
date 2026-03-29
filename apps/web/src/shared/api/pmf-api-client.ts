import { appErrorLogger } from "@/lib/error-logging";
import type {
  ActionResult,
  AnalyticsContextInput,
} from "@/shared/types/form-action";

type ApiActionOptions<TInput> = {
  path: string;
  input: TInput;
  analyticsContext?: AnalyticsContextInput;
  failureMessage: string;
  errorSource: string;
};

const getApiBaseUrl = () => process.env.PMF_API_BASE_URL?.replace(/\/+$/, "");

const isActionResult = (value: unknown): value is ActionResult => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<ActionResult>;
  return typeof candidate.ok === "boolean" && typeof candidate.message === "string";
};

const submitActionToApi = async <TInput>({
  path,
  input,
  analyticsContext,
  failureMessage,
  errorSource,
}: ApiActionOptions<TInput>): Promise<ActionResult> => {
  const apiBaseUrl = getApiBaseUrl();

  if (!apiBaseUrl) {
    throw new Error("PMF_API_BASE_URL is required to route actions through the API.");
  }

  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(analyticsContext?.sessionId
          ? {
              "x-pmf-session-id": analyticsContext.sessionId,
            }
          : {}),
      },
      body: JSON.stringify(input),
      cache: "no-store",
    });

    const payload = (await response.json().catch(() => undefined)) as unknown;

    if (isActionResult(payload)) {
      return payload;
    }

    return {
      ok: false,
      message: failureMessage,
    };
  } catch (error) {
    await appErrorLogger.report({
      source: errorSource,
      message: "API-backed action request failed",
      error,
      context: {
        path,
        hasSessionId: Boolean(analyticsContext?.sessionId),
      },
    });

    return {
      ok: false,
      message: failureMessage,
    };
  }
};

export const submitLeadViaApi = async <TInput>(
  input: TInput,
  analyticsContext?: AnalyticsContextInput,
) =>
  submitActionToApi({
    path: "/leads",
    input,
    analyticsContext,
    failureMessage: "문의 접수 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
    errorSource: "shared.api.submitLeadViaApi",
  });

export const submitConsultationRequestViaApi = async <TInput>(
  input: TInput,
  analyticsContext?: AnalyticsContextInput,
) =>
  submitActionToApi({
    path: "/consultations",
    input,
    analyticsContext,
    failureMessage:
      "상담 요청 접수 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
    errorSource: "shared.api.submitConsultationRequestViaApi",
  });

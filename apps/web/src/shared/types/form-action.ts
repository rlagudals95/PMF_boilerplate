export interface ActionResult {
  ok: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
}

export interface AnalyticsContextInput {
  sessionId?: string;
}

export const createInvalidInputResult = (
  errors: Record<string, string[] | undefined>,
): ActionResult => ({
  ok: false,
  message: "입력값을 다시 확인해 주세요.",
  errors,
});

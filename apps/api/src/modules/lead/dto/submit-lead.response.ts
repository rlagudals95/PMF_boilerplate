export interface SubmitLeadResponse {
  ok: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
}

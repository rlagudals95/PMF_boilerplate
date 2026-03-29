export interface SubmitConsultationResponse {
  ok: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
}

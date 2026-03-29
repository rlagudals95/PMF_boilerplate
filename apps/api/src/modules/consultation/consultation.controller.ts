import {
  Controller,
  Headers,
  HttpCode,
  Inject,
  InternalServerErrorException,
  Post,
} from "@nestjs/common";
import { Body } from "@nestjs/common";

import { ZodValidationPipe } from "../../shared/pipes/zod-validation.pipe";
import { SubmitConsultationUseCase } from "./application/submit-consultation.use-case";
import {
  submitConsultationRequestSchema,
  type SubmitConsultationRequest,
} from "./dto/submit-consultation.request";
import type { SubmitConsultationResponse } from "./dto/submit-consultation.response";

@Controller("consultations")
export class ConsultationController {
  constructor(
    @Inject(SubmitConsultationUseCase)
    private readonly submitConsultationUseCase: SubmitConsultationUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async createConsultationRequest(
    @Body(new ZodValidationPipe(submitConsultationRequestSchema))
    input: SubmitConsultationRequest,
    @Headers("x-pmf-session-id") sessionId?: string,
  ): Promise<SubmitConsultationResponse> {
    const result = await this.submitConsultationUseCase.execute(input, {
      sessionId,
    });

    if (!result.ok) {
      throw new InternalServerErrorException(result);
    }

    return result;
  }
}

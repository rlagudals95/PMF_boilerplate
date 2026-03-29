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
import { SubmitLeadUseCase } from "./application/submit-lead.use-case";
import {
  submitLeadRequestSchema,
  type SubmitLeadRequest,
} from "./dto/submit-lead.request";
import type { SubmitLeadResponse } from "./dto/submit-lead.response";

@Controller("leads")
export class LeadController {
  constructor(
    @Inject(SubmitLeadUseCase)
    private readonly submitLeadUseCase: SubmitLeadUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async createLead(
    @Body(new ZodValidationPipe(submitLeadRequestSchema)) input: SubmitLeadRequest,
    @Headers("x-pmf-session-id") sessionId?: string,
  ): Promise<SubmitLeadResponse> {
    const result = await this.submitLeadUseCase.execute(input, { sessionId });

    if (!result.ok) {
      throw new InternalServerErrorException(result);
    }

    return result;
  }
}

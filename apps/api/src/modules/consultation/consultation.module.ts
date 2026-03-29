import { Module } from "@nestjs/common";

import { SubmitConsultationUseCase } from "./application/submit-consultation.use-case";
import { ConsultationController } from "./consultation.controller";

@Module({
  controllers: [ConsultationController],
  providers: [SubmitConsultationUseCase],
})
export class ConsultationModule {}

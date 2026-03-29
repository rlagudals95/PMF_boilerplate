import { Module } from "@nestjs/common";

import { LeadController } from "./lead.controller";
import { SubmitLeadUseCase } from "./application/submit-lead.use-case";

@Module({
  controllers: [LeadController],
  providers: [SubmitLeadUseCase],
})
export class LeadModule {}

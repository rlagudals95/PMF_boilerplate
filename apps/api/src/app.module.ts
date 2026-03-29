import { Module } from "@nestjs/common";

import { ConsultationModule } from "./modules/consultation/consultation.module";
import { HealthModule } from "./modules/health/health.module";
import { LeadModule } from "./modules/lead/lead.module";

@Module({
  imports: [HealthModule, LeadModule, ConsultationModule],
})
export class AppModule {}

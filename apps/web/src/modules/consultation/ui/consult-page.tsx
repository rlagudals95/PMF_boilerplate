import { CheckCircle2, Clock3, MessagesSquare } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@pmf/ui";

import { productConfig } from "@/lib/product-config";
import { ConsultationRequestForm } from "@/modules/consultation/ui/consultation-request-form";

export default function ConsultPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-20 pt-10">
      <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
              {productConfig.consultation.sectionEyebrow}
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
              {productConfig.consultation.sectionTitle}
            </h1>
            <p className="text-lg text-slate-600">
              {productConfig.consultation.sectionDescription}
            </p>
          </div>

          <div className="grid gap-4">
            {productConfig.consultation.benefitCards.map((item, index) => {
              const Icon =
                index === 0
                  ? MessagesSquare
                  : index === 1
                    ? Clock3
                    : CheckCircle2;

              return (
                <Card key={item.title}>
                  <CardHeader className="pb-3">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle className="mt-3">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600">{item.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <ConsultationRequestForm />
      </section>
    </div>
  );
}

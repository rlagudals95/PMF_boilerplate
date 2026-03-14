import { listExperiments } from "@pmf/db";
import { Card, CardContent, CardHeader, CardTitle } from "@pmf/ui";

import { StatusBadge } from "@/modules/admin/ui/status-badge";

export default async function AdminExperimentsPage() {
  const experiments = await listExperiments();

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {experiments.map((experiment) => (
        <Card key={experiment.id}>
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">{experiment.code}</p>
                <CardTitle>{experiment.name}</CardTitle>
              </div>
              <StatusBadge value={experiment.status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Hypothesis
              </p>
              <p className="mt-2 text-sm text-slate-600">{experiment.hypothesis}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Channel
                </p>
                <p className="mt-2 text-sm text-slate-700">{experiment.channel}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Success metric
                </p>
                <p className="mt-2 text-sm text-slate-700">{experiment.successMetric}</p>
              </div>
            </div>
            {experiment.notes ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Notes
                </p>
                <p className="mt-2 text-sm text-slate-600">{experiment.notes}</p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@pmf/ui";

export function MetricCard({
  title,
  value,
  description,
}: {
  title: string;
  value: number;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <p className="text-sm text-slate-500">{title}</p>
        <CardTitle className="font-mono text-3xl">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-600">{description}</p>
      </CardContent>
    </Card>
  );
}

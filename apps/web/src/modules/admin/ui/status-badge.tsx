import { Badge } from "@pmf/ui";

const variantMap = {
  active: "success",
  running: "success",
  scheduled: "success",
  qualified: "success",
  converted: "success",
  paused: "warning",
  draft: "warning",
  requested: "warning",
  ready: "warning",
  new: "default",
  idea: "default",
  contacted: "default",
  won: "success",
  completed: "success",
  paid: "success",
  lost: "danger",
  cancelled: "danger",
  failed: "danger",
  archived: "danger",
  sunset: "danger",
} as const;

export function StatusBadge({ value }: { value: string }) {
  const variant = variantMap[value as keyof typeof variantMap] ?? "default";

  return <Badge variant={variant}>{value}</Badge>;
}

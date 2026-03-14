import type { ReactNode } from "react";

import AdminLayoutShell from "@/modules/admin/ui/admin-layout-shell";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}

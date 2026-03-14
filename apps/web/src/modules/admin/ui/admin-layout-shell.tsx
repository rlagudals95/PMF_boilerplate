import type { ReactNode } from "react";

import { AdminNav } from "@/modules/admin/ui/admin-nav";

export default function AdminLayoutShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-20 pt-10">
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
            Admin
          </p>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
                PMF 운영 보드
              </h1>
              <p className="mt-2 max-w-2xl text-slate-600">
                리드, 제품, 실험을 한 화면에서 보고 다음 검증 액션을 결정하기 위한 최소 어드민입니다.
              </p>
            </div>
            <AdminNav />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

import { Button } from "@pmf/ui";

import { TrackedLink } from "@/shared/ui/tracked-link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <TrackedLink href="/" className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
            PM
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-950">PMF Boilerplate</p>
            <p className="text-xs text-slate-500">모두의렌탈 실험 리포지터리</p>
          </div>
        </TrackedLink>
        <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
          <TrackedLink href="/">랜딩</TrackedLink>
          <TrackedLink
            href="/demo/funnel"
            eventProperties={{
              source: "site_header_funnel_demo",
            }}
          >
            퍼널 데모
          </TrackedLink>
          <TrackedLink href="/consult">상담 요청</TrackedLink>
          <TrackedLink href="/admin">어드민</TrackedLink>
        </nav>
        <Button asChild size="sm">
          <TrackedLink
            href="/consult"
            eventProperties={{
              source: "site_header",
            }}
          >
            상담 요청하기
          </TrackedLink>
        </Button>
      </div>
    </header>
  );
}

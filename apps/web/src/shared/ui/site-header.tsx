import { Button } from "@pmf/ui";

import { productConfig } from "@/lib/product-config";
import { TrackedLink } from "@/shared/ui/tracked-link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <TrackedLink href="/" className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-sm">
            {productConfig.site.mark}
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {productConfig.site.headerTitle}
            </p>
            <p className="text-xs text-muted-foreground">
              {productConfig.site.headerDescription}
            </p>
          </div>
        </TrackedLink>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <TrackedLink href="/">랜딩</TrackedLink>
          <TrackedLink
            href="/auth"
            eventProperties={{
              source: "site_header_auth_demo",
            }}
          >
            소셜 로그인
          </TrackedLink>
          <TrackedLink
            href="/demo/funnel"
            eventProperties={{
              source: "site_header_funnel_demo",
            }}
          >
            퍼널 데모
          </TrackedLink>
          <TrackedLink
            href="/pay"
            eventProperties={{
              source: "site_header_payment_demo",
            }}
          >
            결제 데모
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
            {productConfig.site.headerPrimaryCtaLabel}
          </TrackedLink>
        </Button>
      </div>
    </header>
  );
}

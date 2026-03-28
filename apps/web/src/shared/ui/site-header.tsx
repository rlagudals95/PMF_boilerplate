import { Button } from "@pmf/ui";

import { appConfig } from "@/lib/app-config";
import { buildVisibleNavItems } from "@/lib/mvp-surface";
import { productConfig } from "@/lib/product-config";
import { TrackedLink } from "@/shared/ui/tracked-link";

export function SiteHeader() {
  const navItems = buildVisibleNavItems(productConfig, appConfig);
  const primaryCtaLabel = productConfig.mvp.primaryCta.label;
  const primaryCtaHref = productConfig.mvp.primaryCta.href;

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
          {navItems.map((item) => (
            <TrackedLink
              key={item.flowId}
              href={item.href}
              eventProperties={{
                source: `site_header_${item.flowId}`,
              }}
            >
              {item.setupRequired ? `${item.label} 설정 필요` : item.label}
            </TrackedLink>
          ))}
        </nav>
        <Button asChild size="sm">
          <TrackedLink
            href={primaryCtaHref}
            eventProperties={{
              source: "site_header",
            }}
          >
            {primaryCtaLabel}
          </TrackedLink>
        </Button>
      </div>
    </header>
  );
}

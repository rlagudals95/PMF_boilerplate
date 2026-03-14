import type { Metadata } from "next";
import { Noto_Sans_KR, Space_Grotesk } from "next/font/google";

import { appConfig } from "@/lib/app-config";
import { themeCssVars } from "@/lib/app-theme";
import { MarketingProviderScripts } from "@/modules/marketing/ui/marketing-provider-scripts";
import { PageViewTracker } from "@/shared/ui/page-view-tracker";
import { SiteHeader } from "@/shared/ui/site-header";

import "./globals.css";

const sans = Noto_Sans_KR({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const mono = Space_Grotesk({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: `${appConfig.appName} | ${appConfig.primaryProduct}`,
  description: appConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" style={themeCssVars}>
      <body className={`${sans.variable} ${mono.variable} font-sans`}>
        <MarketingProviderScripts />
        <div className="relative">
          <div className="absolute inset-0 -z-10 grid-surface opacity-40" />
          <PageViewTracker />
          <SiteHeader />
          <main>{children}</main>
          <footer className="border-t border-border/80 bg-background/80">
            <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
              <p>PMF Boilerplate for side-project experimentation.</p>
              <p>Default data mode: {appConfig.dataMode}</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

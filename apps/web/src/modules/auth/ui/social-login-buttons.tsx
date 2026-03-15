"use client";

import { useState } from "react";

import { Badge, Button } from "@pmf/ui";

import {
  startNaverSocialLogin,
  startSupabaseSocialLogin,
} from "@/modules/auth/model/browser-auth";
import type { AuthProviderStatus } from "@/modules/auth/model/provider-config";

const providerAccentClassName: Record<AuthProviderStatus["id"], string> = {
  google: "border-[#d9d9d9] bg-white text-black hover:bg-neutral-100",
  kakao: "border-[#f7e04b] bg-[#fee500] text-black hover:bg-[#f2d83f]",
  naver: "border-[#0fb95d] bg-[#03c75a] text-white hover:bg-[#03b254]",
};

export function SocialLoginButtons({
  providers,
  nextPath = "/auth",
}: {
  providers: AuthProviderStatus[];
  nextPath?: string;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [pendingProvider, setPendingProvider] =
    useState<AuthProviderStatus["id"] | null>(null);

  const handleLogin = async (provider: AuthProviderStatus) => {
    setPendingProvider(provider.id);
    setMessage(null);

    const result =
      provider.id === "naver"
        ? startNaverSocialLogin(nextPath)
        : await startSupabaseSocialLogin(provider.id, nextPath);

    if (!result.ok) {
      setMessage(result.message);
      setPendingProvider(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className="rounded-3xl border border-border/70 bg-background/70 p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-foreground">{provider.label}</p>
              <Badge variant={provider.isEnabled ? "success" : "warning"}>
                {provider.isEnabled ? "활성" : "설정 필요"}
              </Badge>
            </div>
            <p className="mb-4 min-h-10 text-sm text-muted-foreground">
              {provider.isEnabled
                ? `${provider.label} provider가 starter kit에 연결되어 있습니다.`
                : provider.setupHint}
            </p>
            <Button
              className={providerAccentClassName[provider.id]}
              disabled={!provider.isEnabled || pendingProvider === provider.id}
              onClick={() => {
                void handleLogin(provider);
              }}
              variant="outline"
            >
              {pendingProvider === provider.id
                ? "연결 중..."
                : `${provider.label} 로그인`}
            </Button>
          </div>
        ))}
      </div>
      <p aria-live="polite" className="text-sm text-muted-foreground">
        {message ??
          "Google/Kakao는 Supabase social login, Naver는 별도 OAuth adapter로 동작합니다."}
      </p>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@pmf/ui";

import { readStoredAuthKitSession } from "@/modules/auth/model/auth-session-storage";
import type { AuthKitSession } from "@/modules/auth/model/auth-session";
import type { AuthProviderStatus } from "@/modules/auth/model/provider-config";
import { signOutSocialLogin } from "@/modules/auth/model/browser-auth";

import { SocialLoginButtons } from "./social-login-buttons";

const formatDateTime = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export function AuthDemoPage({
  providers,
}: {
  providers: AuthProviderStatus[];
}) {
  const [session, setSession] = useState<AuthKitSession | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    setSession(readStoredAuthKitSession());
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOutSocialLogin();
    setSession(null);
    setIsSigningOut(false);
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10 max-w-3xl space-y-4">
        <Badge variant="accent">Auth Starter</Badge>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
          Google, Kakao, Naver 로그인 kit
        </h1>
        <p className="text-base text-muted-foreground md:text-lg">
          이 화면은 production auth 시스템이 아니라 새 프로젝트에 그대로 복제할 수
          있는 social login starter를 검증하기 위한 demo입니다.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <CardHeader>
            <CardTitle>Provider 상태와 로그인 시작</CardTitle>
            <CardDescription>
              provider 별 설정 유무를 확인하고 바로 OAuth 흐름을 시작합니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SocialLoginButtons providers={providers} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>현재 Starter Session</CardTitle>
            <CardDescription>
              callback 이후 브라우저에 저장된 demo session을 보여줍니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {session ? (
              <>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">Provider</span>:{" "}
                    {session.provider}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">User ID</span>:{" "}
                    {session.userId}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Name</span>:{" "}
                    {session.displayName ?? "-"}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Email</span>:{" "}
                    {session.email ?? "-"}
                  </p>
                  <p>
                    <span className="font-medium text-foreground">Logged In</span>:{" "}
                    {formatDateTime(session.loggedInAt)}
                  </p>
                </div>
                <Button
                  disabled={isSigningOut}
                  onClick={() => {
                    void handleSignOut();
                  }}
                  variant="outline"
                >
                  {isSigningOut ? "정리 중..." : "로그아웃"}
                </Button>
              </>
            ) : (
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>아직 starter session이 없습니다.</p>
                <p>왼쪽 provider 버튼으로 로그인 흐름을 실행한 뒤 돌아오면 상태가 표시됩니다.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Setup Note</CardTitle>
          <CardDescription>
            Google/Kakao는 Supabase dashboard의 social provider 설정을, Naver는 앱
            client id/secret 구성을 전제로 합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>`NEXT_PUBLIC_SITE_URL`은 callback URL 기준값으로 사용됩니다.</p>
          <p>
            이 kit는 `/admin` 보호나 DB user sync를 하지 않습니다. 그런 요구가 생기면
            별도 auth 작업으로 분리하는 편이 맞습니다.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}

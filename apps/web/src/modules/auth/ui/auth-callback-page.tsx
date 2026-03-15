"use client";

import { useEffect, useState } from "react";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@pmf/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  completeNaverSocialLogin,
  completeSupabaseSocialLogin,
} from "@/modules/auth/model/browser-auth";
import { sanitizeNextPath } from "@/modules/auth/model/auth-routes";
import type { AuthKitSession } from "@/modules/auth/model/auth-session";

type CallbackState =
  | {
      status: "loading";
      message: string;
    }
  | {
      status: "success";
      message: string;
      session: AuthKitSession;
    }
  | {
      status: "error";
      message: string;
    };

type AuthCallbackPageProps = {
  provider?: string;
  code?: string;
  state?: string;
  error?: string;
  errorDescription?: string;
  next?: string;
};

export function AuthCallbackPage({
  provider,
  code,
  state: naverState,
  error,
  errorDescription,
  next,
}: AuthCallbackPageProps) {
  const router = useRouter();
  const [state, setState] = useState<CallbackState>({
    status: "loading",
    message: "로그인 callback을 처리하고 있습니다.",
  });

  useEffect(() => {
    const providerError = errorDescription ?? error;
    const nextPath = sanitizeNextPath(next ?? "/auth");

    if (providerError) {
      setState({
        status: "error",
        message: providerError,
      });
      return;
    }

    if (provider !== "google" && provider !== "kakao" && provider !== "naver") {
      setState({
        status: "error",
        message: "지원하지 않는 provider callback입니다.",
      });
      return;
    }

    const handleCallback = async () => {
      const result =
        provider === "naver"
          ? code && naverState
            ? await completeNaverSocialLogin({
                code,
                state: naverState,
              })
            : {
                ok: false,
                message: "네이버 callback 파라미터가 누락되었습니다.",
              }
          : await completeSupabaseSocialLogin(provider);

      if (!result.ok || !result.session) {
        setState({
          status: "error",
          message: result.message,
        });
        return;
      }

      setState({
        status: "success",
        message: result.message,
        session: result.session,
      });

      window.setTimeout(() => {
        router.replace(nextPath);
      }, 1200);
    };

    void handleCallback();
  }, [code, error, errorDescription, naverState, next, provider, router]);

  return (
    <section className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-3xl items-center px-6 py-16">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Auth Callback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p aria-live="polite" className="text-sm text-muted-foreground">
            {state.message}
          </p>

          {state.status === "success" ? (
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                provider: <span className="font-medium text-foreground">{state.session.provider}</span>
              </p>
              <p>
                email: <span className="font-medium text-foreground">{state.session.email ?? "-"}</span>
              </p>
            </div>
          ) : null}

          <Button asChild variant="outline">
            <Link href="/auth">/auth로 돌아가기</Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}

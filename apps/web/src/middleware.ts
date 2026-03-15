import { NextResponse, type NextRequest } from "next/server";

import { applyAbTestMiddleware } from "@pmf/ab-test";

import { appAbTestDefinitions } from "@/modules/landing/model/hero-copy-experiment";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  applyAbTestMiddleware(request, response, appAbTestDefinitions);

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

---
status: done
owner_role: pm
source_request: "이 보일러플레이트에, auth 관련된 kit이 빠진거 같아. 카카오, 네이버, 구글 로그인 보일러플레이트 kit도 추가해줘"
affected_paths:
  - apps/web/src/app/auth
  - apps/web/src/app/api/auth/naver/session/route.ts
  - apps/web/src/modules/auth
  - apps/web/src/lib/app-config.ts
  - apps/web/src/shared/ui/site-header.tsx
  - apps/web/src/modules/landing/ui/landing-page.tsx
  - .env.example
  - README.md
  - docs/architecture.md
dependencies:
  - ai/context/spec-driven.md
  - docs/architecture.md
skip_reason: null
---

# Brief

## Problem

- 현재 보일러플레이트에는 결제, 리드, 상담, 마케팅 wiring은 있지만 새 프로젝트에서 바로 복제할 수 있는 소셜 로그인 starter가 없다.
- 특히 한국 로컬 제품에서 자주 필요한 카카오, 네이버, 구글 로그인 시작점이 비어 있어 초기 실험 앱을 세팅할 때 매번 auth wiring을 다시 만들어야 한다.

## Target User

- Supabase 기반으로 빠르게 MVP를 띄우는 1인 개발자 또는 작은 제품팀
- 한국 시장 대상 사이드 프로젝트에서 카카오, 네이버, 구글 로그인을 빠르게 붙이려는 개발자

## Goal

- `apps/web` 안에서 바로 실행해 볼 수 있는 social login demo route와 provider wiring을 추가한다.
- Google, Kakao, Naver 세 provider를 같은 UI에서 다루되 provider-specific 설정과 failure handling은 분리한다.
- production auth 시스템이 아니라 재사용 가능한 starter kit 범위로 남긴다.

## Non-Goals

- 관리자 보호나 role-based access control
- user/profile DB schema 추가와 영구 사용자 동기화
- 서버 보호가 필요한 완전한 SSR auth 시스템
- provider dashboard 설정 자동화

## Success Metric

- `.env.example`와 README만 보고 Google, Kakao, Naver login starter를 설정할 수 있다.
- `/auth`에서 provider 버튼, callback 처리, 현재 로그인 상태 확인, sign-out 흐름을 직접 데모할 수 있다.
- provider 미설정 또는 외부 provider 실패가 앱 전체 흐름을 깨지 않고 화면에서 명확히 안내된다.

## Acceptance Criteria

- `app/`에는 얇은 auth route entry만 추가되고 실제 provider 로직은 `modules/auth/*`에 위치한다.
- Google/Kakao는 Supabase OAuth client flow로 시작할 수 있다.
- Naver는 별도 OAuth adapter로 authorize URL 생성과 code exchange를 처리한다.
- `/auth`에서 현재 starter session 정보를 확인하고 로그아웃할 수 있다.
- `.env.example`, README, architecture 문서가 새 auth kit 범위와 setup 방법을 반영한다.
- provider config와 Naver OAuth exchange 경계에 대한 테스트가 추가된다.

## Open Questions

- Google/Kakao provider 실제 활성화는 Supabase dashboard 설정을 전제로 하며, 이 저장소에서는 starter wiring과 demo UX까지만 제공한다.

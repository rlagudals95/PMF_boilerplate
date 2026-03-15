---
status: done
owner_role: pd
source_request: "이 보일러플레이트에, auth 관련된 kit이 빠진거 같아. 카카오, 네이버, 구글 로그인 보일러플레이트 kit도 추가해줘"
affected_paths:
  - apps/web/src/app/auth/page.tsx
  - apps/web/src/app/auth/callback/page.tsx
  - apps/web/src/modules/auth/ui
  - apps/web/src/shared/ui/site-header.tsx
dependencies:
  - docs/work-items/20260315-auth-kit-social-login/brief.md
skip_reason: null
---

# UX Review

## Entry Points

- `/auth`: social login starter demo 진입점
- `/auth/callback`: provider 복귀 처리 화면
- 상단 내비게이션과 랜딩 runtime 카드에서 `/auth`로 이동

## Copy Changes

- auth kit는 production auth가 아니라 starter/demo라는 점을 명확히 표기한다.
- disabled provider에는 필요한 환경 변수 또는 설정 누락을 짧게 표시한다.
- callback 처리 중, 성공, 실패 상태 문구를 분리한다.

## IA Changes

- 기존 주요 화면 목록에 `/auth`를 추가한다.
- `/auth` 안에서는 "provider 상태", "login buttons", "현재 session", "setup note" 순서로 정보를 노출한다.

## Happy Path

- 사용자가 `/auth`에서 provider 버튼을 누른다.
- Google/Kakao는 Supabase OAuth로, Naver는 Naver authorize URL로 이동한다.
- 복귀 후 callback 화면에서 세션을 정리하고 `/auth`로 되돌아온다.
- `/auth`에서 provider, name/email, 로그인 시각을 확인할 수 있다.

## Edge States

- provider 미설정 시 버튼은 disabled 상태로 보이고 필요한 설정을 안내한다.
- callback 파라미터가 누락되면 실패 메시지와 `/auth` 복귀 링크를 보여준다.
- 외부 provider 에러가 나면 앱이 깨지지 않고 실패 이유를 텍스트로 표시한다.

## Accessibility Checks

- 버튼과 상태 카드에 명확한 텍스트 라벨을 둔다.
- loading 상태는 aria-live 영역으로 안내한다.
- disabled provider는 색상만으로 상태를 구분하지 않는다.

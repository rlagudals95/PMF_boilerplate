# PMF Boilerplate

PMF를 찾기 위한 실험용 모노레포 보일러플레이트입니다. 첫 제품은 `모두의렌탈`이지만, 구조 자체는 다음 사이드 프로젝트에서도 그대로 복제할 수 있도록 설계했습니다.

핵심은 단순한 랜딩 템플릿이 아니라, `랜딩 -> 리드 -> 상담 -> 결제 의사 -> 어드민 확인 -> 실험 문서화`까지 이어지는 초기 검증 루프를 바로 실행할 수 있게 만드는 것입니다.

## 무엇이 들어 있나

### 실행 가능한 제품 흐름

- 랜딩 페이지와 CTA 추적
- 리드 캡처 폼
- 상담 요청 폼
- 토스 결제 데모 플로우
- 리드 / 제품 / 실험 / 결제 어드민 화면
- 모바일 퍼널 데모

### 기본 인프라

- Next.js App Router 기반 단일 웹 앱
- pnpm workspace + Turborepo 모노레포
- Supabase/Postgres 지향 Drizzle 스키마
- 로컬 개발용 `local-data.json` fallback 저장소
- analytics / marketing script / error logging 기본 wiring
- 공유 UI, 도메인 타입, Zod 스키마

### 품질과 운영

- Vitest unit test
- Playwright smoke E2E
- AI 도구 공통 컨텍스트 레이어
- 아키텍처 / spec-driven / doc-sync 문서

## 바로 확인할 수 있는 화면

- `/`: 랜딩 + 라이브 리드 폼
- `/consult`: 상담 요청 플로우
- `/pay`: 토스 결제 데모
- `/admin`: 운영 개요
- `/admin/leads`: 리드 inbox
- `/admin/products`: 제품 목록
- `/admin/experiments`: 실험 목록
- `/admin/payments`: 결제 목록
- `/demo/funnel`: 모바일 퍼널 예시

## 시작하기

```bash
corepack enable
pnpm install
cp .env.example .env.local
pnpm db:seed
pnpm dev
```

기본 실행 주소는 `http://localhost:3000` 입니다.

## 주요 명령어

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm db:seed
pnpm db:generate
pnpm db:migrate
pnpm format
```

## 어디를 보면 되는가

### 앱 구조

```text
apps/web/src/
  app/        route entry, layout, page, route.ts
  modules/    기능별 feature slice
  shared/     app-local shared UI, hooks, shared action
  lib/        앱 전역 wiring, env, provider setup
```

### 워크스페이스 패키지

```text
packages/core           도메인 타입, zod 스키마, fixture, mapper
packages/db             Drizzle 스키마, 저장소, 로컬 fallback, seed
packages/ui             공유 UI 컴포넌트
packages/analytics      벤더 중립 track() 추상화
packages/error-logging  벤더 중립 report() 추상화
```

### 문서와 컨텍스트

```text
docs/                   아키텍처, 실험 운영, work item 문서
ai/context/             프로젝트/엔지니어링/spec-driven canonical context
ai/skills/              저장소 로컬 스킬 레지스트리
AGENTS.md               Codex/에이전트용 루트 엔트리
```

## 데이터 전략

- 기본값은 `packages/db/local-data.json` 기반 로컬 저장소입니다.
- `DATABASE_URL`이 설정되면 Drizzle + Postgres로 전환됩니다.
- 초기 PMF 실험 단계에서는 설치 장벽보다 반복 속도가 중요하기 때문에 fallback을 유지합니다.

## 데이터 트래킹

- 기본 추적은 내부 저장소 `page_events`에 항상 기록됩니다.
- `MIXPANEL_PROJECT_TOKEN`이 있으면 같은 이벤트를 Mixpanel에도 전송합니다.
- Mixpanel 실패는 optional adapter 실패로 처리되어 핵심 제품 흐름은 계속 성공합니다.
- 브라우저의 `session_id`를 저장해 anonymous session continuity를 유지합니다.
- `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_KAKAO_PIXEL_ID`, `NEXT_PUBLIC_GOOGLE_ADS_ID`가 있으면 브라우저에 마케팅 스크립트를 함께 로드합니다.
- 마케팅 모듈은 `page_view`, `cta_clicked`, `lead_form_submitted`, `consultation_requested`를 광고 채널 이벤트로 브리지합니다.
- Google Ads 전환은 대응 라벨이 있을 때만 `conversion` 이벤트를 보냅니다.

## 환경 변수

`.env.example` 기준:

- `DATABASE_URL`: Supabase/Postgres 연결 문자열. 비어 있으면 로컬 JSON 저장소를 사용합니다.
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `LOCAL_DATA_FILE`: 로컬 개발용 seed 데이터 위치
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_META_PIXEL_ID`
- `NEXT_PUBLIC_KAKAO_PIXEL_ID`
- `NEXT_PUBLIC_GOOGLE_ADS_ID`
- `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL_LEAD`
- `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL_CONSULTATION`
- `MIXPANEL_PROJECT_TOKEN`
- `MIXPANEL_API_HOST`: 기본값 `https://api.mixpanel.com`
- `MIXPANEL_DEBUG`: `true`면 Mixpanel SDK debug 로그를 켭니다

## 새 제품으로 복제하는 순서

1. `packages/core/src/fixtures/mock-data.ts`에서 제품 seed와 실험 seed를 바꿉니다.
2. 랜딩 카피와 CTA는 `apps/web/src/modules/landing/*`에서 수정합니다.
3. 리드 폼과 상담 폼 필드는 `apps/web/src/modules/lead/*`, `apps/web/src/modules/consultation/*`에서 조정합니다.
4. 브랜드 색상은 `apps/web/src/lib/app-theme.ts`에서 바꿉니다.
5. 새 제품 가설은 `/admin/experiments`에 보이도록 seed와 스키마 데이터를 갱신합니다.
6. 운영 단계로 넘어가면 `DATABASE_URL`을 Supabase/Postgres로 연결합니다.

## AI 컨텍스트 관리

이 저장소는 특정 도구 하나에 종속되지 않도록 `ai/` 폴더에 공통 컨텍스트와 스킬 색인을 둡니다.

- `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`는 얇은 진입 문서입니다.
- 실제 공통 규칙은 `ai/context/project.md`와 `ai/skills/_index.md`에 둡니다.
- 새 플랫폼을 추가할 때는 본문을 복붙하지 말고 플랫폼용 엔트리만 추가합니다.
- `pnpm ai:sync`를 실행하면 `.claude/`, `.gemini/`, `.codex/` 어댑터가 생성됩니다.
- 생성된 어댑터는 파생 산출물이고 source of truth는 계속 `ai/`와 루트 엔트리 문서입니다.

## 더 읽을 문서

- [아키텍처 결정과 트레이드오프](./docs/architecture.md)
- [실험 운영 플레이북](./docs/experiment-playbook.md)
- [AI 컨텍스트 운영 규칙](./docs/agent-context.md)
- [에이전트 작업 규칙](./AGENTS.md)

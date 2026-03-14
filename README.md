# PMF Boilerplate

PMF를 찾기 위한 실험용 모노레포 보일러플레이트입니다. 첫 번째 제품은 `모두의렌탈`이지만, 구조는 다음 사이드 프로젝트에서도 그대로 재사용되도록 설계했습니다.

## 포함된 기본값

- Next.js App Router 웹 앱
- pnpm workspaces + Turborepo 모노레포
- Supabase/Postgres 지향 Drizzle 스키마
- 로컬 개발용 JSON seed 저장소
- 리드 캡처 / 상담 요청 폼
- 제품 / 리드 / 실험 어드민 페이지
- 공유 UI, 도메인 타입, 검증 스키마, 분석 추적 추상화
- Vitest unit test + Playwright smoke E2E
- AI 도구 공통 컨텍스트 레이어 (`ai/`, `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`)

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

## 환경 변수

`.env.example` 기준:

- `DATABASE_URL`: Supabase/Postgres 연결 문자열. 비어 있으면 로컬 JSON 저장소를 사용합니다.
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `LOCAL_DATA_FILE`: 로컬 개발용 seed 데이터 위치
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_META_PIXEL_ID`: 값이 있으면 Meta Pixel이 로드됩니다.
- `NEXT_PUBLIC_KAKAO_PIXEL_ID`: 값이 있으면 Kakao Pixel이 로드됩니다.
- `NEXT_PUBLIC_GOOGLE_ADS_ID`: 값이 있으면 Google Ads gtag가 로드됩니다.
- `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL_LEAD`: 리드 제출 전환 라벨
- `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL_CONSULTATION`: 상담 요청 전환 라벨
- `MIXPANEL_PROJECT_TOKEN`: 값이 있으면 Mixpanel adapter가 활성화됩니다.
- `MIXPANEL_API_HOST`: 기본값 `https://api.mixpanel.com`
- `MIXPANEL_DEBUG`: `true`면 Mixpanel SDK debug 로그를 켭니다.

## 데이터 트래킹

- 기본 추적은 내부 저장소(`page_events`)에 항상 기록됩니다.
- `MIXPANEL_PROJECT_TOKEN`을 넣으면 같은 이벤트가 Mixpanel에도 추가 전송됩니다.
- Mixpanel 전송 실패는 선택적 adapter 실패로 처리되어, 내부 저장과 핵심 제품 흐름은 계속 성공합니다.
- anonymous traffic continuity를 위해 브라우저에 `session_id`를 저장해 Mixpanel `distinct_id`로 사용합니다.
- `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_KAKAO_PIXEL_ID`, `NEXT_PUBLIC_GOOGLE_ADS_ID`를 넣으면 브라우저에서 마케팅 전용 스크립트도 함께 로드됩니다.
- 마케팅 모듈은 `page_view`, `cta_clicked`, `lead_form_submitted`, `consultation_requested`를 광고 채널 이벤트로 브리지합니다.
- Google Ads 전환은 대응 라벨이 설정된 경우에만 `conversion` 이벤트를 발송합니다.

## 저장소 구조

```text
apps/web                 Next.js App Router 앱
apps/web/src/modules/marketing 브라우저 광고 채널 추적 모듈
packages/ui              shadcn 스타일 공유 UI 컴포넌트
packages/core            도메인 타입, zod 스키마, fixture, helper
packages/db              Drizzle 스키마, 저장소 레이어, seed
packages/analytics       벤더 중립 track() 추상화
packages/config-eslint   공통 ESLint 설정
packages/config-typescript 공통 TypeScript 설정
docs/                    아키텍처와 운영 문서
ai/                      벤더 중립 AI 컨텍스트/스킬 레지스트리
```

## 데이터 전략

- 기본값은 `packages/db/local-data.json` 기반 로컬 저장소입니다.
- `DATABASE_URL`이 설정되면 Drizzle + Postgres로 전환됩니다.
- 이렇게 한 이유는 PMF 실험 초기에는 설치 장벽보다 실험 속도가 중요하기 때문입니다.

## 재사용 방법

1. `packages/core/src/fixtures/mock-data.ts`에서 첫 제품과 실험 seed를 바꿉니다.
2. 랜딩 카피와 폼 필드를 `apps/web/src/app`과 `apps/web/src/components/forms`에서 조정합니다.
3. 새 제품 가설은 `/admin/experiments`와 seed에 먼저 등록합니다.
4. 실제 운영 단계로 넘어가면 `DATABASE_URL`을 Supabase로 연결하고 auth를 붙입니다.

## AI 컨텍스트 관리

이 저장소는 Codex 전용 규칙에 묶이지 않도록 `ai/` 폴더에 공통 컨텍스트와 스킬 색인을 둡니다.

- `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`는 얇은 진입 문서입니다.
- 실제 공통 규칙은 `ai/context/project.md`와 `ai/skills/_index.md`에 둡니다.
- 새 플랫폼을 추가할 때는 같은 내용을 복붙하지 말고 해당 플랫폼용 진입 문서만 하나 더 추가하세요.

## 문서

- [아키텍처 결정과 트레이드오프](./docs/architecture.md)
- [실험 운영 플레이북](./docs/experiment-playbook.md)
- [AI 컨텍스트 운영 규칙](./docs/agent-context.md)
- [에이전트 작업 규칙](./AGENTS.md)

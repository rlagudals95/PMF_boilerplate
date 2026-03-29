# Start Your MVP

이 문서는 README의 `Day 0 사용 순서`를 조금 더 자세히 푼 확장판입니다.

## 권장 시작 방식

이 저장소의 기본 온보딩은 명령어보다 `AI tool + one-shot prompt`입니다.

핵심 계약은 아래 한 줄입니다.

`one-shot prompt -> repo-aware shape selection -> product-config.mvp + copy update -> optional deeper code -> verify`

추천 흐름은 아래와 같습니다.

1. 로컬에서 starter를 띄웁니다.
2. AI 코딩 툴에 one-shot prompt를 붙여 넣습니다.
3. AI가 repo를 읽고 필요한 경우에만 1~3개의 짧은 질문을 합니다.
4. AI가 가장 얇은 MVP shape를 고릅니다.
5. 먼저 `apps/web/src/lib/product-config.ts`의 `mvp` shape, active/deferred flow, primary CTA와 copy surface를 맞춥니다.
6. 기존 블록으로 안 되는 경우에만 deeper code를 수정합니다.
7. 마지막에 `pnpm verify`와 브라우저 확인으로 닫습니다.

기본 모드는 `web-only`입니다. `apps/api` Nest backend example은 selected write flow를 HTTP 경계로 보고 싶을 때만 추가로 켭니다.

canonical prompt와 follow-up prompt는 [docs/ai-starter-prompt-pack.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/ai-starter-prompt-pack.md)에 둡니다.

## Day 0 상세 순서

### 1. 로컬 실행

```bash
corepack enable
pnpm install
cp .env.example .env.local
pnpm db:seed
pnpm dev
```

기대 결과:

- `http://localhost:3000`에서 starter가 뜹니다.
- `DATABASE_URL`이 없어도 local JSON fallback으로 바로 시연할 수 있습니다.
- 이 경로는 `apps/web`만 띄우는 기본 `web-only` 모드입니다.

Nest backend example까지 같이 검증하려면 아래를 사용합니다.

```bash
pnpm dev:full
```

- `PMF_API_BASE_URL=http://localhost:4000`을 설정하면 `lead`, `consultation` write flow가 `apps/api`를 통해 저장됩니다.

### 2. AI에 one-shot prompt 넣기

README의 starter prompt를 그대로 붙여 넣거나, [docs/ai-starter-prompt-pack.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/ai-starter-prompt-pack.md)의 canonical prompt를 사용합니다. 두 문서의 starter prompt 원문은 같은 계약을 가리킵니다.

이 단계에서 중요한 건 기능 목록을 길게 설명하는 것이 아니라 아래만 주는 것입니다.

- 무엇을 만들고 싶은지
- 첫 MVP의 핵심 비즈니스 전환이 무엇인지

### 3. AI가 shape와 active flow를 정하게 하기

AI는 보통 아래 중 하나를 고릅니다.

- `lead-gen`
- `consultation`
- `comparison-routing`
- `paid-intent`
- `waitlist`

좋은 실행 결과는 아래를 항상 남겨야 합니다.

- selected MVP shape
- active flows
- deferred flows
- major copy/product changes applied
- required env vars for enabled capabilities
- verification result
- remaining manual follow-ups

### 4. 먼저 바뀌는 곳

첫 수정 surface는 [`apps/web/src/lib/product-config.ts`](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/apps/web/src/lib/product-config.ts)입니다.

여기서 먼저 맞추는 것:

- `mvp.shape`
- `activeFlows / deferredFlows`
- `primaryRoute / primaryCta`
- `navExposure / capability mode`
- `admin.highlightedMetrics`
- 서비스명
- hero angle
- trust signal
- lead / consultation copy
- quality metric

### 5. deeper code는 언제 필요한가

아래 정도는 보통 existing block 안에서 해결합니다.

- 서비스명과 hero copy 변경
- CTA 변경
- active flow와 deferred flow 조정
- payment/auth 노출 여부 조정
- admin에서 먼저 강조할 metric 변경
- inactive flow를 nav와 landing 기본 노출에서 숨기기
- active지만 env가 없는 capability를 `setup required` 상태로 보여주기

아래처럼 현재 블록으로 표현되지 않으면 deeper code를 수정합니다.

- 새 폼 필드 추가
- validation/schema 변경
- admin 표 컬럼 변경
- 새로운 도메인 규칙 추가

### 6. 마지막 확인

보통 아래를 확인하면 첫 데모 close가 됩니다.

- `/`: 랜딩과 리드 진입이 맞는가
- `/consult`: 상담 흐름이 필요한 경우 stronger signal처럼 보이는가
- `/pay`: payment가 active일 때 env 및 flow가 맞는가
- `/admin`: 핵심 metric과 setup required 상태가 맞게 보이는가
- `pnpm verify`: 타입, lint, 테스트가 통과하는가

선택적으로 `web + api` 모드도 같이 확인하려면:

- `pnpm dev:full`
- `PMF_API_BASE_URL=http://localhost:4000`
- `lead`, `consultation` submit가 Nest API로 저장되는가

## 실전 예시

### 입력

```text
가전렌탈 비교 사이트를 만들고 싶어.
사용자가 TV, 냉장고, 정수기 같은 렌탈 상품을 비교하고 내게 맞는 옵션을 찾게 하고 싶어.
첫 MVP 목표는 상담 신청이나 제휴 파트너 연결이야.
```

### 보통 나오는 첫 결과

- selected MVP shape: `comparison-routing`
- active flows: `landing`, `lead`, `consultation`, `admin`
- deferred flows: `payment`, `auth`

### 먼저 바뀌는 파일

- [`apps/web/src/lib/product-config.ts`](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/apps/web/src/lib/product-config.ts)

### 경우에 따라 추가로 바뀌는 surface

- `lead` surface
- `consultation` surface
- `admin` surface

### 완료 기준

- `/`, `/consult`, `/admin`이 comparison-routing 답게 보입니다.
- `pnpm verify`가 통과합니다.

### 정책/운영 제약 입력 예시

```text
출시 첫 주에는 결제보다 상담 전환을 먼저 확인하고 싶어.
개인정보는 최소 수집해야 하고 운영팀이 바로 후속 연락할 수 있어야 해.
첫 성공 기준은 7일 안에 qualified consultation request 10건이야.
```

### 이 입력에서 기대하는 첫 결과

- goal packet으로 먼저 정규화됩니다.
- selected MVP shape는 보통 `consultation`이 됩니다.
- active flows는 `landing`, `consultation`, `admin` 쪽으로 좁혀집니다.
- deferred flows는 `payment`, `auth`가 됩니다.

## Structured Helper

raw business idea에서 시작할 때는 one-shot prompt가 기본입니다. 다만 입력이 이미 구조화돼 있다면 helper를 써도 됩니다.

```bash
pnpm mvp:new <slug> --goal "..." --audience "..." --offer "..." --signal "..."
```

이 helper는 PRD 초안, 첫 work item, recipe, active flows, deferred flows, primary CTA, admin metric 초안을 함께 만듭니다.

## 관련 문서

- canonical prompt pack: [docs/ai-starter-prompt-pack.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/ai-starter-prompt-pack.md)
- README: [README.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/README.md)

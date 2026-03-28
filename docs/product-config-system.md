# Product Config System

## 목적

- 제품별 copy, trust, form surface를 한 곳에서 관리합니다.
- 비개발직군도 AI와 함께 제품 문구와 구조를 더 안전하게 바꿀 수 있게 합니다.
- 제품 품질의 최소 기준을 typed config와 테스트로 빨리 검증합니다.

## 기준 파일

- `apps/web/src/lib/product-config.ts`

이 파일은 현재 활성 제품의 아래 결정을 담습니다.

- mvp runtime contract
  - shape, active/deferred flow, primary route, primary CTA
  - nav exposure, optional capability mode, admin metric emphasis
- site chrome
  - 헤더 mark, 서비스명, 설명, primary CTA
- landing
  - hero badge, hero variant copy, hero highlight
- lead form
  - 제목, 설명, label, placeholder, consent, CTA
- consultation
  - 섹션 카피, benefit card, form label, placeholder, CTA
- quality
  - primary goal, trust signal, primary metric

## 왜 필요한가

기존에는 제품별 판단이 여러 TSX 파일에 흩어져 있어, AI가 빠르게 바꾸더라도 품질이 쉽게 흔들렸습니다.

- 헤더와 메타데이터가 generic한데 폼만 제품화될 수 있습니다.
- 랜딩 카피와 상담 폼 문구가 다른 제품을 말할 수 있습니다.
- 비개발직군이 어떤 파일을 바꿔야 하는지 알기 어렵습니다.

`product-config.ts`는 이 문제를 줄이기 위한 첫 번째 shared surface이자, v1 one-shot MVP의 runtime contract입니다.

## Product Apply Contract

새 MVP를 이 저장소에 적용할 때는 아래 계약을 기본값으로 둡니다.

1. 첫 수정 surface는 항상 `apps/web/src/lib/product-config.ts`입니다.
2. 먼저 `mvp.shape`, `activeFlows`, `deferredFlows`, `primaryRoute`, `primaryCta`, `navExposure`, `capabilities`, `admin.highlightedMetrics`를 정합니다.
3. existing block 안에서 해결 가능한 요청은 `product-config.mvp`와 product-facing copy 조정으로 끝냅니다.
4. 기존 block으로 표현되지 않는 요구일 때만 deeper code를 변경합니다.
5. auth와 payment는 optional capability이므로 비즈니스 목표가 요구할 때만 surface에 올립니다.

즉 이 저장소의 기본 적용 방식은 “새 코드를 많이 생성한다”가 아니라 “typed product surface를 먼저 맞춰 starter를 실제 제품처럼 보이게 만든다”입니다.

## 품질 가드레일

아래 기준은 `apps/web/src/lib/product-config.ts`의 validation과
`apps/web/src/lib/product-config.test.ts`로 빠르게 검증합니다.

- hero highlight는 최소 3개 이상
- consultation benefit card는 최소 3개 이상
- trust signal은 최소 3개 이상
- highlighted admin metric은 최소 2개 이상
- 핵심 문자열은 비어 있으면 안 됨
- shape와 active flow 조합은 recipe와 맞아야 함
- primary route와 primary CTA는 active flow를 가리켜야 함

목적은 “예쁘다”를 자동 판정하는 것이 아니라, 비즈니스 목표와 사용자 신뢰에 필요한 최소 표면이 빠지지 않게 하는 것입니다.

## 권장 작업 순서

1. 기본값은 [docs/ai-starter-prompt-pack.md](/Users/hyeongmin/Desktop/workspace/pmf-boilerplate/docs/ai-starter-prompt-pack.md)로 AI가 repo를 읽고 MVP shape를 정하게 합니다.
2. manual scaffold가 더 필요하고 입력이 이미 정리돼 있다면 `pnpm mvp:new <slug> --goal "..." --audience "..." --offer "..." --signal "..."`를 사용합니다.
3. PRD의 `Product Config Starter` section과 active/deferred flow 판단을 보고 서비스 방향을 확인합니다.
4. `apps/web/src/lib/product-config.ts`에서 `mvp` contract와 서비스 카피를 먼저 맞춥니다.
5. 랜딩, 리드 폼, 상담 폼, 필요한 경우 결제/어드민 surface가 같은 제품 언어를 쓰는지 browser QA로 확인합니다.
6. `pnpm verify`로 타입/테스트를 확인합니다.

## 현재 범위 밖

- 다중 제품 런타임 스위처
- 완전 no-code builder
- recipe library 전체 자동 생성
- CMS 기반 운영

이 문서는 첫 번째 config-first surface를 정의합니다. 더 넓은 recipe system과 generator는 다음 단계입니다.

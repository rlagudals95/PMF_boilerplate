# Toss Payment Demo

이 저장소는 Toss 단건 결제 데모를 `apps/web/src/modules/payment`에 둡니다.

## 목적

- 서버에서 결제를 생성한다.
- `retUrl`과 `resultCallback` 둘 다 받아 결제 상태를 저장한다.
- Postgres가 없어도 `packages/db/local-data.json`으로 결제 시도를 확인할 수 있게 한다.

## 필요한 환경변수

- `TOSS_PAYMENTS_API_KEY`
- `NEXT_PUBLIC_SITE_URL`

## 주요 경로

- `/pay`: 결제 데모 시작 페이지
- `/pay/result`: Toss `retUrl` 복귀 페이지
- `/pay/cancel`: Toss `retCancelUrl` 취소 페이지
- `/api/payments/toss/callback`: Toss `resultCallback` 수신 route
- `/admin/payments`: 저장된 결제 상태 조회

## 구현 기준

- Toss 결제 생성은 `https://pay.toss.im/api/v2/payments`를 사용한다.
- 응답의 `checkoutPage`로 브라우저를 이동시킨다.
- 브라우저 복귀와 callback이 모두 들어오더라도 중복 이벤트가 쌓이지 않게 상태 변경 시에만 추적한다.

## 개발 시 주의

- `NEXT_PUBLIC_SITE_URL=http://localhost:3000`으로도 브라우저 복귀는 테스트할 수 있다.
- 다만 `resultCallback`은 Toss 서버에서 호출하므로 로컬 개발에서는 터널링 없이 도달하지 않을 수 있다.
- 공식 레퍼런스: `https://docs-pay.toss.im/reference/normal/create`

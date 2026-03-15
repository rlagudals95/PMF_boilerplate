# @pmf/user-behavior-log

보일러플레이트에서 재사용 가능한 형태로 정리한 lightweight behavior logger 패키지입니다.

## 목적

- 앱이 제공한 sender 함수로 `page_view`, `click`, `impression` 이벤트를 보냅니다.
- 공통 context와 이벤트별 metadata를 합쳐서 일관된 payload를 만듭니다.
- React 프로젝트에서는 hook / wrapper component로 빠르게 연결할 수 있습니다.

## Core

```ts
import { createBehaviorLogger } from "@pmf/user-behavior-log";

const logger = createBehaviorLogger({
  send: async (event) => {
    await fetch("/api/track", {
      method: "POST",
      body: JSON.stringify(event),
    });
  },
  getContext: () => ({
    path: "/pricing",
    sessionId: "anon_123",
    metadata: {
      product: "modurent",
    },
  }),
});

await logger.click({
  element: {
    id: "hero-cta",
    type: "button",
  },
});
```

## React

```tsx
"use client";

import { BehaviorLoggerProvider, LogClick, LogPageView } from "@pmf/user-behavior-log/react";

export function PricingPage() {
  return (
    <BehaviorLoggerProvider logger={logger}>
      <LogPageView metadata={{ surface: "pricing" }} />
      <LogClick element={{ id: "hero-cta", type: "button" }}>
        <button type="button">상담 신청</button>
      </LogClick>
    </BehaviorLoggerProvider>
  );
}
```

## 설계 기준

- 패키지는 analytics provider, DB, route handler를 직접 알지 않습니다.
- 실패 처리 정책은 caller가 정합니다. sender가 throw하면 logger도 그대로 reject합니다.
- 제품 전용 taxonomy와 사내 유틸은 패키지 밖으로 밀어냅니다.

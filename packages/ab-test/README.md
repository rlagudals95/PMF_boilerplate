# @pmf/ab-test

현재 보일러플레이트에서 재사용 가능한 형태로 정리한 AB test 패키지입니다.

## 목적

- 앱이 정의한 실험 목록으로 cookie 기반 variant assignment를 수행합니다.
- Next.js middleware 같은 boundary에서 독립 실험과 상호배제 실험을 같이 처리합니다.
- client/server에서 현재 assignment map을 안전하게 읽을 수 있습니다.

## 핵심 API

```ts
import {
  applyAbTestMiddleware,
  defineAbTestDefinitions,
  type IndependentAbTestExperiment,
  type ExclusiveAbTestExperiment,
} from "@pmf/ab-test";
```

```ts
const experiments = defineAbTestDefinitions({
  independent: [
    {
      featureKey: "exp_landing_headline",
      description: "Hero headline test",
      variants: [
        { value: "control", weight: 50 },
        { value: "benefit", weight: 50 },
      ],
    },
  ],
  exclusive: [
    {
      featureKey: "exp_checkout_flow",
      description: "New checkout entry",
      trafficAllocation: 30,
      variants: [
        { value: "control", weight: 50 },
        { value: "streamlined", weight: 50 },
      ],
    },
  ],
});
```

```ts
import { NextRequest, NextResponse } from "next/server";
import { applyAbTestMiddleware } from "@pmf/ab-test";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  applyAbTestMiddleware(request, response, experiments);

  return response;
}
```

```ts
import { getAbTestAssignments } from "@pmf/ab-test/server";

const assignments = getAbTestAssignments(cookies(), experiments);
```

```tsx
"use client";

import { useAbTestAssignments } from "@pmf/ab-test/client";

const { assignments } = useAbTestAssignments(experiments);
```

## 설계 기준

- 패키지 안에는 특정 제품 전용 정책을 두지 않습니다.
- 잘못된 실험 정의는 middleware 진입 시 즉시 에러로 드러납니다.
- 상호배제 실험은 활성 실험 전체에서 최대 하나만 배정됩니다.

---
owner: "fe"
doc_type: "task-local"
source_of_truth: true
freshness: "active"
verification: "scripted"
status: skipped
owner_role: fe
source_request: "AI-native 운영 원칙 canonicalization plan 구현"
affected_paths: []
dependencies: []
skip_reason: "apps/web route, module, component, client/server state 흐름을 바꾸지 않고 문서와 adapter generation 경로만 조정한다."
---

# Frontend Spec

이번 작업은 `apps/web`의 route/module/component를 수정하지 않습니다.
사용자-facing 변경은 README와 prompt pack의 문구 정렬에 한정되며, 이는 frontend runtime spec이 아니라 docs/workflow alignment 범위로 처리합니다.

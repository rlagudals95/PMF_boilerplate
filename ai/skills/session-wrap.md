# Skill: Session Wrap

## Use when

- 작업 세션을 마무리하면서 변경사항을 요약하고 싶을 때
- 문서 갱신이 필요한지 점검한 뒤 정리해서 커밋하고 싶을 때
- PR 전이나 작업 종료 전에 docs drift와 commit 범위를 함께 확인하고 싶을 때

## Read first

1. `ai/context/project.md`
2. `ai/context/doc-sync.md`
3. `ai/context/spec-driven.md`
4. 관련 `ai/context/engineering*.md`
5. 관련 `docs/*`
6. 활성 `docs/work-items/<work-id>/*.md`

## Workflow

1. `git status --short`, `git diff --stat`, `git diff --cached --stat`, `git log --oneline -20`로 세션 변경을 파악합니다.
2. 변경을 구조, 기능, 실험, 운영 규칙 중 어디에 속하는지 분류합니다.
3. `ai/context/doc-sync.md` 기준으로 어떤 canonical 문서와 task-local 문서를 함께 봐야 하는지 정합니다.
4. 바뀐 코드와 현재 문서를 직접 읽고, 문서 갱신이 필요한지 판단합니다.
5. 사용자에게 아래 항목을 먼저 제안합니다.
   - 1-2문장 세션 요약
   - 갱신이 필요한 문서 목록과 이유
   - 각 문서에 넣을 정확한 수정안
   - 제안 커밋 메시지
6. 사용자 승인 후에만 문서 수정과 커밋을 수행합니다.
7. 마무리할 때 적용된 문서, 커밋 해시, 남은 리스크나 미실행 검증을 함께 남깁니다.

## Document targeting rules

- 반복 규칙, 읽기 순서, 운영 모델 변경은 `ai/context/*`, `ai/skills/*`, `docs/agent-context.md` 같은 canonical 문서를 우선 봅니다.
- 현재 작업 범위, acceptance criteria, skip reason은 `docs/work-items/*` 같은 task-local 문서에 둡니다.
- 구조 변경이면 `docs/architecture.md`와 관련 `engineering-*` 문서를 같이 점검합니다.
- 실험 정의 변경이면 `docs/experiment-playbook.md`와 관련 spec을 같이 점검합니다.
- 작은 버그 수정이나 문서가 이미 설명하는 범위 안의 구현 수정은 문서 갱신 없이 넘어갈 수 있지만, 왜 갱신이 불필요한지는 설명할 수 있어야 합니다.

## Commit guidance

- 문서 갱신과 커밋은 분리해서 승인받을 수 있어야 합니다.
- auto message를 만들면 제목은 `feat`, `fix`, `refactor`, `docs`, `chore`, `test` 중 하나로 시작합니다.
- 커밋 본문에는 핵심 변경과 문서 갱신 파일만 짧게 적습니다.
- unrelated change나 사용자가 만든 별도 수정은 임의로 정리하거나 되돌리지 않습니다.

## Guardrails

- 문서에는 실제 코드와 diff에서 검증된 사실만 적습니다.
- adapter entry에 본문 규칙을 복붙하지 않습니다.
- 특정 벤더 전용 파일을 source of truth로 취급하지 않습니다.
- 문서 수정이 필요 없으면 그 사실을 명시하고 커밋 흐름만 진행할 수 있습니다.
- 사용자 승인 없이 커밋하지 않습니다.

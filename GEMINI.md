# GEMINI.md

Gemini용 진입 문서입니다.

## Load order

1. `ai/context/project.md`
2. `ai/context/engineering.md`
3. `ai/context/engineering-common.md`
4. 현재 작업에 맞는 `ai/context/engineering-frontend.md`, `ai/context/engineering-backend.md` 중 하나 또는 둘 다
5. `ai/skills/_index.md`
6. 관련 스킬 문서
7. `docs/agent-context.md`
8. `docs/architecture.md`

## Notes

- 공통 규칙의 canonical source는 `ai/`입니다.
- 이 파일은 Gemini가 읽기 쉬운 얇은 어댑터만 담당합니다.
- FE 작업이면 frontend 문서를, domain/DB/integration 작업이면 backend 문서를 읽습니다.
- full-stack 작업이면 common + frontend + backend 문서를 모두 읽습니다.

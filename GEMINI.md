# GEMINI.md

Gemini용 진입 문서입니다.

## Load order

1. `ai/context/project.md`
2. `ai/context/engineering.md`
3. `ai/context/engineering-common.md`
4. `ai/context/spec-driven.md`
5. 현재 작업에 맞는 `ai/context/engineering-frontend.md`, `ai/context/engineering-backend.md` 중 하나 또는 둘 다
6. `ai/context/doc-sync.md`
7. `ai/skills/_index.md`
8. 관련 스킬 문서
9. `docs/agent-context.md`
10. `docs/architecture.md`

## Notes

- 공통 규칙의 canonical source는 `ai/`입니다.
- 이 파일은 Gemini가 읽기 쉬운 얇은 어댑터만 담당합니다.
- FE 작업이면 frontend 문서를, domain/DB/integration 작업이면 backend 문서를 읽습니다.
- full-stack 작업이면 common + frontend + backend 문서를 모두 읽습니다.
- `pnpm ai:sync`를 실행하면 `.gemini/commands/repo/*.toml`과 `.gemini/extensions/*/skills/*/SKILL.md`가 생성됩니다.
- 프로젝트 안에서는 `/repo:<skill>` 명령을 바로 쓸 수 있고, extension을 링크하면 bundled skills도 사용할 수 있습니다.
- 생성된 `.gemini/*`는 adapter 산출물이고 source of truth는 `ai/`입니다.

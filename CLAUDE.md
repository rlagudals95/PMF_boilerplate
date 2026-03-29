# CLAUDE.md

Claude Code용 진입 문서입니다.

## Load order

1. `ai/context/project.md`
2. `ai/context/ai-native.md`
3. `ai/context/engineering.md`
4. `ai/context/engineering-common.md`
5. `ai/context/spec-driven.md`
6. 현재 작업에 맞는 `ai/context/engineering-frontend.md`, `ai/context/engineering-backend.md` 중 하나 또는 둘 다
7. `ai/context/doc-sync.md`
8. `ai/skills/_index.md`
9. 관련 스킬 문서
10. `docs/agent-context.md`
11. `docs/architecture.md`

## Notes

- 공통 규칙의 canonical source는 `ai/`입니다.
- 이 파일에는 Claude 전용 포맷을 최소화하고, 실제 팀 규칙은 복제하지 않습니다.
- FE 작업이면 frontend 문서를, domain/DB/integration 작업이면 backend 문서를 읽습니다.
- full-stack 작업이면 common + frontend + backend 문서를 모두 읽습니다.
- `pnpm ai:sync`를 실행하면 `.claude/skills/<skill-name>/SKILL.md`가 생성되고 Claude skills로 사용할 수 있습니다.
- 생성된 `.claude/*`는 adapter 산출물이고 source of truth는 `ai/`입니다.

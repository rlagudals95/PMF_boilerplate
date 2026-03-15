# Vibe Coding Playbook

이 문서는 이 저장소가 PMF 탐색용 “바이브 코딩”에 얼마나 잘 맞는지 평가하고, 속도와 품질을 동시에 지키기 위한 운영 기준을 정리합니다.

## 결론

현재 이 저장소는 “바이브 코딩이 가능한 보일러플레이트” 수준은 넘습니다.  
특히 canonical context, spec-driven 문서, modular monolith 경계, 로컬 fallback, 기본 검증 루프는 강점입니다.

다만 최신 AI 코딩 도구들의 공통 패턴과 비교하면 아래가 같이 필요했습니다.

- 도구 네이티브 instruction 파일
- 중요한 작업을 바로 문서화할 수 있는 scaffolding
- 빠른 기본 quality gate와 더 무거운 release gate의 분리

이 문서와 함께 추가된 `pnpm work:new`, `pnpm verify`, `pnpm verify:full`, `pnpm ai:sync` 기반 adapter 생성은 그 간극을 메우기 위한 개선입니다.

## 최근 도구들이 공통으로 강조하는 패턴

### 1. 프로젝트 지식을 repo 안에 저장한다

- Anthropic Claude Code는 repo memory와 slash command를 권장합니다.  
  참고: [Claude Code common workflows](https://docs.anthropic.com/en/docs/claude-code/common-workflows), [slash commands](https://docs.anthropic.com/en/docs/claude-code/slash-commands), [memory](https://docs.anthropic.com/en/docs/claude-code/memory)
- GitHub Copilot은 repo-wide custom instructions 파일을 공식 지원합니다.  
  참고: [Adding repository custom instructions for GitHub Copilot](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot)
- Cursor는 project rules를 `.cursor/rules`에 두는 방식을 중심 UX로 둡니다.  
  참고: [Cursor rules for AI](https://docs.cursor.com/en/context/rules-for-ai), [Cursor background agents](https://docs.cursor.com/en/background-agent)
- v0 역시 project instructions와 rules를 별도 관리하도록 유도합니다.  
  참고: [v0 team quickstart](https://v0.dev/docs/quickstart/team), [project instructions](https://v0.dev/chat/settings/project-instructions), [rules](https://v0.dev/chat/settings/rules)

의미:

- AI가 잘 일하려면 “프롬프트 한 번”보다 “repo 안에 남는 지식”이 더 중요합니다.

### 2. 범용 규칙과 파일별 규칙을 분리한다

- Cursor는 repo rule과 scoped rule을 같이 쓰게 합니다.
- GitHub Copilot도 repo custom instruction과 instruction file 계층을 제공합니다.
- Windsurf, Lovable도 memories/knowledge를 프로젝트 단위로 쌓는 방향을 취합니다.  
  참고: [Windsurf memories](https://docs.windsurf.com/windsurf/cascade/memories), [Lovable knowledge](https://docs.lovable.dev/features/knowledge), [Lovable prompting](https://docs.lovable.dev/tips-tricks/prompting)

의미:

- “이 repo 전체 규칙”과 “frontend/backend/docs에서만 쓰는 규칙”을 분리해야 에이전트가 덜 헷갈립니다.

### 3. 계획과 구현을 분리한다

- Anthropic은 plan mode, 병렬 세션, worktree 활용을 계속 권장합니다.
- OpenAI Codex도 task 격리와 repo instruction 파일을 강조합니다.  
  참고: [Introducing Codex](https://openai.com/index/introducing-codex/), [Harnessing engineering agents](https://openai.com/index/harnessing-engineering-agents/)

의미:

- 빠른 코딩일수록 “중요한 작업은 짧은 spec을 먼저 만든다”는 규칙이 오히려 품질을 지킵니다.

### 4. 검증 루프는 짧고 명확해야 한다

- Replit Agent는 checkpoint와 rollback을 전면에 둡니다.  
  참고: [Replit Agent](https://replit.com/ai)
- AI 코딩 툴 대부분은 “작은 단위 구현 -> 즉시 검증 -> 되돌리기 가능” 흐름을 전제로 합니다.

의미:

- `lint`, `typecheck`, `test`, `e2e`가 있어도 한 번에 기억해서 돌려야 하면 바이브 코딩 UX는 나빠집니다.

## 이 저장소의 현재 점수표

| 항목 | 현재 상태 | 평가 |
| --- | --- | --- |
| Canonical project context | `ai/context/*`, `AGENTS.md`, `docs/agent-context.md` | 강함 |
| 중요한 작업 문서화 규칙 | `spec-driven`, `product-squad`, `docs/work-items/*` | 강함 |
| 도구 네이티브 adapter | Claude, Gemini, Codex + Copilot + Cursor | 개선됨 |
| 범위별 instruction | Copilot repo-wide, Cursor repo/frontend/backend/docs rules | 개선됨 |
| 빠른 기본 quality gate | `pnpm verify` | 개선됨 |
| 더 무거운 release gate | `pnpm verify:full` | 개선됨 |
| work item scaffolding | `pnpm work:new` | 개선됨 |
| 로컬 실행 가능성 | local JSON fallback + smoke E2E | 강함 |
| hosted AI builder 직접 최적화 | v0/Lovable 전용 산출물 없음 | 부분적 |
| checkpoint/rollback 자동화 | 툴 내장 기능 의존, repo 자체 자동화 없음 | 부분적 |

## 이 저장소를 바이브 코딩에 잘 맞게 쓰는 권장 흐름

### Quick fix

1. `AGENTS.md`와 관련 canonical doc만 읽습니다.
2. 작은 수정이면 full work item 없이 진행합니다.
3. 구현 후 `pnpm verify`를 돌립니다.

### Important change

1. `pnpm work:new <slug> --request "<원 요청>"`로 work item을 만듭니다.
2. `brief.md`와 필요한 role spec을 채웁니다.
3. 구현은 그 문서를 기준으로 진행합니다.
4. 구조나 운영 규칙이 바뀌면 canonical doc을 같이 갱신합니다.
5. `pnpm verify:full`로 종료합니다.

### AI context change

1. `ai/`, `AGENTS.md`, `README.md`, `docs/agent-context.md`를 수정합니다.
2. `pnpm ai:sync`로 Copilot, Cursor, Claude, Gemini, Codex adapter를 다시 생성합니다.
3. `pnpm verify`로 문서/스크립트 drift를 확인합니다.

## 왜 이 저장소가 “상당히 좋지만 아직 완전 최고는 아닌가”

현재 구조는 “AI가 막 써도 망가지기 어려운 구조”에는 꽤 가깝습니다.  
하지만 최신 vibe coding 도구들이 강조하는 두 영역은 아직 일부만 커버합니다.

- hosted builder 전용 산출물
  - v0/Lovable 전용 project knowledge 파일까지 자동 생성하지는 않습니다.
- checkpoint/preview automation
  - Replit 같은 자동 checkpoint 경험은 repo 밖 도구 기능에 더 의존합니다.

즉, 이 저장소는 “속도와 품질을 둘 다 잡으려는 개발자”에게는 이미 강한 편이지만, “도구가 거의 다 알아서 해주는 초자동 vibe coding”까지는 의도적으로 가지 않습니다.

## 의도적인 trade-off

- auth, CMS, background jobs 같은 무거운 기능을 넣지 않습니다.
- 문서와 구조 규칙을 유지하는 대신, 무규칙한 instant prototyping 속도는 일부 포기합니다.
- vendor-neutral context를 우선하기 때문에 특정 hosted builder 하나에 완전히 맞춘 UX는 덜합니다.

이 trade-off는 PMF 탐색용 보일러플레이트로는 합리적입니다.

## 지금 기준 최종 평가

- “AI가 빠르게 코딩하기 좋은가?”: 예
- “속도만 빠른 게 아니라 품질 가드레일이 있는가?”: 예
- “최신 vibe coding 도구들의 베스트 패턴을 충분히 흡수했는가?”: 이제는 상당 부분 예
- “모든 도구에서 최고로 네이티브한 경험인가?”: 아직 부분적으로만 예

실무적으로는 “매우 강한 AI-native PMF 보일러플레이트”라고 볼 수 있습니다.  
다만 철학은 여전히 “무제한 자유”가 아니라 “빠르되 무너지지 않게” 쪽입니다.

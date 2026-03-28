---
title: "Codex Variant A S-01"
tool: "Codex"
prompt_variant: "Variant A"
scenario_id: "S-01"
evaluator: "Codex"
date: "2026-03-28"
status: "done"
---

# Prompt Evaluation Report

## Scenario

- idea: `나는 렌탈 지원금을 비교해주는 사이트를 만들고 싶고 최종 목표는 렌탈사로 보내는 거야.`
- expected_recipe: `comparison-routing`
- target outcome: `partner handoff 중심의 qualified lead 확보`

## Prompt Used

```text
pnpm mvp:new rental-support-match --prompt "나는 렌탈 지원금을 비교해주는 사이트를 만들고 싶고 최종 목표는 렌탈사로 보내는 거야"
```

## Run Conditions

- repo state: temp workspace copied from `main@1324427`
- branch: `main`
- fresh session: yes
- extra hints given: no

## Outcome Summary

- selected recipe: `comparison-routing`
- active flows: `landing`, `lead capture`, `consultation`, `admin`
- deferred flows: `payment demo`, `social auth starter`, `heavy experiment setup`
- primary CTA: `내 조건으로 비교 결과 받기`
- key metrics: `qualified_lead_rate`, `consultation_request_rate`, `partner_handoff_count`
- commands executed:
  - `pnpm mvp:new rental-support-match --prompt "나는 렌탈 지원금을 비교해주는 사이트를 만들고 싶고 최종 목표는 렌탈사로 보내는 거야"`

## Clarifications

- tool asked: 없음
- user answered: 없음

## Scores

| Criterion | Score (1-5) | Notes |
| --- | --- | --- |
| Goal Packet Extraction | 4 | goal, audience, offer, signal 초안이 모두 생성됐고 방향도 맞았다. 다만 `goal` 표현이 `렌탈사로 보내는 것` 수준이라 운영 지표 문장으로는 조금 더 다듬을 여지가 있다. |
| Recipe Selection | 5 | expected recipe인 `comparison-routing`을 정확히 선택했다. |
| Command Correctness | 5 | repo에서 실제로 실행 가능한 `pnpm mvp:new` 명령을 올바르게 사용했고 PRD/work item 생성까지 성공했다. |
| Artifact Completeness | 4 | PRD와 work item은 생성됐고 setup summary도 충분했다. 다만 `product-config` 수정과 `verify`까지 자동으로 닫는 흐름은 Variant A 자체 범위 밖이다. |
| Scope Control | 5 | 첫 MVP에서 `landing + lead + consultation + admin`만 활성화하고 payment/auth를 제외해 범위가 얇고 측정 가능했다. |
| Clarification Overhead | 5 | 추가 질문 없이 바로 진행됐다. |
| Portability | 5 | plain CLI 명령이라 도구 종속성이 없고 가장 높은 이식성을 가진다. |
| Final Summary Usefulness | 4 | recipe, active/deferred flow, CTA, metrics가 모두 요약됐다. 다만 business framing 설명은 Full AI Prompt보다 짧다. |

## Decision

- average score: `4.6 / 5`
- recommendation: `ship`

## Notes

- Variant A는 가장 deterministic한 baseline으로 적합하다.
- Codex 환경에서는 repo artifact 생성이 빠르고 안정적이어서 baseline prompt로 유지 가치가 높다.
- 다음 비교는 같은 S-01 시나리오로 Variant B, Variant C를 Codex fresh session에서 각각 기록한 뒤, 이후 Cursor와 Claude Code로 확장하는 순서가 적절하다.

---
description: Activate Production mode for this session
---

Production mode is now **ACTIVE** for this session.

You MUST follow the hard-enforced workflow defined in AGENTS.md:

1. **PLAN** — Understand the requirement, research the codebase, ask clarifying questions.
2. **ARCHITECT** — Invoke `@architect` to decompose into small PRs → `DELIVERY_PLAN.md`. STOP and await user approval.
3. **BUILD** — Run `/start` for test baseline, implement ONE PR, run tests to verify.
4. **REVIEW** — Run `/review` to invoke `@reviewer`. Fix all BLOCK findings.
5. **STOP** — Present summary of changes. DO NOT COMMIT. User verifies and commits manually.

REPEAT phases 3-5 for each PR until `DELIVERY_PLAN.md` is complete.

Phase violations (skipping phases, auto-committing, ignoring FAIL verdicts) are forbidden.

Acknowledge this mode activation and await the user's feature request.

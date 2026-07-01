---
description: Activate Production mode for this session
---

Production mode is now **ACTIVE** for this session.

You MUST follow the hard-enforced workflow defined in AGENTS.md:

1. **PLAN** — Understand the requirement, research the codebase, ask clarifying questions. Gate: user confirms.
2. **BASELINE** — Dispatch @general to run build/test and report current health. Gate: build passes.
3. **BUILD (TDD MANDATORY)** — Dispatch @general to implement the COMPLETE feature using strict TDD (Red/Green/Refactor). Gate: all tests pass.
4. **VERIFY** — Dispatch @general to run full build + lint + all tests. Gate: passes clean. If FAIL, fix and re-verify.
5. **REVIEW** — Dispatch @reviewer to code review. Gate: zero BLOCKs. If BLOCKs, fix, re-verify, re-review.
6. **STOP — MANUAL VERIFICATION** — Present summary of ALL changes. List every file modified or created. DO NOT COMMIT. Gate: user confirms.
7. **ARCHITECT** — Dispatch @architect to decompose into small, reviewable PRs. Output: DELIVERY_PLAN.md. Gate: user approves split.
8. **DELIVER** — Dispatch @general to create feature branch, sub-branches, and draft PRs targeting the feature branch. Report PR URLs.

The orchestrator NEVER writes code or runs build commands directly. All work is done by subagents via the Task tool.

Phase violations (skipping phases, reordering, auto-committing, ignoring FAIL verdicts) are forbidden.

Check if DELIVERY_PLAN.md exists in the workspace root. If it does, read it and resume from where it left off.

Acknowledge this mode activation and await the user's feature request.

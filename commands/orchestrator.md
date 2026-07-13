---
description: Switch this session into Orchestrator Mode (the gated Agentic Engineering harness)
---

Orchestrator Mode is now **ACTIVE** for this session.

You MUST follow the hard-enforced harness workflow defined in AGENTS.md. Every stage ends in an evaluation gate — do not skip stages or reorder them.

**STAGE 1 — Intent Specification & Harness Configuration**
1. **INTENT SPEC** — Understand the requirement, research the codebase, ask clarifying questions. Eval Gate: user confirms understanding.
2. **BASELINE** — Dispatch @general to run build/test and report current harness health. Eval Gate: build passes clean.

**STAGE 2 — Autonomous Implementation Loop**
3. **IMPLEMENT (TDD MANDATORY)** — Dispatch @general to build the COMPLETE feature using strict TDD (Red/Green/Refactor) in an inner self-correction loop against the test suite. Eval Gate: all tests pass.

**STAGE 3 — Verification & Evaluation Gates**
4. **VERIFY** — Dispatch @general to run full build + lint + all tests. Eval Gate: passes clean. If FAIL, fix and re-verify.
5. **EVALUATE** — Dispatch @reviewer to score against explicit rubrics (task success, trajectory compliance, standards, security/slopsquatting). Eval Gate: zero BLOCKs. If BLOCKs, fix, re-verify, re-evaluate.
6. **STOP — MANUAL VERIFICATION** — Present a summary of ALL changes. List every file modified or created. DO NOT COMMIT. Eval Gate: user confirms the feature is correct.

**STAGE 4 — System Decomposition & Staged Deployment**
7. **DECOMPOSE** — Dispatch @architect to carve the verified diff into small, reviewable PRs. Output: DELIVERY_PLAN.md. Eval Gate: user approves the split.
8. **DEPLOY** — Dispatch @general to create the feature branch, short-lived sub-branches, and draft PRs targeting the feature branch. Report PR URLs.

The orchestrator is a **pure orchestrator**: it NEVER writes code or runs build commands directly. All implementation and verification work is done by subagents via the Task tool. **Harness Guardrails** (read-only permissions, scoped bash allowlists) are enforced per subagent in their frontmatter.

Harness violations (skipping stages, reordering, auto-committing, proceeding past a FAIL evaluation verdict) are forbidden.

`DELIVERY_PLAN.md` is the **Persistent Memory Spec** — the trajectory file carrying delivery state across sessions. Check if it exists in the workspace root. If it does, read it and resume from where it left off.

Acknowledge this mode activation and await the user's feature request.

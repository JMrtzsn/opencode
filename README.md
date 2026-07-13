# OpenCode Global Config

Personal [OpenCode](https://opencode.ai) configuration. Applies globally across all projects via `~/.config/opencode/`.

## Developer Postures

### Conductor Mode (default)

Real-time, hands-on steering. No process gates. Build fast, write good code. Architectural constraints from `AGENTS.md` apply as guidance but nothing blocks progress.

### Orchestrator Mode (`/orchestrator`)

Asynchronous, multi-file delegation through a gated Agentic Engineering harness. Every stage ends in an evaluation gate — no skipping, no reordering.

```
STAGE 1 Intent Spec & Harness Config  →  STAGE 2 Autonomous Implementation Loop
  →  STAGE 3 Verification & Evaluation Gates  →  STAGE 4 System Decomposition & Staged Deployment
```

| Stage | Sub-steps | What happens |
|---|---|---|
| **1 — Intent Specification & Harness Configuration** | INTENT SPEC, BASELINE | Understand the requirement, research, ask questions (gate: user confirms), then establish current harness health (gate: clean build). |
| **2 — Autonomous Implementation Loop** | IMPLEMENT | Build the complete feature using strict TDD (Red/Green/Refactor) in an inner self-correction loop. No production code without a failing test. Gate: all tests pass. |
| **3 — Verification & Evaluation Gates** | VERIFY, EVALUATE, STOP | Full build + lint + tests (gate: clean); `@reviewer` scores against rubrics — task success, trajectory, security, standards (gate: zero BLOCKs); present changes, no commits (gate: user confirms). |
| **4 — System Decomposition & Staged Deployment** | DECOMPOSE, DEPLOY | `@architect` carves the verified diff into small, reviewable PRs (gate: user approves split); each PR branches off the feature branch and targets it via draft PR. |

The main agent is a pure orchestrator — it never writes code or runs builds directly. All work is dispatched to subagents under **Harness Guardrails** (scoped read-only permissions).

## File Reference

| File | Purpose |
|---|---|
| `AGENTS.md` | Core agent instructions: directives, harness stages, architectural constraints, language specs (Go, TypeScript, Python). Loaded automatically by OpenCode. |
| `WORKFLOW_RULES.md` | Compaction-safe enforcement rules for Orchestrator Mode stage ordering and verification. Referenced by `opencode.json`. |
| `opencode.json` | OpenCode configuration. Points to `WORKFLOW_RULES.md` as additional instructions. |
| `tui.json` | TUI settings (scroll acceleration). |
| `agents/architect.md` | Subagent definition for `@architect`. Runs System Decomposition, outputs `DELIVERY_PLAN.md`. Read-only except for the plan file. |
| `agents/reviewer.md` | Subagent definition for `@reviewer`. Read-only evaluation agent. Reports PASS/FAIL with BLOCK/WARN findings. |
| `commands/orchestrator.md` | `/orchestrator` — switches the session into Orchestrator Mode. |
| `commands/tdd.md` | `/tdd` — strict Red/Green TDD protocol. Mandatory in the Autonomous Implementation Loop. |
| `commands/next-pr.md` | `/next-pr` — executes the next pending PR from `DELIVERY_PLAN.md`. |
| `commands/review.md` | `/review` — invokes `@reviewer` to run the EVALUATE gate on uncommitted changes. |

## Key Principles

- **TDD is mandatory** in Orchestrator Mode. No production code without a failing test first.
- **Build first, decompose later.** The full feature is built and verified before decomposing into PRs.
- **PRs are always drafts.** Never create a non-draft PR unless explicitly requested.
- **No TODOs in code.** Resolve everything before completing a task.
- **Standard library first.** Third-party dependencies require justification.

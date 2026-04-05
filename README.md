# OpenCode Global Config

Personal [OpenCode](https://opencode.ai) configuration. Applies globally across all projects via `~/.config/opencode/`.

## Workflow Modes

### Vibe Mode (default)

No process gates. Build fast, write good code. Architectural constraints from `AGENTS.md` apply as guidance but nothing blocks progress.

### Production Mode (`/production`)

Gated workflow with mandatory phases. Every phase is a hard stop — no skipping, no reordering.

```
PLAN → BASELINE → BUILD (TDD) → VERIFY → REVIEW → STOP → ARCHITECT → DELIVER
```

| Phase | What happens |
|---|---|
| **PLAN** | Understand the requirement, research, ask questions. Gate: user confirms. |
| **BASELINE** | Run build/tests, establish current health. Gate: clean build. |
| **BUILD** | Implement the complete feature using strict TDD (Red/Green/Refactor). No production code without a failing test. Gate: all tests pass. |
| **VERIFY** | Full build + lint + all tests. Gate: clean build. |
| **REVIEW** | `@reviewer` checks against SOLID, KISS, YAGNI, language rules. Gate: zero BLOCKs. |
| **STOP** | Present changes to user. No commits. Gate: user confirms. |
| **ARCHITECT** | `@architect` splits the verified feature into small, reviewable PRs. Gate: user approves split. |
| **DELIVER** | Create a feature branch from main. Each PR branches off the feature branch and targets it via draft PR. Final draft PR merges the feature branch into main. |

The main agent is a pure orchestrator — it never writes code or runs builds directly. All work is dispatched to subagents.

## File Reference

| File | Purpose |
|---|---|
| `AGENTS.md` | Core agent instructions: directives, workflow phases, architectural constraints, language specs (Go, TypeScript, Python). Loaded automatically by OpenCode. |
| `WORKFLOW_RULES.md` | Compaction-safe enforcement rules for Production mode phase ordering and verification. Referenced by `opencode.json`. |
| `opencode.json` | OpenCode configuration. Points to `WORKFLOW_RULES.md` as additional instructions. |
| `tui.json` | TUI settings (scroll acceleration). |
| `agents/architect.md` | Subagent definition for `@architect`. Decomposes features into PRs, outputs `DELIVERY_PLAN.md`. Read-only except for the plan file. |
| `agents/reviewer.md` | Subagent definition for `@reviewer`. Read-only code reviewer. Reports PASS/FAIL with BLOCK/WARN findings. |
| `commands/production.md` | `/production` — activates Production mode for the session. |
| `commands/tdd.md` | `/tdd` — strict Red/Green TDD protocol. Mandatory in Production BUILD phase. |
| `commands/next-pr.md` | `/next-pr` — executes the next pending PR from `DELIVERY_PLAN.md`. |
| `commands/review.md` | `/review` — invokes `@reviewer` to check uncommitted changes. |
| `commands/start.md` | `/start` — runs the test suite to establish baseline health. |

## Key Principles

- **TDD is mandatory** in Production mode. No production code without a failing test first.
- **Build first, split later.** The full feature is built and verified before decomposing into PRs.
- **PRs are always drafts.** Never create a non-draft PR unless explicitly requested.
- **No TODOs in code.** Resolve everything before completing a task.
- **Standard library first.** Third-party dependencies require justification.

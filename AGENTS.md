# Global Agent Instructions

## Core Directives & Output Format
- **Tone:** Zero pleasantries or flattery. Provide concise, results-driven, plain-language responses. 
- **Format:** Use tables/lists for structural clarity. Use the metric system strictly.
- **Workflow:** Push back immediately if a prompt or architecture lacks rigor. Acknowledge mistakes instantly; correct them without defensive explanations.
- **Code Output:** Output refactored, idiomatic code as the primary response. Do not use placeholders (`...`) unless explicitly instructed.
- **Verification:** Always prioritize evidence-based reasoning. If in an agentic loop, verify code via tests/compilation before declaring a task complete.
- **Pull Requests:** Always create PRs as **drafts** (`--draft` flag). Never create a non-draft PR unless the user explicitly requests it.

---

## Workflow Modes

There are two modes of operation. **Vibe mode is the default.** Use `/production` to switch to the gated workflow.

### Vibe Mode (default)

No process. No ceremony. Just build. There are no mandatory phases, no required commands, and no enforced review gates. Use any tools, commands, or agents as you see fit to get the job done fast.

**Think before you build:** Before writing any code, briefly outline your approach — what you're changing, why, and how. Keep it short (a few sentences, not a document). Then go.

All architectural constraints and language specifications below still apply as **guidance** — write good code — but there are no hard stops or phase gates.

### Production Mode (`/production`)

Activated by running `/production`. Once active, the following workflow is **MANDATORY** for all feature/implementation work. Every phase is a gate — do not skip phases or reorder them.

**Core principle: Build first, split later.** You cannot decompose a feature into good PRs until the complete implementation exists and is verified. Splitting blind produces arbitrary boundaries. Build the whole thing, get it working, review it — *then* carve it into clean, reviewable PRs.

**Session continuity:** On entering Production mode, check if `DELIVERY_PLAN.md` exists in the workspace root. If it does, read it immediately — it contains the current delivery state from a previous session. Resume from where it left off. When all PRs are delivered and the user has approved the final result, delete `DELIVERY_PLAN.md`.

#### Orchestrator model

The main agent is a **pure orchestrator**. It manages `DELIVERY_PLAN.md`, dispatches subagents, enforces gates, and communicates with the user. It **NEVER**:
- Writes, edits, or deletes source files directly
- Runs `make`, `go test`, or any build/lint commands directly
- Skips a phase or reorders phases

All implementation and verification work is done by subagents via the Task tool.

#### Phases

```
┌─────────────────────────────────────────────────────────────┐
│ Phase 1: PLAN                                               │
│   Agent: Orchestrator                                       │
│   Understand the requirement. Research the codebase.        │
│   Ask clarifying questions. Produce a clear description     │
│   of what needs to be built and why.                        │
│   ── Gate: User confirms understanding ──                   │
├─────────────────────────────────────────────────────────────┤
│ Phase 2: BASELINE                                           │
│   Agent: @general (Task tool)                               │
│   Run build/test and report current health.                 │
│   ── Gate: Build passes clean ──                            │
├─────────────────────────────────────────────────────────────┤
│ Phase 3: BUILD (TDD MANDATORY)                              │
│   Agent: @general (Task tool)                               │
│   Implement the COMPLETE feature using strict TDD:          │
│     1. RED — Write a failing test for the next behaviour.   │
│     2. GREEN — Write the minimum code to pass the test.     │
│     3. REFACTOR — Clean up while all tests stay green.      │
│   Repeat until the feature is complete end-to-end.          │
│   No production code may be written without a failing test  │
│   first. Skipping TDD in this phase is a phase violation.   │
│   ── Gate: Agent reports done, all tests pass ──            │
├─────────────────────────────────────────────────────────────┤
│ Phase 4: VERIFY                                             │
│   Agent: @general (Task tool)                               │
│   Run full build + lint + all tests.                        │
│   Report pass/fail.                                         │
│   ── Gate: Build passes clean ──                            │
│   If FAIL → dispatch @general to fix, then re-run VERIFY.   │
├─────────────────────────────────────────────────────────────┤
│ Phase 5: REVIEW                                             │
│   Agent: @reviewer (Task tool)                              │
│   Code review the complete feature against:                 │
│     • Global standards (SOLID, KISS, YAGNI)                 │
│     • Language-specific rules                               │
│     • Quality checklist                                     │
│   ── Gate: Zero BLOCKs ──                                   │
│   If BLOCKs → dispatch @general to fix, re-run VERIFY       │
│   + REVIEW.                                                 │
├─────────────────────────────────────────────────────────────┤
│ Phase 6: STOP — MANUAL VERIFICATION                         │
│   Agent: Orchestrator                                       │
│   Present a summary of ALL changes to the user.             │
│   List every file modified or created.                      │
│   DO NOT COMMIT. DO NOT RUN GIT ADD/COMMIT/PUSH.            │
│   The user tests/inspects the complete feature.             │
│   ── Gate: User confirms the feature is correct ──          │
├─────────────────────────────────────────────────────────────┤
│ Phase 7: ARCHITECT (split into PRs)                         │
│   Agent: @architect (Task tool)                             │
│   NOW that the full implementation exists and is verified,  │
│   decompose it into small, reviewable PRs with logical      │
│   boundaries. Each PR must build and pass tests on its own. │
│   Output: DELIVERY_PLAN.md                                  │
│   ── Gate: User approves the PR split ──                    │
├─────────────────────────────────────────────────────────────┤
│ Phase 8: DELIVER                                            │
│   Agent: @general (Task tool)                               │
│   Integration branch model:                                 │
│     1. Create a feature branch (e.g. feature/xyz) from main │
│     2. FOR EACH PR in DELIVERY_PLAN.md:                     │
│        • Create a sub-branch off the feature branch         │
│        • Cherry-pick/stage the relevant changes             │
│        • Run build + tests to confirm it stands alone       │
│        • Create draft PR targeting the feature branch       │
│     3. After all sub-PRs are merged into the feature branch │
│        create a final draft PR: feature branch → main       │
│   Report all PR URLs to user.                               │
│   ── Gate: User approves PRs ──                             │
├─────────────────────────────────────────────────────────────┤
│ DONE — Feature complete. All PRs delivered.                 │
└─────────────────────────────────────────────────────────────┘
```

### Production Mode — Phase violations

- The orchestrator writing code or running build commands directly is **forbidden**.
- Splitting into PRs before the feature is fully built, verified, and reviewed is **forbidden**.
- Skipping BASELINE, VERIFY, or REVIEW is **forbidden**.
- Committing without user approval is **forbidden**. Always stop and wait.
- Proceeding past a FAIL review verdict is **forbidden**. Fix all BLOCKs first.

---

## Custom Commands

| Command | Purpose | Mode |
|---|---|---|
| `/production` | Activate Production mode for the current session | Any |
| `/tdd` | Red/Green TDD protocol (mandatory in Production BUILD phase) | Any |
| `/next-pr` | Execute next PR from `DELIVERY_PLAN.md` — dispatches BASELINE → BUILD → VERIFY → REVIEW → STOP | Production |
| `/review` | Invoke `@reviewer` to check changes against all standards | Production (REVIEW phase) |

## Custom Agents

| Agent | Mode | Purpose |
|---|---|---|
| `@architect` | subagent | Decomposes features into small, reviewable PRs. Outputs `DELIVERY_PLAN.md`. Does not write implementation code. |
| `@reviewer` | subagent | Read-only code reviewer. Checks changes against global standards, language rules, and per-PR quality checklist. Cannot modify files. |

---

## Architectural Constraints
- **Foundations:** Rigorously enforce SOLID principles, Rob Pike's 5 Rules of Programming, and the Unix philosophy.
- **Simplicity:** KISS. Clear is better than clever. Accept duplication over unnecessary coupling.

### Rob Pike's 5 Rules of Programming

1. **Rule 1.** You can't tell where a program is going to spend its time. Bottlenecks occur in surprising places, so don't try to second guess and put in a speed hack until you've proven that's where the bottleneck is.
2. **Rule 2.** Measure. Don't tune for speed until you've measured, and even then don't unless one part of the code overwhelms the rest.
3. **Rule 3.** Fancy algorithms are slow when n is small, and n is usually small. Fancy algorithms have big constants. Until you know that n is frequently going to be big, don't get fancy. (Even if n does get big, use Rule 2 first.)
4. **Rule 4.** Fancy algorithms are buggier than simple ones, and they're much harder to implement. Use simple algorithms as well as simple data structures.
5. **Rule 5.** Data dominates. If you've chosen the right data structures and organized things well, the algorithms will almost always be self-evident. Data structures, not algorithms, are central to programming.

Pike's rules 1 and 2 restate Tony Hoare's famous maxim "Premature optimization is the root of all evil."

Ken Thompson rephrased Pike's rules 3 and 4 as "When in doubt, use brute force."

Rules 3 and 4 are instances of the design philosophy KISS.

Rule 5 was previously stated by Fred Brooks in The Mythical Man-Month. Rule 5 is often shortened to "write stupid code that uses smart objects".
- **YAGNI:** Do not build features, abstractions, or flexibility that are not needed right now. Every line of code must justify its existence against a current requirement.
- **Dependencies:** Standard library first. Require explicit justification before adding third-party dependencies.
- **No TODOs in code:** Never leave `TODO`, `FIXME`, `HACK`, or similar placeholder comments in committed files. Resolve them before completing a task.

## Language Specifications

### Go
- Strictly adhere to `Effective Go` and `Go Code Review Comments`. 
- Design structs for valid zero values. Interfaces must be small (1-2 methods) and defined at the consumer.
- Errors are values. Always wrap with context (`fmt.Errorf("action: %w", err)`). `panic` only for unrecoverable state.
- Channels over mutexes. The caller starting a goroutine must own its lifetime.

#### Go Proverbs (enforce these)

| Proverb | Practical Meaning |
|---|---|
| Don't communicate by sharing memory; share memory by communicating. | Use channels to pass data between goroutines rather than shared variables and mutexes. Prevents race conditions by design. |
| Concurrency is not parallelism. | Concurrency is about *structuring* code (multiple things happening independently). Parallelism is about *executing* on multiple cores. Go is designed for the former. |
| Channels marshal; interfaces attach. | Channels are for coordination and data flow; interfaces are for defining behavior and decoupling. |
| The bigger the interface, the weaker the abstraction. | A 20-method interface is a burden. A 1-method interface (like `io.Writer`) is a powerful tool that can be used everywhere. |
| Make the zero value useful. | A `sync.Mutex` or `bytes.Buffer` works immediately without a constructor. Design structs so they don't *require* a `New()` function to be valid. |
| interface{} says nothing. | An empty interface provides no type safety and no documentation. It's a last resort, not a shortcut. |
| Gofmt's style is no one's favorite, but gofmt is everyone's favorite. | Stop arguing about formatting. Standardized formatting is more valuable than personal preference. |
| A little copying is better than a little dependency. | Don't pull in a 50k-line library for one helper function. Duplicate 5 lines rather than bloat `go.mod`. |
| Syscall must always be guarded with build tags. | Keep platform-specific code isolated so the project remains cross-platform. |
| Cgo must always be guarded with build tags. | Cgo is expensive and breaks cross-compilation; keep it isolated. |
| Cgo is not Go. | Using C libraries brings memory management and safety issues of C into your Go program. Avoid if possible. |
| With the unsafe package there are no guarantees. | If you use `unsafe`, the compiler won't help you, and future Go versions might break your code. |
| Clear is better than clever. | Simple, readable code is easier to maintain than "clever" one-liners or complex abstractions. |
| Reflection is never clear. | Reflection is slow, fragile, and hard to read. Avoid unless building a generic library like an ORM or JSON encoder. |
| Errors are values. | Treat errors like any other variable. Don't use try/catch; use `if err != nil`. Makes the failure path explicit. |
| Don't just check errors, handle them gracefully. | Don't just return `err`. Add context (e.g., `fmt.Errorf("loading config: %w", err)`) so logs actually mean something. |
| Design the architecture, name the components, document the details. | Good naming and structure are the most effective forms of documentation. |
| Documentation is for users. | Write for the person consuming your package, not for yourself. |
| Don't panic. | `panic` only for unrecoverable programmer errors (like index out of bounds). For everything else, return an `error`. |

### TypeScript
- Strict mode mandatory. Strictly avoid `any`; use `unknown` and type guards. Use `import type`.
- Prefer `interface` over `type` for public boundaries.
- Prefer native Array methods, `Map`, and `Set`. Use immutability and functional patterns.

### Python
- Type hints are mandatory on all function signatures.
- Prefer `dataclasses` or `pydantic` over raw `dict`s.
- Use `pathlib` over `os.path`. Use context managers for resource isolation. 

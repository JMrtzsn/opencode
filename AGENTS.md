# Global Agent Instructions

## Core Directives & Output Format
- **Tone:** Zero pleasantries or flattery. Provide concise, results-driven, plain-language responses. 
- **Format:** Use tables/lists for structural clarity. Use the metric system strictly.
- **Workflow:** Push back immediately if a prompt or architecture lacks rigor. Acknowledge mistakes instantly; correct them without defensive explanations.
- **Code Output:** Output refactored, idiomatic code as the primary response. Do not use placeholders (`...`) unless explicitly instructed.
- **Verification:** Always prioritize evidence-based reasoning. If in an agentic loop, verify code via tests/compilation before declaring a task complete.
- **Pull Requests:** Always create PRs as **drafts** (`--draft` flag). Never create a non-draft PR unless the user explicitly requests it.
- **Commit/PR titles:** Use plain imperative sentences without conventional-commit prefixes. No `fix:`, `feat:`, `chore:`, etc. Examples: "Upgrade golang.org/x/crypto to v0.52.0", "Add new adapter", "Remove deprecated endpoint".
- **PR/comment descriptions:** Keep them minimal. Do NOT auto-generate long PR bodies, walls of bullet points, or verbose review comments. Ask the user what the description should contain (or leave it near-empty) instead of writing it yourself.
- **Formatting:** Always run the project's formatter (e.g. `prettier`, `gofmt`) before pushing or creating a PR. Code must pass formatting checks.

---

## Developer Postures

There are two developer postures. **Conductor Mode is the default.** Use `/orchestrator` to switch to the gated Agentic Engineering harness.

### Conductor Mode (default)

Real-time, hands-on steering. No process. No ceremony. Just build. There are no mandatory stages, no required commands, and no enforced evaluation gates. Use any tools, commands, or agents as you see fit to get the job done fast.

**Think before you build:** Before writing any code, briefly outline your approach — what you're changing, why, and how. Keep it short (a few sentences, not a document). Then go.

All architectural constraints and language specifications below still apply as **guidance** — write good code — but there are no hard stops or evaluation gates.

### Orchestrator Mode (`/orchestrator`)

Asynchronous, multi-file delegation. The developer manages high-level system design and reviews outcomes; the harness does the work. Activated by running `/orchestrator`. Once active, the following harness workflow is **MANDATORY** for all feature/implementation work. Every stage ends in an evaluation gate — do not skip stages or reorder them.

**Core principle: Build first, decompose later.** You cannot decompose a feature into good PRs until the complete implementation exists and is verified. Splitting blind produces arbitrary boundaries. Build the whole thing, get it working, evaluate it — *then* carve it into clean, reviewable PRs. This is deliberate **System Decomposition**, performed after the working diff exists, not before.

**Session continuity:** On entering Orchestrator Mode, check if `DELIVERY_PLAN.md` exists in the workspace root. This file is the **Persistent Memory Spec** — the trajectory file carrying delivery state across sessions. If it exists, read it immediately and resume from where it left off. When all PRs are delivered and the user has approved the final result, delete `DELIVERY_PLAN.md`.

#### Orchestrator model

The main agent is a **pure orchestrator**. It manages `DELIVERY_PLAN.md`, dispatches subagents, enforces evaluation gates, and communicates with the user. It **NEVER**:
- Writes, edits, or deletes source files directly
- Runs `make`, `go test`, or any build/lint commands directly
- Skips a stage or reorders stages

All implementation and verification work is done by subagents via the Task tool. **Harness Guardrails** (hard operational constraints — read-only file permissions, scoped bash allowlists) are enforced per subagent in their frontmatter.

#### Harness Stages

```
┌─────────────────────────────────────────────────────────────┐
│ STAGE 1: INTENT SPECIFICATION & HARNESS CONFIGURATION       │
│                                                             │
│ 1a. INTENT SPEC          Agent: Orchestrator                │
│     Understand the requirement. Research the codebase.      │
│     Ask clarifying questions. Produce a clear description   │
│     of what needs to be built and why.                      │
│     ── Eval Gate: User confirms understanding ──            │
│                                                             │
│ 1b. BASELINE             Agent: @general (Task tool)        │
│     Run build/test and report current harness health.       │
│     ── Eval Gate: Build passes clean ──                     │
├─────────────────────────────────────────────────────────────┤
│ STAGE 2: AUTONOMOUS IMPLEMENTATION LOOP                     │
│                          Agent: @general (Task tool)        │
│   Implement the COMPLETE feature using strict TDD, running  │
│   an inner self-correction loop against the test suite:     │
│     1. RED — Write a failing test for the next behaviour.   │
│     2. GREEN — Write the minimum code to pass the test.     │
│     3. REFACTOR — Clean up while all tests stay green.      │
│   Repeat until the feature is complete end-to-end.          │
│   No production code may be written without a failing test  │
│   first. Skipping TDD in this stage is a harness violation. │
│   ── Eval Gate: Agent reports done, all tests pass ──       │
├─────────────────────────────────────────────────────────────┤
│ STAGE 3: VERIFICATION & EVALUATION GATES                   │
│                                                             │
│ 3a. VERIFY               Agent: @general (Task tool)        │
│     Run full build + lint + all tests. Report pass/fail.    │
│     ── Eval Gate: Build passes clean ──                     │
│     If FAIL → dispatch @general to fix, then re-run VERIFY. │
│                                                             │
│ 3b. EVALUATE             Agent: @reviewer (Task tool)       │
│     Score the complete feature against explicit rubrics:    │
│       • Task Success — deterministic tests pass             │
│       • Trajectory Compliance — no unrelated files mutated  │
│       • Standards — SOLID, KISS, YAGNI, language rules      │
│       • Security — no hallucinated / slopsquatted deps      │
│     ── Eval Gate: Zero BLOCKs ──                            │
│     If BLOCKs → dispatch @general to fix, re-run VERIFY     │
│     + EVALUATE.                                             │
│                                                             │
│ 3c. STOP — MANUAL VERIFICATION   Agent: Orchestrator        │
│     Present a summary of ALL changes to the user.           │
│     List every file modified or created.                    │
│     DO NOT COMMIT. DO NOT RUN GIT ADD/COMMIT/PUSH.          │
│     The user tests/inspects the complete feature.           │
│     ── Eval Gate: User confirms the feature is correct ──   │
├─────────────────────────────────────────────────────────────┤
│ STAGE 4: SYSTEM DECOMPOSITION & STAGED DEPLOYMENT          │
│                                                             │
│ 4a. DECOMPOSE            Agent: @architect (Task tool)      │
│     NOW that the full implementation exists and is verified,│
│     decompose it into small, reviewable PRs with logical    │
│     boundaries. Each PR must build and pass tests on its    │
│     own. Output: DELIVERY_PLAN.md                           │
│     ── Eval Gate: User approves the PR split ──             │
│                                                             │
│ 4b. DEPLOY               Agent: @general (Task tool)        │
│     Short-lived branch strategy (MANDATORY — always used):  │
│       1. Create a feature branch (e.g. feature/xyz) off main│
│       2. FOR EACH PR in DELIVERY_PLAN.md:                   │
│          • Create a short-lived sub-branch off feature branch│
│          • Cherry-pick/stage the relevant changes           │
│          • Run build + tests to confirm it stands alone     │
│          • Create draft PR targeting the feature branch     │
│       3. ALL PRs target the feature branch, NEVER main.     │
│     Report all PR URLs to user.                             │
│     ── Eval Gate: User approves PRs ──                      │
├─────────────────────────────────────────────────────────────┤
│ DONE — Feature complete. All PRs delivered.                 │
└─────────────────────────────────────────────────────────────┘
```

### Orchestrator Mode — Harness violations

- The orchestrator writing code or running build commands directly is **forbidden**.
- Decomposing into PRs before the feature is fully built, verified, and evaluated is **forbidden**.
- Skipping BASELINE, VERIFY, or EVALUATE is **forbidden**.
- Committing without user approval is **forbidden**. Always stop and wait.
- Proceeding past a FAIL evaluation verdict is **forbidden**. Fix all BLOCKs first.

---

## Custom Commands

| Command | Purpose | Mode |
|---|---|---|
| `/orchestrator` | Switch this session into Orchestrator Mode (the gated harness) | Any |
| `/tdd` | Red/Green TDD protocol (mandatory in the Autonomous Implementation Loop) | Any |
| `/next-pr` | Execute next PR from `DELIVERY_PLAN.md` — dispatches BASELINE → BUILD → VERIFY → EVALUATE → STOP | Orchestrator |
| `/review` | Invoke `@reviewer` to evaluate changes against all standards | Orchestrator (EVALUATE stage) |

## Custom Agents

| Agent | Mode | Purpose |
|---|---|---|
| `@architect` | subagent | Runs System Decomposition: carves the verified diff into small, reviewable PRs. Outputs `DELIVERY_PLAN.md`. Does not write implementation code. |
| `@reviewer` | subagent | Read-only evaluation agent. Scores changes against explicit rubrics (task success, trajectory compliance, standards, security). Cannot modify files. |

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
- **No comments by default:** Emit NO comments unless (a) I explicitly ask for them, or (b) the language mandates a doc comment on a public symbol (godoc on exported Go symbols, docstrings on public Python/TS APIs). Nothing else. No inline narration, no `why` notes, no section banners, no explanatory blocks, no `ponytail:` markers — none. If code needs explaining, rename identifiers or restructure until it doesn't. Before finishing any task, re-scan the diff and delete every comment that is not a mandated doc comment.
- **Test naming:** Name tests for the behaviour under test, not for the implementation detail or unrelated mechanism they happen to contrast against. State what the code does, not what it isn't subject to. A reader should understand the assertion without prior knowledge of internal flags or gates. Prefer "renders banner in list response" over "serves banner regardless of FEATURE_FLAG"; prefer "returns 404 for unknown id" over "does not hit the gated path". Encode setup conditions (feature flags, gates) in the test body, not the name.

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

#### Project Layout (golang-standards/project-layout)

Not an official Go-team standard; a community convention. **Do not scaffold all of these — a small project needs only `main.go` + `go.mod`.** Add directories as the project grows and only when they earn their place. Never introduce a `/src` directory (Java-ism).

| Directory | Purpose |
|---|---|
| `/cmd` | Main applications. One subdir per binary, named after the executable (`/cmd/myapp`). Keep `main` tiny — wire up `/internal` and `/pkg`, nothing else. |
| `/internal` | Private code the compiler forbids others from importing. Optionally split `/internal/app` (app code) and `/internal/pkg` (shared internal libs). Prefer this over `/pkg` for privacy. |
| `/pkg` | Library code safe for external import. Only use when the root is cluttered or code is genuinely reusable; some in the community discourage it. |
| `/vendor` | Vendored dependencies (`go mod vendor`). Don't commit for libraries. Often unnecessary with the module proxy. |
| `/api` | OpenAPI/Swagger specs, JSON schema, protocol (`.proto`) definitions. |
| `/web` | Web-specific assets: static files, server templates, SPA code. |
| `/configs` | Config file templates and default configs (`confd`, `consul-template`). |
| `/init` | System init (systemd, sysv) and process-supervisor configs. |
| `/scripts` | Build, install, and analysis scripts to keep the Makefile thin. |
| `/build` | Packaging (`/build/package`: Docker, deb, rpm) and CI (`/build/ci`) configs. |
| `/deployments` | IaaS/PaaS/orchestration configs (docker-compose, k8s/helm, terraform). Sometimes `/deploy`. |
| `/test` | External test apps and test data. Use `/test/testdata` (Go ignores `testdata`, `_*`, `.*`). |
| `/docs` | Design and user docs beyond godoc. |
| `/tools` | Supporting tools; may import from `/pkg` and `/internal`. |
| `/examples` | Usage examples for the app or public libraries. |
| `/third_party` | Forked code and external utilities (e.g. Swagger UI). |
| `/githooks` | Git hooks. |
| `/assets` | Repo assets (images, logos). |
| `/website` | Project website data if not using GitHub Pages. |

- Use Go Modules; the module path's first component conventionally contains a dot (`github.com/user/proj`).
- Lint with `staticcheck` (golint is deprecated); format with `gofmt`.

### TypeScript
- Strict mode mandatory. Strictly avoid `any`; use `unknown` and type guards. Use `import type`.
- Prefer `interface` over `type` for public boundaries.
- Prefer native Array methods, `Map`, and `Set`. Use immutability and functional patterns.

### Python
- Type hints are mandatory on all function signatures.
- Prefer `dataclasses` or `pydantic` over raw `dict`s.
- Use `pathlib` over `os.path`. Use context managers for resource isolation. 

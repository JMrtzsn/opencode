# Workflow Enforcement (compaction-safe)

These rules are NON-NEGOTIABLE. They apply in Production mode and must be followed on every PR.

## After every BUILD phase

1. **Run `make`** (no args). If no Makefile, run the language test suite directly.
2. If `make` fails, fix the issue before proceeding. Do NOT move to REVIEW with a broken build.

## After every REVIEW phase

1. **Run `@reviewer`** via the Task tool (subagent_type: reviewer).
2. Fix ALL BLOCK findings before proceeding. Do NOT move to STOP with unresolved BLOCKs.

## STOP phase

1. Present a summary of all changes to the user.
2. List every file modified or created.
3. **DO NOT COMMIT.** The user commits manually.

## Phase order is mandatory

BUILD → `make` → REVIEW (`@reviewer`) → STOP → wait for user.

Skipping or reordering phases is forbidden. No exceptions.

## No dead code

Never include unused functions, imports, or variables. `staticcheck` must pass clean.

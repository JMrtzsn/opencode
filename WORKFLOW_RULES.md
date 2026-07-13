# Harness Enforcement (compaction-safe)

These rules are NON-NEGOTIABLE. They apply in Orchestrator Mode and must be followed on every PR.

## After the Autonomous Implementation Loop (Stage 2)

1. **Run `make`** (no args). If no Makefile, run the language test suite directly.
2. If `make` fails, fix the issue before proceeding. Do NOT move to the EVALUATE gate with a broken build.

## At the EVALUATE gate (Stage 3)

1. **Run `@reviewer`** via the Task tool (subagent_type: reviewer).
2. Fix ALL BLOCK findings before proceeding. Do NOT move to STOP with unresolved BLOCKs.

## STOP gate (Stage 3)

1. Present a summary of all changes to the user.
2. List every file modified or created.
3. **DO NOT COMMIT.** The user commits manually.

## Stage order is mandatory

IMPLEMENT → `make` (VERIFY) → EVALUATE (`@reviewer`) → STOP → wait for user.

Skipping or reordering stages is forbidden. No exceptions.

## No dead code

Never include unused functions, imports, or variables. `staticcheck` must pass clean.

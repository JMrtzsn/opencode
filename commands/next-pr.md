---
description: Execute the next pending PR from DELIVERY_PLAN.md
---

Execute the next pending Pull Request from `DELIVERY_PLAN.md`.

## Execution Protocol

1. **Read the Plan:** Locate `DELIVERY_PLAN.md` and identify the first unchecked `[ ]` task.
2. **Git Isolation:** Execute `git checkout -b <branch-name>` using the branch name specified in the plan.
3. **Implementation:** Write the code strictly required for this specific PR. Do not look ahead to future steps. Use the Red/Green TDD protocol (`/tdd`).
4. **Verification:** Run the test suite. If tests fail, fix them.
5. **Commit:** Execute `git add .` and `git commit -m "<Goal from plan>"`.
6. **Update Plan:** Check off the completed `[x]` task in `DELIVERY_PLAN.md` and commit that change.
7. **Halt:** Stop generating text. Await human review of the branch.

$ARGUMENTS

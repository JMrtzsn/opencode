---
description: Execute the next pending PR from DELIVERY_PLAN.md
---

Execute the next pending Pull Request from `DELIVERY_PLAN.md`.

## Execution Protocol

1. **Read the Plan:** Locate `DELIVERY_PLAN.md` and identify the first unchecked `[ ]` task.
2. **Git Isolation:** Execute `git checkout -b <branch-name>` using the branch name specified in the plan.
3. **Test Baseline:** Run the project's test suite to establish baseline health before making changes.
4. **Implementation:** Write the code strictly required for this specific PR. Do not look ahead to future steps. TDD (`/tdd`) is encouraged but not mandatory.
5. **Verification:** Run the test suite. If tests fail, fix them.
6. **Review:** Invoke `/review` to run the automated code review. Fix all BLOCK findings before proceeding.
7. **Update Plan:** Check off the completed `[x]` task in `DELIVERY_PLAN.md`.
8. **STOP — MANUAL VERIFICATION:** Present a summary of all changes made. List every file modified or created. Do NOT commit. Do NOT run `git add` or `git commit`. The user will review and commit manually.

$ARGUMENTS

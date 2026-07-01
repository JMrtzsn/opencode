---
description: Execute the next pending PR from DELIVERY_PLAN.md
---

Execute the next pending Pull Request from `DELIVERY_PLAN.md`.

This command is used in **Phase 8: DELIVER** — the complete feature is already built, verified, and reviewed. No new implementation happens here.

## Execution Protocol

1. **Read the Plan:** Locate `DELIVERY_PLAN.md` and identify the first unchecked `[ ]` task.
2. **Branch:** Create a short-lived sub-branch off the feature branch using the branch name specified in the plan.
3. **Stage Changes:** Cherry-pick or stage the relevant files for this PR as defined in the plan.
4. **Verify:** Run build + tests to confirm this PR stands alone.
5. **Create Draft PR:** Create a draft PR targeting the feature branch (NEVER main).
6. **Update Plan:** Check off the completed `[x]` task in `DELIVERY_PLAN.md`.
7. **Report:** Output the PR URL.

$ARGUMENTS

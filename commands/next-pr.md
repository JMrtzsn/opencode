---
description: Execute the next pending PR from DELIVERY_PLAN.md
---

Execute the next pending Pull Request from `DELIVERY_PLAN.md`.

This command runs in the separate delivery workflow. The complete feature is already built, verified, evaluated, and decomposed through `/delivery`. No new implementation happens here.

Use plain imperative commit and pull-request titles without conventional-commit prefixes. Keep the pull-request description minimal and use a draft unless the user explicitly requested otherwise.

## Execution Protocol

1. **Read the Plan:** Locate `DELIVERY_PLAN.md` and identify the first unchecked `[ ]` task.
2. **Branch:** Create the first short-lived branch from the feature branch's clean base commit. Create each later branch from the preceding PR branch so ancestry is explicitly stacked.
3. **Stage Changes:** Stage only the patch for this PR as defined in the plan; use non-interactive path or patch commands. Stop if changes cannot be separated without editing implementation.
4. **Verify:** Run build + tests to confirm this PR stands alone.
5. **Create Draft PR:** Create the first draft PR targeting the feature branch and each later draft PR targeting the preceding PR branch (NEVER main).
6. **Update Plan:** Check off the completed `[x]` task in `DELIVERY_PLAN.md`.
7. **Report:** Output the PR URL.

$ARGUMENTS

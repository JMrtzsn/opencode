---
description: Decompose verified output into reviewable draft pull requests
---

Run the delivery workflow only after `/orchestrator` produced verified output, identified multiple separable concerns, and the user chose multi-PR delivery. If the diff is one cohesive concern, stop and recommend a single draft PR instead.

1. Confirm the working diff has current passing verification evidence and a PASS review verdict. If evidence is missing or stale, stop and run verification before delivery.
2. Dispatch `@architect` with the approved outcome and verified diff to create the smallest useful `DELIVERY_PLAN.md`. Do not split by file count or arbitrary line limits; split only at independently understandable, testable boundaries.
3. Present the decomposition and wait for user approval. Do not create branches, commits, pushes, or pull requests before approval.
4. After approval, instruct the user to run `/next-pr` for each pending item.

`DELIVERY_PLAN.md` is temporary delivery state, not product documentation or general memory. Delete it after all planned pull requests are delivered and approved.

$ARGUMENTS

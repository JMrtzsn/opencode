---
description: Run the EVALUATE gate against task, trajectory, standards, and security
agent: reviewer
subtask: true
---

Evaluate all uncommitted changes in the current working tree against the global standards and relevant language skills. This is the **Stage 3 EVALUATE gate** of Orchestrator Mode.

1. Run `git diff` to see unstaged changes and `git diff --cached` to see staged changes.
2. Apply the full evaluation rubric: task success, trajectory compliance (no unrelated files mutated), global + relevant language-skill standards, and security (no hallucinated / slopsquatted dependencies).
3. Output the structured evaluation verdict (PASS/FAIL) with findings.
4. If FAIL, list every BLOCK item that must be resolved before the user commits.
5. Treat test status as unknown unless VERIFY evidence is included in `$ARGUMENTS` or the current conversation.

$ARGUMENTS

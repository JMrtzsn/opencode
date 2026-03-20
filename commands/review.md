---
description: Run code review against AGENTS.md standards
agent: reviewer
subtask: true
---

Review all uncommitted changes in the current working tree against the standards defined in AGENTS.md.

1. Run `git diff` to see unstaged changes and `git diff --cached` to see staged changes.
2. Apply the full review protocol: global standards, language-specific rules, and per-PR quality checklist.
3. Output the structured review verdict (PASS/FAIL) with findings.
4. If FAIL, list every BLOCK item that must be resolved before the user commits.

$ARGUMENTS

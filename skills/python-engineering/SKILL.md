---
name: python-engineering
description: Applies idiomatic Python typing, data modeling, resource handling, security, testing, packaging, and async practices. Use when reading, writing, reviewing, debugging, or designing Python code, tests, APIs, scripts, or project configuration.
---

# Python Engineering

## Approach

- Read `pyproject.toml`, project instructions, lockfiles, neighboring modules, and callers first. Match the supported Python version, package manager, framework, and configured tools.
- Prefer the standard library and installed dependencies. Do not add frameworks, base classes, or indirection for hypothetical reuse.
- Keep modules cohesive and functions direct. Follow existing public API and exception conventions.

## Types And Data

- Type new and changed function signatures, public attributes, and non-obvious values. Do not annotate obvious locals or churn untouched legacy code solely for coverage.
- Avoid `Any` as an escape hatch. Use `object` plus narrowing for unknown values, and use `Protocol` for small structural contracts when substitution is required.
- Prefer built-in generics and `collections.abc` interfaces supported by the project's minimum Python version.
- Use dataclasses for internal value objects when they improve invariants or clarity. Use `TypedDict` for typed mapping-shaped data. Use the project's existing boundary-validation library; add Pydantic only when runtime validation requirements justify it.
- Type hints are not runtime validation. Validate untrusted JSON, environment, CLI, file, and network input before constructing domain values.

## Errors, Resources, And Security

- Raise specific exceptions with actionable context and preserve causes using `raise ... from exc`. Do not catch `Exception` unless adding context, translating at a boundary, or ensuring cleanup before re-raising.
- Use context managers for files, locks, transactions, and temporary resources. Check flush/close outcomes when failure can lose data.
- Prefer `pathlib` for path manipulation, but use the existing project style when changing nearby code. Resolve and constrain user-controlled paths before filesystem access.
- Never use `shell=True`, `eval`, unsafe deserialization, or string-built SQL with untrusted input. Use argument arrays, safe loaders, and parameterized queries.
- Preserve cancellation in async code; do not swallow `CancelledError`. Bound concurrency and clean up tasks, clients, and async generators.

## Tests And Verification

- Test observable behavior, validation failures, exception semantics, and resource cleanup. Use parametrization only for genuinely shared behavior.
- Avoid excessive mocking; prefer small fakes or real pure collaborators. Patch where a name is looked up, not where it originated.
- Run the repository's canonical formatter, type checker, linter, and tests through its configured environment and package manager. Do not assume global tools or install dependencies without approval.

---
name: typescript-engineering
description: Applies strict TypeScript, runtime-boundary, async, testing, and modern React practices. Use when reading, writing, reviewing, debugging, or designing TypeScript, TSX, JavaScript migrations, frontend code, Node.js services, or TypeScript configuration.
---

# TypeScript Engineering

## Approach

- Read `package.json`, `tsconfig.json`, project instructions, neighboring modules, and callers first. Match the configured runtime, module system, compiler version, framework, and conventions.
- Preserve strictness. Do not weaken compiler or lint settings to make a change pass.
- Prefer platform APIs, standard library features, and installed dependencies over new packages or custom frameworks.

## Types And Boundaries

- Avoid `any`. Use `unknown` for untrusted values and narrow with runtime checks. Type assertions do not validate data.
- Validate network, storage, environment, URL, form, and message inputs at runtime before treating them as domain types. Reuse the project's existing validation library; do not add one for trivial checks.
- Model finite states with discriminated unions and make impossible states unrepresentable. Use `never` exhaustiveness checks when the project supports the pattern.
- Infer local implementation types. Write explicit types at public boundaries and where inference hides intent. Use `import type` when required by the module configuration.
- Use `interface` when declaration merging or an extensible object contract is useful; use `type` for unions, mappings, and composition. Do not enforce either mechanically.
- Avoid non-null assertions and unchecked casts unless an invariant is established immediately nearby.

## Runtime And Async Code

- Preserve error causes and add operation context at boundaries. Do not swallow rejected promises or use floating promises unless deliberately detached and observed.
- Thread cancellation with `AbortSignal` through cancellable I/O. Clean up timers, subscriptions, listeners, and resources.
- Keep data immutable when it clarifies ownership, but do not clone reflexively or introduce deep-immutability machinery without need.
- Prefer native arrays, objects, `Map`, and `Set`; choose the structure that reflects lookup and ordering semantics.

## React

- Preserve the existing design system, semantic HTML, keyboard access, labels, focus behavior, and responsive layout.
- Keep render pure. Use effects only to synchronize with external systems, and clean them up. Derive values during render instead of mirroring state.
- Follow the repository's React and compiler guidance. Do not add `useMemo` or `useCallback` without a measured or documented need.
- Handle loading, empty, error, and success states where the user-visible flow requires them.

## Tests And Verification

- Test behavior through public APIs or user interactions. Cover runtime validation, failures, and async cleanup; avoid snapshots that merely restate markup.
- Run the repository's canonical format, typecheck, lint, build, and test commands. Do not assume `npm`; use the lockfile and configured package manager.

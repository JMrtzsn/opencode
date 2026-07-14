---
name: go-engineering
description: Applies idiomatic Go design, error handling, concurrency, testing, security, and project-layout practices. Use when reading, writing, reviewing, debugging, or designing Go code, tests, go.mod files, APIs, or repository structure.
---

# Go Engineering

## Approach

- Read `go.mod`, project instructions, neighboring packages, and callers before changing code. Match the declared Go version and existing package boundaries.
- Prefer standard-library primitives and direct code. Add interfaces, constructors, packages, or dependencies only for a current requirement.
- Follow current Go documentation and Go Code Review Comments. Treat Effective Go as useful but incomplete for modern modules, generics, and APIs.

## Design And Correctness

- Make zero values useful when practical. Use constructors only to establish required invariants or dependencies.
- Define small interfaces where they are consumed. Accept interfaces and return concrete types unless the existing API requires otherwise.
- Keep package names short and cohesive. Avoid `util`, `common`, import cycles, and speculative shared packages.
- Preserve ownership: do not retain caller-owned slices or maps without documenting or copying them; return copies when mutation would cross a boundary unexpectedly.
- Validate untrusted input at the boundary. Apply limits before allocation, parsing, decompression, or concurrency fan-out.

## Errors And Resources

- Handle every meaningful error. Wrap with concise operation context and `%w`; use `errors.Is` and `errors.As` rather than matching strings.
- Do not both log and return the same error unless the boundary owns logging. Preserve sentinel and typed-error behavior in public APIs.
- Close resources on every path and check close/flush errors when they can lose data. Reserve `panic` for impossible programmer states, not operational failures.
- Pass `context.Context` as the first parameter for cancellable work; do not store it in structs or replace caller cancellation with `context.Background()`.

## Concurrency

- The code that starts a goroutine owns its shutdown. Prevent leaks with cancellation, bounded queues, and explicit completion.
- Use channels for communication and ownership transfer; use mutexes for protecting shared state when that is simpler. Verify race-sensitive changes with `go test -race` when practical.
- Do not add concurrency without a measured need. Bound goroutines and external calls.

## Tests And Verification

- Test observable behavior, error paths, boundaries, and cancellation. Prefer table-driven tests only when cases share meaningful setup and assertions.
- Use `t.Helper()` in helpers and avoid sleeps for synchronization.
- Run the repository's canonical checks. Otherwise use `gofmt`, `go test ./...`, `go vet ./...`, and `staticcheck ./...` when installed; add `go test -race ./...` for concurrency changes.
- Keep small projects small. Add `cmd`, `internal`, or other directories only when current code needs them; never introduce `src`.

import assert from "node:assert/strict"
import { describe, test } from "node:test"
import { guardToolCall } from "../plugins/guardrails.ts"

describe("guardToolCall", () => {
  test("blocks credential files but allows templates", () => {
    assert.throws(() => guardToolCall("read", { filePath: "/app/.env" }))
    assert.throws(() => guardToolCall("read", { filePath: "/app/id_ed25519" }))
    assert.doesNotThrow(() => guardToolCall("read", { filePath: "/app/.env.example" }))
    assert.throws(() => guardToolCall("bash", { command: "cat /app/.env.local" }))
    assert.doesNotThrow(() => guardToolCall("bash", { command: "cat /app/.env.example" }))
    assert.throws(() => guardToolCall("apply_patch", { patchText: "*** Begin Patch\n*** Add File: /app/.env\n+secret\n*** End Patch" }))
  })

  test("blocks destructive and hook-bypassing commands", () => {
    assert.throws(() => guardToolCall("bash", { command: "git commit --no-verify -m unsafe" }))
    assert.throws(() => guardToolCall("bash", { command: "git push --force" }))
    assert.throws(() => guardToolCall("bash", { command: "rm -rf build" }))
    assert.throws(() => guardToolCall("bash", { command: "sudo rm -rf build" }))
    assert.doesNotThrow(() => guardToolCall("bash", { command: "git status" }))
  })
})

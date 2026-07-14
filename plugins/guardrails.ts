import type { Plugin } from "@opencode-ai/plugin"

const sensitivePath = /(^|[/\\])(?:\.env(?:\.(?!example$|sample$|template$)[^/\\]+)?|\.npmrc|credentials(?:\.json)?|application_default_credentials\.json|id_(?:rsa|dsa|ecdsa|ed25519)|[^/\\]+\.(?:pem|p12|pfx))$/i

const blockedCommand = [
  /\bgit\s+(?:\S+\s+)*?(?:commit|push)\b[^\n]*(?:--no-verify|-n\b)/i,
  /\bgit\s+(?:\S+\s+)*?push\b[^\n]*(?:--force(?:-with-lease)?|-f\b)/i,
  /\bgit\s+(?:\S+\s+)*?reset\s+--hard\b/i,
  /\bgit\s+(?:\S+\s+)*?clean\b/i,
  /\bgit\s+(?:\S+\s+)*?checkout\s+--\b/i,
  /\bgit\s+(?:\S+\s+)*?branch\s+-D\b/i,
  /(?:^|[;&|\n]\s*)(?:sudo\s+)?rm\s+(?:-[A-Za-z]*r[A-Za-z]*f[A-Za-z]*|-[A-Za-z]*f[A-Za-z]*r[A-Za-z]*|--recursive\s+--force|--force\s+--recursive)\b/i,
]

function containsSensitivePath(text: string): boolean {
  return text.split(/[\s'";&|=]+/).some((token) => sensitivePath.test(token))
}

export function guardToolCall(tool: string, args: Record<string, unknown>): void {
  const paths = [args.filePath, args.path].filter((value): value is string => typeof value === "string")

  if (paths.some((path) => sensitivePath.test(path))) {
    throw new Error("Guardrail blocked access to a credential or private-key file")
  }

  if (tool === "apply_patch" && typeof args.patchText === "string" && [...args.patchText.matchAll(/^\*\*\* (?:Add|Update|Delete) File: (.+)$/gm)].some((match) => sensitivePath.test(match[1] ?? ""))) {
    throw new Error("Guardrail blocked access to a credential or private-key file")
  }

  if (tool === "bash" && typeof args.command === "string") {
    const command = args.command
    if (containsSensitivePath(command)) {
      throw new Error("Guardrail blocked access to a credential or private-key file")
    }
    if (blockedCommand.some((pattern) => pattern.test(command))) {
      throw new Error("Guardrail blocked a destructive or policy-bypassing shell command")
    }
  }
}

const GuardrailsPlugin: Plugin = async ({ client }) => ({
  "tool.execute.before": async (input, output) => {
    try {
      guardToolCall(input.tool, output.args)
    } catch (error) {
      await client.app.log({
        body: {
          service: "guardrails",
          level: "warn",
          message: error instanceof Error ? error.message : "Guardrail blocked a tool call",
          extra: { tool: input.tool },
        },
      }).catch(() => undefined)
      throw error
    }
  },
})

export default GuardrailsPlugin

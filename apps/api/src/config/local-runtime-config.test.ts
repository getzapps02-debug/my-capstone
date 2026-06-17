import { readFileSync } from "node:fs"
import { resolve } from "node:path"

import { describe, expect, it } from "vitest"

describe("local runtime configuration files", () => {
  const projectRoot = resolve(process.cwd(), "../..")

  it("keeps committed environment defaults loopback-only and placeholder-based", () => {
    const envExample = readFileSync(resolve(projectRoot, ".env.example"), "utf8")

    expect(envExample).toContain("API_HOST=127.0.0.1")
    expect(envExample).toContain(
      "LOCAL_REQUEST_TOKEN=replace-with-local-development-token"
    )
    expect(envExample).not.toMatch(/LOCAL_REQUEST_TOKEN=(?!replace-with)/)
    expect(envExample).not.toContain("API_HOST=0.0.0.0")
  })

  it("does not publish PostgreSQL on public host interfaces", () => {
    const compose = readFileSync(resolve(projectRoot, "compose.yaml"), "utf8")

    expect(compose).toContain("127.0.0.1:5432:5432")
    expect(compose).not.toContain("0.0.0.0:5432")
    expect(compose).not.toMatch(/-\s*"?5432:5432"?/)
  })
})

import { describe, expect, it } from "vitest"

import { getHealth, getReadiness } from "./health-client.js"

describe("health client", () => {
  it("parses a successful health response through the shared contract", async () => {
    const result = await getHealth("", async () =>
      new Response(
        JSON.stringify({
          status: "ok",
          service: "api",
          requestId: "req-123",
          timestamp: "2026-06-17T10:00:00.000Z",
        }),
        { status: 200 }
      )
    )

    expect(result.ok).toBe(true)
    expect(result.ok ? result.data.requestId : "").toBe("req-123")
  })

  it("normalizes failures without exposing raw exception details", async () => {
    const result = await getHealth("", async () => {
      throw new Error("stack trace with internal details")
    })

    expect(result.ok).toBe(false)
    expect(result.ok ? "" : result.message).toBe(
      "Local service check is unavailable right now."
    )
    expect(result.ok ? "" : result.message).not.toContain("stack trace")
  })

  it("parses a successful readiness response through the shared contract", async () => {
    const result = await getReadiness("", async () =>
      new Response(
        JSON.stringify({
          dependencies: {
            persistence: "ok",
          },
          requestId: "req-123",
          service: "api",
          status: "ok",
          timestamp: "2026-06-17T10:00:00.000Z",
        }),
        { status: 200 }
      )
    )

    expect(result.ok).toBe(true)
    expect(result.ok ? result.data.dependencies.persistence : "").toBe("ok")
  })
})

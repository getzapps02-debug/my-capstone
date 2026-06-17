import { describe, expect, it } from "vitest"

import { healthResponseSchema } from "./index.js"

describe("health contract", () => {
  it("accepts the standard successful health response", () => {
    const parsed = healthResponseSchema.parse({
      status: "ok",
      service: "api",
      requestId: "req-123",
      timestamp: "2026-06-17T10:00:00.000Z",
    })

    expect(parsed.status).toBe("ok")
  })

  it("rejects malformed health responses", () => {
    expect(() =>
      healthResponseSchema.parse({
        status: "available",
        service: "api",
        timestamp: "2026-06-17T10:00:00.000Z",
      })
    ).toThrow()
  })
})

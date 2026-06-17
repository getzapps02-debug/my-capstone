import { describe, expect, it } from "vitest"

import { healthResponseSchema, readinessResponseSchema } from "./index.js"

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

  it("accepts a readiness response with local dependency state", () => {
    expect(
      readinessResponseSchema.parse({
        dependencies: {
          persistence: "ok",
        },
        requestId: "req-123",
        service: "api",
        status: "ok",
        timestamp: "2026-06-17T00:00:00.000Z",
      })
    ).toMatchObject({
      dependencies: {
        persistence: "ok",
      },
      status: "ok",
    })
  })
})

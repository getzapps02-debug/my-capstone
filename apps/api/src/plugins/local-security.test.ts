import { errorResponseSchema } from "@workspace/contracts/errors"
import { describe, expect, it } from "vitest"

import { buildApp } from "../app.js"

const localSecurity = {
  allowedOrigins: ["http://127.0.0.1:5173", "http://localhost:5173"],
  bodyLimitBytes: 1_048_576,
  handlerTimeoutMs: 30_000,
  localRequestToken: "test-local-token",
  requestTimeoutMs: 30_000,
}

describe("local security boundary", () => {
  it("applies configured request limits and timeouts to the Fastify runtime", async () => {
    const app = await buildApp({ logger: false, localSecurity })
    const initialConfig = app.initialConfig as typeof app.initialConfig & {
      handlerTimeout: number
      requestTimeout: number
    }

    expect(initialConfig.bodyLimit).toBe(localSecurity.bodyLimitBytes)
    expect(initialConfig.handlerTimeout).toBe(localSecurity.handlerTimeoutMs)
    expect(initialConfig.requestTimeout).toBe(localSecurity.requestTimeoutMs)

    await app.close()
  })

  it("allows configured local origins and applies security headers", async () => {
    const app = await buildApp({ logger: false, localSecurity })

    const response = await app.inject({
      headers: {
        origin: "http://127.0.0.1:5173",
      },
      method: "GET",
      url: "/health",
    })

    expect(response.statusCode).toBe(200)
    expect(response.headers["access-control-allow-origin"]).toBe(
      "http://127.0.0.1:5173"
    )
    expect(response.headers["x-content-type-options"]).toBe("nosniff")

    await app.close()
  })

  it("rejects non-local origins without leaking request details", async () => {
    const app = await buildApp({ logger: false, localSecurity })

    const response = await app.inject({
      headers: {
        origin: "https://example.com",
      },
      method: "GET",
      url: "/health",
    })

    const parsed = errorResponseSchema.parse(JSON.parse(response.body))

    expect(response.statusCode).toBe(403)
    expect(parsed.code).toBe("local_origin_required")
    expect(parsed.message).not.toContain("example.com")
    expect(response.headers["access-control-allow-origin"]).toBeUndefined()

    await app.close()
  })

  it("rejects missing local request tokens on state-changing requests", async () => {
    const app = await buildApp({ logger: false, localSecurity })

    app.post("/api/v1/test-state-change", async () => ({ ok: true }))

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/test-state-change",
    })

    const parsed = errorResponseSchema.parse(JSON.parse(response.body))

    expect(response.statusCode).toBe(401)
    expect(parsed.code).toBe("local_request_token_required")
    expect(parsed.message).not.toContain("test-local-token")

    await app.close()
  })

  it("allows state-changing requests with the configured local request token", async () => {
    const app = await buildApp({ logger: false, localSecurity })

    app.post("/api/v1/test-state-change", async () => ({ ok: true }))

    const response = await app.inject({
      headers: {
        "x-local-request-token": "test-local-token",
      },
      method: "POST",
      url: "/api/v1/test-state-change",
    })

    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.body)).toEqual({ ok: true })

    await app.close()
  })
})

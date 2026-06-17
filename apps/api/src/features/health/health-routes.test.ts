import { errorResponseSchema } from "@workspace/contracts/errors"
import { healthResponseSchema } from "@workspace/contracts/health"
import { describe, expect, it } from "vitest"

import { buildApp } from "../../app.js"

describe("health routes", () => {
  it("returns a contract-valid health response with a request id", async () => {
    const app = await buildApp({ logger: false })

    const response = await app.inject({
      method: "GET",
      url: "/health",
    })

    const parsed = healthResponseSchema.parse(JSON.parse(response.body))

    expect(response.statusCode).toBe(200)
    expect(parsed.status).toBe("ok")
    expect(parsed.requestId).toBeTruthy()

    await app.close()
  })

  it("uses the standard error envelope for missing routes", async () => {
    const app = await buildApp({ logger: false })

    const response = await app.inject({
      method: "GET",
      url: "/missing",
    })

    const parsed = errorResponseSchema.parse(JSON.parse(response.body))

    expect(response.statusCode).toBe(404)
    expect(parsed.code).toBe("not_found")
    expect(parsed.message).not.toContain("stack")
    expect(parsed.requestId).toBeTruthy()

    await app.close()
  })
})

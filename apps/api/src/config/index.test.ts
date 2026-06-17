import { describe, expect, it } from "vitest"

import { getApiConfig } from "./index.js"

describe("api config", () => {
  it("uses local-only defaults", () => {
    expect(getApiConfig({})).toMatchObject({
      host: "127.0.0.1",
      localSecurity: {
        allowedOrigins: ["http://127.0.0.1:5173", "http://localhost:5173"],
        localRequestToken: "",
      },
      port: 4000,
    })
  })

  it("rejects non-loopback API hosts", () => {
    expect(() => getApiConfig({ API_HOST: "0.0.0.0" })).toThrow(
      /loopback/i
    )
  })

  it("parses local security settings from environment values", () => {
    expect(
      getApiConfig({
        API_ALLOWED_ORIGINS: "http://127.0.0.1:5173,http://localhost:5173",
        API_BODY_LIMIT_BYTES: "2048",
        API_HANDLER_TIMEOUT_MS: "4000",
        API_REQUEST_TIMEOUT_MS: "3000",
        LOCAL_REQUEST_TOKEN: "placeholder-token",
      }).localSecurity
    ).toEqual({
      allowedOrigins: ["http://127.0.0.1:5173", "http://localhost:5173"],
      bodyLimitBytes: 2048,
      handlerTimeoutMs: 4000,
      localRequestToken: "placeholder-token",
      requestTimeoutMs: 3000,
    })
  })
})

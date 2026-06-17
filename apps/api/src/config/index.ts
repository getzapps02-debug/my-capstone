export type ApiConfig = {
  host: string
  localSecurity: LocalSecurityConfig
  port: number
}

export type LocalSecurityConfig = {
  allowedOrigins: string[]
  bodyLimitBytes: number
  handlerTimeoutMs: number
  localRequestToken: string
  requestTimeoutMs: number
}

type Env = Record<string, string | undefined>

const defaultAllowedOrigins = ["http://127.0.0.1:5173", "http://localhost:5173"]

export function getApiConfig(env: Env = process.env): ApiConfig {
  const host = env.API_HOST ?? "127.0.0.1"

  if (!isLoopbackHost(host)) {
    throw new Error("API_HOST must be a loopback host for local-only runtime.")
  }

  return {
    host,
    localSecurity: {
      allowedOrigins: parseAllowedOrigins(env.API_ALLOWED_ORIGINS),
      bodyLimitBytes: parseInteger(env.API_BODY_LIMIT_BYTES, 1_048_576),
      handlerTimeoutMs: parseInteger(env.API_HANDLER_TIMEOUT_MS, 30_000),
      localRequestToken: env.LOCAL_REQUEST_TOKEN ?? "",
      requestTimeoutMs: parseInteger(env.API_REQUEST_TIMEOUT_MS, 30_000),
    },
    port: parseInteger(env.API_PORT, 4000),
  }
}

function parseAllowedOrigins(value: string | undefined) {
  const origins = value
    ? value
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
    : defaultAllowedOrigins

  for (const origin of origins) {
    const parsed = new URL(origin)

    if (!isLoopbackHost(parsed.hostname)) {
      throw new Error("API_ALLOWED_ORIGINS must contain only local origins.")
    }
  }

  return origins
}

function parseInteger(value: string | undefined, fallback: number) {
  if (!value) {
    return fallback
  }

  const parsed = Number.parseInt(value, 10)

  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

function isLoopbackHost(host: string) {
  return host === "127.0.0.1" || host === "localhost" || host === "::1"
}

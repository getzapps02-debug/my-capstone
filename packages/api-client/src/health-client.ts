import {
  type HealthResponse,
  healthResponseSchema,
} from "@workspace/contracts/health"

export type HealthClientResult =
  | {
      ok: true
      data: HealthResponse
    }
  | {
      ok: false
      message: string
    }

const unavailableMessage = "Local service check is unavailable right now."

export async function getHealth(
  baseUrl = "",
  fetcher: typeof fetch = fetch
): Promise<HealthClientResult> {
  try {
    const response = await fetcher(`${baseUrl}/health`, {
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      return {
        ok: false,
        message: unavailableMessage,
      }
    }

    const body = await response.json()
    const parsed = healthResponseSchema.safeParse(body)

    if (!parsed.success) {
      return {
        ok: false,
        message: unavailableMessage,
      }
    }

    return {
      ok: true,
      data: parsed.data,
    }
  } catch {
    return {
      ok: false,
      message: unavailableMessage,
    }
  }
}

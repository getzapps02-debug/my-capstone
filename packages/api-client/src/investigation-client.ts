import {
  type CurrentSampleInvestigationResponse,
  currentSampleInvestigationResponseSchema,
} from "@workspace/contracts/investigations"

export type CurrentSampleInvestigationClientResult =
  | {
      ok: true
      data: CurrentSampleInvestigationResponse
    }
  | {
      ok: false
      message: string
    }

const unavailableMessage =
  "Saved investigation is unavailable from local persistence right now."

export async function getCurrentSampleInvestigation(
  baseUrl = "",
  fetcher: typeof fetch = fetch
): Promise<CurrentSampleInvestigationClientResult> {
  try {
    const response = await fetcher(
      `${baseUrl}/api/v1/investigations/current-sample`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    )

    if (!response.ok) {
      return {
        ok: false,
        message: unavailableMessage,
      }
    }

    const body = await response.json()
    const parsed = currentSampleInvestigationResponseSchema.safeParse(body)

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

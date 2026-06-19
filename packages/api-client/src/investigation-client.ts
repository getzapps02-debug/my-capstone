import {
  type CurrentSampleInvestigationResponse,
  type SampleDatasetResponse,
  currentSampleInvestigationResponseSchema,
  sampleDatasetResponseSchema,
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
const sampleDataUnavailableMessage =
  "Sample Data is unavailable from local persistence right now."
const sampleDataResetUnavailableMessage =
  "Sample Data could not be reset from local persistence right now."

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

export type SampleDatasetClientResult =
  | {
      ok: true
      data: SampleDatasetResponse
    }
  | {
      ok: false
      message: string
    }

export async function loadSampleDataset(
  baseUrl = "",
  localRequestToken = "",
  fetcher: typeof fetch = fetch
): Promise<SampleDatasetClientResult> {
  return sendSampleDatasetCommand(
    `${baseUrl}/api/v1/investigations/sample/load`,
    localRequestToken,
    fetcher,
    sampleDataUnavailableMessage
  )
}

export async function resetSampleDataset(
  baseUrl = "",
  localRequestToken = "",
  fetcher: typeof fetch = fetch
): Promise<SampleDatasetClientResult> {
  return sendSampleDatasetCommand(
    `${baseUrl}/api/v1/investigations/sample/reset`,
    localRequestToken,
    fetcher,
    sampleDataResetUnavailableMessage
  )
}

async function sendSampleDatasetCommand(
  url: string,
  localRequestToken: string,
  fetcher: typeof fetch,
  failureMessage: string
): Promise<SampleDatasetClientResult> {
  try {
    const response = await fetcher(url, {
      headers: {
        Accept: "application/json",
        "x-local-request-token": localRequestToken,
      },
      method: "POST",
    })

    if (!response.ok) {
      return {
        ok: false,
        message: failureMessage,
      }
    }

    const body = await response.json()
    const parsed = sampleDatasetResponseSchema.safeParse(body)

    if (!parsed.success) {
      return {
        ok: false,
        message: failureMessage,
      }
    }

    return {
      ok: true,
      data: parsed.data,
    }
  } catch {
    return {
      ok: false,
      message: failureMessage,
    }
  }
}

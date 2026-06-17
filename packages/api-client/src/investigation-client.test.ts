import { describe, expect, it, vi } from "vitest"

import { getCurrentSampleInvestigation } from "./investigation-client.js"

describe("investigation client", () => {
  it("fetches and validates the current sample investigation", async () => {
    const fetcher = vi.fn(async () => {
      return new Response(
        JSON.stringify({
          investigation: {
            id: "sample-investigation",
            title: "Sample shortfall investigation",
            status: "draft",
            createdAt: "2026-06-17T00:00:00.000Z",
            datasetOwner: "sample",
          },
        }),
        { status: 200 }
      )
    })

    const result = await getCurrentSampleInvestigation("", fetcher)

    expect(fetcher).toHaveBeenCalledWith(
      "/api/v1/investigations/current-sample",
      {
        headers: {
          Accept: "application/json",
        },
      }
    )
    expect(result).toEqual({
      ok: true,
      data: {
        investigation: {
          id: "sample-investigation",
          title: "Sample shortfall investigation",
          status: "draft",
          createdAt: "2026-06-17T00:00:00.000Z",
          datasetOwner: "sample",
        },
      },
    })
  })

  it("returns a safe message when persistence is unavailable", async () => {
    const result = await getCurrentSampleInvestigation(
      "",
      vi.fn(async () => new Response("nope", { status: 503 }))
    )

    expect(result).toEqual({
      ok: false,
      message:
        "Saved investigation is unavailable from local persistence right now.",
    })
  })
})

import { describe, expect, it, vi } from "vitest"

import {
  getCurrentSampleInvestigation,
  loadSampleDataset,
  resetSampleDataset,
} from "./investigation-client.js"

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

  it("returns a safe message when the response body is invalid JSON", async () => {
    const result = await getCurrentSampleInvestigation(
      "",
      vi.fn(async () => new Response("not-json", { status: 200 }))
    )

    expect(result).toEqual({
      ok: false,
      message:
        "Saved investigation is unavailable from local persistence right now.",
    })
  })

  it("returns a safe message when the response schema is invalid", async () => {
    const result = await getCurrentSampleInvestigation(
      "",
      vi.fn(
        async () =>
          new Response(JSON.stringify({ investigation: { id: "" } }), {
            status: 200,
          })
      )
    )

    expect(result).toEqual({
      ok: false,
      message:
        "Saved investigation is unavailable from local persistence right now.",
    })
  })

  it("returns a safe message when fetch rejects", async () => {
    const result = await getCurrentSampleInvestigation(
      "",
      vi.fn(async () => {
        throw new Error("network details")
      })
    )

    expect(result).toEqual({
      ok: false,
      message:
        "Saved investigation is unavailable from local persistence right now.",
    })
  })

  it("loads Sample Data with the local request token", async () => {
    const fetcher = vi.fn(async () => {
      return new Response(
        JSON.stringify({
          sampleDataset: {
            datasetOwner: "sample",
            label: "Sample Data",
            description:
              "Synthetic example evidence for trying the local investigation workflow.",
            investigation: {
              id: "sample-investigation",
              title: "Sample shortfall investigation",
              status: "draft",
              createdAt: "2026-06-17T00:00:00.000Z",
              datasetOwner: "sample",
            },
            scenarios: [
              {
                id: "complete-reconciled-shortfall",
                label: "Complete reconciled shortfall",
                readiness: "ready",
                summary:
                  "Example evidence with reconciled balances for a future Shortfall walkthrough.",
              },
              {
                id: "insufficient-evidence",
                label: "Insufficient evidence",
                readiness: "insufficient-evidence",
                summary:
                  "Example evidence reserved for later refusal behavior when required records are missing.",
              },
            ],
          },
        }),
        { status: 200 }
      )
    })

    const result = await loadSampleDataset("", "local-dev-token", fetcher)

    expect(fetcher).toHaveBeenCalledWith(
      "/api/v1/investigations/sample/load",
      {
        headers: {
          Accept: "application/json",
          "x-local-request-token": "local-dev-token",
        },
        method: "POST",
      }
    )
    expect(result.ok).toBe(true)
    expect(result.ok ? result.data.sampleDataset.label : "").toBe("Sample Data")
  })

  it("resets Sample Data with the local request token", async () => {
    const fetcher = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            sampleDataset: {
              datasetOwner: "sample",
              label: "Sample Data",
              description:
                "Synthetic example evidence for trying the local investigation workflow.",
              investigation: {
                id: "sample-investigation",
                title: "Sample shortfall investigation",
                status: "draft",
                createdAt: "2026-06-17T00:00:00.000Z",
                datasetOwner: "sample",
              },
              scenarios: [
                {
                  id: "complete-reconciled-shortfall",
                  label: "Complete reconciled shortfall",
                  readiness: "ready",
                  summary:
                    "Example evidence with reconciled balances for a future Shortfall walkthrough.",
                },
                {
                  id: "insufficient-evidence",
                  label: "Insufficient evidence",
                  readiness: "insufficient-evidence",
                  summary:
                    "Example evidence reserved for later refusal behavior when required records are missing.",
                },
              ],
            },
          }),
          { status: 200 }
        )
    )

    const result = await resetSampleDataset("", "local-dev-token", fetcher)

    expect(fetcher).toHaveBeenCalledWith(
      "/api/v1/investigations/sample/reset",
      {
        headers: {
          Accept: "application/json",
          "x-local-request-token": "local-dev-token",
        },
        method: "POST",
      }
    )
    expect(result.ok).toBe(true)
  })

  it("returns a safe Sample Data message when command validation fails", async () => {
    const result = await loadSampleDataset(
      "",
      "local-dev-token",
      vi.fn(async () => new Response(JSON.stringify({ nope: true }), { status: 200 }))
    )

    expect(result).toEqual({
      ok: false,
      message: "Sample Data is unavailable from local persistence right now.",
    })
  })

  it("returns reset-specific safe copy when reset command validation fails", async () => {
    const result = await resetSampleDataset(
      "",
      "local-dev-token",
      vi.fn(async () => new Response(JSON.stringify({ nope: true }), { status: 200 }))
    )

    expect(result).toEqual({
      ok: false,
      message:
        "Sample Data could not be reset from local persistence right now.",
    })
  })
})

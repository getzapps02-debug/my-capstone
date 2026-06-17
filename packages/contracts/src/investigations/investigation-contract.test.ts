import { describe, expect, it } from "vitest"

import { currentSampleInvestigationResponseSchema } from "./index.js"

describe("investigation contracts", () => {
  it("accepts a persisted sample investigation response", () => {
    const parsed = currentSampleInvestigationResponseSchema.parse({
      investigation: {
        id: "sample-investigation",
        title: "Sample shortfall investigation",
        status: "draft",
        createdAt: "2026-06-17T00:00:00.000Z",
        datasetOwner: "sample",
      },
    })

    expect(parsed.investigation?.datasetOwner).toBe("sample")
  })

  it("allows an explicit empty persisted investigation state", () => {
    expect(
      currentSampleInvestigationResponseSchema.parse({
        investigation: null,
      })
    ).toEqual({ investigation: null })
  })
})

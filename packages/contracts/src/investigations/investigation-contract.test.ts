import { describe, expect, it } from "vitest"

import {
  currentSampleInvestigationResponseSchema,
  sampleDatasetResponseSchema,
} from "./index.js"

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

  it("accepts deterministic sample dataset state with required scenarios", () => {
    const parsed = sampleDatasetResponseSchema.parse({
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
    })

    expect(parsed.sampleDataset.datasetOwner).toBe("sample")
    expect(parsed.sampleDataset.scenarios.map((scenario) => scenario.id)).toEqual(
      ["complete-reconciled-shortfall", "insufficient-evidence"]
    )
  })
})

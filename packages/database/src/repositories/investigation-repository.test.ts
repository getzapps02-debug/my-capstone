import { describe, expect, it } from "vitest"

import {
  SAMPLE_INVESTIGATION_ID,
  mapInvestigationEntry,
  type InvestigationRepositoryPort,
} from "./investigation-repository.js"

class MemoryInvestigationRepository implements InvestigationRepositoryPort {
  private entry: Awaited<
    ReturnType<InvestigationRepositoryPort["getCurrentSampleInvestigation"]>
  > = null

  async ensureSampleInvestigation() {
    this.entry = {
      id: SAMPLE_INVESTIGATION_ID,
      title: "Sample shortfall investigation",
      status: "draft",
      createdAt: "2026-06-17T00:00:00.000Z",
      datasetOwner: "sample",
    }

    return this.entry
  }

  async getCurrentSampleInvestigation() {
    return this.entry
  }

  async clearSampleInvestigation() {
    this.entry = null
  }
}

describe("investigation repository contract", () => {
  it("writes, reads, and clears the sample investigation deterministically", async () => {
    const repository = new MemoryInvestigationRepository()

    expect(await repository.getCurrentSampleInvestigation()).toBeNull()

    const saved = await repository.ensureSampleInvestigation()
    expect(saved).toMatchObject({
      id: SAMPLE_INVESTIGATION_ID,
      title: "Sample shortfall investigation",
      status: "draft",
      datasetOwner: "sample",
    })

    expect(await repository.getCurrentSampleInvestigation()).toEqual(saved)

    await repository.clearSampleInvestigation()
    expect(await repository.getCurrentSampleInvestigation()).toBeNull()
  })

  it("maps database rows to stable API-safe values", () => {
    const entry = mapInvestigationEntry({
      id: SAMPLE_INVESTIGATION_ID,
      title: "Sample shortfall investigation",
      status: "draft",
      datasetOwner: "sample",
      createdAt: new Date("2026-06-17T00:00:00.000Z"),
    })

    expect(entry.createdAt).toBe("2026-06-17T00:00:00.000Z")
    expect(entry.datasetOwner).toBe("sample")
  })
})

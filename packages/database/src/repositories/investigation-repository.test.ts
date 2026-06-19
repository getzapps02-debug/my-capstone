import { afterAll, beforeEach, describe, expect, it } from "vitest"

import {
  DrizzleInvestigationRepository,
  SAMPLE_INVESTIGATION_ID,
  getSampleDatasetScenarios,
  mapInvestigationEntry,
} from "./investigation-repository.js"
import { createDatabaseClient } from "../client.js"
import { investigationEntries } from "../schema/index.js"

const databaseUrl = process.env.DATABASE_URL
const maybeDescribe = databaseUrl ? describe : describe.skip
const client = databaseUrl ? createDatabaseClient(databaseUrl) : null

describe("investigation repository contract", () => {
  maybeDescribe("Drizzle repository", () => {
    const repository = client
      ? new DrizzleInvestigationRepository(client.db)
      : null

    beforeEach(async () => {
      await client?.db.delete(investigationEntries)
    })

    afterAll(async () => {
      await client?.close()
    })

    it("writes, reads, and clears the sample investigation deterministically", async () => {
      expect(repository).not.toBeNull()

      if (!repository) {
        return
      }

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

    it("loads and resets deterministic sample dataset state", async () => {
      expect(repository).not.toBeNull()

      if (!repository) {
        return
      }

      const loaded = await repository.loadSampleDataset()
      const loadedAgain = await repository.loadSampleDataset()

      expect(loaded).toMatchObject({
        datasetOwner: "sample",
        label: "Sample Data",
        investigation: {
          id: SAMPLE_INVESTIGATION_ID,
          datasetOwner: "sample",
        },
      })
      expect(loaded.scenarios.map((scenario) => scenario.id)).toEqual([
        "complete-reconciled-shortfall",
        "insufficient-evidence",
      ])
      expect(loadedAgain).toMatchObject({
        label: loaded.label,
        description: loaded.description,
        investigation: {
          id: loaded.investigation.id,
          title: loaded.investigation.title,
          status: loaded.investigation.status,
          datasetOwner: loaded.investigation.datasetOwner,
        },
        scenarios: loaded.scenarios,
      })

      await repository.clearSampleInvestigation()
      expect(await repository.getCurrentSampleInvestigation()).toBeNull()

      const reset = await repository.resetSampleDataset()
      expect(reset.scenarios).toEqual(loaded.scenarios)
      expect(reset.investigation).toMatchObject({
        id: SAMPLE_INVESTIGATION_ID,
        datasetOwner: "sample",
      })
    })

    it("keeps sample and personal rows separated by composite identity", async () => {
      expect(repository).not.toBeNull()

      if (!repository || !client) {
        return
      }

      await client.db.insert(investigationEntries).values({
        id: SAMPLE_INVESTIGATION_ID,
        title: "Personal investigation",
        status: "active",
        datasetOwner: "personal",
      })

      const saved = await repository.ensureSampleInvestigation()
      const rows = await client.db.select().from(investigationEntries)

      expect(saved.datasetOwner).toBe("sample")
      expect(rows).toHaveLength(2)
      expect(rows.map((row) => row.datasetOwner).sort()).toEqual([
        "personal",
        "sample",
      ])
    })

    it("reset keeps personal rows with sample-like IDs untouched", async () => {
      expect(repository).not.toBeNull()

      if (!repository || !client) {
        return
      }

      await client.db.insert(investigationEntries).values({
        id: SAMPLE_INVESTIGATION_ID,
        title: "Personal investigation",
        status: "active",
        datasetOwner: "personal",
      })

      await repository.resetSampleDataset()

      const rows = await client.db.select().from(investigationEntries)
      const personalRow = rows.find((row) => row.datasetOwner === "personal")

      expect(rows).toHaveLength(2)
      expect(personalRow).toMatchObject({
        id: SAMPLE_INVESTIGATION_ID,
        title: "Personal investigation",
        status: "active",
        datasetOwner: "personal",
      })
    })
  })

  it("exposes required sample scenarios without advisory or causal copy", () => {
    const scenarios = getSampleDatasetScenarios()

    expect(scenarios.map((scenario) => scenario.id)).toEqual([
      "complete-reconciled-shortfall",
      "insufficient-evidence",
    ])
    expect(
      scenarios
        .map((scenario) => `${scenario.label} ${scenario.summary}`)
        .join(" ")
    ).not.toMatch(/caused your Shortfall|you overspent because|advice/i)
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

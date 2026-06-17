import { afterAll, beforeEach, describe, expect, it } from "vitest"

import {
  DrizzleInvestigationRepository,
  SAMPLE_INVESTIGATION_ID,
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

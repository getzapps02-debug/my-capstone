import { and, eq } from "drizzle-orm"
import type { NodePgDatabase } from "drizzle-orm/node-postgres"

import { investigationEntries } from "../schema/investigation-entries.js"
import * as schema from "../schema/index.js"

export const SAMPLE_INVESTIGATION_ID = "sample-investigation"

export type DatasetOwner = "sample" | "personal"
export type InvestigationStatus = "draft" | "active"

export type InvestigationEntry = {
  id: string
  title: string
  status: InvestigationStatus
  createdAt: string
  datasetOwner: DatasetOwner
}

export type SampleInvestigationInput = {
  title: string
  status: InvestigationStatus
}

export type InvestigationRepositoryPort = {
  ensureSampleInvestigation(
    input?: SampleInvestigationInput
  ): Promise<InvestigationEntry>
  getCurrentSampleInvestigation(): Promise<InvestigationEntry | null>
  clearSampleInvestigation(): Promise<void>
}

type Database = NodePgDatabase<typeof schema>

const defaultSampleInvestigation = {
  title: "Sample shortfall investigation",
  status: "draft",
} satisfies SampleInvestigationInput

export class PersistenceError extends Error {
  readonly code = "persistence_error"

  constructor(
    message = "Local persistence is unavailable.",
    options?: { cause?: unknown }
  ) {
    super(message, options)
  }
}

export class DrizzleInvestigationRepository
  implements InvestigationRepositoryPort
{
  constructor(private readonly db: Database) {}

  async ensureSampleInvestigation(
    input: SampleInvestigationInput = defaultSampleInvestigation
  ): Promise<InvestigationEntry> {
    try {
      const [row] = await this.db
        .insert(investigationEntries)
        .values({
          id: SAMPLE_INVESTIGATION_ID,
          title: input.title,
          status: input.status,
          datasetOwner: "sample",
        })
        .onConflictDoUpdate({
          target: [investigationEntries.datasetOwner, investigationEntries.id],
          set: {
            title: input.title,
            status: input.status,
            datasetOwner: "sample",
          },
        })
        .returning()

      if (!row) {
        throw new Error("No investigation row returned after write.")
      }

      return mapInvestigationEntry(row)
    } catch (cause) {
      throw new PersistenceError("Could not save the sample investigation.", {
        cause,
      })
    }
  }

  async getCurrentSampleInvestigation(): Promise<InvestigationEntry | null> {
    try {
      const [row] = await this.db
        .select()
        .from(investigationEntries)
        .where(
          and(
            eq(investigationEntries.id, SAMPLE_INVESTIGATION_ID),
            eq(investigationEntries.datasetOwner, "sample")
          )
        )
        .limit(1)

      return row ? mapInvestigationEntry(row) : null
    } catch (cause) {
      throw new PersistenceError("Could not read the sample investigation.", {
        cause,
      })
    }
  }

  async clearSampleInvestigation(): Promise<void> {
    try {
      await this.db
        .delete(investigationEntries)
        .where(
          and(
            eq(investigationEntries.id, SAMPLE_INVESTIGATION_ID),
            eq(investigationEntries.datasetOwner, "sample")
          )
        )
    } catch (cause) {
      throw new PersistenceError("Could not clear the sample investigation.", {
        cause,
      })
    }
  }
}

export function mapInvestigationEntry(
  row: typeof investigationEntries.$inferSelect
): InvestigationEntry {
  return {
    id: row.id,
    title: row.title,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    datasetOwner: row.datasetOwner,
  }
}

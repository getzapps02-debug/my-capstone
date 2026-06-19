import { and, eq } from "drizzle-orm"
import type { NodePgDatabase } from "drizzle-orm/node-postgres"

import { investigationEntries } from "../schema/investigation-entries.js"
import * as schema from "../schema/index.js"

export const SAMPLE_INVESTIGATION_ID = "sample-investigation"

export type DatasetOwner = "sample" | "personal"
export type InvestigationStatus = "draft" | "active"
export type SampleScenarioId =
  | "complete-reconciled-shortfall"
  | "insufficient-evidence"
export type SampleScenarioReadiness = "ready" | "insufficient-evidence"

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

export type SampleScenario = {
  id: SampleScenarioId
  label: string
  readiness: SampleScenarioReadiness
  summary: string
}

export type SampleDataset = {
  datasetOwner: "sample"
  label: string
  description: string
  investigation: InvestigationEntry
  scenarios: SampleScenario[]
}

export type InvestigationRepositoryPort = {
  ensureSampleInvestigation(
    input?: SampleInvestigationInput
  ): Promise<InvestigationEntry>
  getCurrentSampleInvestigation(): Promise<InvestigationEntry | null>
  clearSampleInvestigation(): Promise<void>
  loadSampleDataset(): Promise<SampleDataset>
  resetSampleDataset(): Promise<SampleDataset>
}

type Database = NodePgDatabase<typeof schema>

const defaultSampleInvestigation = {
  title: "Sample shortfall investigation",
  status: "draft",
} satisfies SampleInvestigationInput

const sampleDatasetScenarios = [
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
] satisfies SampleScenario[]

const sampleDatasetDescription =
  "Synthetic example evidence for trying the local investigation workflow."

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

  async loadSampleDataset(): Promise<SampleDataset> {
    const investigation = await this.ensureSampleInvestigation()

    return buildSampleDataset(investigation)
  }

  async resetSampleDataset(): Promise<SampleDataset> {
    try {
      const investigation = await this.db.transaction(async (tx) => {
        await tx
          .delete(investigationEntries)
          .where(
            and(
              eq(investigationEntries.id, SAMPLE_INVESTIGATION_ID),
              eq(investigationEntries.datasetOwner, "sample")
            )
          )

        const [row] = await tx
          .insert(investigationEntries)
          .values({
            id: SAMPLE_INVESTIGATION_ID,
            title: defaultSampleInvestigation.title,
            status: defaultSampleInvestigation.status,
            datasetOwner: "sample",
          })
          .returning()

        if (!row) {
          throw new Error("No investigation row returned after reset.")
        }

        return mapInvestigationEntry(row)
      })

      return buildSampleDataset(investigation)
    } catch (cause) {
      if (cause instanceof PersistenceError) {
        throw cause
      }

      throw new PersistenceError("Could not reset the sample dataset.", {
        cause,
      })
    }
  }
}

export function getSampleDatasetScenarios(): SampleScenario[] {
  return sampleDatasetScenarios.map((scenario) => ({ ...scenario }))
}

function buildSampleDataset(investigation: InvestigationEntry): SampleDataset {
  return {
    datasetOwner: "sample",
    label: "Sample Data",
    description: sampleDatasetDescription,
    investigation,
    scenarios: getSampleDatasetScenarios(),
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

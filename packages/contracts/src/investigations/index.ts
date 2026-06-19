import { z } from "zod"

export const datasetOwnerSchema = z.enum(["sample", "personal"])
export const investigationStatusSchema = z.enum(["draft", "active"])

export const investigationEntrySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  status: investigationStatusSchema,
  createdAt: z.string().datetime(),
  datasetOwner: datasetOwnerSchema,
})

export const currentSampleInvestigationResponseSchema = z.object({
  investigation: investigationEntrySchema.nullable(),
})

export const sampleScenarioIdSchema = z.enum([
  "complete-reconciled-shortfall",
  "insufficient-evidence",
])

export const sampleScenarioReadinessSchema = z.enum([
  "ready",
  "insufficient-evidence",
])

export const sampleScenarioSchema = z.object({
  id: sampleScenarioIdSchema,
  label: z.string().min(1),
  readiness: sampleScenarioReadinessSchema,
  summary: z.string().min(1),
})

export const sampleDatasetSchema = z.object({
  datasetOwner: z.literal("sample"),
  label: z.string().min(1),
  description: z.string().min(1),
  investigation: investigationEntrySchema,
  scenarios: z.array(sampleScenarioSchema).min(2),
})

export const sampleDatasetResponseSchema = z.object({
  sampleDataset: sampleDatasetSchema,
})

export type DatasetOwner = z.infer<typeof datasetOwnerSchema>
export type InvestigationStatus = z.infer<typeof investigationStatusSchema>
export type InvestigationEntry = z.infer<typeof investigationEntrySchema>
export type CurrentSampleInvestigationResponse = z.infer<
  typeof currentSampleInvestigationResponseSchema
>
export type SampleScenarioId = z.infer<typeof sampleScenarioIdSchema>
export type SampleScenarioReadiness = z.infer<
  typeof sampleScenarioReadinessSchema
>
export type SampleScenario = z.infer<typeof sampleScenarioSchema>
export type SampleDataset = z.infer<typeof sampleDatasetSchema>
export type SampleDatasetResponse = z.infer<typeof sampleDatasetResponseSchema>

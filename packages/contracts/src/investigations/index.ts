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

export type DatasetOwner = z.infer<typeof datasetOwnerSchema>
export type InvestigationStatus = z.infer<typeof investigationStatusSchema>
export type InvestigationEntry = z.infer<typeof investigationEntrySchema>
export type CurrentSampleInvestigationResponse = z.infer<
  typeof currentSampleInvestigationResponseSchema
>

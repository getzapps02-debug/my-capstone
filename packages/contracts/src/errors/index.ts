import { z } from "zod"

export const requestIdSchema = z.string().min(1)

export const errorResponseSchema = z.object({
  code: z.string().min(1),
  message: z.string().min(1),
  requestId: requestIdSchema,
})

export type ErrorResponse = z.infer<typeof errorResponseSchema>

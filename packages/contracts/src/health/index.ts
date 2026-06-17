import { z } from "zod"

import { requestIdSchema } from "../errors/index.js"

export const healthResponseSchema = z.object({
  status: z.literal("ok"),
  service: z.literal("api"),
  requestId: requestIdSchema,
  timestamp: z.string().datetime(),
})

export type HealthResponse = z.infer<typeof healthResponseSchema>

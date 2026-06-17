import {
  type HealthResponse,
  healthResponseSchema,
} from "@workspace/contracts/health"
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"

export const healthRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/health",
    {
      schema: {
        response: {
          200: healthResponseSchema,
        },
      },
    },
    async (request): Promise<HealthResponse> => {
      return {
        status: "ok",
        service: "api",
        requestId: request.id,
        timestamp: new Date().toISOString(),
      }
    }
  )
}

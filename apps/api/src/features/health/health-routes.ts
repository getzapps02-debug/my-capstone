import {
  type HealthResponse,
  type ReadinessResponse,
  healthResponseSchema,
  readinessResponseSchema,
} from "@workspace/contracts/health"
import { errorResponseSchema } from "@workspace/contracts/errors"
import {
  createDatabaseClient,
  DrizzleInvestigationRepository,
} from "@workspace/database"
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"

export type HealthRoutesOptions = {
  readinessProbe?: () => Promise<{ persistence: "ok" }>
}

export const healthRoutes: FastifyPluginAsyncZod<HealthRoutesOptions> = async (
  app,
  options
) => {
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

  app.get(
    "/ready",
    {
      schema: {
        response: {
          200: readinessResponseSchema,
          503: errorResponseSchema,
        },
      },
    },
    async (request, reply): Promise<ReadinessResponse | undefined> => {
      try {
        const dependencies = await (
          options.readinessProbe ?? defaultReadinessProbe
        )()

        return {
          dependencies,
          status: "ok",
          service: "api",
          requestId: request.id,
          timestamp: new Date().toISOString(),
        }
      } catch (error) {
        request.log.warn({ err: error, requestId: request.id }, "api_not_ready")

        reply.status(503).send({
          code: "local_dependency_unavailable",
          message: "A required local service is unavailable right now.",
          requestId: request.id,
        })
      }
    }
  )
}

async function defaultReadinessProbe() {
  const client = createDatabaseClient()

  try {
    const repository = new DrizzleInvestigationRepository(client.db)
    await repository.getCurrentSampleInvestigation()

    return {
      persistence: "ok" as const,
    }
  } finally {
    await client.close()
  }
}

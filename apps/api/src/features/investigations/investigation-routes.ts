import {
  currentSampleInvestigationResponseSchema,
  sampleDatasetResponseSchema,
} from "@workspace/contracts/investigations"
import { errorResponseSchema } from "@workspace/contracts/errors"
import {
  createDatabaseClient,
  DrizzleInvestigationRepository,
  PersistenceError,
  type InvestigationRepositoryPort,
} from "@workspace/database"
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"

export type InvestigationRoutesOptions = {
  repository?: InvestigationRepositoryPort
}

export const investigationRoutes: FastifyPluginAsyncZod<
  InvestigationRoutesOptions
> = async (app, options) => {
  const { close, getRepository } = createRepositoryFactory(options.repository)

  app.addHook("onClose", async () => {
    await close()
  })

  app.get(
    "/api/v1/investigations/current-sample",
    {
      schema: {
        response: {
          200: currentSampleInvestigationResponseSchema,
          503: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const repository = getRepository()
        const investigation = await repository.getCurrentSampleInvestigation()

        return {
          investigation,
        }
      } catch (error) {
        if (error instanceof PersistenceError) {
          return reply.status(503).send({
            code: "persistence_unavailable",
            message:
              "Saved investigation is unavailable from local persistence right now.",
            requestId:
              typeof request.id === "string" && request.id.trim() !== ""
                ? request.id
                : "unknown-request",
          })
        }

        throw error
      }
    }
  )

  app.post(
    "/api/v1/investigations/sample/load",
    {
      schema: {
        response: {
          200: sampleDatasetResponseSchema,
          401: errorResponseSchema,
          503: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const repository = getRepository()
        const sampleDataset = await repository.loadSampleDataset()

        return {
          sampleDataset,
        }
      } catch (error) {
        if (error instanceof PersistenceError) {
          return reply.status(503).send({
            code: "persistence_unavailable",
            message:
              "Sample Data is unavailable from local persistence right now.",
            requestId:
              typeof request.id === "string" && request.id.trim() !== ""
                ? request.id
                : "unknown-request",
          })
        }

        throw error
      }
    }
  )

  app.post(
    "/api/v1/investigations/sample/reset",
    {
      schema: {
        response: {
          200: sampleDatasetResponseSchema,
          401: errorResponseSchema,
          503: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const repository = getRepository()
        const sampleDataset = await repository.resetSampleDataset()

        return {
          sampleDataset,
        }
      } catch (error) {
        if (error instanceof PersistenceError) {
          return reply.status(503).send({
            code: "persistence_unavailable",
            message:
              "Sample Data could not be reset from local persistence right now.",
            requestId:
              typeof request.id === "string" && request.id.trim() !== ""
                ? request.id
                : "unknown-request",
          })
        }

        throw error
      }
    }
  )
}

function createRepositoryFactory(repository?: InvestigationRepositoryPort) {
  let databaseClient: ReturnType<typeof createDatabaseClient> | undefined
  let databaseRepository: InvestigationRepositoryPort | undefined = repository

  return {
    async close() {
      await databaseClient?.close()
      databaseClient = undefined
      if (!repository) {
        databaseRepository = undefined
      }
    },
    getRepository() {
      if (databaseRepository) {
        return databaseRepository
      }

      databaseClient = createDatabaseClient()
      databaseRepository = new DrizzleInvestigationRepository(databaseClient.db)

      return databaseRepository
    },
  }
}

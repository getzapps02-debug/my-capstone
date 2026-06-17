import Fastify, { type FastifyServerOptions } from "fastify"
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod"

import { errorHandlerPlugin } from "./errors/error-handler.js"
import { healthRoutes } from "./features/health/health-routes.js"
import {
  investigationRoutes,
  type InvestigationRoutesOptions,
} from "./features/investigations/investigation-routes.js"
import { requestIdPlugin } from "./plugins/request-id.js"

export type BuildAppOptions = FastifyServerOptions & {
  investigationRepository?: InvestigationRoutesOptions["repository"]
}

export async function buildApp(options: BuildAppOptions = {}) {
  const { investigationRepository, ...fastifyOptions } = options
  const app = Fastify({
    logger: true,
    ...fastifyOptions,
  }).withTypeProvider<ZodTypeProvider>()

  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  await app.register(requestIdPlugin)
  await app.register(errorHandlerPlugin)
  await app.register(healthRoutes)
  await app.register(investigationRoutes, { repository: investigationRepository })

  return app
}

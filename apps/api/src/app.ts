import Fastify, { type FastifyServerOptions } from "fastify"
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod"

import { getApiConfig, type LocalSecurityConfig } from "./config/index.js"
import { installErrorHandlers } from "./errors/error-handler.js"
import { healthRoutes } from "./features/health/health-routes.js"
import {
  investigationRoutes,
  type InvestigationRoutesOptions,
} from "./features/investigations/investigation-routes.js"
import { requestIdPlugin } from "./plugins/request-id.js"
import { installLocalSecurity } from "./plugins/local-security.js"

export type BuildAppOptions = FastifyServerOptions & {
  investigationRepository?: InvestigationRoutesOptions["repository"]
  localSecurity?: LocalSecurityConfig
  readinessProbe?: () => Promise<{ persistence: "ok" }>
}

export async function buildApp(options: BuildAppOptions = {}) {
  const {
    investigationRepository,
    localSecurity = getApiConfig().localSecurity,
    readinessProbe,
    ...fastifyOptions
  } = options
  const app = Fastify({
    bodyLimit: localSecurity.bodyLimitBytes,
    requestTimeout: localSecurity.requestTimeoutMs,
    logger: true,
    ...fastifyOptions,
  }).withTypeProvider<ZodTypeProvider>()

  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  await app.register(requestIdPlugin)
  installErrorHandlers(app)
  await installLocalSecurity(app, localSecurity)
  await app.register(healthRoutes, { readinessProbe })
  await app.register(investigationRoutes, { repository: investigationRepository })

  return app
}

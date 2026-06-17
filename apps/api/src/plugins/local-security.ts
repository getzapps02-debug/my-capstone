import cors from "@fastify/cors"
import helmet from "@fastify/helmet"
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"

import type { LocalSecurityConfig } from "../config/index.js"

const stateChangingMethods = new Set(["DELETE", "PATCH", "POST", "PUT"])

export async function installLocalSecurity(
  app: FastifyInstance,
  options: LocalSecurityConfig
) {
  const allowedOrigins = new Set(options.allowedOrigins)

  await app.register(helmet)
  await app.register(cors, {
    origin(origin, callback) {
      callback(null, origin ? allowedOrigins.has(origin) : false)
    },
  })

  app.addHook("onRequest", async (request, reply) => {
    reply.header("x-content-type-options", "nosniff")
    reply.header("referrer-policy", "no-referrer")

    const origin = request.headers.origin

    if (!origin) {
      return
    }

    if (!allowedOrigins.has(origin)) {
      return sendLocalSecurityError(
        reply,
        request,
        403,
        "local_origin_required",
        "Requests must come from the configured local application origin."
      )
    }

    reply.header("access-control-allow-origin", origin)
    reply.header("vary", "Origin")
  })

  app.addHook("preHandler", async (request, reply) => {
    if (!stateChangingMethods.has(request.method)) {
      return
    }

    if (!options.localRequestToken) {
      return sendLocalSecurityError(
        reply,
        request,
        401,
        "local_request_token_required",
        "State-changing local requests require the configured request token."
      )
    }

    const suppliedToken = request.headers["x-local-request-token"]

    if (suppliedToken !== options.localRequestToken) {
      return sendLocalSecurityError(
        reply,
        request,
        401,
        "local_request_token_required",
        "State-changing local requests require the configured request token."
      )
    }
  })
}

function sendLocalSecurityError(
  reply: FastifyReply,
  request: FastifyRequest,
  statusCode: number,
  code: string,
  message: string
) {
  return reply.status(statusCode).send({
    code,
    message,
    requestId:
      typeof request.id === "string" && request.id.trim() !== ""
        ? request.id
        : "unknown-request",
  })
}

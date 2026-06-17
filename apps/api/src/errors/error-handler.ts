import type { FastifyPluginAsync } from "fastify"

import { HttpError } from "./http-error.js"

export const errorHandlerPlugin: FastifyPluginAsync = async (app) => {
  app.setNotFoundHandler(async (request, reply) => {
    const requestId = getRequestId(request)

    return reply.status(404).send({
      code: "not_found",
      message: "The requested local resource is not available.",
      requestId,
    })
  })

  app.setErrorHandler(async (error, request, reply) => {
    const requestId = getRequestId(request)

    if (error instanceof HttpError) {
      const body = {
        code: error.code,
        message: error.message,
        requestId,
      }

      return reply.status(error.statusCode).send(body)
    }

    request.log.error({ err: error, requestId }, "api_error")

    return reply.status(500).send({
      code: "internal_error",
      message: "The local service could not complete the request.",
      requestId,
    })
  })
}

function getRequestId(request: { id?: string }): string {
  return typeof request.id === "string" && request.id.trim() !== ""
    ? request.id
    : "unknown-request"
}

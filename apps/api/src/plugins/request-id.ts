import { randomUUID } from "node:crypto"

import type { FastifyPluginAsync } from "fastify"

export const requestIdPlugin: FastifyPluginAsync = async (app) => {
  app.addHook("onRequest", async (request, reply) => {
    const incomingRequestId = request.headers["x-request-id"]
    const requestId =
      typeof incomingRequestId === "string" && incomingRequestId.trim() !== ""
        ? incomingRequestId
        : randomUUID()

    request.id = requestId
    reply.header("x-request-id", requestId)
  })
}

import { errorResponseSchema } from "@workspace/contracts/errors"
import { currentSampleInvestigationResponseSchema } from "@workspace/contracts/investigations"
import {
  PersistenceError,
  SAMPLE_INVESTIGATION_ID,
  type InvestigationRepositoryPort,
} from "@workspace/database"
import { describe, expect, it } from "vitest"

import { buildApp } from "../../app.js"

const sampleRepository = {
  async ensureSampleInvestigation() {
    return {
      id: SAMPLE_INVESTIGATION_ID,
      title: "Sample shortfall investigation",
      status: "draft",
      createdAt: "2026-06-17T00:00:00.000Z",
      datasetOwner: "sample",
    }
  },
  async getCurrentSampleInvestigation() {
    return {
      id: SAMPLE_INVESTIGATION_ID,
      title: "Sample shortfall investigation",
      status: "draft",
      createdAt: "2026-06-17T00:00:00.000Z",
      datasetOwner: "sample",
    }
  },
  async clearSampleInvestigation() {},
} satisfies InvestigationRepositoryPort

describe("investigation routes", () => {
  it("returns the current sample investigation through the shared contract", async () => {
    const app = await buildApp({
      logger: false,
      investigationRepository: sampleRepository,
    })

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/investigations/current-sample",
    })

    const parsed = currentSampleInvestigationResponseSchema.parse(
      JSON.parse(response.body)
    )

    expect(response.statusCode).toBe(200)
    expect(parsed.investigation?.id).toBe(SAMPLE_INVESTIGATION_ID)
    expect(parsed.investigation?.datasetOwner).toBe("sample")

    await app.close()
  })

  it("returns an explicit empty current investigation state", async () => {
    const app = await buildApp({
      logger: false,
      investigationRepository: {
        async ensureSampleInvestigation() {
          return sampleRepository.ensureSampleInvestigation()
        },
        async getCurrentSampleInvestigation() {
          return null
        },
        async clearSampleInvestigation() {},
      },
    })

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/investigations/current-sample",
    })

    const parsed = currentSampleInvestigationResponseSchema.parse(
      JSON.parse(response.body)
    )

    expect(response.statusCode).toBe(200)
    expect(parsed.investigation).toBeNull()

    await app.close()
  })

  it("normalizes persistence failures without leaking raw database details", async () => {
    const app = await buildApp({
      logger: false,
      investigationRepository: {
        async ensureSampleInvestigation() {
          return sampleRepository.ensureSampleInvestigation()
        },
        async getCurrentSampleInvestigation() {
          throw new PersistenceError("password=secret stack trace")
        },
        async clearSampleInvestigation() {},
      },
    })

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/investigations/current-sample",
    })

    const parsed = errorResponseSchema.parse(JSON.parse(response.body))

    expect(response.statusCode).toBe(503)
    expect(parsed.code).toBe("persistence_unavailable")
    expect(parsed.message).not.toContain("password")

    await app.close()
  })

  it("lets unexpected route errors reach the central error handler", async () => {
    const app = await buildApp({
      logger: false,
      investigationRepository: {
        async ensureSampleInvestigation() {
          return sampleRepository.ensureSampleInvestigation()
        },
        async getCurrentSampleInvestigation() {
          throw new Error("unexpected programmer error")
        },
        async clearSampleInvestigation() {},
      },
    })

    const response = await app.inject({
      method: "GET",
      url: "/api/v1/investigations/current-sample",
    })

    const parsed = errorResponseSchema.parse(JSON.parse(response.body))

    expect(response.statusCode).toBe(500)
    expect(parsed.code).toBe("internal_error")
    expect(parsed.message).not.toContain("programmer")

    await app.close()
  })
})

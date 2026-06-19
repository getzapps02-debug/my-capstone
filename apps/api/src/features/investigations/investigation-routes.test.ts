import { errorResponseSchema } from "@workspace/contracts/errors"
import { currentSampleInvestigationResponseSchema } from "@workspace/contracts/investigations"
import { sampleDatasetResponseSchema } from "@workspace/contracts/investigations"
import {
  PersistenceError,
  SAMPLE_INVESTIGATION_ID,
  type SampleDataset,
  type InvestigationRepositoryPort,
} from "@workspace/database"
import { describe, expect, it } from "vitest"

import { buildApp } from "../../app.js"

const sampleInvestigation = {
      id: SAMPLE_INVESTIGATION_ID,
      title: "Sample shortfall investigation",
      status: "draft",
      createdAt: "2026-06-17T00:00:00.000Z",
      datasetOwner: "sample",
} as const

const sampleDataset = {
  datasetOwner: "sample",
  label: "Sample Data",
  description:
    "Synthetic example evidence for trying the local investigation workflow.",
  investigation: sampleInvestigation,
  scenarios: [
    {
      id: "complete-reconciled-shortfall",
      label: "Complete reconciled shortfall",
      readiness: "ready",
      summary:
        "Example evidence with reconciled balances for a future Shortfall walkthrough.",
    },
    {
      id: "insufficient-evidence",
      label: "Insufficient evidence",
      readiness: "insufficient-evidence",
      summary:
        "Example evidence reserved for later refusal behavior when required records are missing.",
    },
  ],
} satisfies SampleDataset

const sampleRepository = {
  async ensureSampleInvestigation() {
    return sampleInvestigation
  },
  async getCurrentSampleInvestigation() {
    return sampleInvestigation
  },
  async clearSampleInvestigation() {},
  async loadSampleDataset() {
    return sampleDataset
  },
  async resetSampleDataset() {
    return sampleDataset
  },
} satisfies InvestigationRepositoryPort

const testLocalSecurity = {
  allowedOrigins: ["http://127.0.0.1:5173", "http://localhost:5173"],
  bodyLimitBytes: 1_048_576,
  handlerTimeoutMs: 30_000,
  localRequestToken: "local-dev-token",
  requestTimeoutMs: 30_000,
}

describe("investigation routes", () => {
  it("returns the current sample investigation through the shared contract", async () => {
    const app = await buildApp({
      logger: false,
      investigationRepository: sampleRepository,
      localSecurity: testLocalSecurity,
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

  it("loads Sample Data through a token-protected command", async () => {
    const app = await buildApp({
      logger: false,
      investigationRepository: sampleRepository,
      localSecurity: testLocalSecurity,
    })

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/investigations/sample/load",
      headers: {
        "x-local-request-token": "local-dev-token",
      },
    })

    const parsed = sampleDatasetResponseSchema.parse(JSON.parse(response.body))

    expect(response.statusCode).toBe(200)
    expect(parsed.sampleDataset.label).toBe("Sample Data")
    expect(parsed.sampleDataset.scenarios.map((scenario) => scenario.id)).toEqual(
      ["complete-reconciled-shortfall", "insufficient-evidence"]
    )

    await app.close()
  })

  it("resets only Sample Data through a token-protected command", async () => {
    const app = await buildApp({
      logger: false,
      investigationRepository: sampleRepository,
      localSecurity: testLocalSecurity,
    })

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/investigations/sample/reset",
      headers: {
        "x-local-request-token": "local-dev-token",
      },
    })

    const parsed = sampleDatasetResponseSchema.parse(JSON.parse(response.body))

    expect(response.statusCode).toBe(200)
    expect(parsed.sampleDataset.investigation.datasetOwner).toBe("sample")

    await app.close()
  })

  it("rejects Sample Data commands without the local request token", async () => {
    const app = await buildApp({
      logger: false,
      investigationRepository: sampleRepository,
      localSecurity: testLocalSecurity,
    })

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/investigations/sample/load",
    })
    const parsed = errorResponseSchema.parse(JSON.parse(response.body))

    expect(response.statusCode).toBe(401)
    expect(parsed.message).not.toContain("local-dev-token")

    await app.close()
  })

  it("rejects Sample Data reset without the local request token", async () => {
    const app = await buildApp({
      logger: false,
      investigationRepository: sampleRepository,
      localSecurity: testLocalSecurity,
    })

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/investigations/sample/reset",
    })
    const parsed = errorResponseSchema.parse(JSON.parse(response.body))

    expect(response.statusCode).toBe(401)
    expect(parsed.message).not.toContain("local-dev-token")

    await app.close()
  })

  it("returns an explicit empty current investigation state", async () => {
    const app = await buildApp({
      logger: false,
      localSecurity: testLocalSecurity,
      investigationRepository: {
        async ensureSampleInvestigation() {
          return sampleRepository.ensureSampleInvestigation()
        },
        async getCurrentSampleInvestigation() {
          return null
        },
        async clearSampleInvestigation() {},
        async loadSampleDataset() {
          return sampleRepository.loadSampleDataset()
        },
        async resetSampleDataset() {
          return sampleRepository.resetSampleDataset()
        },
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
      localSecurity: testLocalSecurity,
      investigationRepository: {
        async ensureSampleInvestigation() {
          return sampleRepository.ensureSampleInvestigation()
        },
        async getCurrentSampleInvestigation() {
          throw new PersistenceError("password=secret stack trace")
        },
        async clearSampleInvestigation() {},
        async loadSampleDataset() {
          throw new PersistenceError("password=secret stack trace")
        },
        async resetSampleDataset() {
          return sampleRepository.resetSampleDataset()
        },
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

  it("normalizes sample load persistence failures without leaking details", async () => {
    const app = await buildApp({
      logger: false,
      localSecurity: testLocalSecurity,
      investigationRepository: {
        async ensureSampleInvestigation() {
          return sampleRepository.ensureSampleInvestigation()
        },
        async getCurrentSampleInvestigation() {
          return sampleRepository.getCurrentSampleInvestigation()
        },
        async clearSampleInvestigation() {},
        async loadSampleDataset() {
          throw new PersistenceError("password=secret stack trace")
        },
        async resetSampleDataset() {
          return sampleRepository.resetSampleDataset()
        },
      },
    })

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/investigations/sample/load",
      headers: {
        "x-local-request-token": "local-dev-token",
      },
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
      localSecurity: testLocalSecurity,
      investigationRepository: {
        async ensureSampleInvestigation() {
          return sampleRepository.ensureSampleInvestigation()
        },
        async getCurrentSampleInvestigation() {
          throw new Error("unexpected programmer error")
        },
        async clearSampleInvestigation() {},
        async loadSampleDataset() {
          return sampleRepository.loadSampleDataset()
        },
        async resetSampleDataset() {
          return sampleRepository.resetSampleDataset()
        },
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

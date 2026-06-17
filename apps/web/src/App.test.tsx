import { cleanup, render, screen, within } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import { App } from "./App"

afterEach(() => {
  cleanup()
})

describe("Shortfall Investigator app shell", () => {
  const emptyInvestigationClient = async () => ({
    ok: true as const,
    data: {
      investigation: null,
    },
  })

  it("renders the required primary navigation surfaces", () => {
    render(
      <App
        healthClient={async () => ({ ok: false, message: "offline" })}
        investigationClient={emptyInvestigationClient}
      />
    )

    const navigation = screen.getByRole("navigation", {
      name: "Primary navigation",
    })

    expect(within(navigation).getByText("Investigate")).toBeTruthy()
    expect(within(navigation).getByText("Accounts & Data")).toBeTruthy()
    expect(within(navigation).getByText("Investigations")).toBeTruthy()
    expect(within(navigation).getByText("Settings & Privacy")).toBeTruthy()
  })

  it("exposes landmarks, skip link, and active navigation state", () => {
    render(
      <App
        healthClient={async () => ({ ok: false, message: "offline" })}
        investigationClient={emptyInvestigationClient}
      />
    )

    expect(
      screen.getByRole("link", { name: "Skip to main content" })
    ).toBeTruthy()
    expect(
      screen.getByRole("link", { name: "Skip to main content" }).getAttribute("href")
    ).toBe("#main-content")
    expect(screen.getByRole("main").getAttribute("id")).toBe("main-content")
    expect(
      screen.getByRole("button", { current: "page", name: /Investigate/i })
    ).toBeTruthy()
  })

  it("shows calm service status when the local API is available", async () => {
    render(
      <App
        healthClient={async () => ({
          ok: true,
          data: {
            status: "ok",
            service: "api",
            requestId: "req-123",
            timestamp: "2026-06-17T10:00:00.000Z",
          },
        })}
        investigationClient={emptyInvestigationClient}
      />
    )

    expect(await screen.findByText("Local service available")).toBeTruthy()
  })

  it("shows a safe unavailable status without raw exception details", async () => {
    render(
      <App
        healthClient={async () => ({
          ok: false,
          message: "stack trace with internal details",
        })}
        investigationClient={emptyInvestigationClient}
      />
    )

    expect(
      await screen.findByText("Local service check is unavailable right now.")
    ).toBeTruthy()
    expect(screen.queryByText(/stack trace/i)).toBeNull()
  })

  it("shows the saved investigation loaded from local persistence", async () => {
    render(
      <App
        healthClient={async () => ({ ok: false, message: "offline" })}
        investigationClient={async () => ({
          ok: true,
          data: {
            investigation: {
              id: "sample-investigation",
              title: "Sample shortfall investigation",
              status: "draft",
              createdAt: "2026-06-17T00:00:00.000Z",
              datasetOwner: "sample",
            },
          },
        })}
      />
    )

    expect(
      await screen.findByText("Sample shortfall investigation")
    ).toBeTruthy()
    expect(screen.getByText(/Saved locally as draft/i)).toBeTruthy()
    expect(screen.queryByText(/financial advice/i)).toBeNull()
  })

  it("shows a safe persistence unavailable state", async () => {
    render(
      <App
        healthClient={async () => ({ ok: false, message: "offline" })}
        investigationClient={async () => ({
          ok: false,
          message: "password=secret stack trace",
        })}
      />
    )

    expect(
      await screen.findByText(
        "Saved investigation is unavailable from local persistence right now."
      )
    ).toBeTruthy()
    expect(screen.queryByText(/password=secret/i)).toBeNull()
  })
})

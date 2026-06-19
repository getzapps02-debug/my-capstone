import { Button } from "@workspace/ui/components/button"
import { useEffect, useState } from "react"

import {
  getCurrentSampleInvestigation,
  getHealth,
  loadSampleDataset,
  resetSampleDataset,
  type CurrentSampleInvestigationClientResult,
  type HealthClientResult,
  type SampleDatasetClientResult,
} from "@workspace/api-client"

const navItems = [
  {
    label: "Investigate",
    description: "Start or resume a guided local investigation.",
    current: true,
  },
  {
    label: "Accounts & Data",
    description: "Manage local accounts, imports, and evidence records.",
    current: false,
  },
  {
    label: "Investigations",
    description: "Reopen saved investigation work.",
    current: false,
  },
  {
    label: "Settings & Privacy",
    description: "Review local data boundaries and controls.",
    current: false,
  },
]

type ServiceStatus = "checking" | "available" | "unavailable"
type InvestigationStatus = "checking" | "available" | "empty" | "unavailable"
type SampleDataset = Extract<
  SampleDatasetClientResult,
  { ok: true }
>["data"]["sampleDataset"]

type AppProps = {
  healthClient?: () => Promise<HealthClientResult>
  investigationClient?: () => Promise<CurrentSampleInvestigationClientResult>
  loadSampleDatasetClient?: () => Promise<SampleDatasetClientResult>
  localRequestToken?: string
  resetSampleDatasetClient?: () => Promise<SampleDatasetClientResult>
}

const sampleDataUnavailableMessage =
  "Sample Data is unavailable from local persistence right now."
const sampleDataResetUnavailableMessage =
  "Sample Data could not be reset from local persistence right now."

export function App({
  healthClient = getHealth,
  investigationClient = getCurrentSampleInvestigation,
  localRequestToken = import.meta.env.VITE_LOCAL_REQUEST_TOKEN ?? "",
  loadSampleDatasetClient = () => loadSampleDataset("", localRequestToken),
  resetSampleDatasetClient = () => resetSampleDataset("", localRequestToken),
}: AppProps) {
  const [serviceStatus, setServiceStatus] =
    useState<ServiceStatus>("checking")
  const [investigationStatus, setInvestigationStatus] =
    useState<InvestigationStatus>("checking")
  const [investigationTitle, setInvestigationTitle] = useState("")
  const [investigationSummary, setInvestigationSummary] = useState("")
  const [sampleDataset, setSampleDataset] = useState<SampleDataset | null>(null)
  const [sampleActionStatus, setSampleActionStatus] = useState("")

  useEffect(() => {
    let isCurrent = true

    async function checkServiceHealth() {
      setServiceStatus("checking")
      try {
        const result = await healthClient()

        if (!isCurrent) {
          return
        }

        setServiceStatus(result.ok ? "available" : "unavailable")
      } catch {
        if (isCurrent) {
          setServiceStatus("unavailable")
        }
      }
    }

    void checkServiceHealth()

    return () => {
      isCurrent = false
    }
  }, [healthClient])

  useEffect(() => {
    let isCurrent = true

    async function loadInvestigation() {
      setInvestigationStatus("checking")
      try {
        const result = await investigationClient()

        if (!isCurrent) {
          return
        }

        if (!result.ok) {
          setInvestigationStatus("unavailable")
          setInvestigationTitle("")
          setInvestigationSummary("")
          return
        }

        if (!result.data.investigation) {
          setInvestigationStatus("empty")
          setInvestigationTitle("")
          setInvestigationSummary("")
          setSampleDataset(null)
          return
        }

        setInvestigationStatus("available")
        setInvestigationTitle(result.data.investigation.title)
        setInvestigationSummary(
          `Saved locally as ${result.data.investigation.status} on ${new Date(
            result.data.investigation.createdAt
          ).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}.`
        )
        setSampleDataset(null)
      } catch {
        if (isCurrent) {
          setInvestigationStatus("unavailable")
          setInvestigationTitle("")
          setInvestigationSummary("")
          setSampleDataset(null)
        }
      }
    }

    void loadInvestigation()

    return () => {
      isCurrent = false
    }
  }, [investigationClient])

  const serviceStatusCopy = {
    checking: "Checking local service",
    available: "Local service available",
    unavailable: "Local service check is unavailable right now.",
  } satisfies Record<ServiceStatus, string>

  const investigationStatusCopy = {
    checking: "Checking saved investigation",
    available: investigationSummary,
    empty: "No saved investigation is available yet.",
    unavailable:
      "Saved investigation is unavailable from local persistence right now.",
  } satisfies Record<InvestigationStatus, string>

  async function runSampleAction(
    action: () => Promise<SampleDatasetClientResult>,
    successMessage: string,
    failureMessage: string
  ) {
    setSampleActionStatus("")

    try {
      const result = await action()

      if (!result.ok) {
        setSampleActionStatus(failureMessage)
        return
      }

      setSampleDataset(result.data.sampleDataset)
      setInvestigationStatus("available")
      setInvestigationTitle(result.data.sampleDataset.investigation.title)
      setInvestigationSummary(
        `${result.data.sampleDataset.label} / ${result.data.sampleDataset.description}`
      )
      setSampleActionStatus(successMessage)
    } catch {
      setSampleActionStatus(failureMessage)
    }
  }

  return (
    <div className="min-h-svh bg-[#F8FAFC] text-[#172033]">
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#1D4ED8] focus:outline-2 focus:outline-offset-2 focus:outline-[#2563EB]"
        href="#main-content"
      >
        Skip to main content
      </a>
      <div className="grid min-h-svh grid-cols-1 lg:grid-cols-[280px_1fr]">
        <nav
          aria-label="Primary navigation"
          className="border-b border-[#CBD5E1] bg-white px-4 py-4 lg:border-b-0 lg:border-r lg:px-5"
        >
          <div className="mb-5">
            <p className="text-xs font-semibold tracking-normal text-[#5F6B7A]">
              Local workspace
            </p>
            <h1 className="mt-1 text-xl font-semibold leading-tight">
              Shortfall Investigator
            </h1>
          </div>
          <ul className="grid gap-2">
            {navItems.map((item) => (
              <li key={item.label}>
                <Button
                  aria-current={item.current ? "page" : undefined}
                  className="h-auto w-full justify-start rounded-md border border-transparent bg-transparent px-3 py-3 text-left text-[#172033] shadow-none hover:border-[#CBD5E1] hover:bg-[#F1F5F9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] data-[current=true]:border-[#1D4ED8] data-[current=true]:bg-[#F1F5F9] data-[current=true]:text-[#1D4ED8]"
                  data-current={item.current}
                  type="button"
                  variant="ghost"
                >
                  <span className="flex flex-col gap-1">
                    <span className="text-sm font-semibold leading-5">
                      {item.label}
                    </span>
                    <span className="text-xs font-normal leading-5 text-[#5F6B7A]">
                      {item.description}
                    </span>
                  </span>
                </Button>
              </li>
            ))}
          </ul>
        </nav>

        <main
          className="px-5 py-6 sm:px-8 lg:px-10 lg:py-8"
          id="main-content"
        >
          <section
            aria-labelledby="investigate-heading"
            className="max-w-5xl rounded-lg border border-[#CBD5E1] bg-white p-5 sm:p-6"
          >
            <p className="text-sm font-semibold leading-5 text-[#5F6B7A]">
              Investigate
            </p>
            <h2
              className="mt-2 text-2xl font-semibold leading-tight"
              id="investigate-heading"
            >
              Evidence-first investigation shell
            </h2>
            <p className="mt-3 max-w-3xl text-[15px] leading-7 text-[#334155]">
              This local app shell establishes the navigation, workspace
              boundary, and visual foundation for investigation work. A minimal
              saved investigation record now loads from local persistence while
              financial evidence, imports, and analysis remain scoped to later
              stories.
            </p>
            <div
              aria-live="polite"
              className="mt-5 rounded-md border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-sm leading-6 text-[#334155]"
              role="status"
            >
              <span className="font-semibold text-[#172033]">
                Local service
              </span>
              <span className="mx-2 text-[#5F6B7A]">/</span>
              <span>{serviceStatusCopy[serviceStatus]}</span>
            </div>
            <div
              aria-live="polite"
              className="mt-3 rounded-md border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-sm leading-6 text-[#334155]"
              role="status"
            >
              <span className="font-semibold text-[#172033]">
                Saved investigation
              </span>
              <span className="mx-2 text-[#5F6B7A]">/</span>
              {investigationStatus === "available" ? (
                <span>
                  <span className="font-medium text-[#172033]">
                    {investigationTitle}
                  </span>
                  <span className="mx-2 text-[#5F6B7A]">/</span>
                  <span>{investigationStatusCopy[investigationStatus]}</span>
                </span>
              ) : (
                <span>{investigationStatusCopy[investigationStatus]}</span>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {investigationStatus === "empty" ? (
                <Button
                  className="rounded-md bg-[#1D4ED8] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1E40AF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
                  onClick={() =>
                    void runSampleAction(
                      loadSampleDatasetClient,
                      "Sample Data loaded locally.",
                      sampleDataUnavailableMessage
                    )
                  }
                  type="button"
                >
                  Load Sample Data
                </Button>
              ) : null}
              {investigationStatus === "available" ? (
                <Button
                  className="rounded-md border border-[#CBD5E1] bg-white px-4 py-2 text-sm font-semibold text-[#172033] shadow-none hover:bg-[#F1F5F9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
                  onClick={() =>
                    void runSampleAction(
                      resetSampleDatasetClient,
                      "Sample Data reset locally.",
                      sampleDataResetUnavailableMessage
                    )
                  }
                  type="button"
                  variant="ghost"
                >
                  Reset Sample Data
                </Button>
              ) : null}
            </div>
            <p className="mt-3 text-sm leading-6 text-[#5F6B7A]">
              Only Sample Data is reset. Personal Accounts and records are not
              changed by these example-data actions.
            </p>
            {sampleActionStatus ? (
              <div
                aria-live="polite"
                className="mt-3 rounded-md border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-3 text-sm leading-6 text-[#334155]"
                role="status"
              >
                {sampleActionStatus}
              </div>
            ) : null}
            {sampleDataset ? (
              <section
                aria-labelledby="sample-data-heading"
                className="mt-5 rounded-md border border-[#CBD5E1] bg-[#F8FAFC] p-4"
              >
                <p className="text-xs font-semibold text-[#1D4ED8]">
                  {sampleDataset.label}
                </p>
                <h3
                  className="mt-1 text-base font-semibold"
                  id="sample-data-heading"
                >
                  Example evidence entry points
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#5F6B7A]">
                  {sampleDataset.description}
                </p>
                <ul className="mt-3 grid gap-2">
                  {sampleDataset.scenarios.map((scenario) => (
                    <li
                      className="rounded-md border border-[#CBD5E1] bg-white p-3"
                      key={scenario.id}
                    >
                      <p className="text-sm font-semibold text-[#172033]">
                        {scenario.label}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-[#5F6B7A]">
                        {scenario.summary}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <div className="rounded-md border border-[#CBD5E1] bg-[#F8FAFC] p-4">
                <h3 className="text-sm font-semibold">Local first</h3>
                <p className="mt-2 text-sm leading-6 text-[#5F6B7A]">
                  The shell uses local project assets and no remote fonts,
                  CDNs, analytics, or telemetry.
                </p>
              </div>
              <div className="rounded-md border border-[#CBD5E1] bg-[#F8FAFC] p-4">
                <h3 className="text-sm font-semibold">Inspectable</h3>
                <p className="mt-2 text-sm leading-6 text-[#5F6B7A]">
                  Navigation and page regions are semantic, keyboard reachable,
                  and visibly focused.
                </p>
              </div>
              <div className="rounded-md border border-[#CBD5E1] bg-[#F8FAFC] p-4">
                <h3 className="text-sm font-semibold">Scoped</h3>
                <p className="mt-2 text-sm leading-6 text-[#5F6B7A]">
                  React shell code contains no balance, ranking, import,
                  transaction, or replay calculations.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
inputDocuments:
  - "_bmad-output/planning-artifacts/prds/prd-my-capstone-2026-06-15/prd.md"
  - "_bmad-output/planning-artifacts/architecture.md"
  - "_bmad-output/planning-artifacts/ux-designs/ux-my-capstone-2026-06-15/DESIGN.md"
  - "_bmad-output/planning-artifacts/ux-designs/ux-my-capstone-2026-06-15/EXPERIENCE.md"
---

# my-capstone - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for my-capstone, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Story Creation Rules

- Every story must produce a user-verifiable outcome, including stories that establish platform or architecture foundations.
- Invisible scaffolding must be paired with a visible slice or acceptance path that proves the intended user value.
- Every relevant story must include acceptance criteria for accessibility, provenance, non-causal wording, local-only behavior, and chart/table parity.
- Investigation state and case continuity must be considered whenever users enter, leave, resume, or review an Investigation.
- Account readiness is a trust-building checkpoint: users must understand what data is available, what is missing, and whether Investigation can proceed.
- Lightweight source and provenance indicators may appear before the full Evidence Inspector so users can trust imported data and readiness status from the beginning.
- Stories involving interpretation must preserve the spine: what happened, what evidence supports it, what limits apply, and what can be inspected next.

## Requirements Inventory

### Functional Requirements

FR1: The user can create, name, view, and delete Accounts, each using one Currency.
FR2: The user can load, use, and independently reset Sample Data.
FR3: The user can create a Transaction by providing Transaction Date, Amount, Description, and Account, with optional Category, Transaction Type, Merchant, and running Account Balance.
FR4: The user can preview a CSV and map source columns before import, including required mappings for Transaction Date, Amount, Description, and Account.
FR5: The user can import valid CSV rows while malformed rows are rejected with specific row-level reasons and retry support.
FR6: The system prevents repeat import of the same Transaction using Transaction ID when present or Account, Transaction Date, Amount, and normalized Description otherwise.
FR7: The user can establish an Account Balance from imported running balances or an Opening Balance plus ordered Transactions, and must resolve or explicitly accept reconciliation differences before ranking Contributors.
FR8: The user can edit Category, Merchant, Description, Transaction Date, Amount, Transaction Type, and transfer status, with corrections recomputing affected derived views.
FR9: The user can exclude a Transaction from an Investigation, delete a Transaction, or undo an entire import, with confirmations for destructive actions.
FR10: The user can mark Transfers and relate Refunds to affected Transactions or Contributors; Transfers are excluded and Refunds reduce related Contributor impact.
FR11: The user can create or confirm an Obligation and optionally link it to a Transaction; linked Obligations may affect ranking through their linked Transaction amount only.
FR12: The user can attach Context to a Transaction or Investigation; Context supports explanation but does not alter Contributor ranking.
FR13: The user can set and update a Safety Threshold for an Account, refreshing qualifying Shortfalls and affected Investigations.
FR14: The user can view Account Balance periods below the Safety Threshold and select one Shortfall for Investigation.
FR15: The system proposes an Investigation Period for the selected Shortfall, and the user can shorten or extend it.
FR16: The system proposes a Comparable Period, and the user can select another date range; unavailable comparison data is disclosed and ranking omits deviation when needed.
FR17: The system determines whether an Investigation has enough evidence to rank Contributors and refuses ranking when Minimum Evidence is not met.
FR18: The system groups eligible Transactions and linked Obligations into Contributors that reduced the available buffer, excluding duplicates and Transfers and applying linked Refunds.
FR19: The system ranks Contributors by total monetary impact, then deviation, then timing proximity, exposing calculation and Comparison Basis.
FR20: The system describes findings as observable contribution or association without causal overclaiming or financial advice.
FR21: The user can open a Contributor and inspect source Transactions, linked Obligations, monetary impact, Comparable Period values, timing, ranking rationale, and limitations.
FR22: The user can view Account Balance and Category Amount trends over time, with selected Shortfall, Investigation Period, Safety Threshold, threshold crossing, text summaries, and tabular alternatives.
FR23: The user can replay Transactions chronologically from the start to the end of the Investigation Period with synchronized chart, list, Contributor, and evidence views.
FR24: The user can play, pause, move to previous or next events, restart, change speed, and jump from a chart point or Transaction in Transaction Replay.
FR25: The system preserves Accounts and related records across page refresh, browser restart, and application restart without requiring a user account or cloud connection.
FR26: The user can export Transactions for an Account, with exported records distinguishing imported values from user corrections.
FR27: The user can permanently delete an Account or clear all local data, with explicit confirmation, affected-data disclosure, and completion or failure reporting.

### NonFunctional Requirements

NFR1: The core workflow must operate without sending financial data or telemetry outside the local environment.
NFR2: Destructive operations must require explicit confirmation and identify affected data.
NFR3: Sample Data must remain separate from personal Accounts.
NFR4: The core journey must target WCAG 2.2 AA.
NFR5: The core journey must be keyboard operable with visible focus and accessible control names.
NFR6: Charts must provide text summaries and tabular alternatives; meaning must not depend on color, hover, or motion alone.
NFR7: Transaction Replay must respect reduced-motion preferences.
NFR8: The application must support up to 10,000 Transactions per Account without preventing completion of the core journey.
NFR9: After an evidence correction, affected balances, charts, Contributors, and Replay state must update before stale findings can be treated as current.
NFR10: The application must start through one primary documented command after prerequisites.
NFR11: Given identical source evidence, settings, Investigation Period, and Comparable Period, Contributor results must be deterministic.
NFR12: Every Contributor must remain traceable to source evidence, calculation, Comparison Basis, and ranking rationale.
NFR13: Product-generated explanations must comply with the approved non-causal and non-advisory language guardrails.
NFR14: Dates without times use local calendar dates; monetary calculations use the Account Currency rounded to two decimal places.

### Additional Requirements

- Starter initialization must be the first implementation story: initialize the official shadcn Vite pnpm monorepo with `pnpm dlx shadcn@latest init -t vite --monorepo`.
- Preserve the starter workspace conventions while adding `apps/api` as a Fastify TypeScript workspace and `packages/domain`, `packages/contracts`, `packages/api-client`, and `packages/database`.
- Use TypeScript across browser, server, and shared packages; Node.js 24 LTS; ESM modules; and pnpm workspace management.
- Use Tailwind CSS and source-owned shadcn/ui components, with the approved design tokens applied as the brand layer.
- Add Vitest for domain, API, and component tests; Playwright for import-to-investigation workflows; and PostgreSQL integration tests against an isolated test database.
- Make PostgreSQL 18 the authoritative datastore, accessed through Drizzle ORM with committed, versioned SQL migrations.
- Store money as integer minor units and financial dates as PostgreSQL `date` values.
- Keep deterministic financial calculations in pure TypeScript domain functions with no Fastify, React, or database dependency.
- Validate API and CSV boundaries with shared Zod schemas in `packages/contracts`.
- Persist source facts, user corrections, calculation-rule versions, and reproducible derived results.
- Execute imports, corrections, undo, and deletion transactionally.
- Keep Sample Data and personal data explicitly separated through dataset ownership.
- Defer Neo4j or graph storage; any future graph store must be a rebuildable projection and core results must never depend on it.
- Implement a no-login single-user local security model with services bound to loopback, PostgreSQL only on the internal Compose network, fixed local request token for state-changing requests, fixed local CORS origins, request limits, timeouts, and baseline security headers.
- Use no remote fonts, CDNs, analytics, telemetry, or external financial-data processing.
- Redact logs so they exclude sensitive financial values and uploaded row contents.
- Use REST endpoints under `/api/v1`, Fastify route plugins by product capability, generated OpenAPI, and a generated TypeScript API client.
- Use standard API error envelopes with `code`, `message`, `details`, and `requestId`, plus documented HTTP status conventions.
- Provide `/health` and `/ready` endpoints, request ID propagation, and CI drift checks among contracts, OpenAPI output, and generated client.
- Build the frontend as a React/Vite SPA with React Router routes for `/investigate`, `/accounts`, `/accounts/:accountId/import`, `/investigations`, `/investigations/:investigationId`, and `/settings`.
- Use TanStack Query for server state, URL search parameters for shareable investigation selections, React Hook Form with shared Zod schemas for forms, and TanStack Table for evidence tables.
- Wrap Recharts in accessible product components; charts must never be authoritative.
- Keep Replay as a deterministic client controller over server-provided ordered events and avoid browser-side financial calculations.
- Organize web code by product feature with route-level error boundaries, loading skeletons, lazy loading for heavy routes, and reduced-motion enforcement.
- Use Docker Compose as the local deployment mechanism with one Fastify container serving the REST API and compiled Vite frontend and a separate PostgreSQL container with a persistent named volume.
- `docker compose up --build` must start the application; migrations complete before readiness.
- Bind only the application port to `127.0.0.1`; do not host PostgreSQL on the host network.
- Add local `.env.example`, backup and restore documentation, local security documentation, structured redacted logs, and CI checks for linting, type checking, tests, builds, migrations, OpenAPI/client drift, dependency scans, and container scans.
- Enforce project structure and ownership boundaries for `apps/web`, `apps/api`, `packages/contracts`, `packages/database`, `packages/api-client`, `packages/domain`, `packages/ui`, and test folders.
- Reuse shared contracts, keep financial calculations in domain functions, preserve transaction/revision/provenance/dataset boundaries, use committed migrations, add focused tests, and keep charts/tables/narrative/Replay synchronized through stable IDs.

### UX Design Requirements

UX-DR1: Implement the visual identity tokens from `DESIGN.md`, including primary, neutral, evidence, warning, destructive, and success colors.
UX-DR2: Implement typography tokens for display, heading, body, label, and data text, including tabular numerals for monetary values, dates, rankings, and calculations.
UX-DR3: Implement the 4px spacing scale and crisp radius scale for controls, rows, panels, provenance labels, and major workspace regions.
UX-DR4: Preserve a quiet analytical visual style using neutral surfaces, borders, and spacing rather than shadows, gradients, glass effects, or decorative networks.
UX-DR5: Implement inherited shadcn/ui primitives for buttons, inputs, selects, checkboxes, dialogs, drawers, dropdowns, tabs, tooltips, skeletons, toasts, accordions, separators, and tables.
UX-DR6: Implement product-specific App Navigation with persistent desktop navigation, mobile drawer behavior, active state treatment, and unsaved import-state preservation.
UX-DR7: Implement the Investigate Step Indicator for Account readiness, Shortfall, Period, and Findings, allowing completed steps to be revisited and stale downstream findings to be marked after invalidating changes.
UX-DR8: Implement the Balance Chart with keyboard and pointer selection, threshold, selected period, crossing, evidence selection markers, equivalent summary, and equivalent table.
UX-DR9: Implement Contributor Row with rank, monetary impact, valid comparison, timing, one-sentence explanation, selected state, and access to evidence without losing investigation context.
UX-DR10: Implement Evidence Inspector with provenance, source Transactions, calculation, limitations, and related evidence only when it clarifies the finding.
UX-DR11: Implement Provenance Label with explicit text for `Imported fact`, `User-provided`, `Calculated`, and `Derived finding`; color must supplement text only.
UX-DR12: Implement Limitation Callout for readiness, findings, and evidence that lists unavailable or inconsistent evidence, effect on ranking, and corrective path.
UX-DR13: Implement Replay Controls with play, pause, previous, next, restart, speed, jump, current event position, accessible names, state, and boundary-disabled behavior.
UX-DR14: Implement Data Table patterns for Accounts & Data, chart alternatives, and evidence, including captions, associated headers, numeric alignment where practical, and pagination or measured virtualization for long lists.
UX-DR15: Implement Account Readiness Panel showing data coverage, balance evidence, reconciliation status, and one next action.
UX-DR16: Implement CSV Mapper with file preview, required and optional mapping controls, preserved file and mappings after validation failure, adjacent mapping errors, example values, and explicit ambiguous-date selection.
UX-DR17: Implement Import Result with separated accepted, duplicate, and rejected counts, source row numbers, rejection reasons, and retry path.
UX-DR18: Implement Period Controls for Safety Threshold, Shortfall, Investigation Period, and Comparable Period; changes update previews immediately and invalid ranges preserve input while identifying corrections.
UX-DR19: Implement Transaction Detail that shows imported and corrected values together, plus editing, exclusion, Transfer, Refund, Obligation, Context actions, provenance, and downstream effects.
UX-DR20: Implement Destructive Confirmation with one modal level, affected Account or records named, destructive action visually distinct from cancel, focus trap, and focus restoration.
UX-DR21: Implement Responsive Region Tabs below 1024px using the ARIA Tabs pattern to switch Contributors and Evidence without losing active Contributor.
UX-DR22: Implement core empty, failure, stale, loading, and success states from `EXPERIENCE.md`, including No Accounts, No Transactions, import errors, partial import, missing balance evidence, reconciliation difference, no qualifying Shortfall, insufficient evidence, no defensible Contributors, recomputing, persistence/export/delete failure, replay states, invalid period, and local service unavailable.
UX-DR23: Implement interaction primitives: no hover-only selection, roving tabindex for chart points and Contributor rows, standard activation with Enter/Space, Escape closing topmost overlay, synchronized selection across evidence regions, and explicit focus movement rules.
UX-DR24: Implement WCAG 2.2 AA accessibility floor for the core journey, including names, roles, states, visible focus, chart alternatives, synchronized semantic tables, polite/assertive announcements, provenance association, reduced motion, target sizes, contrast, and unclipped focus indicators.
UX-DR25: Implement responsive behavior for `>=1024px`, `768-1023px`, and `<768px`, preserving all required functions, DOM order, 320 CSS pixel and 400% zoom support, and labeled local horizontal scrolling only for genuinely two-dimensional regions.
UX-DR26: Implement evidence synchronization so chart, Contributor list, source Transactions, calculation, related evidence, and Replay share one primary selection and preserve provenance/limitations across breakpoints.
UX-DR27: Implement Replay as an ordered event list exposing event position, local date, same-day order, signed Amount and Currency, resulting Account Balance, threshold state, linked Contributor, reduced-motion behavior, and return-to-investigation focus/selection restoration.
UX-DR28: Implement the five key flows from `EXPERIENCE.md`: investigate Sample Data, import and reconcile a statement, correct evidence and verify recomputation, manage local data/privacy, and start without imported data.
UX-DR29: Implement non-causal, non-advisory, calm, precise microcopy using source glossary terms and avoiding blame, motivational language, financial prescriptions, and unsupported intent statements.

### FR Coverage Map

FR1: Epic 2 - Account creation, naming, viewing, deletion, one Currency per Account
FR2: Epic 1 - Sample Data loading and reset
FR3: Epic 2 - Manual Transaction entry
FR4: Epic 2 - CSV preview and mapping
FR5: Epic 2 - Valid-row import and rejected-row reporting
FR6: Epic 2 - Duplicate Transaction prevention
FR7: Epic 2 - Balance establishment and reconciliation
FR8: Epic 3 - Transaction correction and recomputation
FR9: Epic 3 - Exclude, delete, and undo evidence
FR10: Epic 3 - Transfers and Refund relationships
FR11: Epic 3 - Obligations
FR12: Epic 3 - Context
FR13: Epic 4 - Safety Threshold
FR14: Epic 4 - Shortfall identification and selection
FR15: Epic 4 - Investigation Period proposal and adjustment
FR16: Epic 4 - Comparable Period selection
FR17: Epic 4 - Minimum Evidence enforcement
FR18: Epic 4 - Eligible Contributor grouping
FR19: Epic 4 - Contributor ranking
FR20: Epic 4 - Non-causal finding explanations
FR21: Epic 4 - Contributor evidence inspection
FR22: Epic 5 - Historical trends
FR23: Epic 5 - Chronological Transaction Replay
FR24: Epic 5 - Replay controls
FR25: Epic 1 - Local persistence
FR26: Epic 3 - Transaction export
FR27: Epic 3 - Permanent local deletion

## Epic List

### Epic 1: Local App Foundation with First Visible Investigation Slice

Denzo can start the local app, see the product shell, load/reset Sample Data, and begin from a trustworthy local-only foundation.

**FRs covered:** FR2, FR25

### Epic 2: Account Data Onboarding and Readiness

Denzo can create Accounts, enter or import Transactions, prevent duplicates, reconcile balances, and reach a clear "ready to investigate" state.

**FRs covered:** FR1, FR3, FR4, FR5, FR6, FR7

### Epic 3: Evidence Management and Local Data Control

Denzo can correct evidence, mark Transfers/Refunds, manage Obligations and Context, undo/delete evidence, export Transactions, and permanently delete local data.

**FRs covered:** FR8, FR9, FR10, FR11, FR12, FR26, FR27

### Epic 4: Guided Shortfall Investigation and Contributor Evidence

Denzo can define a Safety Threshold, select a Shortfall, choose Investigation and Comparable Periods, receive defensible ranked Contributors, and inspect the evidence behind each finding.

**FRs covered:** FR13, FR14, FR15, FR16, FR17, FR18, FR19, FR20, FR21

### Epic 5: Historical Trends and Transaction Replay

Denzo can understand the sequence of events through accessible trends and synchronized Transaction Replay.

**FRs covered:** FR22, FR23, FR24

<!-- Repeat for each epic in epics_list (N = 1, 2, 3...) -->

## Epic 1: Local App Foundation with First Visible Investigation Slice

Denzo can start the local app, see the product shell, load/reset Sample Data, and begin from a trustworthy local-only foundation.

<!-- Repeat for each story (M = 1, 2, 3...) within epic N -->

### Story 1.1: Initialize Local Web Workspace

As a local investigator,
I want to open the first Shortfall Investigator app shell,
So that I can confirm the product runs locally and has the approved navigation and visual foundation for future investigation work.

**Acceptance Criteria:**

**Given** the project has been initialized from the approved shadcn Vite monorepo starter
**When** I start the local web app through the documented development command
**Then** the browser displays a Shortfall Investigator app shell with the approved calm analytical visual style
**And** the app shell uses local project styling and assets rather than remote fonts, CDNs, analytics, or telemetry.

**Given** I open the app shell
**When** the first screen renders
**Then** I can see the primary navigation surfaces for `Investigate`, `Accounts & Data`, `Investigations`, and `Settings & Privacy`
**And** the active navigation state is visually and programmatically distinguishable.

**Given** I use only the keyboard
**When** I tab through the app shell navigation and primary content landmark
**Then** focus order follows the visible reading order
**And** every interactive element exposes a visible focus indicator and accessible name.

**Given** the workspace includes shared packages
**When** the project is checked by the standard validation commands
**Then** the web app, shared UI package, and package import boundaries compile successfully
**And** linting and the initial test command complete without failures.

**Given** this is the first implementation story
**When** a future dev agent reads the repository
**Then** the workspace structure clearly preserves the planned boundaries for `apps/web`, shared UI components, and future API/domain/database packages
**And** no financial calculation logic is placed in the React shell.

### Story 1.2: Establish API and Shared Contract Path

As a local investigator,
I want the app shell to verify the local service is available through a shared contract,
So that future investigation features use one trustworthy API/client path instead of ad hoc browser logic.

**Acceptance Criteria:**

**Given** the local web workspace exists
**When** the API workspace is added
**Then** the repository includes an `apps/api` Fastify application
**And** the API exposes a `/health` endpoint that returns a standard successful health response.

**Given** the web app shell is running
**When** the shell checks local service health
**Then** it calls the Fastify API through the established shared contract/client pattern
**And** it displays a calm local service status without exposing stack traces or sensitive details.

**Given** the shared contract package exists
**When** the health response schema is defined
**Then** the API and web client consume the same schema or generated type source
**And** duplicate hand-written health response types are avoided.

**Given** the local API receives a request
**When** the response is produced
**Then** request IDs and the standard response/error shape are established for future endpoints
**And** failures use non-alarming, non-causal product language.

**Given** validation commands run
**When** API tests execute
**Then** the `/health` endpoint test passes
**And** the web/API contract path compiles without type errors.

### Story 1.3: Add Local Persistence Foundation

As a local investigator,
I want the local app to persist and retrieve a minimal investigation record,
So that future sample and personal investigation work rests on durable local storage instead of temporary browser state.

**Acceptance Criteria:**

**Given** the API and shared contract path exist
**When** the database package is added
**Then** the repository includes a `packages/database` workspace with Drizzle configuration
**And** database access remains outside React components and outside pure domain logic.

**Given** Docker Compose is used for local services
**When** I start the local stack through the documented command
**Then** PostgreSQL starts as a local service with a persistent volume
**And** PostgreSQL is not published as a public host service.

**Given** the first persistence migration exists
**When** migrations run against the local database
**Then** a minimal table or tables can store a sample investigation entry record with stable ID, title/status, created timestamp, and dataset ownership
**And** the migration can be repeated from a clean database without manual repair.

**Given** the web app requests the current sample investigation entry
**When** the API retrieves it from local persistence
**Then** the app shell can display the saved entry state through the shared contract/client path
**And** the displayed wording does not imply financial advice or causal conclusions.

**Given** persistence tests run
**When** the test database is reset and seeded
**Then** the sample investigation entry can be written, read, and cleared deterministically
**And** the tests pass without requiring external network services.

### Story 1.4: Enforce Local-Only Runtime Boundary

As a privacy-conscious local investigator,
I want the app to run only against local services with no telemetry or remote asset dependencies,
So that my financial investigation environment stays under my control.

**Acceptance Criteria:**

**Given** the local web and API apps are running
**When** I inspect the configured service origins
**Then** the application and API are bound to loopback/local origins only
**And** documentation warns against LAN or public exposure.

**Given** the API receives a state-changing request
**When** the request is missing the configured local request token
**Then** the API rejects the request using the standard error envelope
**And** the response does not reveal sensitive technical details.

**Given** the app shell renders
**When** network access outside the local environment is unavailable
**Then** the app shell and local service health status still load from local project assets
**And** the app does not require remote fonts, CDNs, analytics, telemetry, or third-party financial-data services.

**Given** local runtime configuration is documented
**When** a developer reads the environment examples
**Then** placeholders are provided without committed secrets
**And** local-only defaults are clear for web, API, and database services.

**Given** validation checks run
**When** local-only tests or static checks inspect the runtime configuration
**Then** forbidden remote asset, analytics, telemetry, or public database exposure patterns fail the check
**And** the test suite passes in the approved local configuration.

### Story 1.5: Load and Reset Sample Data

As a local investigator,
I want to load and reset visibly labeled Sample Data,
So that I can try the investigation workflow safely without modifying personal Accounts or records.

**Acceptance Criteria:**

**Given** the local app is running with no personal Account selected
**When** I choose to load Sample Data
**Then** the system creates or restores a clearly labeled Sample Data dataset
**And** the UI distinguishes Sample Data from personal data everywhere it is shown.

**Given** Sample Data is loaded
**When** I open the Investigate surface
**Then** I can see at least one sample investigation entry point
**And** the copy describes it as example evidence without implying advice, blame, or proven causality.

**Given** Sample Data includes investigation-ready evidence
**When** the sample dataset is seeded
**Then** it includes at least one complete, reconciled Shortfall scenario
**And** it includes at least one insufficient-evidence scenario for refusal behavior later.

**Given** Sample Data and personal data are separate
**When** I reset Sample Data
**Then** only Sample Data records are removed and recreated
**And** no personal Accounts, Transactions, Obligations, Context, or derived findings are changed.

**Given** validation tests run
**When** Sample Data load and reset behavior is tested
**Then** dataset ownership prevents Sample Data and personal data from being combined
**And** repeated load/reset operations are deterministic.

### Story 1.6: Resume First Visible Investigation State

As a local investigator,
I want the app to remember my current sample investigation entry state,
So that I can leave and return without losing the thread of what I was inspecting.

**Acceptance Criteria:**

**Given** Sample Data is loaded and I have opened a sample investigation entry
**When** I refresh the page or restart the local app
**Then** the app restores the current sample investigation entry state from local persistence
**And** it clearly shows that the restored state belongs to Sample Data.

**Given** I navigate between `Investigate`, `Accounts & Data`, `Investigations`, and `Settings & Privacy`
**When** I return to `Investigate`
**Then** the previous sample investigation entry remains available
**And** the app does not present stale derived findings as current.

**Given** the restored entry is incomplete or unavailable
**When** the app cannot safely resume the previous state
**Then** it shows a calm recovery message and a next action to reload Sample Data or return to the Investigate start state
**And** it does not fabricate investigation results.

**Given** the app stores resumable investigation state
**When** the state is saved
**Then** only stable local identifiers and non-sensitive UI state needed for resumption are persisted
**And** the state remains scoped to the local environment.

**Given** resume behavior is tested
**When** page refresh, browser restart simulation, and local app restart paths run
**Then** the sample investigation entry state is restored deterministically
**And** the tests verify no personal data is required for the Sample Data path.

<!-- End story repeat -->

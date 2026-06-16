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

## Epic 1: Local App Foundation with First Visible Investigation Slice

Denzo can start the local app, see the product shell, load/reset Sample Data, and begin from a trustworthy local-only foundation.

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

## Epic 2: Account Data Onboarding and Readiness

Denzo can create Accounts, enter or import Transactions, prevent duplicates, reconcile balances, and reach a clear "ready to investigate" state.

### Story 2.1: Create and Manage Local Accounts

As a local investigator,
I want to create and manage Accounts with one Currency each,
So that my imported or manually entered financial records stay organized and investigation-ready.

**Acceptance Criteria:**

**Given** I open `Accounts & Data`
**When** I create a new Account with a name and Currency
**Then** the Account is saved locally
**And** the Account clearly displays its Currency and dataset ownership.

**Given** an Account already exists
**When** I view the Accounts list
**Then** I can see the Account name, Currency, source type, and current readiness summary
**And** Sample Data Accounts remain visually distinguishable from personal Accounts.

**Given** I rename a personal Account
**When** I save a valid new name
**Then** the Account list and related readiness surfaces update to show the new name
**And** the Account Currency remains unchanged.

**Given** I attempt to create or rename an Account with invalid values
**When** validation runs
**Then** the affected fields show specific, adjacent error messages
**And** no partial or invalid Account is saved.

**Given** I choose to delete a personal Account
**When** the destructive confirmation appears
**Then** it names the affected Account and explains that related Transactions, Obligations, Context, and derived findings will be removed
**And** deletion requires explicit confirmation and restores focus after completion or cancellation.

**Given** validation tests run
**When** Account create, view, rename, and delete paths are tested
**Then** personal and Sample Data Accounts remain separated
**And** Account records persist across page refresh and local app restart.

### Story 2.2: Enter Transactions Manually

As a local investigator,
I want to manually enter Transactions for an Account,
So that I can build investigation evidence even when I do not import a CSV.

**Acceptance Criteria:**

**Given** I have a personal Account
**When** I open the manual Transaction form
**Then** I can enter Transaction Date, Amount, Description, and Account
**And** I can optionally enter Category, Transaction Type, Merchant, and running Account Balance.

**Given** I submit a valid Transaction
**When** the Transaction is saved
**Then** it is associated with the selected Account and Currency
**And** the Account readiness summary updates to reflect the new evidence.

**Given** I submit missing or invalid required fields
**When** validation runs
**Then** each affected field shows a specific adjacent error message
**And** no partial Transaction is saved.

**Given** I enter a Transaction Date without a time
**When** the Transaction is saved
**Then** the date is interpreted as a local calendar date
**And** downstream display uses unambiguous date text.

**Given** I enter an Amount
**When** the Transaction is saved
**Then** the value is stored using integer minor units for the Account Currency
**And** displayed monetary values round to two decimal places.

**Given** I use only the keyboard
**When** I complete and submit the Transaction form
**Then** all controls are reachable in visible reading order
**And** focus moves to a confirmation or the saved Transaction summary without being lost.

**Given** validation tests run
**When** manual Transaction creation is tested
**Then** valid records persist locally across refresh and app restart
**And** invalid records do not affect Account readiness.

### Story 2.3: Preview and Map CSV Data

As a local investigator,
I want to preview a local CSV and map its columns before import,
So that I can confirm how my financial records will be interpreted before anything is saved.

**Acceptance Criteria:**

**Given** I have a personal Account
**When** I choose a local CSV file for import
**Then** the app shows a preview of source rows and interpreted values
**And** the file remains in the local environment without upload to third-party services.

**Given** the CSV preview is displayed
**When** I map columns
**Then** I can assign required mappings for Transaction Date, Amount, Description, and Account
**And** I can assign optional mappings for running Account Balance, Category, Transaction Type, Merchant, and Transaction ID.

**Given** the CSV contains signed Amounts or separate debit and credit columns
**When** I configure amount mapping
**Then** the preview shows interpreted debit/credit values before import
**And** invalid or conflicting mappings are explained next to the affected controls.

**Given** the CSV contains supported date formats
**When** dates are interpreted
**Then** ISO `YYYY-MM-DD`, `MM/DD/YYYY`, and `DD/MM/YYYY` formats are supported
**And** ambiguous day/month data requires explicit user selection before import can continue.

**Given** mapping validation fails
**When** I correct a mapping
**Then** the selected file, preview, and previous mappings are preserved
**And** the preview refreshes without importing partial data.

**Given** I use only the keyboard
**When** I move through the CSV Mapper
**Then** required mapping controls, optional mapping controls, preview table, and validation messages are reachable and understandable
**And** the preview table has associated headers or an equivalent accessible summary.

**Given** CSV mapping tests run
**When** representative fixture files are previewed
**Then** valid rows show expected interpreted values
**And** ambiguous or invalid rows show specific pre-import feedback.

### Story 2.4: Import Valid Rows and Report Rejections

As a local investigator,
I want valid CSV rows imported and malformed rows rejected with clear reasons,
So that I can improve my data without guessing what the importer accepted.

**Acceptance Criteria:**

**Given** I have completed CSV preview and mapping
**When** I confirm import
**Then** valid rows are saved as Transactions for the selected Account
**And** malformed rows are not saved.

**Given** the import completes with mixed results
**When** the Import Result is displayed
**Then** accepted, duplicate, and rejected row counts are shown separately
**And** each rejected row includes the source row number and a specific reason.

**Given** all rows are rejected
**When** the import result is displayed
**Then** no Transactions are saved
**And** the preserved preview lists every rejection reason and offers a correction path.

**Given** some rows are accepted and others rejected
**When** I correct mappings or source data and retry
**Then** previously accepted Transactions are not duplicated
**And** the retry result shows fresh accepted, duplicate, and rejected counts.

**Given** imported Transactions are displayed
**When** I inspect a row from the import result
**Then** imported values are labeled as imported facts with source row provenance
**And** Sample Data and personal data remain separated.

**Given** import fixture tests run
**When** representative valid and malformed CSV fixtures are imported
**Then** at least 95% of valid fixture rows are interpreted correctly
**And** every rejected fixture row receives a specific reason.

### Story 2.5: Prevent Duplicate Transactions

As a local investigator,
I want repeat imports to avoid creating duplicate Transactions,
So that my Account evidence stays trustworthy even if I retry or re-import a statement.

**Acceptance Criteria:**

**Given** an imported row includes a Transaction ID
**When** I import or re-import that row for the same Account
**Then** Transaction ID is used as the duplicate identity
**And** the duplicate row is counted as duplicate instead of creating a new Transaction.

**Given** an imported row does not include a Transaction ID
**When** I import or re-import that row for the same Account
**Then** duplicate identity uses Account, Transaction Date, Amount, and normalized Description
**And** matching rows are counted as duplicates instead of creating new Transactions.

**Given** I re-import the same statement after renaming or reordering the file
**When** import completes
**Then** zero new Transactions are created for rows that already exist
**And** the Import Result shows duplicate counts clearly.

**Given** two Transactions are similar but not duplicates
**When** they differ by duplicate identity fields
**Then** the importer keeps them distinct
**And** the Import Result does not incorrectly collapse valid evidence.

**Given** duplicate prevention runs
**When** matching is applied
**Then** source provenance for the original accepted Transaction remains intact
**And** the duplicate attempt is recorded only in import result context, not as a new Transaction.

**Given** duplicate fixture tests run
**When** same, renamed, reordered, with-ID, and without-ID statement fixtures are imported repeatedly
**Then** re-importing the same evidence creates zero new Transactions
**And** expected non-duplicate rows still import successfully.

### Story 2.6: Establish Balance Evidence and Reconciliation

As a local investigator,
I want the app to establish and reconcile Account Balance evidence,
So that investigations only proceed when the balance record is understandable and trustworthy.

**Acceptance Criteria:**

**Given** imported Transactions include running Account Balance values
**When** Account Balance is established
**Then** imported running balances are preferred as the balance evidence source
**And** the readiness surface labels the balance source as imported evidence.

**Given** imported Transactions do not include running Account Balance values
**When** I provide an Opening Balance
**Then** the app reconstructs Account Balance from the Opening Balance and ordered Transactions
**And** the readiness surface labels the balance source as reconstructed from user-provided evidence.

**Given** running balances and reconstructed balances differ
**When** reconciliation runs
**Then** the app shows the reconciliation difference before Investigation
**And** the difference is explained without blame, advice, or causal conclusions.

**Given** a reconciliation difference exists
**When** I attempt to proceed toward Contributor ranking
**Then** the app requires correction or explicit acceptance of the difference
**And** unresolved reconciliation blocks ranking while preserving the current data state.

**Given** Transactions occur on the same day
**When** Account Balance is reconstructed
**Then** same-day ordering uses source order and then stable import order
**And** the ordering is deterministic across repeated calculations.

**Given** reconciliation tests run
**When** fixture Accounts with imported balances, Opening Balance reconstruction, same-day Transactions, and reconciliation differences are processed
**Then** expected balances and differences match to two decimal places for the Account Currency
**And** results are deterministic for identical inputs.

### Story 2.7: Show Account Readiness for Investigation

As a local investigator,
I want a clear Account readiness view,
So that I know whether my Account has enough evidence to begin a Shortfall Investigation and what to fix if it does not.

**Acceptance Criteria:**

**Given** I select an Account in `Investigate` or `Accounts & Data`
**When** the Account Readiness Panel renders
**Then** it shows data coverage, balance evidence source, reconciliation status, and one recommended next action
**And** the panel distinguishes imported facts, user-provided values, and calculated readiness status.

**Given** the Account has no Transactions
**When** readiness is evaluated
**Then** the panel explains what data is required
**And** it routes me to manual Transaction entry or CSV import without fabricating readiness.

**Given** the Account is missing Opening Balance or running balance evidence
**When** readiness is evaluated
**Then** the panel identifies the missing evidence
**And** it offers the next action needed before Investigation can proceed.

**Given** the Account has an unresolved reconciliation difference
**When** readiness is evaluated
**Then** the panel shows the difference and its effect on ranking eligibility
**And** it requires correction or explicit acceptance before Contributor ranking can proceed.

**Given** the Account is ready for Shortfall selection
**When** readiness is evaluated
**Then** the panel shows `Ready to investigate` with the supporting evidence summary
**And** the next action moves to Safety Threshold and Shortfall selection.

**Given** I use a keyboard or screen reader
**When** readiness status changes after import, manual entry, or reconciliation
**Then** the updated status is announced politely
**And** focus remains on a logical next action.

**Given** readiness tests run
**When** Accounts with no Transactions, missing balance evidence, reconciliation differences, accepted reconciliation, and ready states are evaluated
**Then** each state produces the expected status, limitation, and next action
**And** no state uses causal, advisory, or blame-oriented language.

## Epic 3: Evidence Management and Local Data Control

Denzo can correct evidence, mark Transfers/Refunds, manage Obligations and Context, undo/delete evidence, export Transactions, and permanently delete local data.

### Story 3.1: Inspect Transaction Provenance and Details

As a local investigator,
I want to inspect a Transaction's source and current details,
So that I can understand which evidence is imported, corrected, user-provided, or derived before I rely on it.

**Acceptance Criteria:**

**Given** I open a Transaction from `Accounts & Data`, Account readiness, or an evidence surface
**When** the Transaction Detail view renders
**Then** it shows Transaction Date, Amount, Description, Account, Category, Transaction Type, Merchant, transfer status, and running Account Balance when available
**And** each value is labeled by provenance where applicable.

**Given** a Transaction was imported from CSV
**When** I inspect its details
**Then** the view shows imported fact provenance, including source import reference and source row number when available
**And** the view does not expose raw uploaded row contents beyond the fields needed for user verification.

**Given** a Transaction has user corrections
**When** I inspect corrected fields
**Then** the view shows original imported value and current corrected value together
**And** the correction is clearly labeled as user-provided or user-corrected evidence.

**Given** a Transaction affects Account readiness or future Investigation results
**When** I inspect its details
**Then** the view identifies whether the Transaction is included, excluded, duplicate, Transfer, Refund-related, or otherwise limited
**And** the wording describes evidence status without causal claims or financial advice.

**Given** I use only the keyboard or a screen reader
**When** I open, read, and close Transaction Detail
**Then** focus moves predictably to the detail heading and returns to the invoking control
**And** provenance labels are programmatically associated with the related values.

**Given** provenance tests run
**When** imported, manually entered, corrected, duplicate, excluded, Transfer, and Refund-related Transactions are inspected
**Then** each state displays the expected provenance and evidence status
**And** no state requires external network services.

### Story 3.2: Correct Transaction Evidence

As a local investigator,
I want to correct Transaction evidence,
So that imported or entered records can be fixed and affected readiness or investigation views can update from trustworthy data.

**Acceptance Criteria:**

**Given** I open Transaction Detail for an editable Transaction
**When** I edit Category, Merchant, Description, Transaction Date, Amount, Transaction Type, or transfer status
**Then** the form validates the changed fields
**And** unchanged imported values remain distinguishable from user corrections.

**Given** I save valid Transaction corrections
**When** the corrections are persisted
**Then** the Transaction Detail view shows original imported values and current corrected values where they differ
**And** the correction is labeled as user-provided evidence.

**Given** a correction affects Account Balance, Account readiness, future Contributors, charts, or Replay data
**When** the correction is saved
**Then** affected derived views are marked stale until recomputation completes
**And** stale findings cannot be treated as current.

**Given** recomputation completes after a correction
**When** updated derived data is available
**Then** Account readiness and any affected evidence summaries refresh together
**And** the app announces the update politely without implying the correction caused a Shortfall.

**Given** a correction fails to persist
**When** the failure is reported
**Then** the previous committed Transaction state remains intact
**And** the user receives a calm retry path without data loss.

**Given** correction tests run
**When** each editable Transaction field is corrected
**Then** provenance, local persistence, stale-state marking, and recomputation behavior are verified
**And** monetary and date corrections continue to use integer minor units and local calendar dates.

### Story 3.3: Exclude, Delete, and Undo Imported Evidence

As a local investigator,
I want to exclude, delete, or undo imported evidence safely,
So that I can correct my evidence set without accidentally losing or distorting local records.

**Acceptance Criteria:**

**Given** I open a Transaction that should not participate in an Investigation
**When** I exclude it from an Investigation
**Then** the Transaction remains stored in the Account
**And** affected readiness, Contributor eligibility, charts, and Replay data are marked stale until recomputation completes.

**Given** I exclude a Transaction
**When** I inspect the Transaction later
**Then** its excluded status is visible with provenance and scope
**And** the wording explains exclusion as evidence handling, not financial advice or causality.

**Given** I choose to delete a Transaction
**When** the destructive confirmation appears
**Then** it identifies the Transaction and affected derived records
**And** deletion requires explicit confirmation before any record is removed.

**Given** I undo an import
**When** the confirmation is accepted
**Then** all Transactions created by that import are removed transactionally
**And** unrelated personal data, Sample Data, and later corrections outside that import remain intact.

**Given** exclusion, deletion, or import undo completes
**When** affected views refresh
**Then** stale derived findings are invalidated and refreshed together
**And** the user receives a clear completion or failure message.

**Given** failure occurs during deletion or import undo
**When** the operation cannot complete safely
**Then** the previous committed data state remains intact
**And** the user receives a retry path without partial deletion.

**Given** evidence removal tests run
**When** exclusion, deletion, import undo, failure rollback, and recomputation paths are tested
**Then** data boundaries and derived-state invalidation behave deterministically
**And** destructive actions are keyboard operable and restore focus afterward.

### Story 3.4: Mark Transfers and Link Refunds

As a local investigator,
I want to mark Transfers and link Refunds to related evidence,
So that Contributor analysis can exclude movement between accounts and reduce impact where money was returned.

**Acceptance Criteria:**

**Given** I inspect a Transaction that represents movement between known Accounts
**When** I mark it as a Transfer
**Then** the Transaction is labeled as a Transfer
**And** the Transaction is stored with evidence status that makes it ineligible for spending analysis.

**Given** a Transfer cannot be fully matched or resolved
**When** I inspect its evidence status
**Then** the app shows the unresolved Transfer as an evidence limitation
**And** the wording does not imply causality or advice.

**Given** I inspect a refund Transaction
**When** I link it to an affected source Transaction
**Then** the refund relationship is saved locally
**And** the relationship is available for later Contributor impact calculations without requiring Contributor groups to exist in this story.

**Given** a Refund link is incomplete or unresolved
**When** the evidence is inspected
**Then** the unresolved Refund is shown as a limitation
**And** the system does not silently alter ranking without a supported relationship.

**Given** a Transfer or Refund relationship changes
**When** the update is saved
**Then** affected Account readiness, Contributor eligibility, calculations, charts, and Replay data are marked stale until recomputation completes
**And** the user can inspect the changed relationship from Transaction Detail.

**Given** Transfer and Refund tests run
**When** matched Transfers, unmatched Transfers, linked Refunds, unresolved Refunds, and recomputation paths are tested
**Then** eligibility and monetary impact calculations are deterministic
**And** provenance labels distinguish imported facts from user-provided relationships.

### Story 3.5: Record Obligations and Context

As a local investigator,
I want to record Obligations and Context beside my Transactions or Investigation,
So that I can explain evidence without confusing user-provided notes with imported facts or ranking inputs.

**Acceptance Criteria:**

**Given** I am viewing an Account or Transaction
**When** I create or confirm an Obligation with amount, label, due date or recurrence, and optional linked Transaction
**Then** the Obligation is saved locally
**And** it is visibly labeled as user-provided evidence.

**Given** an Obligation is linked to a Transaction
**When** I inspect the linked evidence
**Then** the Obligation records that later Contributor analysis may use only the Amount of its linked Transaction
**And** an unlinked Obligation is stored as Context-only evidence and cannot be treated as a ranking input.

**Given** I am viewing a Transaction or Investigation
**When** I attach Context such as event, person, place, mood, need-or-want classification, emergency, tag, or note
**Then** the Context is saved locally
**And** it is visibly labeled as user-provided information.

**Given** Context exists on a Transaction or Investigation
**When** findings or evidence summaries are displayed later
**Then** Context may support explanation
**And** Context does not alter Contributor eligibility or ranking.

**Given** Obligation or Context is missing
**When** readiness or Investigation evidence is evaluated
**Then** missing Context never blocks an Investigation
**And** the app does not invent personal context or infer motivation.

**Given** Obligation and Context tests run
**When** linked Obligations, unlinked Obligations, Transaction Context, Investigation Context, and missing Context paths are evaluated
**Then** ranking rules remain deterministic
**And** user-provided evidence remains distinguishable from imported facts and derived findings.

### Story 3.6: Export Account Transactions

As a local investigator,
I want to export Transactions for one Account,
So that I can keep or inspect my local records outside the application without exposing unrelated data.

**Acceptance Criteria:**

**Given** I open `Settings & Privacy` or `Accounts & Data` for a personal Account
**When** I choose to export Transactions
**Then** the app identifies the Account, Currency, and included record count before export
**And** unrelated Accounts are not included.

**Given** exported Transactions include imported and corrected values
**When** the export file is generated
**Then** imported values and user corrections are distinguishable
**And** source provenance fields needed for verification are included without exposing unrelated import contents.

**Given** an Account has Transfers, Refund links, Obligations, Context, exclusions, or deleted records
**When** Transactions are exported
**Then** the export represents current Transaction evidence and relevant flags or relationships consistently
**And** it does not claim that derived findings are proven causes.

**Given** export succeeds
**When** the file is ready
**Then** the app reports completion with the Account name and exported record count
**And** focus remains in or returns to a logical location.

**Given** export fails
**When** the failure is reported
**Then** current local data remains unchanged
**And** the app provides a retry path without implying data loss.

**Given** export tests run
**When** Accounts with imported values, corrected values, multiple Accounts, and relationship flags are exported
**Then** exports include only the selected Account's Transactions
**And** exported values match current local records deterministically.

### Story 3.7: Permanently Delete Local Account Data

As a privacy-conscious local investigator,
I want to permanently delete an Account or clear all local data,
So that I can control what financial records remain in my local environment.

**Acceptance Criteria:**

**Given** I open `Settings & Privacy` or an Account data-control surface
**When** I choose to delete one Account
**Then** the destructive confirmation names the Account and affected record types
**And** it explains that Transactions, Obligations, Context, and derived findings for that Account will be removed.

**Given** I choose to clear all local data
**When** the destructive confirmation appears
**Then** it identifies the scope as all local Accounts, Transactions, Obligations, Context, imports, and derived findings
**And** confirmation requires an explicit user action such as checking a scope confirmation or typing a required phrase.

**Given** deletion is confirmed
**When** the operation completes
**Then** the selected Account or all local records are removed transactionally
**And** the app reports completion without implying the action is recoverable.

**Given** deletion affects Sample Data and personal data differently
**When** I delete a personal Account or reset Sample Data
**Then** the operation respects dataset boundaries
**And** Sample Data reset never deletes personal data unless the user chose clear-all local data.

**Given** deletion fails
**When** the failure is reported
**Then** the previous committed data state remains intact
**And** the app identifies the failed operation and offers a safe retry.

**Given** I use keyboard or assistive technology
**When** I open and complete or cancel destructive confirmation
**Then** focus is trapped inside the dialog while open
**And** focus returns to the invoking control or next logical heading after completion.

**Given** local data deletion tests run
**When** single Account deletion, Sample Data reset, clear-all, cancellation, and failure rollback are tested
**Then** local records and derived findings are removed only within the confirmed scope
**And** no deletion operation requires external services.

## Epic 4: Guided Shortfall Investigation and Contributor Evidence

Denzo can define a Safety Threshold, select a Shortfall, choose Investigation and Comparable Periods, receive defensible ranked Contributors, and inspect the evidence behind each finding.

### Story 4.1: Define Safety Threshold

As a local investigator,
I want to set and update a Safety Threshold for an Account,
So that I can identify balance periods that count as Shortfalls for my investigation.

**Acceptance Criteria:**

**Given** I select an investigation-ready Account
**When** I enter a Safety Threshold amount
**Then** the threshold is saved for that Account
**And** the amount is displayed with the Account Currency rounded to two decimal places.

**Given** a Safety Threshold exists
**When** I update the threshold
**Then** qualifying Shortfalls refresh immediately
**And** any downstream Investigation Period, Comparable Period, Contributor findings, charts, or Replay state affected by the change is marked stale until recomputed.

**Given** the Safety Threshold is displayed in Shortfall or Investigation context
**When** I view charts, lists, period controls, or readiness summaries
**Then** the current threshold is visible or available in accessible text
**And** meaning does not depend on color alone.

**Given** I enter an invalid threshold value
**When** validation runs
**Then** the affected field shows a specific adjacent error message
**And** the previous valid threshold remains active.

**Given** I use only the keyboard or assistive technology
**When** I set or update the threshold
**Then** the control is reachable, labeled, and announced clearly
**And** focus moves to a logical confirmation or Shortfall preview.

**Given** threshold tests run
**When** thresholds are created, updated, rejected, and used to refresh Shortfall eligibility
**Then** calculations use integer minor units and Account Currency
**And** results are deterministic for identical inputs.

### Story 4.2: Identify and Select Shortfalls

As a local investigator,
I want to view and select qualifying Shortfall periods,
So that I can choose the specific balance decline I want to investigate.

**Acceptance Criteria:**

**Given** an Account has a valid Safety Threshold and balance history
**When** Shortfalls are calculated
**Then** periods below the Safety Threshold are identified deterministically
**And** a Shortfall does not require a negative Account Balance.

**Given** qualifying Shortfalls exist
**When** I open Shortfall selection
**Then** Shortfalls are shown on the historical Account Balance chart and in an accessible list
**And** each Shortfall includes date range, lowest balance, threshold, and Account Currency.

**Given** I select a Shortfall from the chart or accessible list
**When** the selection is saved
**Then** exactly one Shortfall is selected for the Investigation
**And** the selected Shortfall remains synchronized across chart, list, and period controls.

**Given** no qualifying Shortfall exists
**When** Shortfall selection is displayed
**Then** the system states that no Account Balance period fell below the current Safety Threshold
**And** it offers threshold adjustment without fabricating a Shortfall.

**Given** I use keyboard or assistive technology
**When** I navigate Shortfall selection
**Then** chart points and list rows are reachable and operable
**And** chart meaning is also available through text summary and tabular data.

**Given** Shortfall selection tests run
**When** fixtures include no Shortfalls, one Shortfall, multiple Shortfalls, threshold changes, and same-day Transactions
**Then** selected Shortfalls and chart/list synchronization are deterministic
**And** no selection copy implies cause, blame, or advice.

### Story 4.3: Propose and Adjust Investigation Period

As a local investigator,
I want the app to propose an Investigation Period that I can adjust,
So that the analysis focuses on the relevant balance decline window without hiding the period rules.

**Acceptance Criteria:**

**Given** I select a qualifying Shortfall
**When** the Investigation Period is proposed
**Then** the default start is the most recent point before the Shortfall where Account Balance was at or above the Safety Threshold
**And** the default end is the lowest Account Balance before recovery to or above the Safety Threshold.

**Given** the selected Shortfall does not recover to or above the Safety Threshold
**When** the Investigation Period is proposed
**Then** the default end is the latest Transaction
**And** the limitation is disclosed in the period explanation.

**Given** an Investigation Period is displayed
**When** I shorten or extend the start or end date
**Then** eligible evidence previews refresh immediately
**And** downstream findings, charts, and Replay state affected by the change are unavailable or marked stale until recomputed.

**Given** I enter an invalid or incomplete period
**When** validation runs
**Then** my entered values are preserved
**And** the app identifies the correction needed before findings can be produced.

**Given** period context is shown visually
**When** I inspect the chart, summary, or table alternative
**Then** Investigation Period boundaries, Safety Threshold, selected Shortfall, and threshold crossing are identifiable
**And** meaning does not depend on color, hover, or motion alone.

**Given** Investigation Period tests run
**When** fixtures include recovered Shortfalls, unrecovered Shortfalls, adjusted periods, invalid periods, and same-day events
**Then** default period proposals and evidence refresh behavior are deterministic
**And** period copy does not imply causality or financial advice.

### Story 4.4: Select Comparable Period

As a local investigator,
I want the app to propose and let me adjust a Comparable Period,
So that Contributor analysis can disclose whether changes are being compared to a valid prior window.

**Acceptance Criteria:**

**Given** an Investigation Period exists
**When** the Comparable Period is proposed
**Then** the default Comparable Period immediately precedes the Investigation Period
**And** it has the same number of calendar days.

**Given** the proposed Comparable Period has incomplete or unavailable data
**When** the period controls render
**Then** the app discloses the limitation clearly
**And** Contributor ranking later omits deviation unless a valid Comparable Period is available.

**Given** I select a different Comparable Period date range
**When** validation succeeds
**Then** the selected range is saved for the Investigation
**And** eligible comparison evidence previews refresh immediately.

**Given** I enter an invalid Comparable Period
**When** validation runs
**Then** my entered values are preserved
**And** the app identifies the correction needed without producing comparison-based findings.

**Given** comparison context is shown in chart, summary, table, or future Contributor evidence
**When** I inspect it
**Then** the Comparison Basis is visible and accessible
**And** the app distinguishes unavailable comparison data from a zero-value comparison.

**Given** Comparable Period tests run
**When** fixtures include complete comparison data, incomplete data, unavailable data, adjusted ranges, and invalid ranges
**Then** comparison eligibility and deviation availability are deterministic
**And** language states comparison limits without causal claims or advice.

### Story 4.5: Enforce Minimum Evidence Before Ranking

As a local investigator,
I want the app to refuse Contributor ranking when required evidence is missing or inconsistent,
So that I am not shown speculative explanations.

**Acceptance Criteria:**

**Given** an Investigation has one Account, balance evidence, complete Transaction Dates and Amounts, a valid Safety Threshold, and reconciled or explicitly accepted balance status
**When** Minimum Evidence is evaluated
**Then** the Investigation is eligible for Contributor ranking
**And** the evidence basis is visible in the Investigation context.

**Given** required evidence is missing or inconsistent
**When** Minimum Evidence is evaluated
**Then** the system does not rank Contributors
**And** it lists every missing or inconsistent input with a corrective path.

**Given** Account Balance reconciliation is unresolved
**When** the user attempts to view ranked Contributors
**Then** the system refuses ranking
**And** it routes the user to resolve or explicitly accept the reconciliation difference.

**Given** no defensible Contributor exists even though Minimum Evidence is present
**When** ranking would otherwise run
**Then** the system states that available evidence does not support a ranked explanation
**And** it does not fabricate Contributors.

**Given** insufficient-evidence state is displayed
**When** I inspect limitations
**Then** each limitation is adjacent to the affected Investigation context
**And** limitation wording avoids blame, advice, and causal conclusions.

**Given** Minimum Evidence tests run
**When** fixtures include complete evidence, missing Account, missing balance evidence, incomplete dates or amounts, invalid threshold, unresolved reconciliation, and no defensible Contributors
**Then** each fixture produces the expected eligibility or refusal state
**And** no refusal path requires external services or hidden assumptions.

### Story 4.6: Determine Eligible Contributors

As a local investigator,
I want eligible Transactions and linked Obligations grouped into Contributors,
So that the Investigation shows only evidence-supported contributors to the balance decline.

**Acceptance Criteria:**

**Given** Minimum Evidence is satisfied for an Investigation Period
**When** Contributor eligibility is calculated
**Then** eligible Transactions that reduced the available buffer are grouped into Contributors
**And** every Contributor links back to its source Transactions.

**Given** Transactions are duplicates or marked as Transfers
**When** Contributor eligibility is calculated
**Then** duplicate Transactions and Transfers are excluded
**And** exclusions are visible as evidence limitations where relevant.

**Given** Refunds are linked to affected Transactions or Contributor groups
**When** Contributor impact is calculated
**Then** linked Refunds reduce the monetary impact of their related Contributor
**And** unresolved Refunds are shown as limitations instead of silently altering results.

**Given** Transactions are linked to the same Obligation
**When** Contributors are grouped
**Then** those Transactions form one Contributor
**And** the linked Obligation is visible as user-provided evidence.

**Given** eligible Transactions are not linked to an Obligation
**When** Contributors are grouped
**Then** they are grouped by Category
**And** Transactions without a Category form an `Uncategorized` Contributor.

**Given** Context or unlinked Obligations exist
**When** Contributor eligibility is calculated
**Then** they may appear as explanatory context
**And** they do not alter eligibility or rank.

**Given** Contributor eligibility tests run
**When** fixtures include duplicates, Transfers, linked Refunds, unresolved Refunds, linked Obligations, unlinked Obligations, Categories, and Uncategorized Transactions
**Then** Contributor groups and monetary impacts are deterministic
**And** every group remains traceable to source evidence.

### Story 4.7: Rank Contributors with Disclosed Calculations

As a local investigator,
I want Contributors ranked by disclosed rules and calculations,
So that I can understand which observable Contributors were most significant without treating the ranking as proof of cause.

**Acceptance Criteria:**

**Given** eligible Contributors exist
**When** ranking is calculated
**Then** Contributors are ranked first by total monetary impact, then by deviation, then by shortest timing proximity
**And** the applied ranking criteria are visible in the Investigation.

**Given** monetary impact is calculated
**When** a Contributor has eligible debit Amounts and linked Refunds
**Then** total monetary impact equals eligible debits minus linked Refund Amounts during the Investigation Period
**And** monetary values use Account Currency rounded to two decimal places.

**Given** a valid Comparable Period exists
**When** deviation is calculated
**Then** deviation equals Investigation Period impact minus matching Comparable Period impact
**And** the Comparison Basis is visible for each ranked Contributor.

**Given** comparison data is unavailable or invalid
**When** ranking is calculated
**Then** deviation is omitted from ranking
**And** the limitation is stated clearly.

**Given** timing proximity is calculated
**When** a Contributor has eligible Transactions
**Then** timing proximity uses elapsed local-calendar time between the Contributor's latest eligible Transaction and the first downward crossing of the Safety Threshold.

**Given** multiple Contributors have equal monetary impact, deviation, and timing proximity after rounding and normalization
**When** ranking is assigned
**Then** those Contributors receive the same rank
**And** rank ordering is deterministic for the remaining Contributors.

**Given** ranking tests run
**When** fixtures include comparable data, missing comparison, tied Contributors, Refunds, same-day Transactions, and threshold crossings
**Then** ranks, calculations, Comparison Basis, and limitations match expected golden results
**And** no ranking output claims causality or gives financial advice.

### Story 4.8: Explain Findings Without Causal Overclaiming

As a local investigator,
I want finding explanations to describe observable contribution and evidence limits,
So that I can understand the analysis without being misled into thinking the app proved causation or gave financial advice.

**Acceptance Criteria:**

**Given** ranked Contributors are available
**When** finding summaries are generated
**Then** product-generated text describes observable contribution, association, amount, timing, sequence, or deviation under disclosed rules
**And** it does not state or imply that a Transaction, Obligation, person, mood, or Context caused a Shortfall.

**Given** a finding uses imported facts, user-provided information, calculations, and derived results
**When** the explanation is displayed
**Then** each evidence type is distinguishable through provenance labels or adjacent explanation
**And** limitations are visible near the affected finding.

**Given** comparison data is unavailable, evidence is incomplete, or a Transfer/Refund relationship is unresolved
**When** explanations are generated
**Then** the limitation is stated in plain language
**And** the finding does not hide uncertainty in a tooltip-only interaction.

**Given** no defensible Contributor exists
**When** the Investigation workspace displays the result
**Then** the system states that available evidence does not support a ranked explanation
**And** it identifies the limiting evidence without inventing a reason.

**Given** product copy is reviewed
**When** benchmark Investigation fixtures are rendered
**Then** prohibited patterns such as "caused your Shortfall," "you overspent because," or prescriptive advice are absent
**And** approved patterns such as "contributed to," "was associated with," and "based on the available records" are used appropriately.

**Given** explanation-language tests run
**When** ranked, insufficient-evidence, no-defensible-Contributor, missing-comparison, and unresolved-evidence fixtures are checked
**Then** zero unsupported causal statements or financial advice appear
**And** explanations remain traceable to evidence and calculation outputs.

### Story 4.9: Inspect Contributor Evidence

As a local investigator,
I want to open a Contributor and inspect the evidence behind its rank,
So that I can verify the finding against source Transactions, calculations, comparison data, timing, and limitations.

**Acceptance Criteria:**

**Given** ranked Contributors are displayed
**When** I select a Contributor
**Then** the Evidence Inspector opens or updates without losing the Investigation context
**And** I can return to the ranked Contributor list with the prior selection preserved.

**Given** a Contributor is open in the Evidence Inspector
**When** I review its evidence
**Then** I can see source Transactions, linked Obligations, monetary impact, Comparable Period values when available, timing relative to threshold crossing, ranking rationale, and limitations
**And** each evidence item has appropriate provenance labels.

**Given** I expand the calculation section
**When** calculation details are shown
**Then** the displayed calculation matches the ranking output and Comparison Basis
**And** monetary values use Account Currency rounded to two decimal places.

**Given** I select a source Transaction or evidence item
**When** synchronized evidence regions are visible
**Then** the relevant chart point, Transaction, Contributor, and evidence detail remain synchronized through stable IDs
**And** selection alone does not unexpectedly move keyboard focus.

**Given** graph or related evidence is available
**When** it is shown
**Then** it appears only when it clarifies the finding
**And** it is accompanied by a plain-language explanation so the user is never required to interpret a dense graph.

**Given** I use keyboard or assistive technology
**When** I navigate Contributor rows and the Evidence Inspector
**Then** Contributor rows support keyboard selection and explicit `Open evidence` behavior
**And** focus movement follows the documented interaction pattern.

**Given** evidence inspection tests run
**When** Contributors with source Transactions, linked Obligations, comparison values, limitations, related evidence, and synchronized selections are inspected
**Then** every ranked Contributor links to source evidence, calculation, Comparison Basis, and ranking rationale
**And** no evidence view implies causality or financial advice.

## Epic 5: Historical Trends and Transaction Replay

Denzo can inspect Account Balance and Category trends, select evidence from chart or table alternatives, and replay the Investigation Period chronologically while chart, Transactions, Contributors, and evidence remain synchronized.

### Story 5.1: Show Historical Account Balance Trends

As a local investigator,
I want to view Account Balance trends over time,
So that I can understand the selected Shortfall and Investigation Period in the context of the Account's balance history.

**Acceptance Criteria:**

**Given** an Account has balance evidence and a Safety Threshold
**When** I open Shortfall selection or the Investigation workspace
**Then** the Account Balance trend is displayed for the relevant date range
**And** the selected Shortfall, Safety Threshold, Investigation Period, Comparable Period when available, and first downward threshold crossing are identifiable.

**Given** the Account Balance chart is displayed
**When** balance values are shown
**Then** monetary values use Account Currency rounded to two decimal places
**And** dates use local calendar dates without time-zone drift.

**Given** the chart uses visual marks
**When** I inspect threshold, selected period, crossing, current evidence selection, and stale state
**Then** each meaning is represented by text, line style, marker shape, or adjacent label in addition to color
**And** chart interpretation does not require hover, animation, or color alone.

**Given** balance evidence changes through import, correction, deletion, exclusion, or threshold update
**When** derived trend data is recomputed
**Then** affected chart points and Investigation context refresh together
**And** stale balance, Contributor, evidence, and Replay views cannot be treated as current.

**Given** no balance evidence is available for the requested range
**When** the trend view renders
**Then** the system explains which balance evidence is missing
**And** it routes me to provide an Opening Balance, import running balances, or correct reconciliation without fabricating chart values.

**Given** Account Balance trend tests run
**When** fixtures include imported running balances, reconstructed balances, reconciliation differences, threshold crossings, period changes, and evidence corrections
**Then** trend points, crossing identification, stale-state behavior, and display values are deterministic
**And** no trend copy implies prediction, blame, or financial advice.

### Story 5.2: Show Category Amount Trends

As a local investigator,
I want to view Category Amount trends over time,
So that I can compare spending patterns during the Investigation Period without mistaking them for proven causes.

**Acceptance Criteria:**

**Given** categorized Transactions exist for the Account
**When** Category trends are calculated
**Then** the view groups eligible Transaction Amounts by Category and local calendar date or period bucket
**And** Transactions without a Category appear under `Uncategorized`.

**Given** the Investigation Period and Comparable Period are available
**When** Category trends are displayed
**Then** Investigation Period values and comparable values are distinguishable
**And** unavailable comparison data is shown as unavailable rather than as zero.

**Given** Transfers, excluded Transactions, duplicate Transactions, or linked Refunds affect the analysis
**When** Category trend values are calculated
**Then** the same eligibility and adjustment rules used by Contributor evidence are applied or disclosed
**And** limitations are visible near the affected trend.

**Given** I select a Category trend point or row
**When** synchronized evidence regions are visible
**Then** related Transactions, Contributor rows, chart marks, and Evidence Inspector content update through stable IDs
**And** selection alone does not unexpectedly move keyboard focus.

**Given** Category changes, Transfer flags, Refund links, exclusions, or Transaction Amounts are corrected
**When** trend data refreshes
**Then** affected Category trend values, Contributors, evidence, and Replay state are updated together or marked stale until recomputed.

**Given** Category trend tests run
**When** fixtures include categorized Transactions, Uncategorized Transactions, Transfers, exclusions, duplicate rows, linked Refunds, missing comparison data, and corrections
**Then** Category totals, comparison availability, limitations, and synchronized selections are deterministic
**And** trend language avoids causal overclaiming and advice.

### Story 5.3: Provide Chart Summaries and Table Alternatives

As a local investigator using keyboard, assistive technology, or a small screen,
I want chart information available through summaries and tables,
So that I can inspect trends and selected evidence without relying on visual chart interaction.

**Acceptance Criteria:**

**Given** a balance or Category chart is displayed
**When** I inspect the chart alternative
**Then** an always-available text summary identifies the chart title, Account, Currency, date range, Safety Threshold, selected Shortfall, Investigation Period, Comparable Period when available, threshold crossing, selected evidence, and key values.

**Given** chart data exists
**When** I open the equivalent table
**Then** the table includes associated headers, local dates, monetary values, threshold state where relevant, selected-evidence state, and links or actions for corresponding Transactions
**And** numeric values align or format consistently for scanning.

**Given** I select a chart point, summary item, or table row
**When** selection changes
**Then** chart, summary, table, Transaction list, Contributor rows, Evidence Inspector, and Replay event when available remain synchronized
**And** one polite status announcement summarizes the selection and next action.

**Given** a chart has many points or Transactions
**When** the table alternative is rendered
**Then** pagination or measured virtualization preserves chronological comprehension
**And** no infinite scroll or hidden hover-only action is required.

**Given** the workspace is below 1024px, at 320 CSS pixels, or at 400% zoom
**When** chart alternatives are displayed
**Then** no required function disappears
**And** local horizontal scrolling is used only inside labeled two-dimensional chart or table regions.

**Given** chart accessibility tests run
**When** balance and Category chart fixtures are navigated with keyboard and assistive technology
**Then** names, roles, states, focus indicators, table headers, announcements, and selection synchronization meet the documented WCAG 2.2 AA floor
**And** no meaning depends on color, hover, or motion alone.

### Story 5.4: Build Chronological Replay Events

As a local investigator,
I want the Investigation Period converted into ordered Replay events with a visible ready state,
So that I can verify the sequence before stepping through the balance decline and related evidence.

**Acceptance Criteria:**

**Given** an Investigation Period has replayable Transactions
**When** Replay events are generated
**Then** events cover Transactions from the start through the end of the Investigation Period
**And** each event includes event position, total event count, local date, signed Amount, Account Currency, resulting Account Balance, threshold state, and linked Contributor when available.

**Given** Replay events have been generated
**When** I view Replay readiness in the Investigation workspace
**Then** I can see the total event count, selected period, first event date and Amount, resulting Account Balance, threshold state, and whether a linked Contributor is available
**And** Replay remains stopped without autoplay until I explicitly start or step it.

**Given** Replay readiness is displayed
**When** I inspect the event preview
**Then** the preview is available as text or a table with local dates, Account Currency, event position, and source Transaction links
**And** it does not require chart animation or future Replay controls to verify the ordered event list.

**Given** multiple Transactions occur on the same local date
**When** Replay events are ordered
**Then** events sort by local calendar date, source order when available, stable import order, and stable Transaction ID as final tie-breaker
**And** identical inputs produce identical Replay order.

**Given** a Replay event is linked to source evidence
**When** the event is selected
**Then** the corresponding chart point, Transaction row, Contributor row, Evidence Inspector section, and related evidence update through stable IDs
**And** provenance and limitations remain attached to the selected evidence.

**Given** the Investigation Period contains no replayable Transactions
**When** Replay is requested
**Then** the system states that the period contains no replayable Transactions
**And** it returns me to Period setup or the Investigation workspace without changing existing selections.

**Given** evidence changes while Replay data exists
**When** Transactions, balances, thresholds, periods, Contributors, or exclusions change
**Then** affected Replay events are regenerated or marked stale
**And** stale Replay cannot be resumed as current.

**Given** Replay event tests run
**When** fixtures include same-day Transactions, imported order, manually entered Transactions, linked Contributors, threshold crossing, no-event periods, and evidence corrections
**Then** event order, event payloads, synchronization IDs, and stale behavior are deterministic
**And** Replay data is generated without browser-side financial calculations.

### Story 5.5: Control Transaction Replay

As a local investigator,
I want clear controls for Transaction Replay,
So that I can play, pause, step, restart, change speed, and jump without losing Investigation context.

**Acceptance Criteria:**

**Given** Replay is ready
**When** I open Transaction Replay
**Then** controls show total events, current event position, selected period, play state, speed, previous/next availability, restart availability, and an exit action
**And** Replay starts at event 1 without autoplay.

**Given** I use Replay controls
**When** I play, pause, move previous, move next, restart, change speed, or jump from a chart point or Transaction
**Then** the current event, chart, Transaction list, Contributor evidence, and Evidence Inspector remain synchronized
**And** disabled boundary controls expose disabled state and do not change selection.

**Given** Replay reaches a threshold crossing or user-selected milestone
**When** Replay advances during autoplay
**Then** the milestone is announced politely
**And** event-by-event narration is available only as an explicit option.

**Given** Replay completes or I exit Replay
**When** the complete Investigation view is restored
**Then** the prior Contributor and evidence selection are preserved
**And** focus returns to the Replay invoker or the next logical Investigation heading.

**Given** Replay loading fails
**When** the failure state is displayed
**Then** the current Investigation context remains available
**And** the message states what failed and offers a safe retry without losing the prior selection.

**Given** Replay control tests run
**When** keyboard, pointer, jump, speed, boundary, completion, exit, and load-failure paths are exercised
**Then** controls expose accessible names, roles, states, focus order, announcements, and deterministic synchronization
**And** Replay copy does not optimize watch time or imply advice.

### Story 5.6: Support Reduced Motion and Responsive Replay

As a local investigator with motion sensitivity or a smaller screen,
I want Replay to remain fully usable without animation or side-by-side layout,
So that I can understand the sequence without discomfort or lost functionality.

**Acceptance Criteria:**

**Given** reduced-motion preference is active
**When** Replay advances, jumps, completes, or updates selections
**Then** events change instantaneously without interpolation, panning, flashing, or animated auto-scroll
**And** every balance, threshold, Contributor, and evidence change remains available in text.

**Given** reduced-motion preference is inactive
**When** Replay uses visual transitions
**Then** animation is restrained, interruptible by pause, and never required to understand event order or evidence
**And** Pause remains immediately reachable.

**Given** the viewport is between 768 and 1023px
**When** Replay is shown
**Then** the chart remains above responsive region tabs for Contributors and Evidence
**And** changing tabs does not lose the active Replay event or Contributor.

**Given** the viewport is below 768px, 320 CSS pixels wide, or at 400% zoom
**When** Replay is shown
**Then** all controls and event details remain reachable in DOM order
**And** advisory copy may state that a wider window can make comparison easier without hiding any required function.

**Given** Replay is paused by stale data, failure, or user action
**When** the paused state is announced
**Then** the announcement includes `Paused at event n of total` or the specific blocking reason
**And** duplicate synchronized announcements are suppressed.

**Given** reduced-motion and responsive Replay tests run
**When** fixtures are checked across desktop, tablet, mobile, reduced-motion, stale, and failure states
**Then** Replay remains keyboard operable, accessible, synchronized, and nonblank
**And** no required function depends on motion, hover, or wide-screen layout.

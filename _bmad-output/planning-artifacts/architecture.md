---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - "_bmad-output/planning-artifacts/briefs/brief-my-capstone-2026-06-15/brief.md"
  - "_bmad-output/planning-artifacts/prds/prd-my-capstone-2026-06-15/prd.md"
  - "_bmad-output/planning-artifacts/ux-designs/ux-my-capstone-2026-06-15/DESIGN.md"
  - "_bmad-output/planning-artifacts/ux-designs/ux-my-capstone-2026-06-15/EXPERIENCE.md"
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-06-15'
project_name: 'my-capstone'
user_name: 'Denzo'
date: '2026-06-15'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**

The MVP has 27 functional requirements across six areas:

1. Account onboarding, CSV import, deduplication, balance reconstruction, and reconciliation
2. Transaction correction, exclusions, Transfers, Refunds, Obligations, and Context
3. Safety Threshold, Shortfall, Investigation Period, and Comparable Period selection
4. Deterministic Contributor eligibility, ranking, explanation, and evidence inspection
5. Historical trends and synchronized Transaction Replay
6. Local persistence, export, and permanent deletion

The architecture must preserve provenance from imported facts and user corrections through calculations and derived findings. Evidence changes must invalidate stale results and trigger consistent recomputation across balances, charts, Contributors, and Replay.

**Non-Functional Requirements:**

The 14 NFRs establish these primary drivers:

- Local-only operation without financial-data or telemetry transmission
- WCAG 2.2 AA and keyboard-operable workflows
- Equivalent text and table representations for charts
- Reduced-motion Replay
- Support for up to 10,000 Transactions per Account
- Deterministic calculations and ranking
- Complete evidence traceability
- Explicit non-causal and non-advisory language
- One-command startup after documented prerequisites
- Local-calendar dates and two-decimal Currency calculations

**Scale & Complexity:**

- Primary domain: local-first full-stack analytical web application
- Complexity level: medium-high
- Estimated architectural components: 10-12
- Users and tenancy: single user, multiple independent Accounts
- Data volume: moderate and bounded
- External integrations: none for the core workflow
- Real-time collaboration: none
- Regulatory posture: not a regulated banking product, but financial-data privacy and explanation integrity are trust-critical

Complexity comes from correctness, provenance, synchronization, and accessibility rather than scale or distributed traffic.

### Technical Constraints & Dependencies

- Windows 11 with current Chrome or Edge
- Responsive browser UI running locally
- One Account and Currency per Investigation
- Local timezone interpretation
- Stable ordering for same-day Transactions
- Durable persistence across application restarts
- Sample and personal data must remain logically separate
- No cloud account, telemetry, bank integration, or external financial-data processing
- Docker-based one-command startup is an inherited product constraint
- shadcn/ui is the inherited component vocabulary
- Related graph evidence is optional and cannot become necessary for understanding a finding
- The proposed Neo4j dependency must be justified against a simpler relational approach before adoption

### Cross-Cutting Concerns Identified

- Deterministic monetary and date calculations
- Evidence provenance and auditability
- Transactional import, deduplication, undo, and deletion
- Derived-state invalidation and recomputation
- Synchronization across charts, Contributors, Transactions, evidence, and Replay
- Accessible chart alternatives and interaction models
- Privacy boundaries and local-only operation
- Failure handling without data loss or false conclusions
- Versioned calculation rules and reproducible fixtures
- Non-causal, non-advisory explanation generation
- Stable identifiers across every evidence surface
- Clean startup, migrations, health checks, and local backup behavior

## Starter Template Evaluation

### Primary Technology Domain

Local-first full-stack TypeScript web application with:

- React browser client
- Local Fastify API
- PostgreSQL persistence
- Docker Compose runtime
- Shared TypeScript contracts

### Starter Options Considered

**Vite React TypeScript**

Official, minimal, and appropriate for the responsive client. Vite 8 provides a maintained `react-ts` template, but it does not establish the monorepo or shadcn structure.

**shadcn Vite Monorepo**

Builds on Vite and establishes the approved shadcn/ui component vocabulary, Tailwind configuration, aliases, and shared UI package structure.

**Next.js**

Provides a stronger full-stack convention, but SSR, React Server Components, and deployment-oriented behavior add little value to a localhost-only analytical application with a separate durable API.

### Selected Starter: shadcn Vite Monorepo

**Rationale for Selection:**

- Directly matches the finalized UX design system
- Provides React and TypeScript through Vite
- Establishes `apps/web` and shared package conventions
- Leaves the Fastify API and domain model explicit
- Avoids framework-specific server rendering
- Supports offline runtime operation after dependencies are installed
- Keeps deterministic financial logic independent of the UI framework

**Initialization Command:**

```bash
pnpm dlx shadcn@latest init -t vite --monorepo
```

Add `apps/api` as a Fastify TypeScript workspace during the first implementation story.

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**

- TypeScript across browser and server packages
- Node.js 24 LTS
- ESM modules
- pnpm workspace

**Styling Solution:**

- Tailwind CSS
- shadcn/ui source-owned components
- Approved design tokens applied as the brand layer

**Build Tooling:**

- Vite 8 for the browser application
- Independent API build
- Workspace-level scripts for development, testing, and builds

**Testing Framework:**

Testing is added during initialization:

- Vitest for domain, API, and component tests
- Playwright for import-to-investigation workflows
- PostgreSQL integration tests against an isolated test database

**Code Organization:**

```text
apps/
  web/
  api/
packages/
  domain/
  contracts/
  database/
  ui/
```

The pure `domain` package owns deterministic calculations and has no Fastify, React, or database dependency.

**Development Experience:**

- Vite hot-module replacement
- Shared TypeScript contracts
- One workspace lockfile
- One Docker Compose startup path
- Independent test layers
- No required external runtime services

**Note:** Starter initialization must be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**

- PostgreSQL authority and transactional imports
- Shared TypeScript contracts and deterministic domain calculations
- Versioned REST API boundaries
- Local-only security model
- Docker Compose deployment

**Important Decisions (Shape Architecture):**

- React Router and TanStack Query frontend architecture
- Generated API client and optimistic concurrency
- Accessible synchronized visualizations
- Automated contract, migration, and security verification

**Deferred Decisions (Post-MVP):**

- Neo4j or another graph projection
- Authentication and multi-user authorization
- Public or cloud hosting
- Distributed workers and message brokers
- Application caching and offline mutation support
- Horizontal scaling and hosted monitoring

### Data Architecture

- PostgreSQL 18 is the authoritative datastore.
- Drizzle ORM manages application access with committed, versioned SQL migrations.
- Monetary values use integer minor units; financial dates use the PostgreSQL `date` type.
- Zod validates API and CSV boundaries.
- Database constraints enforce referential integrity, valid states, and deduplication.
- Pure TypeScript domain functions implement deterministic financial calculations.
- Source facts, corrections, calculation-rule versions, and reproducible results are persisted.
- Imports, corrections, undo, and deletion execute transactionally.
- Sample and personal datasets remain explicitly separated through dataset ownership.
- No application cache is introduced for the MVP.
- Neo4j is deferred. Any future graph store must be a rebuildable projection, and core results must never depend on it.

### Authentication & Security

- The single-user MVP has no accounts, roles, sessions, or login flow.
- Application services bind only to loopback; Docker publishes the application port to `127.0.0.1`.
- PostgreSQL is available only on the internal Compose network and is not host-published.
- State-changing requests require a fixed local request token.
- CORS permits only fixed local origins.
- Strict validation, request-body limits, file and row limits, and timeouts apply at the API boundary.
- `@fastify/helmet` supplies baseline HTTP security headers.
- The application uses no remote fonts, CDNs, analytics, or telemetry.
- Logs exclude sensitive financial values and uploaded row contents.
- Secrets remain in ignored local environment files, with placeholders only in examples.
- The PostgreSQL volume relies on host operating-system file protections.
- Export and destructive actions require explicit user gestures.
- TLS is not required for loopback operation; documentation must prohibit LAN and public exposure.
- CI performs dependency and container-image security scans.

### API & Communication Patterns

- The API uses versioned REST endpoints under `/api/v1`.
- Fastify 5.8 route plugins are organized by product capability.
- Shared Zod schemas live in `packages/contracts` and integrate through `fastify-type-provider-zod`.
- OpenAPI is generated through `@fastify/swagger`.
- The frontend consumes a generated TypeScript API client.
- JSON is the standard representation; multipart requests are limited to CSV imports.
- GraphQL, WebSockets, message brokers, and background workers are excluded from the MVP.
- Commands execute synchronously, with each state-changing command contained in a database transaction.
- When recomputation crosses a command boundary, responses explicitly identify temporarily stale results.
- Resources use stable opaque IDs.
- Mutable resources use revision numbers for optimistic concurrency.
- Errors use a standard envelope containing `code`, `message`, `details`, and `requestId`.
- HTTP status conventions use 400 for malformed requests, 404 for absent resources, 409 for revision conflicts, 422 for valid but unacceptable domain input, and 503 for unavailable dependencies.
- The API generates and propagates request IDs.
- `/health` and `/ready` expose process and dependency health.
- Loopback deployment does not require a rate limiter, but body, upload, row, and timeout limits remain mandatory.
- CI detects drift among contracts, OpenAPI output, and the generated client.

### Frontend Architecture

- The frontend is a React and Vite single-page application.
- React Router 7.17 uses declarative routes for `/investigate`, `/accounts`, `/accounts/:accountId/import`, `/investigations`, `/investigations/:investigationId`, and `/settings`.
- TanStack Query 5 owns server state.
- URL search parameters own shareable investigation selections.
- Small React contexts are limited to ephemeral synchronized selection and accessibility announcements.
- No Redux or general-purpose global state library is introduced.
- React Hook Form and shared Zod schemas manage forms.
- TanStack Table supports evidence tables.
- Recharts is wrapped in accessible product components; charts are never authoritative.
- Charts, text, tables, and Replay share stable IDs and consume the same API data.
- Replay is a deterministic client controller over server-provided ordered events and performs no browser-side financial calculations.
- Source-owned shadcn components live in the shared UI package.
- Code is organized by product feature with route-level error boundaries and loading skeletons.
- Routes and Replay or chart-heavy bundles are loaded lazily.
- Pagination is the default for large results; virtualization is added only after measurement.
- No service worker or offline mutation queue is included in the MVP.
- Testing Library, axe, and Playwright verify behavior, accessibility, and keyboard operation.
- Reduced-motion behavior is enforced through a shared boundary.
- Canonical URL serialization preserves shareable investigations.
- Mutations atomically invalidate or replace all affected query data.

### Infrastructure & Deployment

- Docker Compose is the local deployment mechanism.
- One Fastify container serves both the REST API and the compiled Vite frontend.
- PostgreSQL 18 runs in a separate container using a persistent named volume.
- `docker compose up --build` starts the application.
- Database health checks control startup ordering.
- Database migrations complete before the application reports readiness.
- Only the application port is published, bound to `127.0.0.1`.
- Environment-specific values use local environment files with a committed `.env.example`.
- GitHub Actions runs linting, type checking, unit tests, integration tests, end-to-end tests, production builds, migration checks, OpenAPI and client drift checks, and dependency and container scans.
- Logs are structured, local, and redacted; the MVP has no remote telemetry or hosted monitoring.
- PostgreSQL volume backup and restoration procedures are documented.
- Kubernetes, cloud hosting, autoscaling, and hosted observability are deferred.

### Decision Impact Analysis

**Implementation Sequence:**

1. Initialize the TypeScript monorepo.
2. Establish shared domain and contract packages.
3. Configure PostgreSQL, Drizzle, and migrations.
4. Implement Fastify security and API foundations.
5. Generate the typed API client.
6. Build React routes and shared UI primitives.
7. Implement import and investigation workflows.
8. Add Docker Compose and readiness handling.
9. Establish CI, accessibility, integration, and end-to-end verification.

**Cross-Component Dependencies:**

- Shared Zod contracts connect the API, generated client, forms, and CSV boundary validation.
- PostgreSQL transactions preserve deterministic recomputation and consistent mutation responses.
- Stable IDs synchronize charts, tables, narrative text, and Replay.
- Single-origin deployment simplifies local security and CORS.
- Dataset ownership prevents sample and personal data from contaminating one another.
- CI protects schema, migration, OpenAPI, and generated-client consistency.

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:**

Naming, file placement, API formats, data representation, state ownership, errors, loading states, events, and enforcement are the primary areas where independent agents could create incompatible implementations.

### Naming Patterns

**Database Naming Conventions:**

- Tables use plural `snake_case`, such as `transactions`.
- Columns use `snake_case`, such as `posted_date`.
- Foreign keys use `<entity>_id`.
- Indexes use `idx_<table>_<columns>`.
- Constraints use `<table>_<columns>_<type>`.

**API Naming Conventions:**

- Resource endpoints are plural, such as `/api/v1/accounts`.
- Fastify route parameters use `:accountId`.
- JSON fields and query parameters use `camelCase`.
- Custom headers use standard hyphenated HTTP names.

**Code Naming Conventions:**

- Components, classes, and types use `PascalCase`.
- Functions and variables use `camelCase`.
- Module constants use `UPPER_SNAKE_CASE`.
- Source files use kebab-case, including `transaction-table.tsx`.
- Tests use `<subject>.test.ts` or `<subject>.test.tsx`.

### Structure Patterns

**Project Organization:**

- Application code is organized by product feature.
- Shared code belongs only in its designated package under `packages/`.
- Tests are colocated with implementation by default.
- Cross-feature integration tests use dedicated test directories.
- Playwright tests live in the workspace end-to-end test area.
- Domain logic never imports React, Fastify, or database adapters.
- Route handlers coordinate application work but do not contain financial calculations.

**File Structure Patterns:**

- Each feature owns its routes, components, query hooks, and presentation helpers.
- Cross-feature domain rules belong in `packages/domain`.
- API and CSV schemas belong in `packages/contracts`.
- Drizzle schema, migrations, and repositories belong in `packages/database`.
- Reusable presentation primitives belong in `packages/ui`.
- Static assets remain local and are grouped by the application that consumes them.
- Environment examples contain placeholders and never secrets.

### Format Patterns

**API Response Formats:**

- Successful single-resource reads return the requested resource directly.
- Collection responses contain `items` and pagination metadata.
- Errors contain `code`, `message`, `details`, and `requestId`.
- Resource creation returns HTTP 201.
- Successful deletion without a response body returns HTTP 204.
- Revision conflicts return HTTP 409.

**Data Exchange Formats:**

- JSON fields use `camelCase`.
- Calendar dates use `YYYY-MM-DD`.
- Timestamps use UTC ISO 8601 strings.
- Money uses integer minor units accompanied by an explicit currency.
- Booleans use JSON `true` and `false`.
- Meaningfully empty values use `null`; irrelevant optional fields are omitted.
- Resource IDs are opaque strings.

### Communication Patterns

**Event System Patterns:**

- Domain events use past-tense dot notation, such as `transaction.corrected`.
- Event payloads include `eventId`, `eventVersion`, `occurredAt`, `datasetId`, and typed event data.
- Events describe completed facts and never issue commands.
- Event versions change only when payload compatibility changes.
- MVP events remain synchronous and in-process unless a later architecture decision introduces external delivery.

**State Management Patterns:**

- TanStack Query owns remote server state.
- URL parameters own shareable investigation selections.
- Component state owns temporary presentation details.
- React context is restricted to synchronized selection and accessibility announcements.
- Mutations atomically invalidate or replace every affected query.
- State is not duplicated across TanStack Query, URL parameters, and component state.

### Process Patterns

**Error Handling Patterns:**

- Domain code throws typed domain errors.
- A central API error handler translates typed errors into standard HTTP responses.
- User-facing messages explain recovery without exposing stack traces.
- Logs include technical context without sensitive financial data.
- Route and feature error boundaries provide retry or navigation actions.

**Loading State Patterns:**

- Initial loading, background refresh, empty results, and errors are distinct states.
- Skeletons preserve the intended page structure.
- Mutations disable only affected controls.
- Existing data remains visible during background refresh.
- Retry behavior is explicit.
- Financial mutations are never retried automatically.

### Enforcement Guidelines

**All AI Agents MUST:**

- Reuse shared contracts instead of redefining payload types.
- Keep financial calculations inside pure domain functions.
- Preserve transaction, revision, provenance, and dataset boundaries.
- Use committed migrations rather than runtime schema mutation.
- Add focused tests beside changed behavior.
- Keep charts, tables, narrative text, and Replay synchronized through stable IDs.
- Run formatting, linting, type checking, tests, and contract-drift checks.

**Pattern Enforcement:**

- ESLint and formatting rules enforce source conventions.
- TypeScript strict mode and package boundaries enforce dependency direction.
- Migration validation protects database evolution.
- OpenAPI generation and generated-client checks protect API consistency.
- Unit, integration, accessibility, and end-to-end tests protect behavior.
- GitHub Actions executes the complete enforcement suite.
- Architectural exceptions must be documented and approved before implementation.

### Pattern Examples

**Good Examples:**

```ts
const result = calculateInvestigation(input);
await investigationRepository.save(result, transaction);
```

```json
{
  "items": [],
  "nextCursor": null
}
```

```json
{
  "code": "REVISION_CONFLICT",
  "message": "This investigation changed since it was opened.",
  "details": {
    "currentRevision": 4
  },
  "requestId": "req_01..."
}
```

**Anti-Patterns:**

- Calculating balances inside React components
- Returning database `snake_case` fields directly through the API
- Defining duplicate request schemas inside route handlers
- Using floating-point values for money
- Automatically retrying corrections or destructive mutations
- Treating charts as the authoritative evidence source
- Logging imported rows or financial descriptions

## Project Structure & Boundaries

### Complete Project Directory Structure

```text
my-capstone/
├── .github/
│   └── workflows/
│       └── ci.yml
├── apps/
│   ├── api/
│   │   ├── src/
│   │   │   ├── app.ts
│   │   │   ├── server.ts
│   │   │   ├── config/
│   │   │   ├── plugins/
│   │   │   ├── errors/
│   │   │   └── features/
│   │   │       ├── accounts/
│   │   │       ├── imports/
│   │   │       ├── transactions/
│   │   │       ├── investigations/
│   │   │       ├── replay/
│   │   │       ├── data-control/
│   │   │       └── settings/
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── web/
│       ├── public/
│       ├── src/
│       │   ├── app/
│       │   ├── routes/
│       │   ├── features/
│       │   │   ├── accounts/
│       │   │   ├── imports/
│       │   │   ├── transactions/
│       │   │   ├── investigations/
│       │   │   ├── replay/
│       │   │   └── data-control/
│       │   ├── components/
│       │   ├── lib/
│       │   ├── styles/
│       │   └── main.tsx
│       ├── index.html
│       ├── package.json
│       └── tsconfig.json
├── packages/
│   ├── contracts/
│   │   ├── src/
│   │   │   ├── accounts/
│   │   │   ├── imports/
│   │   │   ├── transactions/
│   │   │   ├── investigations/
│   │   │   └── errors/
│   │   └── package.json
│   ├── database/
│   │   ├── src/
│   │   │   ├── schema/
│   │   │   ├── repositories/
│   │   │   └── client.ts
│   │   ├── migrations/
│   │   └── package.json
│   ├── api-client/
│   │   ├── src/
│   │   │   └── generated/
│   │   └── package.json
│   ├── domain/
│   │   ├── src/
│   │   │   ├── money/
│   │   │   ├── balances/
│   │   │   ├── contributors/
│   │   │   ├── investigations/
│   │   │   └── replay/
│   │   └── package.json
│   └── ui/
│       ├── src/
│       │   ├── components/
│       │   ├── charts/
│       │   └── accessibility/
│       └── package.json
├── tests/
│   ├── integration/
│   ├── e2e/
│   ├── acceptance/
│   │   ├── capacity/
│   │   ├── local-only/
│   │   └── clean-startup/
│   └── fixtures/
├── docs/
│   ├── backup-restore.md
│   └── local-security.md
├── compose.yaml
├── Dockerfile
├── drizzle.config.ts
├── playwright.config.ts
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
└── README.md
```

### Architectural Boundaries

**API Boundaries:**

- `apps/web` communicates with application capabilities only through the generated API client.
- Public HTTP routes are versioned under `/api/v1`.
- Route handlers validate contracts, invoke application orchestration, and translate results into HTTP responses.
- Local request-token verification applies at the API plugin boundary to state-changing routes.
- Health and readiness endpoints remain separate from product routes.

**Component Boundaries:**

- Web features own route composition, query hooks, and feature-specific presentation.
- Shared UI components contain no product business rules.
- Charts, tables, narrative text, and Replay coordinate through stable IDs and shared query data.
- Feature modules cannot import another feature's private modules.
- Cross-feature browser behavior must be promoted to a clearly named shared module.

**Service Boundaries:**

- `apps/api` coordinates contracts, domain functions, and repositories.
- `packages/domain` contains pure calculations and imports no framework or database code.
- `packages/contracts` owns external schemas and API types.
- `packages/api-client` owns generated OpenAPI client code and is never edited manually.
- `packages/database` is the only package that directly accesses PostgreSQL.
- API feature services establish transaction boundaries and call domain functions and repositories.

**Data Boundaries:**

- PostgreSQL is the sole authoritative persistent store.
- Repository interfaces isolate database access from domain calculations.
- Every persisted product record remains associated with a dataset boundary.
- Sample and personal datasets cannot be combined by queries or calculations.
- CSV data enters only through contract validation and transactional import services.
- No cache or graph projection participates in authoritative reads during the MVP.

### Requirements to Structure Mapping

**Feature Mapping:**

- Account onboarding, import, reconstruction, and reconciliation map to `accounts`, `imports`, and `packages/domain/src/balances`.
- Corrections, exclusions, Transfers, Refunds, Obligations, and Context map to the `transactions` features and transaction contracts.
- Safety Threshold, Shortfall, Investigation Period, and Comparable Period map to `investigations`.
- Contributor eligibility, ranking, explanation, and evidence map to `packages/domain/src/contributors` and investigation features.
- Historical trends and synchronized Transaction Replay map to `replay`, shared chart components, and accessibility components.
- Settings and local runtime configuration map to the API and web `settings` features.
- Transaction export, Account deletion, and clear-all operations map to API and web `data-control` features.

**Cross-Cutting Concerns:**

- Privacy and local-only operation map to API plugins, Compose networking, `.env.example`, and `docs/local-security.md`.
- Provenance and deterministic recomputation map to domain functions, database schema, repositories, and integration tests.
- Dataset isolation maps to contracts, schema constraints, repositories, and API query filters.
- Accessibility maps to `packages/ui/src/accessibility`, feature components, axe tests, and Playwright keyboard tests.
- Contract consistency maps to `packages/contracts`, OpenAPI generation, the generated client, and CI.
- Backup and restore map to the PostgreSQL volume configuration and `docs/backup-restore.md`.
- Capacity, local-only operation, and one-command startup map to `tests/acceptance`.

### Integration Points

**Internal Communication:**

- React routes call generated client methods through TanStack Query hooks.
- Fastify routes validate shared contracts and invoke feature services.
- Feature services open database transactions, invoke pure domain functions, and persist through repositories.
- Domain events are synchronous in-process facts used only where explicit feature coordination is required.

**External Integrations:**

- The MVP has no external runtime integrations.
- Package registries and container-image registries are build-time dependencies only.
- CSV files are user-selected local inputs and are never uploaded to third-party services.

**Data Flow:**

```text
CSV → contract validation → import service → database transaction
    → domain calculations → persisted results → REST response
    → generated client → TanStack Query → text/table/chart/Replay
```

### File Organization Patterns

**Configuration Files:**

- Workspace configuration remains at the repository root.
- Application-specific configuration stays within the owning application.
- Environment values are loaded through typed configuration modules.
- Generated outputs are identified explicitly and are never edited manually.
- The OpenAPI-generated client is emitted only into `packages/api-client/src/generated`.

**Source Organization:**

- Applications use feature-oriented folders.
- Packages are organized by architectural responsibility.
- Package public APIs are exported from explicit entry points.
- Private implementation files are not imported across package or feature boundaries.

**Test Organization:**

- Unit and component tests are colocated with implementation.
- Database and cross-feature integration tests live under `tests/integration`.
- Playwright workflows live under `tests/e2e`.
- Capacity, network-isolation, and clean-startup checks live under `tests/acceptance`.
- Reusable deterministic inputs live under `tests/fixtures`.

**Asset Organization:**

- Browser-served static assets live in `apps/web/public`.
- Feature-specific assets remain with the consuming feature when bundling is appropriate.
- Fonts, icons, and images are local project assets.
- Generated production assets are emitted to build directories and are not committed unless tooling requires them.

### Development Workflow Integration

**Development Server Structure:**

- Workspace scripts start Vite, Fastify, and required local infrastructure.
- Vite proxies API requests to Fastify during development.
- Package watch scripts rebuild shared TypeScript dependencies as needed.

**Build Process Structure:**

- Shared packages type-check and build before consuming applications.
- Contracts generate OpenAPI and the typed client as part of verified build workflows.
- Vite emits production frontend assets.
- Fastify packages the API and serves the compiled frontend assets.

**Deployment Structure:**

- Compose starts PostgreSQL and waits for its health check.
- A migration command applies committed migrations before readiness.
- The Fastify container serves the API and frontend from one loopback-bound origin.
- The PostgreSQL named volume holds authoritative local data.

## Architecture Validation Results

### Coherence Validation

**Decision Compatibility:**

The selected technologies form a compatible TypeScript stack. React and Vite consume a generated client derived from Fastify and Zod contracts. Fastify coordinates pure domain logic and Drizzle repositories backed by PostgreSQL. Docker Compose provides the required local runtime without introducing a distributed-systems dependency.

The single-origin production deployment, loopback binding, fixed local request token, internal PostgreSQL network, and no-external-telemetry rule support the local-only security posture without conflicting with the no-login MVP decision.

**Pattern Consistency:**

Naming, response formats, money and date representation, typed errors, state ownership, and event conventions align with the selected frameworks and database. The implementation rules explicitly prevent duplicated contracts, browser-side financial calculations, direct cross-feature imports, and accidental retries of financial mutations.

**Structure Alignment:**

The monorepo structure gives each architectural responsibility a concrete owner. The generated client has an explicit package, local data control has dedicated API and web features, and acceptance tests have defined locations for capacity, network isolation, and clean startup.

### Requirements Coverage Validation

**Feature Coverage:**

All six functional areas are mapped:

1. Account onboarding, manual entry, CSV import, deduplication, reconstruction, and reconciliation
2. Corrections, exclusions, Transfers, Refunds, Obligations, and Context
3. Safety Threshold, Shortfall, Investigation Period, and Comparable Period selection
4. Minimum Evidence, Contributor eligibility, ranking, explanation, and evidence inspection
5. Historical trends and synchronized Transaction Replay
6. Local persistence, export, Account deletion, and clear-all data control

**Functional Requirements Coverage:**

All 27 functional requirements have architectural support through feature modules, shared contracts, deterministic domain functions, repositories, transactions, synchronized frontend views, and dedicated data-control boundaries.

**Non-Functional Requirements Coverage:**

All 14 non-functional requirements are supported:

- Local-only operation, explicit destructive confirmation, and sample/personal separation
- WCAG 2.2 AA targets, keyboard operation, non-visual chart alternatives, and reduced motion
- Capacity for 10,000 Transactions per Account, stale-result protection, and one-command startup
- Deterministic results, complete evidence traceability, guarded product language, local calendar dates, and integer-minor-unit money

Acceptance coverage explicitly verifies capacity, disabled-network operation, and clean startup.

### Implementation Readiness Validation

**Decision Completeness:**

All implementation-blocking decisions are documented with current major technology versions, rationale, deferred alternatives, and cross-component consequences.

**Structure Completeness:**

The project tree identifies application entry points, feature ownership, shared packages, generated code, migrations, tests, documentation, build configuration, and deployment files.

**Pattern Completeness:**

Potential agent conflicts involving naming, placement, API formats, data representation, events, state ownership, errors, loading behavior, generated files, and enforcement are addressed with examples and anti-patterns.

### Gap Analysis Results

**Critical Gaps:** None.

**Important Gaps Resolved:**

- Added `packages/api-client` as the sole owner of generated OpenAPI client code.
- Added `data-control` features for export, Account deletion, and clear-all operations.
- Added acceptance-test areas for 10,000-Transaction capacity, local-only operation, and clean one-command startup.

**Nice-to-Have Future Enhancements:**

- A rebuildable graph projection if measured investigation queries justify it
- Hosted observability if deployment expands beyond one local user
- Multi-user authentication and authorization if the product scope changes
- Performance-driven virtualization or caching after profiling

### Validation Issues Addressed

Validation initially found that generated client ownership, local data-control ownership, and three measurable NFR acceptance checks were not explicit in the physical structure. These issues were resolved by adding dedicated packages, feature directories, and acceptance-test locations.

### Architecture Completeness Checklist

**Requirements Analysis**

- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**Architectural Decisions**

- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**Implementation Patterns**

- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**Project Structure**

- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High

**Key Strengths:**

- Deterministic financial logic is isolated from frameworks and persistence.
- Provenance and dataset isolation are enforced across storage and application boundaries.
- Shared contracts connect validation, documentation, generated clients, and forms.
- Local-only deployment has explicit network and telemetry restrictions.
- Accessibility and evidence integrity are architectural concerns rather than presentation afterthoughts.
- Concrete consistency rules give multiple implementation agents compatible defaults.

**Areas for Future Enhancement:**

- Introduce additional infrastructure only in response to measured requirements.
- Revisit graph projections, caching, authentication, and hosted deployment after MVP evidence.
- Expand operational documentation if non-local deployment becomes a supported environment.

### Implementation Handoff

**AI Agent Guidelines:**

- Follow all architectural decisions exactly as documented.
- Use implementation patterns consistently across all components.
- Respect package, feature, data, and generated-code boundaries.
- Preserve deterministic calculations, provenance, dataset isolation, and evidence guardrails.
- Refer to this document for architectural questions and document any required exception before coding.

**First Implementation Priority:**

Initialize the official shadcn Vite pnpm monorepo with:

```bash
pnpm dlx shadcn@latest init -t vite --monorepo
```

Then preserve its workspace conventions while adding the Fastify API and the `domain`, `contracts`, `api-client`, and `database` packages.

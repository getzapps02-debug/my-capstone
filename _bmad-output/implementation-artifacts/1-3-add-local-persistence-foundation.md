# Story 1.3: Add Local Persistence Foundation

Status: done

## Story

As a local investigator,
I want the local app to persist and retrieve a minimal investigation record,
so that future sample and personal investigation work rests on durable local storage instead of temporary browser state.

## Acceptance Criteria

1. Given API/shared contract path exists, when database package is added, repository includes `packages/database` with Drizzle config, and database access remains outside React components and pure domain logic.
2. Given Docker Compose is used, when starting local stack through documented command, PostgreSQL starts as local service with persistent volume, and PostgreSQL is not published as public host service.
3. Given first persistence migration exists, when migrations run, minimal table(s) store sample investigation entry with stable ID, title/status, created timestamp, and dataset ownership, and migration can repeat from clean DB without manual repair.
4. Given web app requests current sample investigation entry, when API retrieves it from local persistence, app shell displays saved entry through shared contract/client path, wording does not imply financial advice/causal conclusions.
5. Given persistence tests run, when test DB reset/seeded, sample investigation entry can be written/read/cleared deterministically, tests pass without external network services.

## Tasks / Subtasks

- [x] Add database workspace package and Drizzle foundation (AC: 1, 3)
  - [x] Create `packages/database` with package scripts, TypeScript config, lint config, source exports, and tests aligned with existing workspace patterns.
  - [x] Add root Drizzle config and committed SQL migration output for the initial persistence schema.
  - [x] Keep database access isolated to `packages/database`; React components and pure domain modules must not import database clients, Drizzle tables, or repository internals.
  - [x] Preserve the runtime export pattern learned in Story 1.2: if a package export points at `dist`, provide a development condition for TS source or ensure all dev/runtime commands build first.

- [x] Define minimal persisted investigation model (AC: 3, 5)
  - [x] Create table(s) for the current minimal investigation entry with stable ID, title, status, created timestamp, and dataset ownership.
  - [x] Enforce dataset ownership in schema or repository code so `sample` and `personal` records cannot be accidentally merged.
  - [x] Keep the model intentionally narrow; do not add Accounts, Transactions, CSV import state, analysis calculations, or full sample dataset loading in this story.
  - [x] Make migration execution repeatable from a clean PostgreSQL database without manual repair.

- [x] Add repository and deterministic persistence tests (AC: 1, 3, 5)
  - [x] Implement repository functions to seed/write, read, and clear the minimal sample investigation entry.
  - [x] Tests must reset/seed/read/clear deterministically and must not require external network services.
  - [x] Hide raw database errors from higher layers; expose typed or normalized persistence failures suitable for API handling.

- [x] Add local PostgreSQL Compose service and environment docs (AC: 2, 3, 5)
  - [x] Add `compose.yaml` with PostgreSQL 18 as a local service, a persistent named volume, health check, and internal service networking.
  - [x] Do not publish PostgreSQL as a public host service. Prefer no `ports:` entry for Postgres; if a host binding becomes unavoidable for local test tooling, bind explicitly to `127.0.0.1` and document why.
  - [x] Add or update `.env.example` with non-secret local defaults and clear database connection variables.
  - [x] Update README with documented commands for starting the local stack and running migrations/tests.

- [x] Expose current sample investigation through API, contracts, and client (AC: 1, 4)
  - [x] Add shared Zod contract(s) under `packages/contracts` for the current sample investigation response and failure envelope reuse.
  - [x] Add API route under the versioned product namespace, preferably `GET /api/v1/investigations/current-sample`, that reads through `packages/database` repository code.
  - [x] Add `packages/api-client` function that fetches and validates the route through the shared contract.
  - [x] Keep `/health` behavior from Story 1.2 unchanged.

- [x] Display persisted sample investigation in the web shell (AC: 4)
  - [x] Update `apps/web` to request the current sample investigation through `@workspace/api-client`, not direct API fetch logic.
  - [x] Display saved title/status/created state in calm, local-first wording.
  - [x] Avoid wording that implies financial advice, causal conclusions, ranking, diagnoses, or completed analysis.
  - [x] Provide a failure/no-data state that makes persistence problems visible without exposing secrets or raw SQL errors.

- [x] Verify full workspace behavior (AC: 1-5)
  - [x] Run package-level database tests.
  - [x] Run API/client/contract/web tests that cover the new route and display behavior.
  - [x] Run root validation commands: `pnpm build`, `pnpm test`, `pnpm typecheck`, and `pnpm lint`.

### Review Findings

- [x] [Review][Patch] GET current sample route writes instead of retrieving persisted state [apps/api/src/features/investigations/investigation-routes.ts:35]
- [x] [Review][Patch] Real API path cannot return the documented no-data state because the GET route always upserts [apps/api/src/features/investigations/investigation-routes.ts:35]
- [x] [Review][Patch] Persistence tests use an in-memory fake instead of exercising the Drizzle/PostgreSQL repository, reset, seed, read, and clear path [packages/database/src/repositories/investigation-repository.test.ts:9]
- [x] [Review][Patch] Documented migration command can fall back to the Compose-only `postgres` hostname instead of the host-reachable local database URL [drizzle.config.ts:8]
- [x] [Review][Patch] Sample and personal investigation records can collide because identity/upsert conflict only uses `id` while ownership is separate [packages/database/migrations/0000_initial_investigation_entries.sql:2]
- [x] [Review][Patch] Investigation route maps any `Error` to persistence unavailable instead of rethrowing unexpected failures [apps/api/src/features/investigations/investigation-routes.ts:41]
- [x] [Review][Patch] API-owned PostgreSQL pool is never closed on Fastify shutdown [apps/api/src/features/investigations/investigation-routes.ts:68]
- [x] [Review][Patch] Drizzle schema omits the check constraints present in the committed SQL migration, creating drift risk for future generated migrations [packages/database/src/schema/investigation-entries.ts:3]
- [x] [Review][Patch] API startup does not load copied `.env` values for `DATABASE_URL` [apps/api/src/server.ts:1]
- [x] [Review][Patch] Web shell can remain stuck on checking when injected clients reject [apps/web/src/App.tsx:56]

## Dev Notes

### Current Repository State

- Story 1.2 established a working `apps/api` Fastify app, `packages/contracts`, and `packages/api-client` with health contracts and client tests. Build, test, typecheck, and lint passed after the Story 1.2 review fixes.
- Existing package exports use `development` conditions to avoid loading ignored `dist` files during dev. Preserve this pattern for `packages/database` and any changed shared package.
- Existing contract files live under `packages/contracts/src/{feature}/index.ts`; existing client files live under `packages/api-client/src/*-client.ts`.
- Do not commit generated JS or declaration files inside `src`. Story 1.2 explicitly removed accidental generated `*.js` and `*.d.ts` files from contract source folders.

### Architecture Constraints

- PostgreSQL is the authoritative persistent store for local data. Use Drizzle ORM with committed, versioned SQL migrations.
- `packages/database` is the only package that directly accesses PostgreSQL. `apps/api` coordinates contracts, domain logic, and repository calls.
- Repository interfaces must isolate database access from pure domain logic.
- Every persisted record must be associated with a dataset ownership boundary so sample and personal data remain separable.
- Product API routes should be versioned under `/api/v1`. Use shared Zod contracts at API/client boundaries.
- Docker Compose is the local deployment target. PostgreSQL runs as a separate service with a persistent named volume and must not be exposed publicly.
- State-changing local request token enforcement belongs to Story 1.4. Do not implement that broader runtime boundary here unless needed only as a no-op placeholder.

### Data Model Guidance

Implement the minimum schema needed for this story. A suitable initial table may be named `investigation_entries` or similar and should include:

- `id`: stable primary identifier.
- `title`: non-empty investigation title.
- `status`: constrained text or enum value.
- `created_at`: database-created timestamp.
- `dataset_owner` or equivalent ownership discriminator, at minimum separating `sample` from `personal`.

Do not add monetary fields, transaction records, account records, CSV import tables, analysis results, charts, or replay events in this story. Those belong to later epics and stories.

### API and UX Guidance

- The API route should return a typed success response for the current sample investigation and a normalized error response on persistence failure.
- The web shell should make it obvious the displayed entry was loaded from local persistence, but should not over-explain implementation details in the UI.
- Acceptable UI copy is factual status language such as saved investigation title/status and local data availability. Avoid claims about causes, recommendations, financial health, rankings, or advice.

### Testing Standards

- Keep tests deterministic. They should be able to reset/seed/read/clear the sample investigation entry repeatedly.
- Tests may depend on local Docker/PostgreSQL services, but must not require internet access or cloud services.
- Include negative or empty-state coverage for missing sample investigation and persistence failure paths where practical.
- Preserve existing health route, contract, client, and web tests.

### Project Structure Notes

Expected additions or updates:

- `packages/database/package.json`
- `packages/database/src/client.ts`
- `packages/database/src/schema/*`
- `packages/database/src/repositories/*`
- `packages/database/src/index.ts`
- `packages/database/migrations/*`
- `drizzle.config.ts`
- `compose.yaml`
- `.env.example`
- `apps/api/src/features/investigations/*`
- `packages/contracts/src/investigations/*`
- `packages/api-client/src/investigation-client.ts`
- `apps/web/src/App.tsx`
- `README.md`

Keep file locations consistent with existing feature folders. If naming differs, document the reason in the Dev Agent Record.

### Previous Story Intelligence

- Story 1.2 review found that runtime package exports pointing to `dist` can break dev startup when `dist` is intentionally ignored. Use development export conditions or build-before-run scripts for any new package consumed at runtime.
- Story 1.2 review also found accidental generated `*.js` and `*.d.ts` files in `packages/contracts/src`. Generated build outputs should remain outside source folders.
- Health behavior is already covered and should remain stable while adding the persistence route.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-1.3-Add-Local-Persistence-Foundation]
- [Source: _bmad-output/planning-artifacts/architecture.md#Data-Architecture]
- [Source: _bmad-output/planning-artifacts/architecture.md#API-Architecture]
- [Source: _bmad-output/planning-artifacts/architecture.md#Infrastructure-and-Deployment]
- [Source: _bmad-output/planning-artifacts/architecture.md#Project-Structure]
- [Source: _bmad-output/planning-artifacts/prd.md#FR-25-Persist-Local-Data]
- [Source: _bmad-output/implementation-artifacts/1-2-establish-api-and-shared-contract-path.md]
- PostgreSQL 18 current release docs: https://www.postgresql.org/docs/current/release-18.html
- Drizzle migrations docs: https://orm.drizzle.team/docs/migrations
- Docker Compose `ports` docs: https://docs.docker.com/compose/compose-file/05-services/#ports

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- 2026-06-17T14:38:06+08:00: package-level database/contracts/api-client tests passed; API failure-path test exposed route error serialization issue.
- 2026-06-17T14:56:57+08:00: API tests and typecheck passed after direct normalized 503 route response.
- 2026-06-17T14:58:06+08:00: root `pnpm build` passed.
- 2026-06-17T14:58:06+08:00: root `pnpm test` passed.
- 2026-06-17T15:00:00+08:00: root `pnpm typecheck` and `pnpm lint` passed.
- 2026-06-17T15:02:36+08:00: `docker compose config` passed for loopback-only PostgreSQL binding.
- 2026-06-17T16:20:32+08:00: code review patches applied; root `pnpm typecheck`, `pnpm test`, `pnpm lint`, `pnpm build`, `docker compose config`, documented database migration, and live PostgreSQL-backed database repository tests passed.

### Completion Notes List

- Added `@workspace/database` with Drizzle schema, PostgreSQL client factory, investigation repository, migration SQL, migration metadata, package exports, and deterministic repository contract tests.
- Added local PostgreSQL Compose service with persistent volume, health check, internal network, and `127.0.0.1:5432` host binding to support local migrations without public exposure.
- Added shared investigation contracts, typed API client, and `GET /api/v1/investigations/current-sample` API route that returns a saved sample investigation or a sanitized persistence failure.
- Updated the web shell to load the saved investigation through `@workspace/api-client` and display factual local persistence status without financial advice or causal claims.
- Simplified the public error envelope to avoid leaking implementation details and to work with strict route response serialization.
- Verified with root `pnpm build`, `pnpm test`, `pnpm typecheck`, `pnpm lint`, and `docker compose config`.
- Applied code review fixes for read-only current sample retrieval, no-data route behavior, composite dataset/id persistence identity, API pool shutdown, `.env` loading, PostgreSQL 18 Compose volume layout, and rejected-client UI failure handling.

### File List

- `.env.example`
- `README.md`
- `apps/api/package.json`
- `apps/api/src/app.ts`
- `apps/api/src/errors/error-handler.ts`
- `apps/api/src/config/load-env.ts`
- `apps/api/src/features/investigations/investigation-routes.test.ts`
- `apps/api/src/features/investigations/investigation-routes.ts`
- `apps/web/src/App.test.tsx`
- `apps/web/src/App.tsx`
- `compose.yaml`
- `drizzle.config.ts`
- `packages/api-client/package.json`
- `packages/api-client/src/index.ts`
- `packages/api-client/src/investigation-client.test.ts`
- `packages/api-client/src/investigation-client.ts`
- `packages/contracts/package.json`
- `packages/contracts/src/errors/index.ts`
- `packages/contracts/src/index.ts`
- `packages/contracts/src/investigations/index.ts`
- `packages/contracts/src/investigations/investigation-contract.test.ts`
- `packages/database/eslint.config.js`
- `packages/database/migrations/0000_initial_investigation_entries.sql`
- `packages/database/migrations/meta/0000_snapshot.json`
- `packages/database/migrations/meta/_journal.json`
- `packages/database/package.json`
- `packages/database/src/client.ts`
- `packages/database/src/index.ts`
- `packages/database/src/repositories/investigation-repository.test.ts`
- `packages/database/src/repositories/investigation-repository.ts`
- `packages/database/src/schema/index.ts`
- `packages/database/src/schema/investigation-entries.ts`
- `packages/database/tsconfig.build.json`
- `packages/database/tsconfig.json`
- `pnpm-lock.yaml`

### Change Log

- 2026-06-17: Implemented Story 1.3 local persistence foundation and moved story to review.
- 2026-06-17: Resolved code review findings and moved story to done.

## Story Metadata

baseline_commit: dfd5e3e28f2b7ba08d74c6fbbaad2612eac9be4d
created_at: 2026-06-17T14:14:08+08:00

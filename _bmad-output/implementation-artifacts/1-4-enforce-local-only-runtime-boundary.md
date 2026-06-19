---
baseline_commit: 205b325
---

# Story 1.4: Enforce Local-Only Runtime Boundary

Status: done

## Story

As a privacy-conscious local investigator,
I want the app to run only against local services with no telemetry or remote asset dependencies,
so that my financial investigation environment stays under my control.

## Acceptance Criteria

1. Given the local web and API apps are running, when I inspect the configured service origins, then the application and API are bound to loopback/local origins only, and documentation warns against LAN or public exposure.
2. Given the API receives a state-changing request, when the request is missing the configured local request token, then the API rejects the request using the standard error envelope, and the response does not reveal sensitive technical details.
3. Given the app shell renders, when network access outside the local environment is unavailable, then the app shell and local service health status still load from local project assets, and the app does not require remote fonts, CDNs, analytics, telemetry, or third-party financial-data services.
4. Given local runtime configuration is documented, when a developer reads the environment examples, then placeholders are provided without committed secrets, and local-only defaults are clear for web, API, and database services.
5. Given validation checks run, when local-only tests or static checks inspect the runtime configuration, then forbidden remote asset, analytics, telemetry, or public database exposure patterns fail the check, and the test suite passes in the approved local configuration.

## Tasks / Subtasks

- [x] Add local runtime configuration and request-token contract (AC: 1, 2, 4)
  - [x] Extend `apps/api/src/config/index.ts` with typed local runtime settings: `LOCAL_REQUEST_TOKEN`, allowed local origins, request/body limits, and timeout defaults.
  - [x] Update `.env.example` and README with non-secret local defaults. Use placeholder language for the token; do not commit a real secret.
  - [x] Keep `API_HOST` defaulted to `127.0.0.1`; fail or warn clearly if configured to a non-loopback host.

- [x] Add Fastify local-security boundary plugins (AC: 1, 2, 5)
  - [x] Add a security plugin under `apps/api/src/plugins/` for CORS, Helmet headers, request limits/timeouts, and local request-token enforcement.
  - [x] Register the plugin from `apps/api/src/app.ts` before product routes.
  - [x] Apply token enforcement only to state-changing methods: `POST`, `PUT`, `PATCH`, and `DELETE`. `GET`, `/health`, and `/ready` must remain readable without the token.
  - [x] Reject missing or invalid tokens with the shared error envelope and sanitized copy. Do not echo supplied token values, stack traces, database URLs, or raw headers.

- [x] Add readiness endpoint and local dependency health checks (AC: 1, 3, 5)
  - [x] Add `/ready` beside `/health` in `apps/api/src/features/health/`.
  - [x] `/ready` should verify local dependency readiness without causing writes. At minimum, it should report API readiness and persistence availability through sanitized success/failure responses.
  - [x] Add shared contracts in `packages/contracts/src/health/` and client support in `packages/api-client` if the web shell consumes readiness.

- [x] Prove the app shell uses local assets only (AC: 3, 5)
  - [x] Add static checks that fail on remote URLs in committed frontend source/config where they would load fonts, scripts, styles, analytics, telemetry, or third-party financial data.
  - [x] The check should allow local URLs such as `http://127.0.0.1`, `http://localhost`, relative paths, documentation links in markdown, and package metadata URLs if not loaded by runtime app code.
  - [x] Preserve existing app shell behavior and tests; do not introduce remote fonts, CDNs, analytics scripts, or telemetry packages.

- [x] Document the supported local-only runtime boundary (AC: 1, 4)
  - [x] Update README with loopback-only API/web defaults, database binding expectations, request-token usage for local state-changing calls, and a warning against LAN/public exposure.
  - [x] Add or update `docs/local-security.md` if docs already exist or if README would become too dense.
  - [x] Explain that PostgreSQL is for local development and must remain loopback-only when host-published for migrations/tests.

- [x] Verify local-only behavior (AC: 1-5)
  - [x] Add API tests for allowed local origins, rejected non-local origins, missing/invalid token rejection on a test state-changing route, and token-free `GET`/health/readiness behavior.
  - [x] Add config/static tests for forbidden remote asset/telemetry/public database exposure patterns.
  - [x] Run `pnpm typecheck`, `pnpm test`, `pnpm lint`, `pnpm build`, and `docker compose config`.

### Review Findings

- [x] [Review][Patch] Apply configured handler timeout at Fastify runtime [apps/api/src/app.ts:31]

## Dev Notes

### Current Repository State

- Story 1.3 is done but its code review fixes are currently uncommitted in the working tree. Build the story on the current files, not only on commit `205b325`.
- Current API app construction lives in `apps/api/src/app.ts`. `buildApp()` registers request IDs, installs error handlers, then registers health and investigation routes.
- API config currently exposes only `host` and `port` in `apps/api/src/config/index.ts`; defaults are `127.0.0.1` and `4000`.
- `apps/api/src/server.ts` already calls `loadLocalEnv()` before reading config. Reuse that path; do not introduce a second `.env` loader or a new dependency unless it removes the local helper cleanly.
- Existing error envelope shape is `code`, `message`, and `requestId` in `packages/contracts/src/errors/index.ts`. Architecture mentions `details`, but the current implementation intentionally simplified it in Story 1.3; do not widen it casually without updating tests and clients.
- Current Compose publishes PostgreSQL to `127.0.0.1:5432` to support host migrations/tests. This is a documented local-only exception; avoid changing it back to public host binding or an internal-only network that breaks host migrations.

### Architecture Constraints

- Single-user MVP has no login, roles, sessions, or cloud auth.
- Services must bind to loopback/local origins only. Documentation must prohibit LAN/public exposure.
- State-changing requests require a fixed local request token.
- CORS must allow only fixed local origins; do not reflect arbitrary origins or use wildcard origins for app APIs.
- Baseline HTTP security headers should be supplied with `@fastify/helmet`.
- Strict validation, request-body limits, file/row limits, and request/handler timeouts apply at the API boundary.
- The app must use no remote fonts, CDNs, analytics, telemetry, or external financial-data processing.
- Logs must exclude sensitive financial values, uploaded row contents, request tokens, database URLs, and raw secrets.
- `/health` and `/ready` expose process and dependency health. `/health` should remain cheap/process-level; `/ready` can check dependencies.

### Latest Technical Notes

- `@fastify/helmet` is the Fastify security-header plugin; its README states plugin versions `>=12.x` support Fastify `^5.x`, and it is global by default when registered without `{ global: false }`.
- `@fastify/cors` supports fixed string/array origins. Its README warns that dynamic `RegExp` or function origins can create DoS risk; prefer a simple fixed local-origin allowlist.
- Fastify server options include `bodyLimit`, `requestTimeout`, and `handlerTimeout`. Current docs note `requestTimeout` defaults to `0` and should be set non-zero to reduce DoS exposure outside a reverse-proxy setup.

### Implementation Guidance

- Prefer adding `apps/api/src/plugins/local-security.ts` or similarly named plugin rather than scattering security logic across routes.
- Keep token checking independent of database and product features. It should be unit-testable with `buildApp({ logger: false })`.
- Suggested token header: `x-local-request-token`. Document the exact header in `.env.example`, README, and tests.
- Suggested environment names:
  - `LOCAL_REQUEST_TOKEN`
  - `API_ALLOWED_ORIGINS` as comma-separated local origins, e.g. `http://127.0.0.1:5173,http://localhost:5173`
  - `API_BODY_LIMIT_BYTES`
  - `API_REQUEST_TIMEOUT_MS`
  - `API_HANDLER_TIMEOUT_MS`
- If no token is configured in development, fail closed for state-changing requests with a clear startup/config error or documented placeholder requirement. Do not silently disable token enforcement.
- Add a test-only state-changing route inside a test plugin if needed to verify token enforcement before later stories add real mutations.
- Do not implement Sample Data load/reset here. Story 1.5 owns sample dataset creation/reset.
- Do not add financial calculations, accounts, CSV import behavior, or destructive data-control behavior in this story.

### Files Likely to Change

- `.env.example`
- `README.md`
- `compose.yaml`
- `apps/api/package.json`
- `apps/api/src/app.ts`
- `apps/api/src/config/index.ts`
- `apps/api/src/plugins/local-security.ts`
- `apps/api/src/plugins/local-security.test.ts`
- `apps/api/src/features/health/health-routes.ts`
- `apps/api/src/features/health/health-routes.test.ts`
- `packages/contracts/src/health/index.ts`
- `packages/contracts/src/health/health-contract.test.ts`
- `packages/api-client/src/health-client.ts`
- `packages/api-client/src/health-client.test.ts`
- `apps/web/src/App.tsx`
- `apps/web/src/App.test.tsx`
- `docs/local-security.md`
- `tests/acceptance/local-only/` or a local static-check test location if introduced

### Testing Standards

- API tests should use `app.inject()` and assert both status code and shared error envelope parsing.
- Add at least one state-changing request test that fails without token and passes with the configured token.
- Add CORS tests for an allowed local origin and a rejected non-local origin.
- Add readiness tests for success and sanitized failure. Use injected repositories/clients or a small dependency probe seam; do not require a live database for ordinary unit tests.
- Add static local-only checks that scan runtime source/config for forbidden remote patterns. Keep documentation links out of scope or explicitly allow markdown docs.
- Preserve existing tests for `/health`, current sample investigation, API client failures, and app shell statuses.

### Previous Story Intelligence

- Story 1.3 review caught that documentation/config must be executable exactly as written. Verify README commands and Compose behavior, not just code shape.
- Story 1.3 fixed PostgreSQL 18 volume layout: mount the named volume at `/var/lib/postgresql`, not `/var/lib/postgresql/data`.
- Story 1.3 fixed package-script cwd issues in `drizzle.config.ts` by using absolute paths. Be alert for path behavior when adding static checks or scripts.
- Story 1.3 fixed central API error handling by installing handlers directly on the root Fastify instance, not through an encapsulated sibling plugin.
- Story 1.3 introduced API `.env` loading through `apps/api/src/config/load-env.ts`. Reuse it for token/local-origin settings.
- Story 1.3 added live Drizzle/Postgres tests that run when `DATABASE_URL` is set and skip otherwise. Follow that pattern for dependency-sensitive tests.

### Project Structure Notes

- API plugins belong under `apps/api/src/plugins/`.
- Product route plugins belong under `apps/api/src/features/<capability>/`.
- Shared Zod contracts belong in `packages/contracts`; clients belong in `packages/api-client`.
- Do not import database code into React or pure domain logic.
- Do not hand-edit generated API client output under `packages/api-client/src/generated` if/when generation is introduced.
- Keep source file names kebab-case.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-1.4-Enforce-Local-Only-Runtime-Boundary]
- [Source: _bmad-output/planning-artifacts/architecture.md#Authentication-&-Security]
- [Source: _bmad-output/planning-artifacts/architecture.md#API-&-Communication-Patterns]
- [Source: _bmad-output/planning-artifacts/architecture.md#Infrastructure-&-Deployment]
- [Source: _bmad-output/planning-artifacts/architecture.md#Project-Structure-&-Boundaries]
- [Source: _bmad-output/planning-artifacts/prds/prd-my-capstone-2026-06-15/prd.md#7.1-Privacy-and-Data-Control]
- [Source: _bmad-output/planning-artifacts/prds/prd-my-capstone-2026-06-15/prd.md#8-Success-Metrics]
- [Source: _bmad-output/planning-artifacts/ux-designs/ux-my-capstone-2026-06-15/EXPERIENCE.md#State-Patterns]
- [Source: _bmad-output/implementation-artifacts/1-3-add-local-persistence-foundation.md#Previous-Story-Intelligence]
- [Fastify Helmet README](https://github.com/fastify/fastify-helmet)
- [Fastify CORS README](https://github.com/fastify/fastify-cors)
- [Fastify Server Reference](https://fastify.dev/docs/latest/Reference/Server/)

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- Red checks first confirmed missing local-security plugin/config/readiness/static validation coverage.
- Focused green checks passed for contracts, API client, API, and web packages after implementation.
- Full validation passed on 2026-06-17T17:06:03+08:00:
  - `pnpm typecheck`
  - `pnpm test`
  - `pnpm lint`
  - `pnpm build`
  - `docker compose config`

### Completion Notes List

- Added typed local runtime configuration with loopback-only API host and fixed local-origin allowlist validation.
- Added API local-security enforcement with Helmet/CORS headers and `x-local-request-token` protection for state-changing methods only.
- Added `/ready` with shared contract/client support and sanitized dependency failure responses.
- Added static local-only checks for runtime frontend source/config and config checks for local env/Compose exposure.
- Updated README and `docs/local-security.md` with local-only runtime boundary, token, and loopback database guidance.

### File List

- `.env.example`
- `README.md`
- `_bmad-output/implementation-artifacts/1-4-enforce-local-only-runtime-boundary.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `apps/api/package.json`
- `apps/api/src/app.ts`
- `apps/api/src/config/index.ts`
- `apps/api/src/config/index.test.ts`
- `apps/api/src/config/local-runtime-config.test.ts`
- `apps/api/src/features/health/health-routes.ts`
- `apps/api/src/features/health/health-routes.test.ts`
- `apps/api/src/plugins/local-security.ts`
- `apps/api/src/plugins/local-security.test.ts`
- `apps/web/src/local-assets.test.ts`
- `apps/web/tsconfig.app.json`
- `apps/web/vite.config.ts`
- `docs/local-security.md`
- `packages/api-client/src/health-client.ts`
- `packages/api-client/src/health-client.test.ts`
- `packages/contracts/src/health/index.ts`
- `packages/contracts/src/health/health-contract.test.ts`
- `pnpm-lock.yaml`

### Change Log

- 2026-06-17: Implemented local-only runtime boundary and moved story to review.

## Story Metadata

baseline_commit: 205b325
created_at: 2026-06-17T16:35:59+08:00

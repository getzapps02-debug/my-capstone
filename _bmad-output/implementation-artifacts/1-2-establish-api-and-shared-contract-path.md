---
baseline_commit: dfd5e3e28f2b7ba08d74c6fbbaad2612eac9be4d
---

# Story 1.2: Establish API and Shared Contract Path

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a local investigator,
I want the app shell to verify the local service is available through a shared contract,
so that future investigation features use one trustworthy API/client path instead of ad hoc browser logic.

## Acceptance Criteria

1. Given the local web workspace exists, when the API workspace is added, then the repository includes an `apps/api` Fastify application, and the API exposes a `/health` endpoint that returns a standard successful health response.
2. Given the web app shell is running, when the shell checks local service health, then it calls the Fastify API through the established shared contract/client pattern, and it displays a calm local service status without exposing stack traces or sensitive details.
3. Given the shared contract package exists, when the health response schema is defined, then the API and web client consume the same schema or generated type source, and duplicate hand-written health response types are avoided.
4. Given the local API receives a request, when the response is produced, then request IDs and the standard response/error shape are established for future endpoints, and failures use non-alarming, non-causal product language.
5. Given validation commands run, when API tests execute, then the `/health` endpoint test passes, and the web/API contract path compiles without type errors.

## Tasks / Subtasks

- [x] Add the Fastify API workspace. (AC: 1, 4, 5)
  - [x] Create `apps/api` as a TypeScript ESM workspace with `src/app.ts`, `src/server.ts`, `src/config/`, `src/plugins/`, `src/errors/`, and `src/features/health/`.
  - [x] Add API scripts that fit the existing root Turbo scripts: `dev`, `build`, `typecheck`, `lint`, and `test`.
  - [x] Ensure the API can run independently on a loopback host and configurable local port without introducing Docker, PostgreSQL, migrations, or sample data in this story.
- [x] Define the shared health contract and response envelopes. (AC: 3, 4)
  - [x] Create `packages/contracts` with explicit public exports and Zod schemas/types for health success, standard error envelope, and request ID-bearing responses.
  - [x] Have the API import and use the shared contract schema for `/health` rather than defining a route-local duplicate type.
  - [x] Have the web/client side import types or schema-derived types from the same contract path; do not hand-write a second health response shape in React.
- [x] Establish the API client path used by the web shell. (AC: 2, 3, 5)
  - [x] Create `packages/api-client` as the owner for web-to-API access, with generated-client ownership documented and any Story 1.2 manual client kept small, explicit, and replaceable by generated OpenAPI output later.
  - [x] Expose a typed `getHealth`-style function that fetches `/health` through the shared contract path and normalizes success/failure without leaking raw stack traces.
  - [x] Update `apps/web` path aliases/dependencies only as needed to consume `@workspace/api-client`; preserve the existing app shell, navigation, skip link, and shared UI import pattern.
- [x] Show local service status in the app shell. (AC: 2, 4)
  - [x] Add a compact service-status surface to the existing shell that reports loading, available, and unavailable states in calm product language.
  - [x] Keep status copy non-alarming and non-causal; examples: "Local service available" and "Local service check is unavailable right now."
  - [x] Do not expose exception messages, stack traces, host internals, or financial details in the UI.
- [x] Establish request ID and error handling conventions. (AC: 4)
  - [x] Generate or propagate a request ID for every API response, including errors.
  - [x] Return standard error envelopes with `code`, `message`, optional `details`, and `requestId`.
  - [x] Keep logs local and avoid logging financial values or uploaded row contents; no financial data exists yet, but the convention should be set now.
- [x] Add focused validation coverage and documentation. (AC: 1, 2, 3, 5)
  - [x] Add API tests for `/health` success shape, request ID presence, and contract/schema parsing.
  - [x] Add web or client tests for service status success/failure rendering without stack trace leakage.
  - [x] Update `README.md` with API/web development commands and validation commands for the multi-workspace setup.
  - [x] Run install if dependencies changed, then run `pnpm typecheck`, `pnpm lint`, `pnpm test`, and `pnpm build`; record any command that cannot run.

## Dev Notes

### Story Scope

This story adds the first backend boundary and proves the web shell talks to it through shared contracts. It should not implement database access, Docker Compose, `/ready`, persistence, local-only enforcement tests, sample data, CSV import, accounts, transactions, investigation calculations, charts, Replay, or financial domain logic. Those are owned by later stories.

### Current Repository State

- Story 1.1 initialized the shadcn Vite pnpm monorepo and is marked `done`.
- Existing workspace packages are `apps/web` and `packages/ui`.
- Root scripts already delegate through Turbo: `dev`, `build`, `lint`, `format`, `typecheck`, and `test`.
- `pnpm-workspace.yaml` already includes `apps/*` and `packages/*`, so new `apps/api`, `packages/contracts`, and `packages/api-client` workspaces should be discovered without changing the workspace glob.
- This Windows environment has no global `pnpm` shim; previous successful commands used `& 'C:\Program Files\nodejs\npx.cmd' --yes pnpm@10.33.4 <command>`.
- Story 1.1 changes are still uncommitted in the working tree. Do not revert or overwrite them.

### Previous Story Intelligence

- The shadcn CLI initially generated a nested `my-capstone/` directory; the final accepted workspace lives at the repo root. Do not create another nested project.
- Tests run through Vitest and Testing Library; Story 1.1 needed explicit Testing Library cleanup between renders.
- Validation passed for Story 1.1 with `pnpm test`, `pnpm typecheck`, `pnpm lint`, and `pnpm build`.
- The web shell currently imports `Button` from `@workspace/ui/components/button` and keeps product composition in `apps/web/src/App.tsx`. Preserve that boundary.
- Story 1.1 deliberately avoided API, persistence, Docker, sample data, imports, charts, Replay, and financial calculations; Story 1.2 should add only the API/contract/client path.

### Architecture Requirements

- The architecture target is a local-first full-stack TypeScript app with React browser client, local Fastify API, PostgreSQL persistence later, Docker Compose runtime later, and shared TypeScript contracts. [Source: `_bmad-output/planning-artifacts/architecture.md` > Primary Technology Domain]
- `apps/api` is the Fastify application workspace. Expected API entry points include `src/app.ts`, `src/server.ts`, `src/config/`, `src/plugins/`, `src/errors/`, and `src/features/`. [Source: `_bmad-output/planning-artifacts/architecture.md` > Complete Project Directory Structure]
- Product API routes use versioned REST endpoints under `/api/v1`; health and readiness endpoints remain separate from product routes. For this story, implement `/health` only and do not add product routes. [Source: `_bmad-output/planning-artifacts/architecture.md` > API & Communication Patterns; Architectural Boundaries]
- Fastify 5.8 route plugins are organized by product capability. The health endpoint should live in a health feature/plugin, not as unrelated inline code in `server.ts`. [Source: `_bmad-output/planning-artifacts/architecture.md` > API & Communication Patterns]
- Shared Zod schemas live in `packages/contracts` and integrate through `fastify-type-provider-zod`; duplicate request/response schemas inside route handlers are an anti-pattern. [Source: `_bmad-output/planning-artifacts/architecture.md` > API & Communication Patterns; Anti-Patterns]
- Standard API errors use an envelope containing `code`, `message`, `details`, and `requestId`; the API generates and propagates request IDs. [Source: `_bmad-output/planning-artifacts/architecture.md` > API & Communication Patterns]
- `packages/api-client` owns generated OpenAPI client code. In this story, a minimal handwritten health client is acceptable only as a bridge until OpenAPI generation is added; generated output later belongs only in `packages/api-client/src/generated`. [Source: `_bmad-output/planning-artifacts/architecture.md` > File Organization Patterns; Gap Analysis Results]
- The frontend communicates with application capabilities only through the API client package; React components must not duplicate API schemas or call arbitrary product endpoints directly. [Source: `_bmad-output/planning-artifacts/architecture.md` > Architectural Boundaries]
- Logs are structured, local, and redacted. The MVP has no remote telemetry or hosted monitoring. Logs must not include imported rows or financial descriptions. [Source: `_bmad-output/planning-artifacts/architecture.md` > Infrastructure & Deployment; Anti-Patterns]

### UX and Product Language Requirements

- The product voice is calm, precise, non-judgmental, non-causal, and non-advisory. Avoid blame, motivational language, financial prescriptions, and unsupported intent statements. [Source: `_bmad-output/planning-artifacts/ux-designs/ux-my-capstone-2026-06-15/EXPERIENCE.md` > Voice and Tone]
- Service status should fit the existing quiet analytical shell: neutral surfaces, visible border, compact typography, and blue focus/selection where interactive. [Source: `_bmad-output/planning-artifacts/ux-designs/ux-my-capstone-2026-06-15/DESIGN.md` > Colors; Shapes]
- Keep the first screen as the application shell, not a marketing page. Any status panel should support the shell rather than becoming a hero or decorative card.
- Loading and failure states must be accessible text, not color-only meaning. If a retry control is added, it needs an accessible name and visible focus indicator.

### Latest Technical Information

- Fastify official docs currently list latest as `v5.8.x`; use Fastify 5-compatible APIs and avoid older v4 assumptions. [Source: https://fastify.dev/docs/latest/]
- Fastify type providers are scoped and do not propagate globally through encapsulation; plugins using Zod schemas should call or receive the correctly typed Fastify instance rather than assuming provider state crosses plugin boundaries. [Source: https://fastify.dev/docs/latest/Reference/Type-Providers/]
- Fastify's docs identify `fastify-type-provider-zod` as the Zod provider path for Zod instructions. [Source: https://fastify.dev/docs/latest/Reference/Type-Providers/]
- Zod 4 supports converting schemas to JSON Schema through `z.toJSONSchema`, which is useful for later OpenAPI/client generation. [Source: https://zod.dev/json-schema]

### File Structure Requirements

Expected additions or updates:

```text
apps/
  api/
    src/
      app.ts
      server.ts
      config/
      plugins/
      errors/
      features/
        health/
    package.json
    tsconfig.json
packages/
  contracts/
    src/
      health/
      errors/
      index.ts
    package.json
    tsconfig.json
  api-client/
    src/
      health-client.ts
      index.ts
      generated/
        .gitkeep
    package.json
    tsconfig.json
apps/web/
  src/App.tsx
  src/App.test.tsx
README.md
```

Adjust exact filenames to match the starter conventions, but keep source files kebab-case where practical and keep package public APIs exported from explicit entry points. Avoid private cross-package imports.

### Implementation Guardrails

- Do not use Express, Next.js API routes, GraphQL, WebSockets, background workers, service workers, Redux, or browser local storage for this story.
- Do not add PostgreSQL, Drizzle, migrations, Docker Compose, `.env` secrets, sample data, account CRUD, CSV upload, transactions, calculations, charts, Replay, or local-only network enforcement in this story.
- Do not place contract definitions in both `apps/api` and `apps/web`; the shared contract package owns them.
- Do not let React perform health response validation using a separate handwritten type. The API client and/or shared contracts should own parsing.
- Do not expose raw `Error.message`, stack traces, port numbers, filesystem paths, or dependency internals in UI copy.
- Bind local development servers to loopback where scripts specify a host. Production loopback/Docker behavior is completed in later stories.

### Testing Requirements

- API tests should use Fastify injection against the built app instance rather than requiring a real listening port.
- Minimum API coverage: successful `GET /health`, response body matches the shared schema, and `requestId` is present.
- Minimum contract coverage: schema parsing accepts the API success response and rejects malformed health responses.
- Minimum web/client coverage: the shell renders service status for success and failure paths and failure UI does not include stack traces or raw exception text.
- Existing Story 1.1 navigation/accessibility tests must remain passing.
- Run the root validation commands after dependency changes:
  - `& 'C:\Program Files\nodejs\npx.cmd' --yes pnpm@10.33.4 install`
  - `& 'C:\Program Files\nodejs\npx.cmd' --yes pnpm@10.33.4 typecheck`
  - `& 'C:\Program Files\nodejs\npx.cmd' --yes pnpm@10.33.4 lint`
  - `& 'C:\Program Files\nodejs\npx.cmd' --yes pnpm@10.33.4 test`
  - `& 'C:\Program Files\nodejs\npx.cmd' --yes pnpm@10.33.4 build`

### Project Context Reference

No `project-context.md` file exists in the repository at story creation time.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- 2026-06-17T11:36:22+08:00 - Started Story 1.2 implementation and moved sprint/story status to `in-progress`; preserved existing baseline commit `dfd5e3e28f2b7ba08d74c6fbbaad2612eac9be4d`.
- 2026-06-17T11:43:51+08:00 - Initial validation exposed an API literal type mismatch and an over-specific request ID header assertion; corrected health handler typing and kept request ID validation on the contract response body.
- 2026-06-17T11:48:02+08:00 - Web service-status test rendered the correct text but queried live-region accessible name too strictly; adjusted the test to assert visible status copy.
- 2026-06-17T11:50:32+08:00 - Final validation passed: install, test, typecheck, lint, and build.
- 2026-06-17T13:13:00+08:00 - Compiled API runtime check exposed package exports pointing at TypeScript source; changed shared packages to emit `dist`, updated Turbo dependency ordering, excluded API `dist` from tests, and reran final validation successfully.
- 2026-06-17T13:59:16+08:00 - Code review patch findings resolved: removed generated contract artifacts from `src`, added development export conditions, and verified API workspace dev-condition resolution.

### Completion Notes List

- Story created by BMad create-story workflow.
- Ultimate context engine analysis completed - comprehensive developer guide created.
- Added `apps/api` Fastify workspace with `/health`, loopback/local configuration, request ID setup, and standard error envelopes.
- Added `packages/contracts` as the shared Zod contract source for health and error responses.
- Added `packages/api-client` with a small typed health client that parses shared contracts and normalizes failures without leaking exception details.
- Updated the web shell to display loading, available, and unavailable local service status while preserving Story 1.1 navigation, landmarks, and shared UI boundaries.
- Added focused API, contract, API-client, and web tests for health success, request IDs, schema parsing, safe failure copy, and shell regression coverage.
- Updated README development documentation for the API and multi-workspace commands.
- Adjusted package build outputs so the compiled API can consume built `@workspace/contracts` exports at runtime.
- Resolved code review findings by removing generated JS/declaration artifacts from contract source folders and making API dev resolution use source exports through the `development` condition.
- Confirmed no persistence, Docker Compose, sample data, account/transaction behavior, charts, Replay, or financial calculations were added.

### Change Log

- 2026-06-17: Implemented Story 1.2 API, shared contracts, API client path, web service status, focused tests, runtime-safe package exports, review patches, and documentation; status moved to done after review patches and validation passed.

### File List

- `_bmad-output/implementation-artifacts/1-2-establish-api-and-shared-contract-path.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `README.md`
- `pnpm-lock.yaml`
- `turbo.json`
- `apps/api/eslint.config.js`
- `apps/api/package.json`
- `apps/api/tsconfig.json`
- `apps/api/tsconfig.build.json`
- `apps/api/src/app.ts`
- `apps/api/src/server.ts`
- `apps/api/src/config/index.ts`
- `apps/api/src/errors/error-handler.ts`
- `apps/api/src/errors/http-error.ts`
- `apps/api/src/features/health/health-routes.ts`
- `apps/api/src/features/health/health-routes.test.ts`
- `apps/api/src/plugins/request-id.ts`
- `apps/web/package.json`
- `apps/web/tsconfig.app.json`
- `apps/web/vite.config.ts`
- `apps/web/src/App.tsx`
- `apps/web/src/App.test.tsx`
- `packages/api-client/eslint.config.js`
- `packages/api-client/package.json`
- `packages/api-client/tsconfig.json`
- `packages/api-client/tsconfig.build.json`
- `packages/api-client/src/generated/.gitkeep`
- `packages/api-client/src/health-client.ts`
- `packages/api-client/src/health-client.test.ts`
- `packages/api-client/src/index.ts`
- `packages/contracts/eslint.config.js`
- `packages/contracts/package.json`
- `packages/contracts/tsconfig.json`
- `packages/contracts/tsconfig.build.json`
- `packages/contracts/src/errors/index.ts`
- `packages/contracts/src/health/health-contract.test.ts`
- `packages/contracts/src/health/index.ts`
- `packages/contracts/src/index.ts`

### Review Findings

- [x] [Review][Patch] Remove generated contract artifacts from `packages/contracts/src` [packages/contracts/src/errors/index.js:1]
- [x] [Review][Patch] Make API dev startup independent of ignored package `dist` outputs [apps/api/package.json:6]

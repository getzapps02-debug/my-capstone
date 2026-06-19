---
baseline_commit: 1788b14
created_at: 2026-06-19T00:00:00+08:00
---

# Story 1.5: Load and Reset Sample Data

Status: review

## Story

As a local investigator,
I want to load and reset visibly labeled Sample Data,
so that I can try the investigation workflow safely without modifying personal Accounts or records.

## Acceptance Criteria

1. Given the local app is running with no personal Account selected, when I choose to load Sample Data, then the system creates or restores a clearly labeled Sample Data dataset, and the UI distinguishes Sample Data from personal data everywhere it is shown.
2. Given Sample Data is loaded, when I open the Investigate surface, then I can see at least one sample investigation entry point, and the copy describes it as example evidence without implying advice, blame, or proven causality.
3. Given Sample Data includes investigation-ready evidence, when the sample dataset is seeded, then it includes at least one complete, reconciled Shortfall scenario, and it includes at least one insufficient-evidence scenario for refusal behavior later.
4. Given Sample Data and personal data are separate, when I reset Sample Data, then only Sample Data records are removed and recreated, and no personal Accounts, Transactions, Obligations, Context, or derived findings are changed.
5. Given validation tests run, when Sample Data load and reset behavior is tested, then dataset ownership prevents Sample Data and personal data from being combined, and repeated load/reset operations are deterministic.

## Tasks / Subtasks

- [x] Define the sample dataset contract and deterministic seed shape (AC: 1, 3, 5)
  - [x] Extend the investigation contract in `packages/contracts/src/investigations/` to expose sample dataset state, visible label, scenario summaries, and the current sample investigation entry point.
  - [x] Include stable scenario IDs for at least `complete-reconciled-shortfall` and `insufficient-evidence`.
  - [x] Keep all sample scenario copy synthetic, non-advisory, and non-causal.

- [x] Extend local persistence and repository behavior for sample load/reset (AC: 1, 3, 4, 5)
  - [x] Reuse `packages/database/src/repositories/investigation-repository.ts`; extend the existing sample-owned repository path rather than adding a parallel persistence layer.
  - [x] Add only the minimum schema/migration support required for visible sample dataset state and scenario metadata in this story.
  - [x] Ensure load is idempotent and reset removes/recreates only records whose dataset owner is `sample`.
  - [x] Preserve personal rows even when they share a stable sample-like ID; tests must prove composite dataset ownership prevents collisions.

- [x] Add token-protected API commands for load and reset (AC: 1, 4, 5)
  - [x] Add state-changing endpoints under the existing investigations feature, for example `POST /api/v1/investigations/sample/load` and `POST /api/v1/investigations/sample/reset`.
  - [x] Return shared Zod contract responses and sanitized error envelopes for persistence failures.
  - [x] Rely on the Story 1.4 local-security plugin for `x-local-request-token`; do not bypass or duplicate token enforcement in the route.
  - [x] Keep `GET /api/v1/investigations/current-sample` readable without a token.

- [x] Update the API client and web shell to expose Sample Data actions (AC: 1, 2, 4)
  - [x] Add client methods in `packages/api-client/src/investigation-client.ts` for load and reset commands.
  - [x] Update `apps/web/src/App.tsx` so the Investigate empty state offers `Load Sample Data`, and the loaded state clearly labels the entry as Sample Data.
  - [x] Provide a reset action that explains only Sample Data will be reset; keep wording calm and avoid implying advice, blame, causality, or real financial history.
  - [x] Preserve existing local service and saved-investigation status behavior.

- [x] Verify deterministic separation and UI states (AC: 1-5)
  - [x] Add contract tests for sample dataset response parsing and scenario IDs.
  - [x] Add repository tests for idempotent load, deterministic reset, and sample/personal isolation.
  - [x] Add API route tests for load/reset success, token rejection through the existing security plugin, sanitized persistence failure, and unchanged token-free read behavior.
  - [x] Add web component tests for the No Accounts/empty state, visible Sample Data labeling, load/reset actions, safe failure messages, and absence of prohibited advisory/causal copy.
  - [x] Run `pnpm typecheck`, `pnpm test`, `pnpm lint`, `pnpm build`, and `docker compose config`.

### Review Findings

- [x] [Review][Patch] Make reset atomic so a failed reload cannot leave Sample Data cleared [`packages/database/src/repositories/investigation-repository.ts:175`]
- [x] [Review][Patch] Declare token-rejection responses on sample mutation route schemas [`apps/api/src/features/investigations/investigation-routes.ts:63`]
- [x] [Review][Patch] Preserve reset-specific safe failure copy through the API client and web shell [`packages/api-client/src/investigation-client.ts:100`]
- [x] [Review][Patch] Add missing token-rejection coverage for Sample Data reset [`apps/api/src/features/investigations/investigation-routes.test.ts:143`]

## Dev Notes

### Current Repository State

- Story 1.4 is currently in review and introduced the local-only runtime boundary. Build on the current working tree and preserve the state-changing request token behavior.
- `apps/api/src/app.ts` registers request IDs, installs central error handlers, installs local security, then registers health and investigation routes.
- Existing investigation API surface lives in `apps/api/src/features/investigations/investigation-routes.ts` and currently exposes `GET /api/v1/investigations/current-sample`.
- Existing web shell in `apps/web/src/App.tsx` already calls `getCurrentSampleInvestigation()` and renders available, empty, and unavailable saved-investigation states.
- Existing database support is intentionally minimal: `investigation_entries` has `id`, `title`, `status`, `created_at`, and `dataset_owner`; the primary key is `(dataset_owner, id)`.
- Existing repository constants and behavior in `packages/database/src/repositories/investigation-repository.ts` already include `SAMPLE_INVESTIGATION_ID`, `ensureSampleInvestigation()`, `getCurrentSampleInvestigation()`, and `clearSampleInvestigation()`.
- Existing repository tests already prove sample and personal rows can share `SAMPLE_INVESTIGATION_ID` without collision. Extend that pattern for reset.

### Architecture Constraints

- PostgreSQL remains the authoritative local datastore, accessed through Drizzle ORM with committed SQL migrations.
- Persisted product records must remain associated with a dataset boundary; sample and personal datasets cannot be combined by queries, calculations, or reset operations.
- State-changing API commands must be synchronous and transactionally consistent. If reset becomes multi-table in this story, implement it in one database transaction.
- API routes use versioned REST endpoints under `/api/v1`, Fastify route plugins by product capability, and shared Zod schemas in `packages/contracts`.
- The current implemented error envelope has `code`, `message`, and `requestId`; do not widen it casually just because the architecture still mentions `details`.
- The MVP has no login, roles, sessions, cloud sync, telemetry, remote fonts, CDNs, or external financial-data processing.
- React must not contain financial calculations, database access, or derived ranking logic. For this story, the UI may display seeded scenario summaries and entry points returned by the API.

### Sample Data Requirements

- Sample Data is synthetic and must be visibly labeled anywhere it appears in this story.
- The seed must be deterministic: repeated load/reset operations produce the same stable IDs, titles, statuses, scenario summaries, and dataset ownership.
- Include at least two scenario records or scenario summaries:
  - `complete-reconciled-shortfall`: a future-ready scenario representing a complete, reconciled Shortfall path.
  - `insufficient-evidence`: a future-ready scenario representing later refusal behavior when required evidence is missing.
- This story does not need to implement full account, transaction, balance, contributor, ranking, chart, or replay calculations. If schema is expanded, store enough scenario metadata for future stories without pretending derived findings already exist.
- Reset must delete/recreate only sample-owned records. It must not alter personal Accounts, Transactions, Obligations, Context, investigations, or derived findings.

### UX and Copy Guardrails

- The Investigate No Accounts state should offer `Load Sample Data`; later stories own full manual Account and CSV import flows.
- Loaded sample entry copy should describe example evidence only. Avoid phrases like "caused your Shortfall", "you overspent because", prescriptions, advice, blame, or motivational coaching.
- Use explicit labels such as `Sample Data` and `Example evidence`; do not rely on color alone.
- Preserve semantic landmarks, accessible names, visible focus, and `aria-live` behavior already present in the shell.
- Failure states should retain current visible data where safe, state what failed, and offer a safe retry without exposing raw database details or secrets.

### Files Likely to Change

- `apps/api/src/features/investigations/investigation-routes.ts`
- `apps/api/src/features/investigations/investigation-routes.test.ts`
- `apps/web/src/App.tsx`
- `apps/web/src/App.test.tsx`
- `packages/api-client/src/investigation-client.ts`
- `packages/api-client/src/investigation-client.test.ts`
- `packages/contracts/src/investigations/index.ts`
- `packages/contracts/src/investigations/investigation-contract.test.ts`
- `packages/database/src/repositories/investigation-repository.ts`
- `packages/database/src/repositories/investigation-repository.test.ts`
- `packages/database/src/schema/investigation-entries.ts`
- `packages/database/src/schema/index.ts`
- `packages/database/migrations/*.sql`
- `README.md` or `docs/local-security.md` only if setup or token usage changes for users.

### Testing Standards

- API tests should use `buildApp({ logger: false, investigationRepository })` and `app.inject()`.
- For state-changing route tests, set/pass `x-local-request-token` through the existing local-security path and assert missing/invalid token rejection is still sanitized.
- Repository tests that require a live database should continue the existing `DATABASE_URL` gated pattern and skip when unset.
- Component tests should inject fake client functions into `App` rather than depending on network or a live database.
- Add regression checks that reset leaves personal-owner rows untouched and repeated reset results are deterministic.
- Keep static local-only checks passing; do not add remote assets, telemetry packages, or third-party financial-data URLs.

### Previous Story Intelligence

- Story 1.4 added typed local runtime settings and `x-local-request-token` protection for `POST`, `PUT`, `PATCH`, and `DELETE`; all new load/reset commands must pass through this protection.
- Story 1.4 preserved token-free `GET`, `/health`, and `/ready`; do not make `current-sample` require a token.
- Story 1.4 added sanitized readiness and persistence failure responses; reuse that tone and avoid leaking database URLs, tokens, stack traces, or raw headers.
- Story 1.3/1.4 highlighted that documentation and commands must be executable exactly as written. If docs change, verify commands against this repo.
- Story 1.3 introduced live Drizzle/Postgres tests that run when `DATABASE_URL` is set and skip otherwise. Follow that pattern for dependency-sensitive reset tests.
- Story 1.4 explicitly left Sample Data load/reset out of scope; this story owns that behavior.

### Project Structure Notes

- Product route plugins belong under `apps/api/src/features/<capability>/`.
- Shared contracts belong in `packages/contracts`; the API client belongs in `packages/api-client`.
- Database schema and repositories belong in `packages/database`; React components must not import database code.
- Keep source file names kebab-case and package public APIs exported from explicit entry points.
- Do not hand-edit generated client output under `packages/api-client/src/generated` if generation is introduced later.

### Latest Technical Notes

- No new third-party library is required for this story. Use the repo's current versions: Fastify 5.8, `fastify-type-provider-zod` 6.1, Zod 4.4, Drizzle ORM, React 19, Vite 8, Vitest 4, and Testing Library.
- Prefer extending existing contracts and repository ports over adding dependencies, background workers, client-side caches, or ad hoc browser persistence.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-1.5-Load-and-Reset-Sample-Data]
- [Source: _bmad-output/planning-artifacts/prds/prd-my-capstone-2026-06-15/prd.md#FR-2-Load-and-Reset-Sample-Data]
- [Source: _bmad-output/planning-artifacts/prds/prd-my-capstone-2026-06-15/prd.md#7.1-Privacy-and-Data-Control]
- [Source: _bmad-output/planning-artifacts/prds/prd-my-capstone-2026-06-15/prd.md#9.1-Evidence-Guardrails]
- [Source: _bmad-output/planning-artifacts/prds/prd-my-capstone-2026-06-15/prd.md#9.2-Product-Generated-Language]
- [Source: _bmad-output/planning-artifacts/architecture.md#Data-Architecture]
- [Source: _bmad-output/planning-artifacts/architecture.md#Authentication-&-Security]
- [Source: _bmad-output/planning-artifacts/architecture.md#API-&-Communication-Patterns]
- [Source: _bmad-output/planning-artifacts/architecture.md#File-Organization-Patterns]
- [Source: _bmad-output/planning-artifacts/ux-designs/ux-my-capstone-2026-06-15/EXPERIENCE.md#State-Patterns]
- [Source: _bmad-output/implementation-artifacts/1-4-enforce-local-only-runtime-boundary.md#Previous-Story-Intelligence]

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- Initial full `pnpm test` run caught one API test setup issue where a sample-load persistence failure was blocked by missing local token config before it reached the repository. Test setup was corrected to use the explicit Story 1.4 local-security config.
- Initial `pnpm build` run caught unsupported `Button` variant `outline` in the web shell. The reset action was switched to the existing `ghost` variant with explicit border styling.
- Final validation passed on 2026-06-19:
  - `pnpm typecheck`
  - `pnpm test`
  - `pnpm lint`
  - `pnpm build`
  - `docker compose config`

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created.
- Added sample dataset contracts with visible `Sample Data` labeling and deterministic scenario IDs for complete reconciled Shortfall and insufficient-evidence paths.
- Extended the existing sample-owned investigation repository path with deterministic load/reset behavior and no parallel persistence layer.
- Added token-protected sample load/reset API commands under the investigations feature while preserving token-free `current-sample` reads.
- Added API client load/reset helpers and a Vite-exposed local request token placeholder.
- Updated the Investigate shell with Load/Reset Sample Data actions, explicit Sample Data labeling, scenario summaries, and safe failure copy.
- Added focused contract, repository, API, client, and web tests for dataset shape, token protection, sample/personal separation, deterministic behavior, and safe copy.

### File List

- `.env.example`
- `_bmad-output/implementation-artifacts/1-5-load-and-reset-sample-data.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `apps/api/src/features/investigations/investigation-routes.test.ts`
- `apps/api/src/features/investigations/investigation-routes.ts`
- `apps/web/src/App.test.tsx`
- `apps/web/src/App.tsx`
- `packages/api-client/src/investigation-client.test.ts`
- `packages/api-client/src/investigation-client.ts`
- `packages/contracts/src/investigations/index.ts`
- `packages/contracts/src/investigations/investigation-contract.test.ts`
- `packages/database/src/repositories/investigation-repository.test.ts`
- `packages/database/src/repositories/investigation-repository.ts`

### Change Log

- 2026-06-19: Implemented deterministic Sample Data load/reset slice and moved story to review.

## Story Metadata

baseline_commit: 1788b14
created_at: 2026-06-19T00:00:00+08:00

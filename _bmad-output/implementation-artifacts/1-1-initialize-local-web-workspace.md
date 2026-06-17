---
baseline_commit: dfd5e3e28f2b7ba08d74c6fbbaad2612eac9be4d
---

# Story 1.1: Initialize Local Web Workspace

Status: done

## Story

As a local investigator,
I want to open the first Shortfall Investigator app shell,
so that I can confirm the product runs locally and has the approved navigation and visual foundation for future investigation work.

## Acceptance Criteria

1. Given the project has been initialized from the approved shadcn Vite monorepo starter, when I start the local web app through the documented development command, then the browser displays a Shortfall Investigator app shell with the approved calm analytical visual style, and the app shell uses local project styling and assets rather than remote fonts, CDNs, analytics, or telemetry.
2. Given I open the app shell, when the first screen renders, then I can see the primary navigation surfaces for `Investigate`, `Accounts & Data`, `Investigations`, and `Settings & Privacy`, and the active navigation state is visually and programmatically distinguishable.
3. Given I use only the keyboard, when I tab through the app shell navigation and primary content landmark, then focus order follows the visible reading order, and every interactive element exposes a visible focus indicator and accessible name.
4. Given the workspace includes shared packages, when the project is checked by the standard validation commands, then the web app, shared UI package, and package import boundaries compile successfully, and linting and the initial test command complete without failures.
5. Given this is the first implementation story, when a future dev agent reads the repository, then the workspace structure clearly preserves the planned boundaries for `apps/web`, shared UI components, and future API/domain/database packages, and no financial calculation logic is placed in the React shell.

## Tasks / Subtasks

- [x] Initialize the approved frontend monorepo starter. (AC: 1, 4, 5)
  - [x] Use the architecture-approved shadcn Vite monorepo starter command: `pnpm dlx shadcn@latest init -t vite --monorepo`.
  - [x] If the current shadcn CLI requires interactive template selection instead of `-t vite`, use `pnpm dlx shadcn@latest init --monorepo` and select `Vite`; document the exact command used in `README.md`.
  - [x] Preserve generated `apps/web`, `packages/ui`, root workspace files, `components.json` files, Tailwind setup, and package import aliases.
  - [x] Do not create financial domain logic, API routes, database schemas, Docker files, or sample data in this story unless required by the starter itself.
- [x] Build the first Shortfall Investigator app shell. (AC: 1, 2, 3)
  - [x] Replace starter/demo content with a functional shell titled `Shortfall Investigator`.
  - [x] Add navigation entries for `Investigate`, `Accounts & Data`, `Investigations`, and `Settings & Privacy`.
  - [x] Use semantic landmarks: a skip link, navigation landmark, and a primary content landmark.
  - [x] Ensure the active navigation item has visible styling and an ARIA-current state or equivalent programmatic indication.
- [x] Apply the approved local visual foundation. (AC: 1, 3)
  - [x] Use local CSS/Tailwind tokens for the approved calm analytical style: neutral background, white surfaces, blue primary action/selection, visible borders, compact functional typography, and restrained radii.
  - [x] Use system font fallback only unless a local font asset is committed; do not load Google Fonts or any remote font/CDN asset.
  - [x] Avoid banking-dashboard decoration, gradients, glass effects, dramatic shadows, decorative networks, and color-only meaning.
  - [x] Ensure focus styling uses a visible 2px solid blue focus ring or stronger equivalent with adequate contrast and no clipping.
- [x] Establish workspace boundaries for later stories without implementing their behavior. (AC: 4, 5)
  - [x] Keep reusable UI primitives in `packages/ui`; product shell composition belongs in `apps/web`.
  - [x] If creating placeholder directories for future packages, keep them minimal and clearly empty or documented; do not add fake implementations.
  - [x] Keep React shell code free of balance, ranking, import, transaction, or replay calculations.
- [x] Add or update developer documentation. (AC: 1, 4, 5)
  - [x] Document the primary local development command for the web app.
  - [x] Document the initial validation commands for install, typecheck/build, lint, and tests.
  - [x] State that the current story provides only the app shell and shared UI boundary; API, persistence, local-only runtime enforcement, and sample data arrive in later Epic 1 stories.
- [x] Add focused validation coverage. (AC: 2, 3, 4)
  - [x] Add at least one component or app-level test that verifies all four navigation labels render.
  - [x] Add at least one accessibility-oriented assertion for landmarks, accessible navigation names, or active navigation state.
  - [x] Run the available validation commands and record any command that cannot run because dependencies or tooling are unavailable.

## Dev Notes

### Story Scope

This story creates the first visible frontend workspace and shell only. It is the foundation for Epic 1, whose goal is that Denzo can start the local app, see the product shell, load/reset Sample Data, and begin from a trustworthy local-only foundation. Stories 1.2 through 1.6 add API health, persistence, local-only enforcement, Sample Data, and resume behavior later. Do not pull those behaviors into Story 1.1.

### Sequencing Clarification

The architecture handoff says to add `apps/api` during the first implementation story, but the approved Epic 1 story sequence assigns the Fastify API workspace and `/health` endpoint to Story 1.2. For Story 1.1, satisfy the architecture intent by preserving workspace boundaries and leaving a clear path for `apps/api`, `packages/contracts`, `packages/domain`, `packages/database`, and `packages/api-client`. Do not implement Fastify routes, health checks, contracts, database access, or Docker behavior in this story. If the starter or workspace setup requires placeholder directories, keep them empty/minimal and document that implementation begins in the owning later story.

### Current Repository State

- The repository currently contains BMad planning artifacts and no application workspace.
- Existing top-level items include `.agents`, `.claude`, `.git`, `docs`, `_bmad`, `_bmad-output`, `.gitignore`, and `ShortFall Investigator PRD.png`.
- There are no existing app files to preserve or modify. This story is expected to add the first application workspace.
- Git history is planning-only so far; the latest commits add and correct BMad epics/readiness artifacts. No implementation conventions have been established in code yet.

### Architecture Requirements

- Use the selected starter: shadcn Vite Monorepo. Architecture explicitly names `pnpm dlx shadcn@latest init -t vite --monorepo` as the first implementation priority. [Source: `_bmad-output/planning-artifacts/architecture.md` > Starter Template Evaluation; Implementation Handoff]
- The architecture target is a local-first full-stack TypeScript web app with React browser client, local Fastify API, PostgreSQL persistence, Docker Compose runtime, and shared TypeScript contracts. In this story, initialize only the frontend monorepo foundation and preserve room for those later workspaces. [Source: `_bmad-output/planning-artifacts/architecture.md` > Primary Technology Domain]
- Required runtime/tooling decisions: TypeScript, Node.js 24 LTS, ESM modules, pnpm workspace, Tailwind CSS, shadcn/ui source-owned components, Vite 8, Vitest, and Playwright. [Source: `_bmad-output/planning-artifacts/architecture.md` > Architectural Decisions Provided by Starter]
- Planned project ownership boundaries include `apps/web`, `apps/api`, `packages/contracts`, `packages/database`, `packages/api-client`, `packages/domain`, and `packages/ui`. This story should create or preserve only what is needed for the shell and workspace boundary. [Source: `_bmad-output/planning-artifacts/architecture.md` > Complete Project Directory Structure]
- Shared UI components belong in `packages/ui`; web route composition and app shell belong in `apps/web`. Domain logic never imports React, Fastify, or database adapters. [Source: `_bmad-output/planning-artifacts/architecture.md` > Structure Patterns; Component Boundaries]
- Use kebab-case source files, PascalCase components/types, camelCase functions/variables, and tests named `<subject>.test.ts` or `<subject>.test.tsx`. [Source: `_bmad-output/planning-artifacts/architecture.md` > Naming Patterns]
- Anti-patterns to avoid in this story: financial calculations inside React components, remote fonts/CDNs/analytics, duplicated shared types, floating-point money logic, chart-as-authoritative patterns, and logging financial descriptions. [Source: `_bmad-output/planning-artifacts/architecture.md` > Anti-Patterns]

### UX Requirements

- The product is a quiet analytical tool: trustworthy, inspectable, composed under uncertainty, and not styled like a bank portal. [Source: `_bmad-output/planning-artifacts/ux-designs/ux-my-capstone-2026-06-15/DESIGN.md` > Brand & Style]
- Use local neutral surfaces and borders: background `#F8FAFC`, foreground `#172033`, surface `#FFFFFF`, surface-muted `#F1F5F9`, border `#CBD5E1`, primary/focus blue `#1D4ED8` / `#2563EB`. [Source: `_bmad-output/planning-artifacts/ux-designs/ux-my-capstone-2026-06-15/DESIGN.md` > frontmatter; Colors]
- Typography should be compact and functional. Inter is preferred only if available locally; otherwise use `ui-sans-serif, system-ui, sans-serif`. Do not introduce remote font loading. [Source: `_bmad-output/planning-artifacts/ux-designs/ux-my-capstone-2026-06-15/DESIGN.md` > Typography]
- Corners are crisp: 4px compact controls, 6px rows/inputs, 8px major panels. Cards should not become decorative page sections. [Source: `_bmad-output/planning-artifacts/ux-designs/ux-my-capstone-2026-06-15/DESIGN.md` > Shapes]
- App Navigation must be persistent on desktop, drawer-capable below 1024px later, preserve active surface, and expose active state. For this story, implement the desktop shell and do not block future responsive drawer work. [Source: `_bmad-output/planning-artifacts/ux-designs/ux-my-capstone-2026-06-15/EXPERIENCE.md` > Information Architecture; Component Patterns]
- Keyboard behavior: `Tab` follows visible reading order, selection is never hover-only, `Enter` or `Space` activates focused controls, every interactive element exposes name/role/state and visible focus. [Source: `_bmad-output/planning-artifacts/ux-designs/ux-my-capstone-2026-06-15/EXPERIENCE.md` > Interaction Primitives; Accessibility Floor]
- Use calm, precise, non-judgmental microcopy. Avoid blame, celebration, financial prescriptions, motivational language, and causal claims. [Source: `_bmad-output/planning-artifacts/ux-designs/ux-my-capstone-2026-06-15/EXPERIENCE.md` > Voice and Tone]

### Latest Technical Information

- shadcn/ui official monorepo docs say the CLI supports monorepo setup and installs components/dependencies to correct paths; the documented monorepo command is `pnpm dlx shadcn@latest init --monorepo`, with template selection including Vite. The docs also require `components.json` in every workspace and consistent aliases/style/baseColor/icon library across workspaces. [Source: https://ui.shadcn.com/docs/monorepo]
- Vite official docs currently show Vite `v8.0.16`, support `react-ts` templates, allow scaffolding with `pnpm create vite`, and state Vite requires Node.js `20.19+` or `22.12+`; Node 24 LTS satisfies that compatibility floor. [Source: https://vite.dev/guide/]
- Node.js official release data lists Node v24 "Krypton" as LTS, last updated May 21, 2026, and production applications should use Active LTS or Maintenance LTS releases. [Source: https://nodejs.org/en/about/previous-releases]
- pnpm workspaces require a root `pnpm-workspace.yaml`; use the `workspace:` protocol for local workspace dependencies where applicable to avoid accidentally resolving a registry package instead of a local package. [Source: https://pnpm.io/workspaces]

### File Structure Requirements

Expected resulting files depend on the current shadcn CLI output, but the implementation should converge toward:

```text
apps/
  web/
    src/
      app/
      components/
      lib/
      styles/
      main.tsx
    index.html
    package.json
    components.json
packages/
  ui/
    src/
      components/
      lib/
      styles/
    package.json
    components.json
pnpm-workspace.yaml
package.json
tsconfig.json
README.md
```

If the starter emits a slightly different Vite structure, preserve the generated structure when it is consistent with shadcn/ui monorepo conventions. Do not move generated files mechanically unless needed to satisfy the architecture boundaries.

### Testing Requirements

- Minimum validation expected before marking dev complete:
  - dependency install succeeds;
  - web app builds or typechecks successfully;
  - lint command succeeds if generated/configured;
  - initial test command succeeds and includes navigation/accessibility coverage added in this story.
- Tests should be colocated with implementation when practical. Use the starter-compatible React/Vitest/testing-library pattern rather than inventing a separate test harness.
- If the starter does not generate lint/test scripts, add minimal scripts and document them. Do not claim completion if no validation command was run.

### Implementation Guardrails

- The shell must be useful and inspectable, not a marketing landing page. First screen is the app shell with navigation, not a hero page.
- Keep all assets local. Do not add external analytics, telemetry, third-party scripts, remote stylesheets, or remote image/font URLs.
- Do not implement CSV import, Accounts CRUD, API health, persistence, Docker Compose, sample data, charts, replay, contributor ranking, or data deletion in this story.
- Do not store financial data in browser state or local storage in this story. No financial data exists yet.
- If the shadcn CLI adds demo components, remove unused demo UI that distracts from the Shortfall Investigator shell.

### Project Context Reference

No `project-context.md` file exists in the repository at story creation time.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- 2026-06-16T17:09:01+08:00 - Started Story 1.1 implementation from baseline commit `dfd5e3e28f2b7ba08d74c6fbbaad2612eac9be4d`.
- 2026-06-16T17:18:14+08:00 - shadcn CLI generated the monorepo in a nested `my-capstone/` directory; copied source/config into the repo root and removed the duplicate nested scaffold after validation.
- 2026-06-16T17:35:49+08:00 - Initial test run exposed missing cleanup between renders; added Testing Library cleanup and reran tests successfully.
- 2026-06-16T17:41:58+08:00 - Final validation passed: `pnpm test`, `pnpm typecheck`, `pnpm lint`, and `pnpm build`.
- 2026-06-16T17:43:51+08:00 - Started local dev server at `http://127.0.0.1:5173/`.

### Completion Notes List

- Story created by BMad create-story workflow.
- Ultimate context engine analysis completed - comprehensive developer guide created.
- Initialized the shadcn Vite pnpm monorepo at the repository root with `apps/web` and `packages/ui`.
- Replaced starter demo content with the Shortfall Investigator shell, semantic landmarks, skip link, primary navigation, active navigation state, and calm analytical visual style.
- Added a minimal shared `Button` primitive in `packages/ui` for the shell while keeping product composition in `apps/web`.
- Added focused Vitest/Testing Library coverage for required navigation labels, landmarks, skip link, and active navigation state.
- Documented development and validation commands in `README.md`, including the `npx pnpm@10.33.4` command form required on this Windows environment.
- Confirmed no API routes, database schemas, Docker behavior, sample data, imports, charts, Replay, or financial calculations were implemented in this story.

### Change Log

- 2026-06-16: Implemented Story 1.1 local web workspace and app shell; status moved to review after tests, typecheck, lint, and build passed.

### File List

- `_bmad-output/implementation-artifacts/1-1-initialize-local-web-workspace.md`
- `.gitignore`
- `.npmrc`
- `.prettierignore`
- `.prettierrc`
- `README.md`
- `package.json`
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`
- `tsconfig.json`
- `turbo.json`
- `apps/web/components.json`
- `apps/web/eslint.config.js`
- `apps/web/index.html`
- `apps/web/package.json`
- `apps/web/tsconfig.app.json`
- `apps/web/tsconfig.json`
- `apps/web/tsconfig.node.json`
- `apps/web/vite.config.ts`
- `apps/web/src/App.test.tsx`
- `apps/web/src/App.tsx`
- `apps/web/src/main.tsx`
- `apps/web/src/components/.gitkeep`
- `apps/web/src/components/theme-provider.tsx`
- `packages/ui/components.json`
- `packages/ui/eslint.config.js`
- `packages/ui/package.json`
- `packages/ui/tsconfig.json`
- `packages/ui/tsconfig.lint.json`
- `packages/ui/src/components/.gitkeep`
- `packages/ui/src/components/button.tsx`
- `packages/ui/src/hooks/.gitkeep`
- `packages/ui/src/lib/.gitkeep`
- `packages/ui/src/styles/globals.css`

# Shortfall Investigator

Local-first financial investigation workspace for the Shortfall Investigator
capstone project.

## Current Story Scope

Story 1.4 adds the local-only runtime boundary on top of the persistence
foundation: loopback defaults, fixed local request-token enforcement for
state-changing API calls, local CORS origins, baseline security headers,
readiness checks, and static checks against remote runtime assets. It
intentionally does not implement Accounts, Transactions, imports, charts, Replay,
Sample Data load/reset, or financial calculations. Those capabilities are owned
by later stories.

The starter was initialized with:

```powershell
& 'C:\Program Files\nodejs\npx.cmd' --yes pnpm@latest dlx shadcn@latest init --template vite --base radix --preset nova --monorepo --name my-capstone
```

Because this Windows environment does not expose a global `pnpm` shim, commands
can be run through `npx pnpm@10.33.4`.

## Development

Install dependencies:

```powershell
& 'C:\Program Files\nodejs\npx.cmd' --yes pnpm@10.33.4 install
```

Start the web app:

```powershell
& 'C:\Program Files\nodejs\npx.cmd' --yes pnpm@10.33.4 dev --filter web
```

Start the API:

```powershell
& 'C:\Program Files\nodejs\npx.cmd' --yes pnpm@10.33.4 dev --filter api
```

Start both app workspaces:

```powershell
& 'C:\Program Files\nodejs\npx.cmd' --yes pnpm@10.33.4 dev
```

The API health endpoint is available at `http://127.0.0.1:4000/health`, and
dependency readiness is available at `http://127.0.0.1:4000/ready`. During web
development, Vite proxies local API requests to `127.0.0.1`.

## Local Runtime Boundary

Copy `.env.example` to `.env` and replace `LOCAL_REQUEST_TOKEN` with a local
development value before testing state-changing requests. Do not commit a real
token.

The supported development origins are:

- Web: `http://127.0.0.1:5173` or `http://localhost:5173`
- API: `http://127.0.0.1:4000`
- PostgreSQL for host migration/test tooling: `127.0.0.1:5432`

State-changing API requests (`POST`, `PUT`, `PATCH`, `DELETE`) must include:

```text
x-local-request-token: <LOCAL_REQUEST_TOKEN>
```

Do not bind the API, web app, or PostgreSQL to LAN or public interfaces. This
project is designed for a single-user local runtime and does not include login,
cloud security controls, telemetry, or public hosting hardening. See
[`docs/local-security.md`](docs/local-security.md) for the boundary rules.

## Local Persistence

Copy local environment defaults and adjust only if needed:

```powershell
Copy-Item .env.example .env
```

Start the local PostgreSQL service:

```powershell
docker compose up -d postgres
```

PostgreSQL uses the `shortfall-postgres-18-data` named volume. The Compose service
binds PostgreSQL to `127.0.0.1:5432` only, so it is reachable by local dev tools
without exposing the database as a public host service.

Run migrations:

```powershell
& 'C:\Program Files\nodejs\npx.cmd' --yes pnpm@10.33.4 --filter @workspace/database migrate
```

The current sample investigation is available through
`GET /api/v1/investigations/current-sample` after the API can reach the local
database.

## Validation

```powershell
& 'C:\Program Files\nodejs\npx.cmd' --yes pnpm@10.33.4 typecheck
& 'C:\Program Files\nodejs\npx.cmd' --yes pnpm@10.33.4 lint
& 'C:\Program Files\nodejs\npx.cmd' --yes pnpm@10.33.4 test
& 'C:\Program Files\nodejs\npx.cmd' --yes pnpm@10.33.4 build
```

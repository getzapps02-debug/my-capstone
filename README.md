# Shortfall Investigator

Local-first financial investigation workspace for the Shortfall Investigator
capstone project.

## Current Story Scope

Story 1.3 adds the local persistence foundation: a PostgreSQL service for Docker
Compose, a Drizzle-backed `packages/database` workspace, a minimal persisted
sample investigation record, and a typed API/client/web display path. It
intentionally does not implement Accounts, Transactions, imports, charts, Replay,
local-only request token enforcement, or financial calculations. Those
capabilities are owned by later stories.

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

The API health endpoint is available at `http://127.0.0.1:4000/health`. During
web development, Vite proxies `/health` to the local API.

## Local Persistence

Copy local environment defaults and adjust only if needed:

```powershell
Copy-Item .env.example .env
```

Start the local PostgreSQL service:

```powershell
docker compose up -d postgres
```

PostgreSQL uses the `shortfall-postgres-data` named volume. The Compose service
binds PostgreSQL to `127.0.0.1:5432` only, so it is reachable by local dev tools
without exposing the database as a public host service. Application containers
can also reach it through the internal Compose network using the `postgres`
hostname.

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

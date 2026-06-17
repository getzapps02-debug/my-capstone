# Local Security Boundary

Shortfall Investigator is a single-user local application. It is not designed
for LAN, public internet, shared-host, or cloud exposure.

## Supported Local Services

- Web development server: `http://127.0.0.1:5173` or `http://localhost:5173`
- API: `http://127.0.0.1:4000`
- PostgreSQL for local migration/test tooling: `127.0.0.1:5432`

Do not replace these defaults with `0.0.0.0`, LAN IP addresses, public
hostnames, or wildcard CORS origins.

## State-Changing Requests

State-changing API requests require the configured local request token:

```text
x-local-request-token: <LOCAL_REQUEST_TOKEN>
```

The token is a local guardrail, not user authentication. Keep the value in the
ignored `.env` file and never commit a real token.

## Runtime Asset Rules

Runtime app code must not load remote fonts, scripts, styles, analytics,
telemetry, or third-party financial-data services. Static checks cover the web
runtime source and Vite configuration.

Documentation may link to external references, but those links must not become
runtime dependencies.

## Local Data

PostgreSQL stores local application data in a named Docker volume. The current
development Compose file publishes PostgreSQL only on `127.0.0.1` so host
migration and integration test tooling can connect without exposing the database
on public host interfaces.

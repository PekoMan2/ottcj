# Majo · Od Tatier k Dunaju

A pledge-first charity run website for Zachráňme Vilyho. The React application
is served by Nginx, which forwards API requests to a NestJS backend connected
to PostgreSQL.

## Product documentation

- [Product specification](docs/product-spec.md)
- [Design system](docs/design-system.md)
- [Seven-milestone implementation plan](docs/implementation-plan.md)
- [Content and external inputs needed](docs/content-needed.md)
- [LiveTrack and lifecycle operations](docs/live-operations.md)

The authoritative product inputs are `majootkd_design_brief_v2.docx` and
`majootkd_skicar_max_chaos_v5.html`. See `AGENTS.md` for their exact authority
and contributor rules.

## Project structure

```text
.
├── fe/               React, TypeScript, Vite, Tailwind CSS, and Nginx
├── be/               NestJS, TypeORM, Swagger, and PostgreSQL driver
├── compose.yaml      Application stack
├── .env.example      Committed configuration template
├── .env              Local configuration (ignored by Git)
└── package.json      Docker Compose convenience commands
```

The frontend and backend are independent npm projects. Each has its own
`package.json` and `package-lock.json`; there are no npm workspaces or root
dependencies.

## Requirements

- Docker Engine with Docker Compose
- npm and Node.js 24 only when running package checks outside Docker

## Setup

Create the local environment file:

```bash
cp .env.example .env
```

The committed defaults are suitable for local development. Change
`DB_PASSWORD` and `TRACKING_SECRET` to strong random values before deploying
the application anywhere public.

Start the complete stack:

```bash
docker compose up --build
```

The equivalent root npm command is `npm run dev`. To build and start in the
background, run `npm run up`.

## URLs

- Website: <http://localhost:8080>
- API health: <http://localhost:8080/api/health>
- Swagger: <http://localhost:8080/api/docs>
- Nginx health: <http://localhost:8080/health>

Change the host port through `APP_PORT` in `.env` when port 8080 is already in
use.

The public lifecycle state is read from `/api/event-state`; switching between
`pre`, `live`, and `post` does not require rebuilding the frontend. Live-start
registrations are disabled by default and must not be enabled until the
approved consent, retention settings, encryption key, Garmin device and tested
recipient limits are configured as described in the operations runbook.

## Traffic flow

The browser only connects to the frontend container. Nginx serves the React
build and proxies relative `/api/*` requests to `be:3000`; the backend connects
to PostgreSQL at `db:5432`.

```text
Browser -> fe:80 -> /api/* -> be:3000 -> db:5432
```

Nginx also falls back to `index.html` for non-file routes so React Router pages
can be opened or refreshed directly.

## Operations

Inspect service status and follow logs:

```bash
npm run ps
npm run logs
```

Stop the stack while preserving PostgreSQL data:

```bash
npm run down
```

Rebuild and recreate the services:

```bash
npm run rebuild
```

Reset the local stack:

```bash
npm run reset
```

**Warning:** `npm run reset` permanently deletes the named PostgreSQL volume
and all data stored in it.

## Database schema

`DB_SYNCHRONIZE=true` lets TypeORM synchronize the initial empty schema and is
acceptable while this project has no important data. Replace synchronization
with committed database migrations and set `DB_SYNCHRONIZE=false` before
storing important production data.

PostgreSQL is also published through `DB_EXPOSED_PORT` for optional local
debugging. Normal browser access only requires the frontend URL.

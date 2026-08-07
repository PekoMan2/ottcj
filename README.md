# Majo · Od Tatier k Dunaju

A charity run website for Zachráňme Vilyho. The site is fully static: a React
application built by Vite and served by Nginx. There is no backend and no
database; donations link out to Donio and run-start notifications are
collected through a Google Form.

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
├── compose.yaml      Frontend service
├── .env              Compose configuration (committed, no secrets)
└── package.json      Docker Compose convenience commands
```

## Requirements

- Docker Engine with Docker Compose
- npm and Node.js 24 only when running package checks outside Docker

## Setup

Start the site:

```bash
docker compose up --build
```

The equivalent root npm command is `npm run dev`. To build and start in the
background, run `npm run up`.

## URLs

- Website: <http://localhost:8080>
- Nginx health: <http://localhost:8080/health>

Change the host port through `APP_PORT` in `.env` when port 8080 is already in
use.

## Run lifecycle configuration

The public lifecycle state (`pre`, `live`, `post`), the start time, the Garmin
LiveTrack link and the final result are all baked into the bundle at build
time from `VITE_*` variables. Vite loads them by mode: `npm run dev` reads
`fe/.env.development` and `npm run build` reads `fe/.env.production`,
including inside the Docker build. Both files are committed; no value in them
is secret. See [docs/live-operations.md](docs/live-operations.md) for the
race-day flow. Changing any of them requires a rebuild (`npm run rebuild`).

None of the variables are secrets; every value is publicly visible in the
built JavaScript bundle.

## Operations

Inspect service status and follow logs:

```bash
npm run ps
npm run logs
```

Stop the stack:

```bash
npm run down
```

Rebuild and recreate after changing `VITE_*` values or content:

```bash
npm run rebuild
```

# Start with pnpm

## Prereqs
- Node.js 20+
- pnpm 9+
- Docker (for local Postgres)

## Install dependencies
```bash
pnpm i
```

## Start database
```bash
docker compose up -d db
```

## Configure env
```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

## Migrate + seed
```bash
pnpm -C apps/api db:migrate
pnpm -C apps/api db:seed
```

## Run dev
```bash
pnpm dev
```

Web: http://localhost:3000
API: http://localhost:4000

## Stop dev servers
- Press `Ctrl+C` in each terminal running `pnpm dev`.

## Demo logins (seeded)
- Admin: admin@example.com / password123
- Creator: provider@example.com / password123
- User: customer@example.com / password123

## Optional: production build
```bash
pnpm -C apps/web build
pnpm -C apps/web start
```

## Optional: Docker
```bash
docker compose up -d
```

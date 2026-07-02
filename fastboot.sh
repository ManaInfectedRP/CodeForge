#!/usr/bin/env bash
# CodeForge Academy — one-command boot.
# Usage: ./fastboot.sh [--fresh]
#   --fresh   wipe and recreate the database before starting
set -euo pipefail
cd "$(dirname "$0")"

FRESH=0
for arg in "$@"; do
  case "$arg" in
    --fresh) FRESH=1 ;;
    *) echo "Unknown option: $arg" >&2; exit 1 ;;
  esac
done

step() { printf '\n\033[1;34m▸ %s\033[0m\n' "$1"; }

if curl -sf http://localhost:4000/api/health >/dev/null 2>&1; then
  echo "CodeForge is already running on http://localhost:4000 — stop it before rebooting." >&2
  exit 1
fi

step "Checking dependencies"
if [ ! -d node_modules ]; then
  npm install
else
  echo "node_modules present — skipping npm install"
fi

step "Checking environment"
if [ ! -f apps/api/.env ]; then
  cp apps/api/.env.example apps/api/.env
  echo "Created apps/api/.env from .env.example — edit DATABASE_URL if your Postgres credentials differ"
else
  echo "apps/api/.env present"
fi

step "Preparing database"
if [ "$FRESH" = 1 ]; then
  npx -w apps/api prisma migrate reset --force --skip-seed
fi
if [ -d apps/api/prisma/migrations ] && [ -n "$(ls -A apps/api/prisma/migrations 2>/dev/null)" ]; then
  npx -w apps/api prisma migrate deploy
else
  # first boot: create the initial migration
  npx -w apps/api prisma migrate dev --name init --skip-seed
fi
# On Windows, a running dev server locks the query-engine DLL and generate
# fails with EPERM — fall back to the already-generated client in that case.
if ! npx -w apps/api prisma generate; then
  if [ -d node_modules/.prisma/client ]; then
    echo "warn: prisma generate failed (engine DLL likely locked by a running server) — using existing client"
  else
    echo "error: prisma generate failed and no client exists" >&2
    exit 1
  fi
fi

step "Seeding (idempotent)"
npm run db:seed -w apps/api

step "Starting CodeForge Academy"
echo "API:  http://localhost:4000"
echo "Web:  http://localhost:5173"
npm run dev

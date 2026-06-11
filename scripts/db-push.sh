#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ -f .env.local ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env.local
  set +a
fi

if [[ -z "${SUPABASE_DB_PASSWORD:-}" ]]; then
  echo "Missing SUPABASE_DB_PASSWORD in .env.local" >&2
  exit 1
fi

supabase db push \
  --db-url "postgresql://postgres:${SUPABASE_DB_PASSWORD}@db.irurgflxcmuiwripqpdp.supabase.co:5432/postgres" \
  --yes

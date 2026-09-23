#!/usr/bin/env bash
# Naivolabs — release script.
#
# Run on the server, from deploy/:
#   ./deploy.sh             # build + roll out the tag in .env
#   ./deploy.sh --no-cache  # force a clean rebuild
#
# What it guarantees
# ------------------
#   1. migrations run to completion BEFORE the new CMS takes traffic
#      (compose gates `cms` on `cms-migrate` exiting 0)
#   2. the rollout is only reported successful once the site answers /healthz
#      and the CMS answers /api/access through the proxy
#   3. the previous image tag stays on disk, so a rollback is one command
#   4. a database dump is taken first — a release that needs reverting should
#      never be a data-loss event

set -euo pipefail

cd "$(dirname "$0")"

CACHE_FLAG=""
if [ "${1:-}" = "--no-cache" ]; then
  CACHE_FLAG="--no-cache"
fi

if [ ! -f .env ]; then
  echo "No deploy/.env found. Copy .env.production.example and fill it in." >&2
  exit 1
fi

# shellcheck disable=SC1091
set -a && . ./.env && set +a

SITE_URL="https://${SITE_DOMAIN}/healthz"
CMS_URL="https://${CMS_DOMAIN}/api/access"

# A dump before every release, but only when there is something to dump: on the
# very first deploy the stack is not running yet, and `exec` would abort the
# release under `set -e`.
if [ -n "$(docker compose --env-file .env ps -q backup 2>/dev/null)" ]; then
  echo "==> Pre-release database backup"
  docker compose --env-file .env exec -T backup /usr/local/bin/backup.sh
else
  echo "==> No running stack yet — skipping the pre-release backup (first deploy)"
fi

echo "==> Building images (tag ${IMAGE_TAG:-latest})"
docker compose --env-file .env build ${CACHE_FLAG}

echo "==> Starting stack"
docker compose --env-file .env up -d --remove-orphans

echo "==> Waiting for the site to report healthy"
for i in $(seq 1 30); do
  if curl -fsS --max-time 5 "$SITE_URL" > /dev/null 2>&1; then
    echo "    site OK (${i}s)"
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "    site did NOT become healthy — check: docker compose logs site caddy" >&2
    exit 1
  fi
  sleep 1
done

echo "==> Waiting for the CMS to report healthy"
for i in $(seq 1 40); do
  if curl -fsS --max-time 5 "$CMS_URL" > /dev/null 2>&1; then
    echo "    cms OK (${i}s)"
    break
  fi
  if [ "$i" -eq 40 ]; then
    echo "    cms did NOT become healthy — check: docker compose logs cms cms-migrate" >&2
    exit 1
  fi
  sleep 1
done

echo
echo "Release ${IMAGE_TAG:-latest} is live."
echo "  site : https://${SITE_DOMAIN}"
echo "  admin: https://${CMS_DOMAIN}/admin"
echo
echo "Rollback: set IMAGE_TAG in .env to the previous tag and run"
echo "  docker compose --env-file .env up -d"
echo "Remaining images:"
docker images --format '  {{.Repository}}:{{.Tag}}  {{.CreatedSince}}' | grep naivolabs || true

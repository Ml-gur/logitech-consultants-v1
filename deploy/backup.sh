#!/bin/sh
# Naivolabs — database backup.
#
# Runs inside the `backup` compose service (see docker-compose.yml), which has
# PGHOST/PGUSER/PGPASSWORD/PGDATABASE set and /backups mounted.
#
# Can also be run by hand:
#   docker compose exec db pg_dump -U naivolabs naivolabs | gzip > naivolabs.sql.gz
#
# What it does
# ------------
#   1. pg_dump (custom format, compressed) to /backups with a timestamped name
#   2. verifies the dump is readable (pg_restore --list) — an unverifiable
#      backup is not a backup
#   3. prunes dumps older than BACKUP_KEEP_DAYS
#   4. optionally uploads off-box if OFFSITE_CMD is set
#
# OFF-BOX IS NOT OPTIONAL IN PRACTICE
# -----------------------------------
# A dump on the same disk as the database does not survive disk failure. Set one
# of these in .env and the script will use it:
#
#   Hetzner Storage Box (recommended, included with a Hetzner account):
#     OFFSITE_CMD='scp -P 23 $FILE u12345@u12345.your-storagebox.de:naivolabs/'
#     (requires an SSH key mounted into this container)
#
#   Any S3-compatible bucket:
#     OFFSITE_CMD='aws s3 cp $FILE s3://naivolabs-backups/ --endpoint-url $S3_ENDPOINT'

set -eu

STAMP=$(date -u +%Y%m%dT%H%M%SZ)
FILE="/backups/naivolabs-${STAMP}.dump"
KEEP_DAYS="${BACKUP_KEEP_DAYS:-14}"

echo "[backup] $(date -u +%FT%TZ) starting pg_dump -> ${FILE}"
pg_dump --format=custom --no-owner --no-privileges --file="${FILE}"

# Verify before we trust it.
if pg_restore --list "${FILE}" > /dev/null 2>&1; then
  SIZE=$(du -h "${FILE}" | cut -f1)
  echo "[backup] verified ${FILE} (${SIZE})"
else
  echo "[backup] FAILED verification for ${FILE} — keeping it for inspection" >&2
  exit 1
fi

# Off-box copy.
if [ -n "${OFFSITE_CMD:-}" ]; then
  echo "[backup] uploading off-box"
  # shellcheck disable=SC2086
  sh -c "$(echo "${OFFSITE_CMD}" | sed "s#\\\$FILE#${FILE}#g")"
else
  echo "[backup] WARNING: OFFSITE_CMD is not set — this dump only exists on this server" >&2
fi

# Prune.
echo "[backup] pruning dumps older than ${KEEP_DAYS} days"
find /backups -name 'naivolabs-*.dump' -type f -mtime "+${KEEP_DAYS}" -print -delete

echo "[backup] done"

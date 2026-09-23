# Deployment — Hetzner

Production runbook for `naivolabs.com`. The reasoning behind these choices is in
[`docs/research/hetzner-deployment.md`](../docs/research/hetzner-deployment.md).

```
Internet
   │
   ▼
Caddy  (443/80, automatic TLS, HTTP/3)        ← only public-facing service
   ├── naivolabs.com        → site (nginx, :8080)   static Vite build
   └── cms.naivolabs.com    → cms  (Next.js, :3000) Payload admin + REST API
                                    │
                                    └── db (PostgreSQL 16)   internal network only
```

Everything lives in one `docker compose` stack on one server.

---

## 1. Provision the server

Create a Hetzner Cloud server:

- **Image**: Ubuntu 24.04
- **Type**: CAX21-class (4 vCPU Arm / 8 GB) for production. The whole stack is
  multi-arch; see the research doc for the x86 alternative.
- **Networking**: attach a public IPv4 (and IPv6 if you want it in DNS).
- **Cloud config**: paste [`cloud-init.yaml`](./cloud-init.yaml) — replace the
  placeholder SSH key first. It creates the `deploy` user, disables password and
  root SSH, sets up `ufw` + `fail2ban` + unattended upgrades, installs Docker,
  and configures Docker log rotation.
- **Firewall** (Hetzner console): inbound TCP `22`, `80`, `443` and UDP `443`
  only. Delete the default "allow all".

## 2. Point DNS at it

| Record | Name | Value |
|---|---|---|
| A | `naivolabs.com` | server IPv4 |
| A | `cms.naivolabs.com` | server IPv4 |
| AAAA | both (optional) | server IPv6 |
| CAA | `naivolabs.com` | `0 issue "letsencrypt.org"` |

Caddy requests certificates on first request. **DNS must resolve before the
first `up`**, or certificate issuance fails and you will be waiting on retries.

## 3. Ship the code

```bash
# from the repository root, on your machine
rsync -avz --delete \
  --exclude node_modules --exclude .git --exclude dist \
  --exclude cms/node_modules --exclude cms/.next --exclude cms/cms.db \
  ./ deploy@naivolabs.com:/srv/naivolabs/
```

## 4. Configure secrets

```bash
ssh deploy@naivolabs.com
cd /srv/naivolabs/deploy
cp .env.production.example .env
chmod 600 .env

# Generate the two secrets and paste them in:
openssl rand -base64 48   # → PAYLOAD_SECRET
openssl rand -hex 24      # → POSTGRES_PASSWORD
# DATABASE_URL must use the SAME password (host is the service name `db`).

$EDITOR .env
```

Set `OFFSITE_CMD` too — the built-in `backup` service writes dumps to a volume
on the same server, which does not survive losing the server. See
[`backup.sh`](./backup.sh) for the Storage Box / S3 forms.

## 5. Release

```bash
cd /srv/naivolabs/deploy
./deploy.sh
```

That script: takes a pre-release dump → builds images → starts the stack →
waits for `/healthz` on the site and `/api/access` on the CMS. It fails loudly
if either does not come up.

Ordering is enforced by compose: `cms` will not start until `cms-migrate` exits
successfully, and `cms-migrate` will not start until Postgres is healthy.

## 6. First-run: create the admin user

Run once, after the stack is healthy:

```bash
cd /srv/naivolabs/deploy
docker compose --env-file .env run --rm cms npm run seed
```

This imports the bundled deployment patterns, blog posts, FAQs and contact
details into the database, and creates the first admin user from
`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`.

Then:

1. sign in at `https://cms.naivolabs.com/admin`
2. **change the password immediately**
3. delete `SEED_ADMIN_PASSWORD` from `.env` (and from your shell history)

Re-running `npm run seed` is idempotent — it updates by slug rather than
duplicating.

---

## Recurring operations

### Deploy a new release

```bash
# on your machine
rsync -avz --delete --exclude node_modules --exclude .git --exclude dist \
  --exclude cms/node_modules --exclude cms/.next --exclude cms/cms.db \
  ./ deploy@naivolabs.com:/srv/naivolabs/

# on the server
cd /srv/naivolabs/deploy
# bump IMAGE_TAG in .env so this release is identifiable (and revertible)
sed -i "s/^IMAGE_TAG=.*/IMAGE_TAG=$(date +%Y.%m.%d-%H%M)/" .env
./deploy.sh
```

### Roll back

```bash
cd /srv/naivolabs/deploy
sed -i 's/^IMAGE_TAG=.*/IMAGE_TAG=<previous-tag>/' .env
docker compose --env-file .env up -d
```

Available tags: `docker images | grep naivolabs`. This reverts **application
code only** — migrations are forward-only. If a release changed the schema,
restore the pre-release dump instead (see below) and expect to lose the writes
made since.

### Restore from a dump

```bash
cd /srv/naivolabs/deploy
docker compose --env-file .env exec -T db \
  pg_restore --clean --if-exists --no-owner -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
  < /path/to/naivolabs-<stamp>.dump
```

### Migrations

Schema changes come from `cms/src/migrations/`. After changing a collection:

```bash
cd cms
npm run payload -- migrate:create   # generates a dated migration file — COMMIT IT
```

Never edit a migration that has already run in production. `deploy.sh` applies
pending migrations automatically on the next release.

### Logs

```bash
cd /srv/naivolabs/deploy
docker compose --env-file .env logs -f --tail=100 site cms
docker compose --env-file .env logs -f caddy        # access logs are JSON
```

### Backups

| Layer | When | Where |
|---|---|---|
| `pg_dump` inside the `backup` service | 02:15 daily | `backups` volume |
| `naivolabs-backup.timer` | 03:00 daily | Storage Box / S3 (`OFFSITE_CMD`) |
| Caddy certificates | — | `caddy_data` volume (back this up once) |

Verify restores quarterly. An untested backup is a belief, not a control.

---

## Local verification before you ship

The same images run locally, which is the point of containerising this:

```bash
cd deploy
cp .env.production.example .env
# For a local run, point the domains at localhost and skip TLS:
#   SITE_DOMAIN=localhost  CMS_DOMAIN=cms.localhost
docker compose --env-file .env up -d --build
curl -fsS http://localhost/healthz
```

---

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| Caddy logs `tls: no certificate` | DNS not resolving, or port 80/443 blocked |
| `cms` keeps restarting | `cms-migrate` failed — `docker compose logs cms-migrate` |
| Contact form 500s | `CORS_ORIGINS` does not include the exact site origin (scheme + host, no trailing slash) |
| Site shows old content after a CMS edit | `VITE_CMS_URL` was empty at **build** time — it is inlined by Vite, so a rebuild is required |
| Blog/FAQ content falls back to bundled copy and the contact form fails | the site's CSP (`deploy/nginx-security-headers.conf`) `connect-src` does not list your `CMS_DOMAIN` |
| Disk filling up | `docker system prune` (old images), or check the `pg_data` volume |

## Cost outline

One CAX21-class instance plus a Storage Box for off-box backups is the whole
bill. Confirm current pricing in the Hetzner console — the April 2026 increase
moved things, and instance sizes change with hardware generations.

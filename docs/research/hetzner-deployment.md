# Deployment research — Hetzner (September 2026)

Prepared for the Naivolabs production launch. Scope: how to run the marketing
site, the Payload CMS and PostgreSQL on a single Hetzner Cloud server, with a
path to scale out later.

## 1. Why a single node is the right starting point

The workload is two containers with very different profiles:

| Component | Profile | Steady-state footprint |
|---|---|---|
| `site` (nginx serving a ~500 KB static build) | Tiny, bursty | < 64 MB RAM |
| `cms` (Payload 3 / Next.js) | Moderate, spiky admin usage | 250–450 MB RAM |
| `db` (PostgreSQL 16) | Small | 100–250 MB RAM |

That fits comfortably on one shared-vCPU instance. A managed database and a
separate app host would roughly triple the monthly cost to solve a problem the
project does not have yet (no HA requirement, no horizontal scaling need).

**Instance choice.** Hetzner's cloud line now splits into x86 shared vCPU
(`CX` Gen3, `CPX` Gen2) and Arm shared vCPU (`CAX`, Ampere Altra). Arm is the
cheapest and is fine here because everything in this stack is containerised and
every base image used (`node:22-alpine`, `nginx:alpine`, `postgres:16-alpine`,
`caddy:2-alpine`) is published for `linux/arm64`. See
[Hetzner Cloud](https://www.hetzner.com/cloud/) and the
[CAX benchmark write-up](https://betterstack.com/community/guides/web-servers/hetzner-cloud-review/).

Recommendation: **CAX21-class (4 vCPU / 8 GB) for production**, or a
CX32/CPX31-class x86 instance if you want a single architecture across dev and
prod. Prices changed in April 2026 — check the console rather than trusting a
figure in a document.

> Careful with the *cost-optimized* tier (CX/CAX family): Hetzner documents it
> as intended for development and variable workloads, not sustained high load.
> For production traffic prefer the regular-performance line even though it
> costs a little more.

## 2. Reverse proxy: Caddy over nginx

Both work. Caddy was chosen because certificate management is the single most
common self-hosting failure mode, and Caddy removes it:

- certificates are issued on first request and renewed automatically
- HTTP/3 and zstd/gzip compression are on by default
- the config is ~30 lines and readable by whoever inherits the server

nginx + certbot needs a renewal timer, a `--deploy-hook` to reload, and a
monitor to catch silent renewal failures. That is three things to get wrong for
no benefit at this scale. The site container still runs nginx internally (it is
the natural static file server), so nothing is lost.

## 3. Hardening

The pieces that matter, all applied in `deploy/cloud-init.yaml`:

1. **Two firewalls.** Hetzner's cloud firewall is configured in the console;
   `ufw` is configured on the host. If someone mis-clicks in the console, the
   host firewall still blocks the database port.
2. **No published database port.** `db` sits on a Docker network declared
   `internal: true` — it has no route to the internet and no host port mapping.
3. **Non-root containers.** The site image runs as the `nginx` user on port
   8080 and the CMS as the `node` user. Neither needs a privileged port.
4. **Key-only SSH**, root login disabled, `MaxAuthTries 3`.
5. **Unattended security upgrades** plus `fail2ban`.
6. **Docker log rotation.** The default `json-file` driver is unbounded;
   unbounded logs are a classic way to lose a server. Capped at 20 MB × 5.
7. **`live-restore: true`** so containers survive a Docker daemon restart.

## 4. Data safety

A dump stored on the same disk as the database is not a backup. The stack has
two layers:

1. `backup` service: nightly `pg_dump --format=custom` at 02:15, **verified**
   with `pg_restore --list` (an unverified dump is not a backup), pruned after
   `BACKUP_KEEP_DAYS`.
2. `naivolabs-backup.timer`: 03:00, copies the dumps off-box via
   `OFFSITE_CMD`. Recommended destination is a **Hetzner Storage Box**, which
   is included in the account and supports SSH/SFTP/rsync; S3-compatible
   object storage also works.

Prompted by [the QuestDB Hetzner guide](https://questdb.com/docs/deployment/hetzner/),
which documents the same pattern: Postgres data on a separate volume plus
scheduled verified dumps.

`caddy_data` also deserves a backup — it holds the issued certificates.
Re-issuing is possible but hits Let's Encrypt rate limits if it is done
repeatedly.

## 5. Deploy and rollback

`deploy/deploy.sh` does the release in an order that cannot produce a
half-migrated database:

```
backup → build → up -d
   └─ cms-migrate (one-shot) → exits 0 → cms starts → health checks
```

Compose enforces the ordering with
`depends_on: cms-migrate: condition: service_completed_successfully`. This
matters because Payload does **not** create tables on its own in production —
the schema comes from the migration files in `cms/src/migrations/`.

Rollback is a tag change: images are tagged per release (`IMAGE_TAG`), so
`IMAGE_TAG=<previous> docker compose up -d` restores the prior build. Database
changes are not rolled back automatically, which is why a dump is taken before
every release.

## 6. What this deliberately does not include

Honest list, so nobody assumes these exist:

- **No HA.** One server, one database, no failover. An outage is an outage
  until the box is back. Acceptable pre-scale; revisit with the first enterprise
  client that requires an SLA.
- **No managed database.** Neon/managed Postgres would remove the backup
  burden at a higher monthly cost. Reasonable alternative if the team would
  rather not own it.
- **No CDN.** Caddy serves from Nairobi-adjacent Hetzner regions (Falkenstein,
  Nuremberg, Helsinki, Ashburn, Singapore). For a Nairobi-primary audience,
  latency from EU regions is real but acceptable for a static site; adding
  Cloudflare in front is the cheapest fix if it becomes a complaint.
- **No WAF or bot filtering.** Cloudflare (or Caddy's rate-limit plugin) is
  the follow-up if the contact form starts attracting abuse.
- **No secret manager.** Secrets live in `deploy/.env` (mode 600). Fine for a
  small team; move to SOPS/age or Hetzner's secrets story before the team grows.

## 7. Sources

- Hetzner Cloud product/pricing and instance families — <https://www.hetzner.com/cloud/>
- Hetzner cost-optimized plans (and the "development/testing" caveat) — <https://www.hetzner.com/cloud/cost-optimized/>
- Independent CAX/CX/CPX benchmark and review — <https://betterstack.com/community/guides/web-servers/hetzner-cloud-review/>
- Cloud pricing changes in 2026 — <https://northflank.com/blog/hetzner-cloud-server-price-increases>
- Hetzner deployment pattern with Postgres on a volume + backups — <https://questdb.com/docs/deployment/hetzner/>
- Community consensus that Caddy is the low-friction TLS option on Hetzner — <https://www.reddit.com/r/hetzner/comments/1c2rrs4/basic_vps_setup_with_docker_and_nginx_on_hetzner/>
- Docker Compose in production: when it is the right call (deploys, backups,
  health checks, rollback path) — <https://news.ycombinator.com/item?id=47962032>

# Loop Run Log — YOUR_PROJECT

Append one entry per run. Prune entries older than 30 days.

## Format

```json
{
  "run_id": "2026-06-09T08:15:00Z",
  "pattern": "daily-triage",
  "duration_s": 45,
  "items_found": 4,
  "actions_taken": 1,
  "escalations": 0,
  "tokens_estimate": 52000,
  "outcome": "report-only | fix-proposed | escalated | no-op"
}
```

## Recent Runs

```json
{
  "run_id": "2026-08-04T00:00:00Z",
  "pattern": "fidelity-gaps (manual continue)",
  "duration_s": 120,
  "items_found": 3,
  "actions_taken": 1,
  "escalations": 0,
  "tokens_estimate": 15000,
  "outcome": "fix-proposed"
}
```

```json
{
  "run_id": "2026-08-05T17:45:00Z",
  "pattern": "fidelity-gaps (manual continue)",
  "duration_s": 3600,
  "items_found": 1,
  "actions_taken": 1,
  "escalations": 0,
  "tokens_estimate": 40000,
  "outcome": "fix-proposed"
}
```

```json
{
  "run_id": "2026-08-05T19:00:00Z",
  "pattern": "fidelity-gaps (manual continue) — CMS build",
  "duration_s": 5400,
  "items_found": 1,
  "actions_taken": 1,
  "escalations": 0,
  "tokens_estimate": 60000,
  "outcome": "fix-proposed"
}
```

<!-- Loop appends below this line -->
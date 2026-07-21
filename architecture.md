# MCH Studio — Workflow Architecture

Stable structural reference. For current state / next actions, see `STATUS.md`.

## System Overview

MCH Studio is now workflow-first.

The durable source of truth is local files under `studio-runs/`. The app is optional scaffolding and should not become the system unless the file workflow proves that a cockpit is useful.

## Active Loop

```txt
raw idea
  -> studio-runs/inbox.md
  -> production run folder
  -> brief + tasks + assets + script/payload + publish kit + log
  -> published, scheduled, or killed with reason
```

## Repo Layout

```txt
mch-studio/
  studio-runs/
    README.md
    inbox.md
    _templates/production-run/
    library/
    2026-04-workflow-first-mch-studio/
  src/app/(dashboard)/studio/
  src/components/ui/
  src/lib/supabase/
```

## Boundaries

- Not a CRM.
- Not a database-first app.
- Not an autopublishing system.
- Not a draft graveyard.
- Not a Remotion renderer until script/payload files prove useful.

## App Role

`/studio` is currently a signpost. It should remain lightweight until three real production runs show exactly what UI would reduce friction.

## Agent Role

Codex and local agents should work directly inside run folders:

- read `brief.md`
- update `tasks.md`
- draft in `assets/`
- prepare `exports/publish-kit.md`
- record decisions and blockers in `log.md`

The source of truth is files, not browser state.

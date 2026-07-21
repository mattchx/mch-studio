# MCH Studio

Lightweight local creative production system for social, marketing, ads, and practical video ideas. The old review queue/calendar surface has been removed, and the app is optional scaffolding. The source of truth is `studio-runs/`.

Creative bar: MCH Studio exists to produce assets worth publishing, not just drafts that technically exist. For now, a publishable asset is usually a strong organic post or hard-ad variant with a generated image. Real-camera videos may come later as selfie/talking-head recordings or Loom/OBS-style screen recordings.

## 2026 Direction — Simple Local Studio

MCH Studio is the Codex-front-runner project. Use it to build the creative production system for social media, marketing, ads, and short-form video.

Current core workflows:
- raw idea → organic social post
- raw idea → hard-ad style variant
- post variant → generated image through Gemini, ChatGPT/Codex image tools, or another local/manual image flow
- later: raw idea → talking-head/selfie video outline
- later: raw idea → Loom/OBS-style screen-recording outline for LinkedIn, YouTube, or Shorts

Working lanes:
- UI lane: improve the Next.js Studio surface at `/studio`, `/studio/saved`, previews, and the Ads Simulator. This lane should make the local workflow easier to review and operate, not move generation into the app by default.
- Social/ads lane: highest-priority production lane. Turn raw ideas into saved bundles with organic social first, plus a hard-ad style variant when useful. Keep this lane in `studio-runs/posts.json`, generated images, reusable hooks, and manual publish readiness.
- Practical video lane: separate planning lane for selfie/talking-head and Loom/OBS-style scripts or shot lists. Do not make this the default workflow, and do not revive Remotion, AI video, or elaborate motion unless Matt explicitly asks.

Operating model:
- Codex leads bounded implementation inside this project
- Claude Code remains coordinator for vault/business continuity, strategy notes, and cross-project integration
- Prefer reusable, data-driven content schemas over one-off generation flows
- Remotion, AI video generation, and fancy motion systems are shelved unless Matt explicitly revives them
- Keep video practical and organic: real camera, screen recording, or straightforward image-led posts
- Keep strategic source-of-truth notes in the vault, not app code
- Update `STATUS.md` after meaningful work
- When generating Studio post bundles from an idea (slash command `/studio-generate` or equivalent prompt), follow `studio-runs/_skills/studio-generate.md` exactly — that file is the source of truth shared with Codex/Gemini

First product target: a repeatable local workflow where a raw idea becomes a saved post bundle with text variants and generated images.

## Architecture
- **Source of truth:** local files under `studio-runs/`
- **Current app:** optional Next.js signpost at `/studio`
- **Current persistence:** `studio-runs/posts.json` plus generated media under `studio-runs/media/`
- **Current generation:** Codex/local agents append saved post bundles directly
- **AI/API boundary:** the app does NOT call AI APIs directly unless the architecture is intentionally changed and documented
- **Next architecture step:** prove the simple post/image workflow with real ideas before rebuilding app/database features

## Agent CLI (`scripts/cc.sh`) — Legacy/Reserved

The old Supabase content CLI still exists but is not part of the active Studio surface. Use it only if intentionally reviving or migrating old Supabase data. Always use absolute path:
```
/Users/mattch/dev/code/personal/mch-studio/scripts/cc.sh <command>
```

### Commands
```
# Clients
list-clients                          List all clients
get-client <slug>                     Get client by slug
get-profile <client_id>              Get client AI profile
add-client '{...}'                    Add a new client
add-profile '{...}'                   Add client AI profile
update-client <slug> '{...}'          Update client fields

# Content
push-content '{...}'                  Push one content item
push-batch '[{...},...]'              Push multiple content items
list-content [client_id] [status]     List content items

# Jobs
start-job '{...}'                     Log a generation job
complete-job <job_id> <count>         Mark job complete
fail-job <job_id> "message"           Mark job failed

# Images
upload-image <local_path> <storage_path>   Upload to Supabase Storage
```

## Studio Workflow

Active workflow:
- raw idea → saved post bundle in `studio-runs/posts.json`
- saved bundle → organic post + hard-ad variant
- each variant → generated image when useful
- app preview → manual review
- done → ready or published via `scripts/posts.sh`

Chat split:
- Use a UI chat for Studio interface changes and visual polish.
- Use a production chat for social posts, hard-ad variants, generated images, and `posts.json` updates.
- Use a video chat only for practical video concepts, scripts, recording plans, and future short-form repurposing.

## Stack
- Next.js 16, TypeScript, Tailwind 4
- Supabase (auth, DB, storage) — project ref: `toipreojjlkbgktajypd`
- Vercel (deployment) — https://mch-studio.vercel.app

## Key Paths
- `studio-runs/README.md` — Operating protocol
- `studio-runs/inbox.md` — Raw idea capture
- `studio-runs/_templates/production-run/` — Reusable run template
- `studio-runs/2026-04-workflow-first-mch-studio/` — First real run
- `src/app/(dashboard)/studio/` — Optional signpost page
- `src/components/ui/` — Local UI primitives, if the app earns its way back in
- `src/lib/supabase/` — Client & server Supabase wrappers
- `src/proxy.ts` — Auth middleware (Next.js 16 proxy pattern)

## Persistence
- Current workflow state lives in `studio-runs/`
- Supabase is not required for the active workflow
- Browser localStorage is not a source of truth

## Env Vars
- Shell (`~/.zshrc`): `CC_SUPABASE_URL`, `CC_SUPABASE_SERVICE_KEY`, `GEMINI_API_KEY`
- Vercel: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`

## Notes
- Next.js 16: uses `proxy.ts` not `middleware.ts`, all request APIs are async (`await params`, `await cookies()`)
- Tailwind 4: CSS-based config via `@import "tailwindcss"`, no tailwind.config.js

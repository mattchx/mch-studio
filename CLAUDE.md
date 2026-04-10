# MCH Studio

Content creation, preview, and approval dashboard. Claude Code agents generate client content locally, push it to Supabase. Matt reviews/approves here. Calendar view for scheduling.

CRM features (pipeline, contacts, follow-ups, call logs) live in **Arc** now.

## Architecture
- **Generation:** Claude Code agent runs locally → generates text + calls Gemini Imagen API for images → writes to Supabase
- **Dashboard:** Next.js app (read/review only) → reads from Supabase, approve/reject/publish workflow
- The app does NOT call any AI APIs directly

## Agent CLI (`scripts/cc.sh`)

All Supabase operations go through `scripts/cc.sh`. Always use absolute path:
```
/Users/mattch/claude/mch-projects/mch-studio/scripts/cc.sh <command>
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

## Content Generation Workflow

When asked to generate content for a client:

### 1. Get Client Context
```bash
cc.sh get-client <slug>
cc.sh get-profile <client_id>
```

### 2. Log the Job
```bash
cc.sh start-job '{"client_id":"...","job_type":"monthly_social","config":{"month":"2026-04","count":4}}'
```

### 3. Generate Content
You (Claude Code) generate the text directly — you ARE the LLM. Use the client profile (brand voice, target audience, services, guidelines) to write content.

**Content types:**
- `social` — Instagram/Facebook caption (150-280 chars), hashtags, CTA
- `blog` — SEO title, meta description, 600-800 word article in markdown
- `gbp_post` — Google Business Profile update (100-300 chars), CTA
- `newsletter` — Email newsletter content
- `report` — Monthly performance report

### 4. Generate Images (if needed)
Call Gemini Imagen 4 API. Save to `/tmp/`, then upload:
```bash
source ~/.zshrc && curl -s -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=$GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"instances":[{"prompt":"YOUR PROMPT"}],"parameters":{"sampleCount":1,"aspectRatio":"1:1"}}' \
  | python3 -c "
import json,sys,base64
data=json.load(sys.stdin)
if 'predictions' in data:
    open('/tmp/content-image.jpg','wb').write(base64.b64decode(data['predictions'][0]['bytesBase64Encoded']))
    print('saved')
else:
    print('Error:',json.dumps(data,indent=2))
"

# Upload to Supabase Storage
cc.sh upload-image /tmp/content-image.jpg "<client-slug>/social-001.jpg"
```

Image prompt guidelines:
- Social: `[service] clinic, [topic], warm professional lighting, clean minimal, no text overlay, no faces, photorealistic, square`
- Blog: `[service] treatment room, [topic], warm clinical lighting, wide angle, no people, photorealistic, 16:9`

### 5. Push Content
```bash
cc.sh push-content '{
  "client_id": "...",
  "content_type": "social",
  "status": "pending_review",
  "title": "Post Title",
  "body": "Caption text...",
  "image_url": "https://toipreojjlkbgktajypd.supabase.co/storage/v1/object/public/content-images/...",
  "metadata": {"hashtags": "...", "platforms": ["instagram", "facebook"]},
  "due_date": "2026-04-07T00:00:00Z"
}'
```

### 6. Complete the Job
```bash
cc.sh complete-job <job_id> <items_created>
```

## Scheduling Content
When generating a month of content, spread due dates evenly:
- 4 social posts → ~weekly (days 1, 8, 15, 22)
- 1 blog post → mid-month (day 15)
- 4 GBP posts → ~weekly

## Stack
- Next.js 16, TypeScript, Tailwind 4
- Supabase (auth, DB, storage) — project ref: `toipreojjlkbgktajypd`
- Vercel (deployment) — https://command-center-cyan-gamma.vercel.app

## Key Paths
- `scripts/cc.sh` — Agent CLI for Supabase operations
- `src/app/(dashboard)/queue/` — Main review queue
- `src/app/(dashboard)/calendar/` — Content calendar
- `src/app/(dashboard)/content/[id]/` — Content detail + review actions
- `src/app/api/content/[id]/` — Content item CRUD
- `src/lib/supabase/` — Client & server Supabase wrappers
- `src/proxy.ts` — Auth middleware (Next.js 16 proxy pattern)
- `src/types/database.ts` — TypeScript types for DB schema

## Database (Supabase)
- `clients` — business name, slug, category, brand
- `client_profiles` — brand voice, target audience, services, guidelines
- `content_items` — content queue (social, blog, gbp_post, etc.)
- `generation_jobs` — tracks agent-triggered generation runs
- `content-images` bucket — public storage for generated images
- RLS: all tables admin-only via `is_admin()` (checks `matt@mchproj.com`)
- Service role key bypasses RLS (used by agent to write data)

## Env Vars
- Shell (`~/.zshrc`): `CC_SUPABASE_URL`, `CC_SUPABASE_SERVICE_KEY`, `GEMINI_API_KEY`
- Vercel: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`

## Notes
- Next.js 16: uses `proxy.ts` not `middleware.ts`, all request APIs are async (`await params`, `await cookies()`)
- Tailwind 4: CSS-based config via `@import "tailwindcss"`, no tailwind.config.js

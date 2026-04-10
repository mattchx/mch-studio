# Command Center

Internal content approval dashboard for MCH Projects. AI agents generate client content (social posts, blog articles, GBP updates), Matt reviews and approves before publication.

## Workflow

### 1. Add a Client

Clients are added to Supabase directly (via dashboard or agent). Each client needs:

- **Client record** — business name, slug, category, contact info
- **Client profile** — brand voice, target audience, key services, content guidelines, social platforms

### 2. Agent Generates Content

A Claude Code agent running locally handles all content generation:

1. Reads client profile from Supabase (brand voice, services, audience)
2. Generates text content (social captions, blog posts, GBP updates)
3. Calls Gemini Imagen 4 API for images, uploads to Supabase Storage (`content-images` bucket)
4. Writes `content_items` to Supabase with status `pending_review`
5. Logs the run in `generation_jobs` for tracking

The dashboard does **not** call any AI APIs — the agent writes directly to Supabase using the service role key.

### 3. Review in Dashboard

Open the Command Center at [command-center-cyan-gamma.vercel.app](https://command-center-cyan-gamma.vercel.app).

**Queue** (`/queue`) — shows all `pending_review` items sorted by due date. Filter by client, content type, or status.

**Review** (`/content/[id]`) — full content preview with:
- Title, body text, and image preview
- Metadata (hashtags, meta descriptions, platforms)
- Due date

**Actions on each item:**
- **Approve** — marks as `approved`, ready to publish
- **Edit** — modify title or body inline before approving
- **Reject** — add an optional rejection note (agent can use this to regenerate)

### 4. Publish

Approved content is manually posted to the client's platforms (Instagram, Facebook, Google Business Profile, blog). Status is updated to `published` with a timestamp.

## Content Types

| Type | Description | Typical fields |
|------|-------------|----------------|
| `social` | Instagram/Facebook post | Caption, hashtags, square image |
| `blog` | Blog article | Title, meta description, body (markdown), hero image |
| `gbp_post` | Google Business Profile update | Short body with CTA |
| `newsletter` | Email newsletter | Title, body |
| `report` | Monthly report | Title, body |
| `site_update` | Website content update | Title, body |

## Status Flow

```
draft → pending_review → approved → published
                       ↘ rejected
```

## Tech Stack

- **Frontend:** Next.js 16, TypeScript, Tailwind 4
- **Database:** Supabase (PostgreSQL + Auth + Storage)
- **Deployment:** Vercel
- **Content generation:** Claude Code agent (local) + Gemini Imagen 4 API

## Local Development

```bash
npm install
npm run dev
```

Requires `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://toipreojjlkbgktajypd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Database

Schema is in `supabase/migrations/`. Tables:

- `clients` — business info
- `client_profiles` — AI generation context (brand voice, services, guidelines)
- `content_items` — the content queue
- `generation_jobs` — agent job tracking
- `content-images` bucket — generated images (public read)

All tables use RLS restricted to `matt@mchproj.com`. The service role key (used by the agent) bypasses RLS.

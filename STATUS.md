# MCH Studio — Status

## What happened
- Renamed from Command Center to MCH Studio
- Stripped all CRM features (pipeline, contacts, follow-ups, call logs) — those live in Arc now
- Kept: content queue, calendar, preview/approve, AI profiles, generation jobs, image upload
- Deployed to https://mch-studio.vercel.app

## Recent (2026-04-10)
- Redesigned queue UI: sage green accent, DM Sans + IBM Plex Sans fonts, softer dark theme (#18191b bg)
- Replaced native selects with pill toggle filters + custom dropdowns
- Fixed sort bug (QueueList wasn't re-rendering on sort change)
- Added drag-and-drop reorder for queue items
- Removed sidebar, replaced with slim top bar (settings gear + sign out)
- Disconnected calendar from nav (route still exists)
- New SVG favicon matching sage green accent
- Changes are LOCAL ONLY — not deployed yet

## Current state
- Auth is **temporarily disabled** — app is open access, /login redirects to /queue
- UI redesign is local, needs deploy

## Next steps
- Deploy redesign to Vercel
- Re-enable auth: configure Resend as custom SMTP in Supabase, or fix PKCE magic link redirect URLs
- Clean up old DB tables (follow_ups, call_logs, contacts) from Command Center era
- Delete old `command-center` Vercel project

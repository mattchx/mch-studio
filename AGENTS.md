<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# MCH Studio Codex Brief

MCH Studio is the Codex-front-runner project for building Matt's creative production system: social media, marketing, ads, and short-form video.

Read `STATUS.md`, `CLAUDE.md`, and `studio-runs/README.md` before planning or editing. When the user invokes `/studio-generate` (or asks Studio to draft a post pair from an idea), follow `studio-runs/_skills/studio-generate.md` exactly. The active workflow is local-first and intentionally simple: idea → saved post bundle with text + generated image → manual review/publish.

Operating rules:
- Codex should lead bounded implementation in this project.
- Keep the Studio workflow simple before adding app, database, or UI structure.
- Prefer reusable, data-driven content schemas.
- Do not prioritize Remotion, AI video generation, or fancy motion systems right now. Those are shelved unless Matt explicitly revives them.
- Current priority: organic/social posts, hard-ad style variants, generated images, and later real-camera video formats such as selfie/talking-head or Loom/OBS screen recordings.
- Keep strategy/source-of-truth notes in the vault; keep app code focused on the production tool.
- Update `STATUS.md` after meaningful work.

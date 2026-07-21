# MCH Studio

MCH Studio is a lightweight local creative system for turning useful ideas into social posts, hard-ad variants, and generated images.

The app and Supabase are not the source of truth. The source of truth is the local `studio-runs/` workspace.

## Workflow

1. Start with one clear idea.
2. Generate a saved post bundle in `studio-runs/posts.json`.
3. Include one organic post and one hard-ad style variant.
4. Add generated images when useful, stored under `studio-runs/media/`.
5. Review in the local Studio app.
6. Mark assets ready or published manually.

## Current Contract

```txt
studio-runs/
  posts.json
  media/
    idea-slug/
      organic.png
      hard_ad.png
```

## Visual And Video Direction

Generated images are enough for now when they support the post clearly. Remotion, AI video generation, and fancy motion systems are shelved unless Matt explicitly revives them.

Future video should stay practical and organic:
- selfie/talking-head recordings
- Loom or OBS-style screen recordings
- YouTube, LinkedIn, or short-form cuts from real explanation

## Key Paths

- `studio-runs/README.md` — operating protocol
- `studio-runs/inbox.md` — raw idea capture
- `studio-runs/posts.json` — saved post bundles
- `studio-runs/media/` — generated images for post variants
- `src/app/(dashboard)/studio/` — optional signpost page, not the system

## Development

The Next.js app remains available as optional UI scaffolding:

```bash
npm install
npm run dev
```

The app is not required to execute the workflow.

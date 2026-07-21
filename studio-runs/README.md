# MCH Studio Runs

This folder is the source of truth for MCH Studio work.

The current goal is simple: turn useful ideas into saved post bundles with text variants and generated images. The older heavier production-run workflow can remain available as reference, but it is not the default path right now.

## Work Lanes

Keep active Studio work split into three lanes:

1. UI lane: improve the Studio app surface for reviewing bundles, previewing posts, and practicing ad setup. The app remains optional scaffolding; `studio-runs/` stays the source of truth.
2. Social/ads lane: primary production lane. Turn raw ideas into organic posts first, then hard-ad style variants when useful, with generated images and reusable hooks captured locally.
3. Practical video lane: separate lightweight lane for talking-head/selfie ideas, Loom/OBS screen-recording outlines, shot lists, and repurposing notes. Remotion, AI video, and heavy motion systems stay shelved unless Matt explicitly revives them.

## Daily Loop

1. Start with one idea.
2. Generate or edit a bundle in `posts.json`.
3. Keep the bundle to two useful variants: organic and hard ad.
4. Add generated images under `media/` when useful.
5. Review in Studio, then mark ready or published manually.

## Current Post Bundle Contract

Each saved post lives in `posts.json`:

```json
{
  "id": "idea-slug",
  "idea": "original idea sentence",
  "title": "Short title",
  "variants": [
    { "type": "organic", "body": "...", "image": "idea-slug/organic.png" },
    { "type": "hard_ad", "body": "...", "image": "idea-slug/hard_ad.png", "cta": "Get the brief" }
  ],
  "status": "draft",
  "updated_at": "2026-05-05T00:00:00Z"
}
```

Generated image paths are relative to `studio-runs/media/`.

## Legacy Production Run Contract

Production-run folders remain useful for larger projects, but they are not the default Studio workflow right now.

```txt
studio-runs/
  2026-04-idea-slug/
    brief.md
    tasks.md
    assets/
      posts.md
      script.md
      remotion.json
      media.md
    exports/
      publish-kit.md
    log.md
```

## File Roles

- `brief.md` captures the raw idea, goal, audience, CTA, constraints, references, and desired outcome.
- `tasks.md` keeps one clear next action at the top and tracks execution with `todo`, `doing`, `blocked`, and `done`.
- `assets/posts.md` holds draft and final social copy.
- `assets/script.md` holds the short-video script and scene notes.
- `assets/remotion.json` holds structured video payload only when video is relevant.
- `assets/media.md` tracks the required attachment: rendered MP4, photo, or image asset.
- `exports/publish-kit.md` is the final manual publishing handoff, including copy and at least one attachment path.
- `log.md` records decisions, blockers, changes, and what happened.

## Asset Rule

Most post bundles should include a useful image before being marked ready. Generated images through Gemini, ChatGPT/Codex image tools, or another manual/local image flow are acceptable.

## Visual Quality Gate

A visual asset is ready only when it passes these checks:

- Clear visual concept tied to the idea
- Readable on mobile without requiring audio
- Platform-appropriate format and pacing
- Matt approves it as something MCH Projects would actually post

Remotion, AI video generation, and elaborate motion systems are shelved unless Matt explicitly revives them.

## Practical Video Direction

Future video work should prioritize real, organic formats:

- selfie/talking-head recordings
- Loom or OBS-style screen recordings
- YouTube, LinkedIn, or short-form versions from the same practical explanation

Treat video as its own chat or planning pass so it does not slow down the social post bundle workflow.

## Weekly Loop

1. Review drafts in `posts.json`.
2. Move reusable hooks, angles, and patterns into `library/`.
3. Mark finished assets ready or published.
4. Check whether the simple post/image workflow is making publishing easier.

## Done Means

A bundle is done when it is published or intentionally left behind with a clear reason.

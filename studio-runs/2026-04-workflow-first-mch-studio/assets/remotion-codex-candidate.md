# Codex Remotion Candidate

## Concept

This version treats the post as a motion-graphic explanation of the operating rhythm:

```txt
loose ideas -> sorted workflow -> finished social asset
```

Instead of showing the LinkedIn copy as big text cards, the video uses:

- floating idea fragments
- a production rail with five steps: Capture, Decide, Draft, Publish, Learn
- a highlighted idea transforming into a finished post-style card
- a final lockup around "One useful idea. One finished asset. Every week."

## Files

- Composition: `remotion/src/CodexMotionConcept.tsx`
- Registered composition id: `MarketingProductionRhythmCodex`
- Render script: `pnpm render:codex`
- Intended output: `exports/marketing-production-rhythm-codex.mp4`

## Status

Code implemented and `pnpm lint` passes.

Rendering from Codex failed because Remotion could not launch Chrome in this sandbox on this macOS version. Matt can render locally from:

```bash
cd /Users/mattch/claude/personal/mch-studio/remotion
pnpm render:codex
```

After rendering, compare it against Claude's version and the rejected first render.

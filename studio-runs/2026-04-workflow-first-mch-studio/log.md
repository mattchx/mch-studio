# Log: Workflow-First MCH Studio

## Decisions

- 2026-04-30: Source of truth moves to local production-run folders.
- 2026-04-30: App and Supabase are optional tooling, not the workflow.
- 2026-04-30: First success metric is published assets.
- 2026-05-01: Reframed the first public asset away from internal MCH Studio tooling and toward MCH Projects clients.
- 2026-05-01: Selected LinkedIn as the first publish channel.
- 2026-05-02: Final-polished the LinkedIn copy; publish readiness later changed to require a visual attachment.
- 2026-05-02: Changed workflow rule so publish kits require a visual attachment: Remotion MP4 preferred, image/photo fallback allowed.
- 2026-05-02: Rendered `exports/marketing-production-rhythm.mp4` from the run's `assets/remotion.json` scene payload.
- 2026-05-02: Rendered the true Remotion attachment at `exports/marketing-production-rhythm-remotion.mp4`.
- 2026-05-02: Rejected the first Remotion render as too static and not visually engaging enough for MCH Projects publishing.
- 2026-05-02: Redesigned `remotion/src/Composition.tsx` as a self-contained motion graphic (scatter → sorted lanes → weekly rhythm rail → post mockup → kinetic tagline) and rendered v2 to `exports/marketing-production-rhythm-remotion-v2.mp4`. Lint + tsc clean.

## Changes

- Created a complete run folder with brief, tasks, assets, publish kit, and log.
- Added post drafts, hooks, short-video script, and Remotion payload.
- Rewrote the public post around marketing production rhythm for client appeal.
- Tightened the final copy around "ideas never make it all the way to published."
- Updated the script and Remotion payload to match the client-facing marketing production rhythm angle.
- Marked publish kit not ready until `exports/marketing-production-rhythm.mp4` or fallback visual exists.
- Added MP4 attachment and initially marked publish kit ready to publish.
- Switched the preferred publish attachment to the Remotion-rendered MP4.
- Moved the publish kit back to not ready until the visual asset is redesigned and approved.
- Rewrote `remotion/src/Composition.tsx` to drop the payload-driven slide format and instead render a five-beat motion graphic: scattered idea cards → sorted lanes → weekly rhythm rail → LinkedIn post mockup → kinetic tagline. Rendered to `exports/marketing-production-rhythm-remotion-v2.mp4` (1080x1920, 30s).
- Moved the publish kit to "ready for review" pending Matt's gate sign-off.

## Blockers

- Awaiting Matt's approval on `exports/marketing-production-rhythm-remotion-v2.mp4` against the visual quality gate before scheduling.

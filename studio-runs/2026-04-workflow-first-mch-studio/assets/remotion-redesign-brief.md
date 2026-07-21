# Remotion Redesign Brief: Marketing Production Rhythm

## Current Verdict

The current rendered video proves the Remotion pipeline works, but it is not publishable yet.

File reviewed:
- `exports/marketing-production-rhythm-remotion.mp4`

Problem:
- It feels like a static portrait slide deck.
- It leans too heavily on large text blocks.
- The "scattered ideas becoming a publish rhythm" idea is described, not visualized.
- It does not give the first two seconds enough movement or curiosity.
- It does not yet feel like something MCH Projects would attach to a client-facing LinkedIn post.

## Goal

Create a more visual, more engaging Remotion MP4 for the LinkedIn post in `exports/publish-kit.md`.

The asset should show the transformation:

```txt
scattered business ideas -> organized production rhythm -> finished publishable asset
```

## Creative Direction

Make it feel like a practical motion graphic, not a narrated slide deck.

Use visual metaphors such as:
- Messy notes, question cards, screenshots, and draft fragments entering the frame
- Cards sorting into lanes: Capture, Decide, Draft, Publish, Learn
- A weekly rhythm/timeline/checklist that fills in as the video progresses
- One highlighted idea transforming into a LinkedIn post, short script, or offer card
- Subtle MCH Projects branding as an operating-system-like production layer

Avoid:
- Full-screen text cards
- Long caption blocks
- Generic gradient backgrounds
- Decorative motion that does not explain the idea
- Anything that feels like a PowerPoint export

## Acceptance Criteria

- 1080x1920 vertical MP4
- 20-35 seconds
- Grabs attention within the first two seconds
- Uses graphic objects and motion, not just text
- Readable on mobile without sound
- Uses the existing copy/idea but does not try to display the whole LinkedIn post
- Exports to `exports/marketing-production-rhythm-remotion-v2.mp4`
- Updates `assets/media.md`, `tasks.md`, `exports/publish-kit.md`, and `log.md`

## Suggested Implementation Notes

- Keep the existing `remotion/` project.
- You may replace or substantially rewrite `remotion/src/Composition.tsx`.
- Keep the payload-driven direction if useful, but do not let `assets/remotion.json` force a boring scene structure.
- Consider adding small reusable components: `IdeaCard`, `WorkflowLane`, `ProgressRail`, `PostMockup`.
- Use Remotion animation primitives (`interpolate`, `spring`, `Sequence`) to make objects sort, snap, stack, reveal, and transform.
- Tailwind is available in the Remotion project.

## Claude Code Prompt

```txt
You are in /Users/mattch/claude/personal/mch-studio.

Read AGENTS.md, CLAUDE.md, STATUS.md, studio-runs/README.md, and studio-runs/2026-04-workflow-first-mch-studio/assets/remotion-redesign-brief.md first.

The current Remotion render exists at:
studio-runs/2026-04-workflow-first-mch-studio/exports/marketing-production-rhythm-remotion.mp4

It is rejected because it feels like a static portrait slide deck. Please redesign the Remotion video into a more visual, engaging, graphic motion asset for the LinkedIn post in:
studio-runs/2026-04-workflow-first-mch-studio/exports/publish-kit.md

Goal: show scattered business ideas becoming an organized weekly publishing rhythm and one finished asset. Avoid full-screen text cards and generic caption slides.

Work in the existing Remotion project under remotion/. Tailwind is installed. You may rewrite remotion/src/Composition.tsx and add supporting components/files as needed. Keep the work scoped to this run and the Remotion template.

Acceptance:
- Render a vertical 1080x1920 MP4, 20-35 seconds.
- Export to studio-runs/2026-04-workflow-first-mch-studio/exports/marketing-production-rhythm-remotion-v2.mp4.
- It should be readable without sound and visually interesting in the first two seconds.
- Update the run files: assets/media.md, tasks.md, exports/publish-kit.md, and log.md.
- Run the Remotion lint/typecheck and render command.

Before finishing, briefly explain the creative concept and what files changed.
```

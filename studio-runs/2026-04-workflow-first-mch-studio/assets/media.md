# Media: Marketing Production Rhythm

## Required Attachment

Status: ready for review

Preferred asset:
- [x] Render Remotion MP4 from `assets/remotion.json` to `exports/marketing-production-rhythm-remotion.mp4`
- [x] Redesign the Remotion concept into a more visual, graphic, engaging asset (`exports/marketing-production-rhythm-remotion-v2.mp4`)

Fallback asset:
- [ ] Add a photo/image under `assets/` if video is too much for this publish pass

## Asset Direction

For LinkedIn, use a vertical or square motion asset that feels designed for the feed:

- Theme: scattered ideas becoming one publish rhythm
- Visual language: customer questions, messy capture, idea sorting, timeline/checklist mechanics, finished social asset, MCH Projects branding
- Motion language: ideas should move, combine, snap into order, transform into publishable outputs, and reveal progress
- Tone: practical, calm, professional, MCH Projects

Avoid:
- Static text-card slideshow
- Generic caption sequence
- Long blocks of explanatory text
- A "PowerPoint in portrait" feel

## Visual Quality Gate

- [x] Rendered MP4 exists
- [x] Clear visual concept tied to the idea — scattered cards → sorted lanes → weekly rhythm rail → finished post
- [x] Attention in the first two seconds — 9 idea cards rain in from above and jiggle in scatter
- [x] Graphic elements beyond static text cards — sorted lanes, progress rail with checkpoints, post mockup, kinetic tagline
- [x] Readable on mobile without audio — large hook text, large card text, mock post copy is feed-sized
- [x] Platform-appropriate pacing — 30s, five distinct beats, no scene over ~8s
- [ ] Approved as publishable (Matt to confirm)

## Current Attachment

`exports/marketing-production-rhythm-remotion-v2.mp4`

Details:
- 1080x1920 vertical
- 30.0 seconds, 900 frames @ 30 fps
- H.264 MP4 with silent AAC audio
- Generated with the redesigned Remotion composition in `remotion/src/Composition.tsx`
- Concept: scattered ideas → sorted lanes → weekly rhythm rail → finished LinkedIn post → kinetic tagline

## Creative Concept

Five beats:
1. 0–3s: Cold open — 9 idea cards (customer questions, FAQs, drafts, before/after) rain in from above and jiggle as scatter.
2. 3–10s: Five labeled lanes (CAPTURE · DECIDE · DRAFT · PUBLISH · LEARN) materialize and the cards snap into them with stagger.
3. 10–18s: Lanes recede; horizontal Mon→Fri rhythm rail appears. The "service explainer" hero card rides the rail; nodes turn green with checkmarks as it passes.
4. 18–25s: Hero card transforms into a LinkedIn post mockup centered in frame with MCH Projects header, post body, and a reaction counter ticking up.
5. 25–30s: Mockup shrinks to the upper third; tagline "One idea. / One finished asset. / Every week." kinetic-types in.

Avoided: full-screen text cards, generic gradient slides, captioned voiceover slideshow.

## Older renders (backup)

- `exports/marketing-production-rhythm-remotion.mp4` — first Remotion attempt, rejected as too static.
- `exports/marketing-production-rhythm.mp4` — earlier FFmpeg-generated backup render.

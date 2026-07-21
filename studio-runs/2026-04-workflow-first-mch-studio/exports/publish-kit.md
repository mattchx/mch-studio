# Publish Kit: Marketing Production Rhythm

## Publish Decision

Status: ready for review

Recommended first channel: LinkedIn

Reason: the copy is final, and the redesigned Remotion MP4 visualizes the "scattered ideas → weekly rhythm → published asset" arc with motion graphics rather than text cards. Awaiting Matt's approval against the visual quality gate before scheduling.

Primary attachment: `exports/marketing-production-rhythm-remotion-v2.mp4`

## Final LinkedIn Copy

Most small businesses do not have a marketing problem because they lack ideas.

They have a marketing problem because useful ideas never make it all the way to published.

The ideas are usually there:

- a customer question that comes up every week
- a before-and-after story
- a service people misunderstand
- an offer that needs explaining
- a seasonal reason to check in

But those ideas stay scattered.

They sit in notes, conversations, screenshots, and half-written drafts.

Then marketing starts to feel like a big creative project instead of a simple rhythm.

The rhythm can be much simpler:

1. Capture the useful idea.
2. Decide the audience and point.
3. Turn it into one post, one short script, or one clear offer.
4. Clean it up.
5. Publish it.
6. Learn from what happened.

That is where momentum starts.

Not from waiting for the perfect campaign.
Not from adding another tool.
Not from saving more drafts.

One useful idea.
One finished asset.
Every week.

That alone would put a lot of businesses ahead of where they are now.

MCH Projects is being built around that kind of execution: practical marketing systems that help good businesses show up clearly, consistently, and with less friction.

## X Version

Most small businesses do not need more marketing ideas.

They need a better path from idea to published.

The ideas are already there:
customer questions
seasonal reminders
before/after stories
offers that need explaining

The missing piece is rhythm.

One useful idea -> one finished asset -> every week.

## Attachment

Status: ready for review

Primary attachment:

- `exports/marketing-production-rhythm-remotion-v2.mp4` — 1080x1920, 30s, motion-graphic redesign

Backup renders:

- `exports/marketing-production-rhythm-remotion.mp4` — first Remotion attempt, rejected as too static
- `exports/marketing-production-rhythm.mp4` — earlier FFmpeg backup

## Video Handoff

The redesigned MP4 is rendered from `remotion/src/Composition.tsx` (no longer payload-driven — the composition is a self-contained motion graphic).

Concept beats (timecodes for review):
- 0:00–0:03 — idea cards rain in and scatter
- 0:03–0:10 — five lanes (Capture · Decide · Draft · Publish · Learn) appear; cards snap in
- 0:10–0:18 — Mon→Fri rhythm rail; one highlighted card rides the rail and trips checkpoints
- 0:18–0:25 — card transforms into a LinkedIn post mockup with reaction counter
- 0:25–0:30 — kinetic tagline: "One idea. / One finished asset. / Every week."

If the visual quality gate fails, see `assets/remotion-redesign-brief.md` for the next pass.

## Manual Publishing Checklist

- [x] Choose LinkedIn, X, or short video
- [x] Final review LinkedIn copy
- [x] Render Remotion MP4 or attach fallback image/photo
- [x] Render redesigned visual attachment
- [ ] Matt approves redesigned visual attachment against the visual quality gate
- [ ] Publish or schedule
- [ ] Update `tasks.md`
- [ ] Add publishing note to `log.md`

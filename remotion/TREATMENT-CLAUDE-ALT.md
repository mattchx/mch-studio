# Alt Treatment — `MarketingProductionRhythmCodex`

Author: Claude (alt-perspective pass)
Date: 2026-05-04
Status: proposal — no code written, `CodexMotionConcept.tsx` not edited

Read alongside [`PLAN.md`](PLAN.md) and the 2026-05-04 feedback section in [`vault/Reference Materials/Remotion/Polish & Audio Research.md`](../../vault/Reference%20Materials/Remotion/Polish%20%26%20Audio%20Research.md).

---

## Why this exists

The current canonical `CodexMotionConcept.tsx` already responded to Matt's 2026-05-04 review (bigger type, fewer words, stronger metaphors). It still leans on a 5-card swarm in scene 1 and a 5-step rail in scene 3 — that's a lot of moving parts for a 25s mobile video and pulls the eye toward decoration rather than message.

This treatment proposes a **harder cut**: one dominant element per scene, type as the hero, transitions doing structural work between scenes. Goal is to make the piece readable in 2-second chunks with the phone muted.

If Matt likes the direction, Codex implements it as a sibling composition (`MarketingProductionRhythmAlt`) so we can A/B render against the current canonical before promoting either.

---

## Concept — "Counter Cut"

**Through-line:** *Lots of ideas → one shipped — every week.*

The piece is a kinetic counter. A persistent horizontal bar (the "rhythm bar") rides the bottom third of frame the entire 25s. It changes role scene-to-scene — first a noise meter, then a gate, then a progress rail, then a beat — so the viewer never loses orientation, but the metaphor evolves.

Words on screen are punctuation, not paragraphs. Every scene has **≤4 words**. Numbers carry the load.

---

## Graphic system

| Token | Spec |
|---|---|
| Canvas | 1080×1920, 30fps, 750 frames (25s) — same as canonical for direct A/B |
| Hero type | Inter or Geist, weight 900, **220–280px**, letter-spacing -3px |
| Kicker | Same family, weight 700, **44px**, uppercase, letter-spacing +5px |
| Body cap | Never below 56px; if it has to be smaller it shouldn't be on screen |
| Palette | `ink` background, `text` cream, `green` for system/positive, `amber` reserved for the single hero moment per piece — nothing else. Drop cyan, pink, blue entirely |
| Persistent motif | One 22px-thick horizontal bar at y≈1480, full-bleed margins. Always present, role shifts |
| Transitions | Full-frame color wipes (`text` cream sliding L→R), clip-path mask reveals on type, scale-push on the bar. No drift particles, no dot rings |
| Brand chrome | `MCH` mark top-left throughout (already in `Background()`). Drop the right-corner "Studio" label — adds noise |
| Motion blur | Wrap the bar's role-change moves in `<CameraMotionBlur>` (>30px in <12 frames). Never on type |

---

## Scene shotlist

Total 750 frames. Every scene has a hard `<Series.Sequence durationInFrames=…>` block.

### S1 — Provocation (0–90, 3.0s)

- **On screen:** giant counter ticks `47 → 168 → 312`, then settles on `312`
- **Kicker:** `IDEAS THIS MONTH`
- **Bar:** behaves as a noise meter — bouncy, peaks driven by `Math.sin(frame * 0.6)`, capped opacity 0.4
- **Exit:** cream wipe L→R (frames 78–96)

### S2 — Reality (90–195, 3.5s)

- **On screen:** counter slams down to `1`. The `1` lands at 280px, slight overshoot via `SPRING_PUNCHY`
- **Kicker:** `PUBLISHED`
- **Bar:** shrinks to a single 60px segment aligned under the `1` — same visual language, smaller story
- **Transition out:** the `1` scales to 0.4 and slides up; bar holds

### S3 — Pivot (195–330, 4.5s)

- **On screen, line 1 (195–255):** `It's not the ideas.` — mask-reveal per word, 200px, two-line allowed
- **On screen, line 2 (255–315):** `It's the rhythm.` replaces line 1 via clip-path inset L→R, `amber` accent on "rhythm" only
- **Kicker:** none — let the type breathe
- **Bar:** holds dim, pulses once on the word "rhythm" (single beat, 2-frame scale punch)
- **Exit:** color flip — background goes cream, type goes ink, bar inverts. Held 6 frames as the visual reset before scene 4

### S4 — System (330–510, 6.0s)

- **On screen:** four words land sequentially **on the bar itself** as it fills L→R: `PICK · MAKE · SHIP · LEARN`
- The bar is now the rail. No card grid, no numbered chips. Each word is a 56px tick label that snaps in as the fill hits its mark
- **Hero text above the bar (330–390):** `THE LOOP` — 220px, single line, exits by frame 420 so the bar can hold the full bottom half cleanly
- **Motion-blur** the fill leading edge

### S5 — Output (510–630, 4.0s)

- **On screen:** a 9:16 phone frame outline (3px stroke, cream) draws on via stroke-dasharray-style clip
- Inside: a single line of post copy at 92px — `Publish the useful one.` — typed in left-to-right with mask reveal
- **Kicker bottom-right of frame:** `1 / WEEK` (44px, amber — this is the one amber hit in the piece)
- **Bar:** continues; 4 ticks light in sequence to mark the four weeks of the month
- **Exit:** phone frame scales down to a 24px square that tucks into the rightmost tick of the bar — visual proof that "one asset" is the smallest unit of the rhythm

### S6 — Signature (630–750, 4.0s)

- **On screen:** `MCH STUDIO` lockup, 180px, locked center, ink-on-cream
- Below it, 56px: `weekly · useful · shipped`
- **Bar:** four ticks pulse in tempo (sine on `frame * 0.18`), green
- **No exit** — final frame holds for 12 frames so the export's last frame is poster-quality for thumbnails

---

## Audio cues (Phase A)

Pulled forward from the cue sheet in `studio-runs/2026-04-workflow-first-mch-studio/assets/audio-cue-sheet.md` so VO timing maps cleanly to scene boundaries.

| Frame | Cue |
|---|---|
| 0 | Music in, ducked to 0.2 |
| 10 | VO: *"Three hundred ideas a month."* |
| 95 | Whoosh (transition) |
| 105 | VO: *"One published."* |
| 200 | VO: *"It's not the ideas."* |
| 270 | VO: *"It's the rhythm."* + soft riser |
| 340 | VO: *"Pick. Make. Ship. Learn."* — beat-synced to the four ticks (one word per tick) |
| 520 | VO: *"One asset. Every week."* |
| 640 | Music ramps back to 0.6 for outro hold |
| 720 | Music out |

Render: `--audio-bitrate=192k --audio-codec=aac` per PLAN.md decisions.

---

## How this differs from the current canonical

| Dimension | Canonical (`CodexMotionConcept.tsx`) | Alt (this) |
|---|---|---|
| Scene 1 anchor | 5 colored signal cards scattered across canvas | Single tickering counter, one bar |
| Scene 3 anchor | 5-step numbered rail with 5 chips | One bar, 4 word-ticks land on it |
| Scene 4 anchor | Detailed post mockup with logo, body, copy bar, button | Phone outline + one line of copy + the bar absorbs it |
| Color count | green + amber + cyan + pink + blue + grays | ink + cream + green + one amber hit |
| Words on screen at peak | ~12–18 (signal labels + kicker + hero + step labels) | ≤4 per scene |
| Hero type size | 154px | 220–280px |
| Persistent motif | None — each scene is its own object set | The rhythm bar runs all 25s |
| Transition style | Skewed band sweeps + scene fades | Cream wipes + clip-path masks + color flip |
| Decorative load | Medium-high (cards rotate, dots ring, post mockup details) | Low — type and bar do everything |

The bet: **constraint reads as confidence**. A piece that says less per second feels more designed at mobile sizes than one that says more.

---

## Risk / pushback to expect

1. **"It's too sparse to convey what MCH Studio does."** Counter: the canonical already over-explains and Matt's note was that it *still* feels too wordy. Sparseness is the direction, not a bug. If post-render Matt feels under-served, swap S5's single-line copy for a two-line stack — cheap fix.
2. **"The single persistent bar is gimmicky."** Counter: the bar is the metaphor — rhythm. Without a persistent visual through-line, scene-to-scene transitions have to do all the orientation work and viewers fall off.
3. **"No 5-step process anymore — does that hurt clarity?"** The 5-step rail in canonical reads as a tutorial slide. Compressing to 4 verbs on a single bar is a tighter expression of the same idea and avoids the "consultant deck" feel.

---

## Implementation notes for whoever picks this up

- Build as `src/MarketingProductionRhythmAlt.tsx`; register in `Root.tsx` next to the canonical so both render side-by-side. Don't replace the canonical until Matt picks one.
- Reuse `lib/theme.ts`, `lib/motion.ts`, and a new `CODEX_SCENES_ALT` block in `lib/timing.ts`. Don't fork the constants.
- Use `<Series>` of `<Series.Sequence>` from the start (PLAN.md phase 2 already calls for this; alt should ship with it).
- The rhythm bar is the only element that shouldn't be inside a `<Sequence>` — it lives at the composition root so it persists across scenes.
- Keep the Codex canonical untouched while this is in evaluation. The two compositions exist to be A/B'd, not merged.

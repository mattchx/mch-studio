# Audio Cue Sheet — MarketingProductionRhythmCodex

For Codex's audio integration phase (phase 5 in [`PLAN.md`](../../../remotion/PLAN.md)).

- **Composition:** `MarketingProductionRhythmCodex` (`src/CodexMotionConcept.tsx`)
- **Duration:** 750 frames @ 30 fps = **25.0s**
- **Render flag (Codex):** `--audio-bitrate=192k --audio-codec=aac`
- **All audio assets land in:** `remotion/public/audio/` (CORS — must use `staticFile()`)

> Timing below is approximate, snapped to existing scene events in the canonical composition. Frame ranges are inclusive of the visual beat they reinforce. Codex will refine after the `<Series.Sequence>` restructure (phase 2). After that, this doc gets re-snapped to the new scene boundaries — flag any drift > 5 frames.

---

## Scene map (from current code, pre-`<Series>` restructure)

| # | Time | Frames | Visual beat | VO line |
|---|---|---|---|---|
| 1 | 0.0–3.0s | 0–90 | HeroClaim slides up; idea cards begin arriving from off-canvas | "The ideas are already there." *(beat)* |
| 2 | 3.0–5.5s | 90–165 | HeroClaim fades; cards finish arriving and start sorting into pile | "What's missing is the publishing rhythm." |
| 3 | 5.5–10.0s | 165–300 | WorkflowRail reveals; cards continue sorting; first 3 lane nodes fill (Capture, Decide, Draft) | "Capture the raw signal. Choose the point. Shape the asset." |
| 4 | 10.0–13.2s | 300–396 | Last 2 lane nodes fill (Publish, Learn); TransformationStage starts to show | "Ship it. Learn what landed." |
| 5 | 13.2–18.5s | 396–555 | Card transforms small → big; settles; rail fully filled | "One useful idea becomes one finished asset." |
| 6 | 18.5–20.5s | 555–615 | Idea cards fade out; visual breath before lockup | *(silent — let music carry)* |
| 7 | 20.5–25.0s | 615–750 | FinalLockup reveals + holds | "One useful idea. One finished asset. Every week." |

---

## VO script (final form)

**Phase A (free):** OpenAI `gpt-4o-mini-tts` voice **`onyx`** (deeper, narrator) OR Matt records his own on iPhone Voice Memos. Either is acceptable for the v1 export — pick whichever is available when audio-integration phase fires.

**Phase B (paid):** ElevenLabs. Suggested voices — **Adam** (deep, calm, narrator) or **Brian** (warmer, business), or clone Matt's own voice (3-min sample).

Total spoken: ~21 seconds at conversational pace, leaving 4s of music-only breath at scene 6 and tail-out.

```
[Scene 1 — 0.0s, after 0.5s music intro]
The ideas are already there.

[Scene 2 — 3.2s]
What's missing is the publishing rhythm.

[Scene 3 — 6.0s]
Capture the raw signal.
Choose the point.
Shape the asset.

[Scene 4 — 10.5s]
Ship it. Learn what landed.

[Scene 5 — 13.5s]
One useful idea becomes one finished asset.

[Scene 6 — 18.5s, hold]
[silence]

[Scene 7 — 21.0s]
One useful idea.
One finished asset.
Every week.
```

**OpenAI TTS settings (Phase A):** model `gpt-4o-mini-tts`, voice `onyx`, speed 1.0, format `mp3`. Re-run with style instructions if delivery feels flat (`gpt-4o-mini-tts` accepts a tone hint in the request — e.g. "calm, confident narrator pace").

**ElevenLabs settings starting point (Phase B):** stability 0.45, similarity 0.75, style 0.10, speaker boost on. Lower stability if delivery is too flat; raise if pitch drifts.

---

## Music selection — free sources only

**Search all three for the same brief:** minimal corporate / instrumental / no vocals / 90–110 BPM / has a clear lift around 0:13–0:18 to match the transformation stage. Pull 3 candidates total, audition, pick the best.

1. **YouTube Audio Library** — [youtube.com/audiolibrary](https://www.youtube.com/audiolibrary). Filter: Genre = Cinematic or Electronic, Mood = Inspirational or Bright, Attribution = "No attribution required". Free, commercial OK on the no-attribution picks.
2. **no-copyright-music.com** — [no-copyright-music.com](https://www.no-copyright-music.com/). Browse "Corporate" / "Inspiring" / "Background" categories. Verify each track's specific license — most are royalty-free no-attribution but read the per-track terms before using on a paid client deliverable.
3. **Pixabay Music** — [pixabay.com/music/search/corporate%20uplifting/](https://pixabay.com/music/search/corporate%20uplifting/). Filter "no vocals", "instrumental". Look for "Inspiring Corporate" / "Minimal Tech" tags. CC0, no attribution.

**Rules:**
- Trim source to 25.0s. Fade in 0–0.8s, fade out 23.5–25.0s.
- **Volume curve** in Remotion `<Audio volume={f => ...}>`:
  - 0–0.5s: 0 → 0.55 (intro lift)
  - 0.5–3.0s: 0.55
  - 3.0–18.5s: **0.20** (ducked under VO)
  - 18.5–20.5s: 0.55 (breath, music takes over)
  - 20.5–24.5s: 0.30 (ducked under outro VO)
  - 24.5–25.0s: 0.30 → 0 (fade out)
- File naming convention: `public/audio/music-bg.mp3`

---

## SFX picks

**Two slots only — restraint is the brand.**

| Slot | Frame | Trigger | Asset | Volume |
|---|---|---|---|---|
| **Whoosh A** | ~165 (5.5s) | Sort pile snaps into lane positions; rail reveal kicks in | [Mixkit "fast whoosh transition" 2682](https://mixkit.co/free-sound-effects/whoosh/) | 0.45 |
| **Whoosh B** | ~396 (13.2s) | Card transforms small → big in TransformationStage | [FILM CRUX free pack](https://www.filmcrux.com/free-whoosh-transition-sound-effects) — pick a "rising" whoosh | 0.50 |

Optional tertiary (only if final review feels flat at the lockup):
- **Click/punctuation** at ~615 (20.5s) on FinalLockup reveal — Mixkit "tech click 2569" at 0.30. Hold off until first export review.

Filenames: `public/audio/sfx-whoosh-1.mp3`, `public/audio/sfx-whoosh-2.mp3`.

---

## Asset checklist before Codex wires `<Audio>`

- [ ] `public/audio/vo.mp3` — OpenAI TTS export (Phase A) or ElevenLabs (Phase B), mono, 44.1kHz, ≤ 21s
- [ ] `public/audio/music-bg.mp3` — YouTube Audio Library / no-copyright-music.com / Pixabay, stereo, 25.0s, normalized to -16 LUFS
- [ ] `public/audio/sfx-whoosh-1.mp3` — Mixkit
- [ ] `public/audio/sfx-whoosh-2.mp3` — FILM CRUX
- [ ] License notes in `assets/audio-licenses.md` — for each music track: source URL, track title, license terms screenshot/quote, attribution text if required

---

## Re-snap rule (post phase 2)

Codex's `<Series.Sequence>` restructure may shift scene boundaries by a few frames. After phase 2 lands, this doc needs:

1. Re-read `Root.tsx` for new per-scene durations
2. Update the **Scene map** table frame ranges
3. Update the **Volume curve** ducking points to the new VO frame ranges
4. Update the **SFX trigger** frames

Claude owns this re-snap; Codex flags when phase 2 is committed.

---

## Decisions

1. **Phase A voice:** `onyx` or Matt's own iPhone Voice Memos recording
2. **Phase B trigger:** when Matt explicitly says "I'm ready". No automatic trigger
3. **VO line at scene 7:** dropped. FinalLockup carries the brand silently — VO ends at "Every week."

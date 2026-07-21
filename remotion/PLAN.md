# Remotion Polish Plan

Working doc for refining the MCH Studio Remotion videos. Read this before editing.

- **Research:** [`vault/Reference Materials/Remotion/Polish & Audio Research.md`](../../../vault/Reference%20Materials/Remotion/Polish%20%26%20Audio%20Research.md)
- **Codex split-advice (overruled but archived):** [`vault/Advisors/codex/remotion-polish/2026-05-02T21-02-00--codex.md`](../../../vault/Advisors/codex/remotion-polish/2026-05-02T21-02-00--codex.md)
- **Audio cue sheet:** [`../studio-runs/2026-04-workflow-first-mch-studio/assets/audio-cue-sheet.md`](../studio-runs/2026-04-workflow-first-mch-studio/assets/audio-cue-sheet.md)

---

## Coordination model

**Codex drives.** That's the default for everything in this project per `AGENTS.md`.

**Claude is on-call** for two cases:
1. Codex tokens / context exhausted → Claude continues without ceremony
2. Alt-perspective work where a different model helps — alternate Remotion compositions, post copy variants, scene treatments, VO script alternates

No rigid file ownership. Whoever's in the seat reads this `PLAN.md` + project `STATUS.md` first, updates `STATUS.md` after meaningful work.

`CodexMotionConcept.tsx` is the canonical production composition. `Composition.tsx` is a sandbox for experiments.

---

## Phase order — don't skip

| Phase | Work | Owner |
|---|---|---|
| 1 | Create `src/lib/theme.ts` + `motion.ts` + `timing.ts`; wire canonical to consume them — no concept changes | next session |
| 2 | Restructure `CodexMotionConcept.tsx` into `<Series.Sequence>` blocks with locked scene durations | next session |
| 3 | Typography (Inter or Geist, weight 800–900, tracking -2 to -3px on big headings) + house easing/spring constants applied | next session |
| 4 | `pnpm add @remotion/motion-blur`; wrap fast moves only (the rail at frames 350–510 first); `BackgroundGrid()` blob drift via `frame * 0.03` | next session |
| 5 | **Audio last.** VO + ducked music + 2 transition whooshes per cue sheet | next session |
| 6 | Render tuning: `--audio-bitrate=192k --audio-codec=aac` | next session |

**Why audio is last:** bad structure + VO + music is harder to debug than dry timing. Lock scene durations first.

---

## Quick-win shortlist (from research)

1. **Typography** — drop Arial, use Inter or Geist; weight 800–900 on headlines, letter-spacing -2 to -3px
2. **Motion constants** in `src/lib/motion.ts`:
   ```ts
   export const EASE = Easing.bezier(0.16, 1, 0.3, 1);
   export const SPRING_PUNCHY = { mass: 0.5, stiffness: 200, damping: 18 };
   ```
3. **Audio** — `<Audio>` with VO + ducked music + 1 whoosh per scene transition
4. **Motion blur** — `<CameraMotionBlur>` on fast moves only (>30px in <12 frames). Don't use on text
5. **`<Series.Sequence>` restructure** — give every scene a named `durationInFrames`. Easier re-timing, easier audio cues

Bonus: `BackgroundGrid()` blob positions drift with `frame * 0.03`.

---

## Audio stack

**Phase A — start free / cheap:**
- **VO:** OpenAI `gpt-4o-mini-tts` (pennies per video, full commercial license, no attribution) **OR** Matt's own voice via iPhone Voice Memos
- **Music:** mix of [YouTube Audio Library](https://www.youtube.com/audiolibrary), [no-copyright-music.com](https://www.no-copyright-music.com/), [Pixabay Music](https://pixabay.com/music/) — all free, commercial OK, no attribution required on the picks we use
- **SFX:** Mixkit + FILM CRUX free transition pack

**Phase B — upgrade to ElevenLabs paid when ready:**
- ElevenLabs Creator ($22/mo) — Turbo v2.5 or Multilingual v2
- Eventual brand move: clone Matt's own voice (3-min sample) for consistency across all MCH content
- Music + SFX stay free; no need to subscribe to Artlist/Epidemic yet

**Render:** `--audio-bitrate=192k --audio-codec=aac`; all assets in `public/audio/`, use `staticFile()`.

Cue sheet (VO script + music ducking curve + SFX picks + asset checklist) lives in the production-run folder linked above.

---

## Decisions

1. **Phase A VO:** OpenAI `gpt-4o-mini-tts` voice `onyx` OR Matt's own iPhone Voice Memos recording. Codex picks whichever is available at audio-integration phase
2. **Phase B trigger:** when Matt explicitly says "I'm ready". No automatic trigger
3. **Outro VO line:** dropped. FinalLockup carries the brand silently

---

## Notes for whoever picks this up

- Update project `STATUS.md` after meaningful work — that's the cross-session handoff
- If you do a phase out of order, note why in `STATUS.md`
- If switching tools (Codex ↔ Claude) mid-phase, that's fine, just commit current state first
- Composition is 750 frames @ 30fps = 25.0s. Re-snap the cue sheet if scene boundaries shift after phase 2

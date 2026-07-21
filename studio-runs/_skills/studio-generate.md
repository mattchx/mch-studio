# studio-generate — workflow spec

Vendor-neutral spec. Claude Code's packaged `/studio-generate` skill defers to this file.
Codex and Gemini read it via the pointer in `AGENTS.md`.

## Purpose

Take a one-sentence idea from MCH Studio's Hub and produce a saved post bundle that
appears in the app at `/studio/saved`:

- one **organic** post (founder voice, social-feed shape, no CTA button)
- one **hard ad** (paid-feed shape, includes a 3–6 word CTA)
- one generated image per variant
- written to `studio-runs/posts.json` with `status: "draft"`

## Inputs

A single idea sentence, e.g. `rhythm beats polish in B2B marketing`.

## Steps

### 1. Slug the idea
Generate a kebab-case `id` from the idea (≤4 meaningful words, e.g. `rhythm-beats-polish`).
If `studio-runs/posts.json` already contains that id, append `-2`, `-3`, etc.

### 2. Ground in the Marketing Toolkit
Read these files for principle + structure:
- `vault/MCH Projects/Reference/Marketing Toolkit/marketing-review-kb.md` — LF8, 17 Cashvertising secrets, headline/body/writing rules
- `vault/MCH Projects/Reference/Marketing Toolkit/Frameworks/Before & After Copywriting Framework.md`
- `vault/MCH Projects/Reference/Marketing Toolkit/Frameworks/Life Force 8 Copy Mapping.md`

Pick the single strongest LF8 drive for the idea and name it in your draft notes (not in
the body copy).

### 3. Optional — pull from Rich UX
If the idea names a topic that maps to a Rich UX course (browse `vault/Rich UX/Courses/`
folder names — e.g. "AI Brand Voice", "Copywriting", "Client Acquisition"), open one
canonical note from that course and use it for tone reinforcement only. Do NOT force this
step — if nothing fits in 30 seconds, skip.

### 4. Draft both variants

**Organic post** — founder POV, ≤120 words, scannable line breaks, no CTA button. Use Extreme
Specificity (Cashvertising secret #9): concrete numbers, named situations, real objects.

**Hard ad** — paid-feed shape, ≤80 words body + a 3–6 word CTA. Lead with a pattern
interrupt or single-benefit headline. The CTA goes in the `cta` field, not in the body.

Both variants share the same idea; do not paraphrase one into the other. They should feel
like two different angles on the same insight.

### 5. Generate one image per variant

Use the image path that matches the agent environment:

- **Codex:** use Codex's built-in image generation/editing tool and save the resulting PNGs to
  `~/dev/code/personal/mch-studio/studio-runs/media/<post-id>/<variant>.png`.
- **Claude Code:** use Gemini. Recipe is canonical at `~/.claude/skills/add-visuals/SKILL.md`
  (lines 15–39). Summary:

```bash
mkdir -p ~/dev/code/personal/mch-studio/studio-runs/media/<post-id>

curl -s "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=$GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"<image prompt for this variant>"}]}],"generationConfig":{"responseModalities":["IMAGE"]}}' \
  -o /tmp/gemini_<variant>.json

python3 -c "
import json, base64, sys
data = json.load(open('/tmp/gemini_<variant>.json'))
for p in data['candidates'][0]['content']['parts']:
    if 'inlineData' in p:
        open(sys.argv[1], 'wb').write(base64.b64decode(p['inlineData']['data']))
        break
" ~/dev/code/personal/mch-studio/studio-runs/media/<post-id>/<variant>.png
```

Image prompts:
- Honor `feedback_visuals_must_show_people.md` — visuals must show people in pain or
  success contexts. No abstract textures, no decorative gradients.
- Organic variant: candid, real-feeling scene matching the body's specific situation.
- Hard ad variant: cleaner, slightly more product-shot, but still a person in scene.

If image generation is unavailable or fails, skip image generation and leave `image`
undefined for that variant — the app renders a placeholder.

### 6. Write the bundle

Append to `~/dev/code/personal/mch-studio/studio-runs/posts.json` (`.posts` array). Schema:

```json
{
  "id": "rhythm-beats-polish",
  "idea": "<the original sentence verbatim>",
  "title": "<5–7 word title, sentence case>",
  "variants": [
    {
      "type": "organic",
      "body": "...",
      "image": "rhythm-beats-polish/organic.png"
    },
    {
      "type": "hard_ad",
      "body": "...",
      "image": "rhythm-beats-polish/hard_ad.png",
      "cta": "Get the brief"
    }
  ],
  "status": "draft",
  "updated_at": "<ISO8601 UTC, e.g. 2026-05-05T14:23:11Z>"
}
```

**Image paths** are relative to `studio-runs/media/`. The app's `/api/media/[...path]`
route serves them.

Use `jq` to splice — never overwrite the file, never touch other entries:

```bash
POSTS=~/dev/code/personal/mch-studio/studio-runs/posts.json
TMP=$(mktemp)
jq --argjson new "$NEW_BUNDLE_JSON" '.posts += [$new]' "$POSTS" > "$TMP" && mv "$TMP" "$POSTS"
```

### 7. Print the review URL

Final stdout line: `http://localhost:3001/studio/p/<post-id>`

So the user can click straight into the preview without leaving the terminal.

## Non-goals

- No web preview rendering — the app does that
- No status transitions — `scripts/posts.sh ready|publish` handles those
- No deletion of existing posts
- No more than two variants per invocation

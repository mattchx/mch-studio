#!/usr/bin/env node

import { spawnSync } from 'node:child_process'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const runDir = process.argv[2]
const outputArg = process.argv[3]

if (!runDir || !outputArg) {
  console.error('Usage: node scripts/render-run-video.mjs <run-dir> <output-mp4>')
  process.exit(1)
}

const payload = await import(resolve(runDir, 'assets/remotion.json'), {
  with: { type: 'json' },
}).then((mod) => mod.default)

const output = resolve(outputArg)
const fps = payload.fps || 30
const duration = payload.durationFrames / fps
const font = '/System/Library/Fonts/Supplemental/Arial.ttf'
const tempDir = mkdtempSync(join(tmpdir(), 'mch-video-'))

function wrap(text, max = 28) {
  const words = String(text).split(/\s+/)
  const lines = []
  let line = ''

  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (next.length > max && line) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  }

  if (line) lines.push(line)
  return lines.join('\n')
}

function textFile(name, text) {
  const path = join(tempDir, name)
  writeFileSync(path, text)
  return path.replace(/:/g, '\\:')
}

const filters = [
  `drawbox=x=0:y=0:w=1080:h=1920:color=0x18191b@1:t=fill`,
  `drawtext=fontfile=${font}:text='MCH Projects':x=80:y=90:fontsize=38:fontcolor=0x6dba7a`,
  `drawtext=fontfile=${font}:text='Marketing Production Rhythm':x=80:y=145:fontsize=34:fontcolor=0xb0b3b8`,
  `drawbox=x=80:y=250:w=920:h=1190:color=0x212225@0.95:t=fill`,
  `drawbox=x=80:y=250:w=920:h=1190:color=0x38393c@1:t=3`,
  `drawtext=fontfile=${font}:text='One useful idea -> one finished asset -> every week':x=90:y=1550:fontsize=42:fontcolor=0xececec:box=1:boxcolor=0x2a2b2e@0.9:boxborderw=24`,
]

payload.scenes.forEach((scene, index) => {
  const start = scene.startFrame / fps
  const end = (scene.startFrame + scene.durationFrames) / fps
  const captionPath = textFile(`caption-${index}.txt`, wrap(scene.caption, 18))
  const voicePath = textFile(`voice-${index}.txt`, wrap(scene.voiceover, 26))
  const visualPath = textFile(`visual-${index}.txt`, wrap(scene.visualPrompt, 36))
  const enable = `between(t\\,${start}\\,${end})`

  filters.push(
    `drawtext=fontfile=${font}:text='0${index + 1}':x=120:y=310:fontsize=42:fontcolor=0x6dba7a:enable='${enable}'`,
    `drawtext=fontfile=${font}:textfile='${captionPath}':x=120:y=420:fontsize=76:fontcolor=0x6dba7a:line_spacing=18:enable='${enable}'`,
    `drawtext=fontfile=${font}:textfile='${voicePath}':x=120:y=730:fontsize=56:fontcolor=0xececec:line_spacing=18:enable='${enable}'`,
    `drawbox=x=120:y=1160:w=840:h=170:color=0x2a2b2e@0.9:t=fill:enable='${enable}'`,
    `drawtext=fontfile=${font}:textfile='${visualPath}':x=150:y=1200:fontsize=32:fontcolor=0xb0b3b8:line_spacing=10:enable='${enable}'`
  )
})

const result = spawnSync(
  'ffmpeg',
  [
    '-y',
    '-f',
    'lavfi',
    '-i',
    `color=c=0x18191b:s=1080x1920:d=${duration}:r=${fps}`,
    '-f',
    'lavfi',
    '-i',
    `anullsrc=channel_layout=stereo:sample_rate=48000`,
    '-vf',
    filters.join(','),
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    '-c:a',
    'aac',
    '-shortest',
    output,
  ],
  { stdio: 'inherit' }
)

process.exit(result.status ?? 1)

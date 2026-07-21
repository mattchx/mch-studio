import { promises as fs } from 'node:fs'
import path from 'node:path'

const MEDIA_ROOT = path.resolve(process.cwd(), 'studio-runs', 'media')

const CONTENT_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params
  const requested = path.resolve(MEDIA_ROOT, ...segments)

  if (
    requested !== MEDIA_ROOT &&
    !requested.startsWith(MEDIA_ROOT + path.sep)
  ) {
    return new Response('Not found', { status: 404 })
  }

  const ext = path.extname(requested).toLowerCase()
  const contentType = CONTENT_TYPES[ext]
  if (!contentType) {
    return new Response('Unsupported media type', { status: 415 })
  }

  try {
    const data = await fs.readFile(requested)
    return new Response(new Uint8Array(data), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'private, max-age=60',
      },
    })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}

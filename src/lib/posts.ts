import { promises as fs } from 'node:fs'
import path from 'node:path'

export type PostStatus = 'draft' | 'ready' | 'published'
export type VariantType = 'organic' | 'hard_ad'

export type Variant = {
  type: VariantType
  body: string
  image?: string
  cta?: string
}

export type Post = {
  id: string
  idea: string
  title: string
  variants: Variant[]
  status: PostStatus
  updated_at: string
}

type RawPost = Partial<Post> & {
  body?: string
  media?: Array<{ type: 'image' | 'video'; src: string }>
}

const POSTS_PATH = path.join(process.cwd(), 'studio-runs', 'posts.json')

function migrate(raw: RawPost): Post {
  if (raw.variants && raw.variants.length > 0) {
    return {
      id: raw.id ?? '',
      idea: raw.idea ?? raw.title ?? '',
      title: raw.title ?? raw.id ?? '',
      variants: raw.variants,
      status: (raw.status as PostStatus) ?? 'draft',
      updated_at: raw.updated_at ?? new Date(0).toISOString(),
    }
  }
  return {
    id: raw.id ?? '',
    idea: raw.idea ?? raw.title ?? '',
    title: raw.title ?? raw.id ?? '',
    variants: [
      {
        type: 'organic',
        body: raw.body ?? '',
        image: raw.media?.find((m) => m.type === 'image')?.src || undefined,
      },
    ],
    status: (raw.status as PostStatus) ?? 'draft',
    updated_at: raw.updated_at ?? new Date(0).toISOString(),
  }
}

export async function readPosts(): Promise<Post[]> {
  const raw = await fs.readFile(POSTS_PATH, 'utf8')
  const parsed = JSON.parse(raw) as { posts: RawPost[] }
  return parsed.posts
    .map(migrate)
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    )
}

export async function readPost(id: string): Promise<Post | null> {
  const posts = await readPosts()
  return posts.find((post) => post.id === id) ?? null
}

import Link from 'next/link'
import {
  ArrowRight,
  Image as ImageIcon,
  Megaphone,
  MessageSquare,
} from 'lucide-react'
import { readPosts } from '@/lib/posts'
import type { Post } from '@/lib/posts'
import { Hub } from './Hub'
import {
  getPostExcerpt,
  getPostStats,
  getVariant,
  hasImage,
  statusStyles,
} from './post-ui'

export const dynamic = 'force-dynamic'

export default async function StudioPage() {
  const posts = await readPosts()
  const stats = getPostStats(posts)

  return (
    <div className="-mx-6 -my-8 min-h-[calc(100vh-3.5rem)] bg-[#fffdf7] px-6 py-12 text-[#1e211e]">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 border border-[#191919] bg-[#191919] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#f7d66b]">
            MCH Studio
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold leading-tight md:text-5xl">
            Social posts in progress.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#5b6159]">
            Use the terminal to draft and refine. Studio is the place to review saved organic posts,
            hard-ad variants, and visual assets before publishing manually.
          </p>
        </header>

        <Hub />

        <section className="mt-12 grid gap-3 md:grid-cols-4">
          <MetricCard label="Total bundles" value={stats.total} />
          <MetricCard label="Drafts" value={stats.draft} />
          <MetricCard label="Ready" value={stats.ready} />
          <MetricCard label="Need image pass" value={stats.missingImages} />
        </section>

        <section className="mt-12">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#596157]">
                Saved social posts
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold">
                Draft list
              </h2>
            </div>
            <Link
              href="/studio/saved"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#6a4b00] transition hover:gap-3"
            >
              Saved view <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {posts.length === 0 ? (
            <p className="border border-dashed border-[#d8cdae] bg-white/70 p-6 text-sm text-[#5b6159]">
              Nothing saved yet. Generate the first post bundle from the terminal.
            </p>
          ) : (
            <div className="grid gap-3">
              {posts.map((post) => (
                <PostListRow key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>

        <section className="mt-12 border-t border-[#e2d7bd] pt-6">
          <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#596157]">
            How the Ads Simulator informs social
          </div>
          <ul className="grid gap-2 text-sm leading-relaxed text-[#5b6159] md:grid-cols-2">
            <li className="border border-[#eadfbe] bg-white p-3">
              Stronger hooks for the hard-ad variant.
            </li>
            <li className="border border-[#eadfbe] bg-white p-3">
              More visible proof objects in image prompts.
            </li>
            <li className="border border-[#eadfbe] bg-white p-3">
              Clearer audience pain without turning social into a campaign setup.
            </li>
            <li className="border border-[#eadfbe] bg-white p-3">
              Cleaner CTA shape when the post leans sponsored.
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}

function PostListRow({ post }: { post: Post }) {
  const organic = getVariant(post, 'organic')
  const hardAd = getVariant(post, 'hard_ad')
  const excerpt = getPostExcerpt(post)
  const includesImage = hasImage(post)

  return (
    <Link
      href={`/studio/p/${post.id}`}
      className="group block border border-[#d8cdae] bg-white p-4 shadow-[4px_4px_0_#d9a441] transition hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[6px_6px_0_#d9a441]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] ${statusStyles[post.status]}`}
            >
              {post.status}
            </span>
            {organic && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#5b6159]">
                <MessageSquare className="h-3 w-3" /> organic
              </span>
            )}
            {hardAd && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#5b6159]">
                <Megaphone className="h-3 w-3" /> hard ad
              </span>
            )}
            {includesImage && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#5b6159]">
                <ImageIcon className="h-3 w-3" /> image
              </span>
            )}
          </div>
          <h3 className="mt-3 font-[family-name:var(--font-display)] text-lg font-bold leading-tight text-[#1e211e]">
            {post.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-[#5b6159]">
            {excerpt}
          </p>
        </div>
        <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-[#6a4b00] transition group-hover:translate-x-1" />
      </div>
    </Link>
  )
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-[#d8cdae] bg-white p-4 shadow-[4px_4px_0_#d9a441]">
      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#596157]">
        {label}
      </div>
      <div className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold text-[#1e211e]">
        {value}
      </div>
    </div>
  )
}

import Link from 'next/link'
import { ArrowRight, Image as ImageIcon, Megaphone, MessageSquare } from 'lucide-react'
import { readPosts } from '@/lib/posts'
import type { Post } from '@/lib/posts'
import {
  getPostExcerpt,
  getPostStats,
  getVariant,
  hasEveryVariantImage,
  hasImage,
  statusLabels,
  statusOrder,
  statusStyles,
} from '../post-ui'

export const dynamic = 'force-dynamic'

export default async function SavedPostsPage() {
  const posts = await readPosts()
  const stats = getPostStats(posts)

  return (
    <div className="-mx-6 -my-8 min-h-[calc(100vh-3.5rem)] bg-[#fffdf7] px-6 py-12 text-[#1e211e]">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 border border-[#191919] bg-[#191919] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#f7d66b]">
            Saved bundles
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold leading-tight md:text-5xl">
            Organic and hard-ad drafts in one place.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[#5b6159]">
            Open a bundle, copy the variant that fits, post manually, then move it from{' '}
            <code className="bg-white px-1.5 py-0.5 text-[#6a4b00]">draft</code> to{' '}
            <code className="bg-white px-1.5 py-0.5 text-[#6a4b00]">ready</code> or{' '}
            <code className="bg-white px-1.5 py-0.5 text-[#6a4b00]">published</code>.
          </p>
        </header>

        <section className="mb-8 grid gap-3 md:grid-cols-4">
          <MetricCard label="Total" value={stats.total} />
          <MetricCard label="Draft" value={stats.draft} />
          <MetricCard label="Ready" value={stats.ready} />
          <MetricCard label="Need image pass" value={stats.missingImages} />
        </section>

        {posts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-8">
            {statusOrder.map((status) => {
              const statusPosts = posts.filter((post) => post.status === status)
              if (statusPosts.length === 0) return null

              return (
                <section key={status}>
                  <div className="mb-3 flex items-center justify-between border-b border-[#e2d7bd] pb-2">
                    <h2 className="font-[family-name:var(--font-display)] text-xl font-bold">
                      {statusLabels[status]}
                    </h2>
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#9aa097]">
                      {statusPosts.length} bundle{statusPosts.length === 1 ? '' : 's'}
                    </span>
                  </div>
                  <div className="grid gap-4">
                    {statusPosts.map((post) => (
                      <PostRow key={post.id} post={post} />
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function PostRow({ post }: { post: Post }) {
  const organic = getVariant(post, 'organic')
  const hardAd = getVariant(post, 'hard_ad')
  const excerpt = getPostExcerpt(post)
  const includesImage = hasImage(post)
  const allImagesReady = hasEveryVariantImage(post)

  return (
    <Link
      href={`/studio/p/${post.id}`}
      className="group block border border-[#d8cdae] bg-white p-5 shadow-[6px_6px_0_#d9a441] transition hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[8px_8px_0_#d9a441]"
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
            {!allImagesReady && (
              <span className="inline-flex items-center gap-1 border border-[#d8cdae] bg-[#fff8df] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#6a4b00]">
                <ImageIcon className="h-3 w-3" /> image pass
              </span>
            )}
            <span className="ml-auto text-[10px] uppercase tracking-[0.14em] text-[#9aa097]">
              {formatDate(post.updated_at)}
            </span>
          </div>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-xl font-bold leading-tight text-[#1e211e]">
            {post.title}
          </h2>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#5b6159]">
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

function EmptyState() {
  return (
    <div className="border border-dashed border-[#d8cdae] bg-white/70 p-10 text-center">
      <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[#1e211e]">
        Nothing saved yet.
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#5b6159]">
        Start an idea on the <Link className="underline" href="/studio">Hub</Link>. The generated
        bundle will show up here.
      </p>
    </div>
  )
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

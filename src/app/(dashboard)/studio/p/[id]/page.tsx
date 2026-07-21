import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Image as ImageIcon, Megaphone, MessageSquare } from 'lucide-react'
import { readPost } from '@/lib/posts'
import type { Variant } from '@/lib/posts'
import { CopyVariantButton } from './CopyVariantButton'

export const dynamic = 'force-dynamic'

export default async function PostPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = await readPost(id)
  if (!post) notFound()

  const organic = post.variants.find((v) => v.type === 'organic')
  const hardAd = post.variants.find((v) => v.type === 'hard_ad')

  return (
    <div className="-mx-6 -my-8 min-h-[calc(100vh-3.5rem)] bg-[#fffdf7] px-6 py-12 text-[#1e211e]">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/studio/saved"
          className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#5b6159] transition hover:text-[#1e211e]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Saved bundles
        </Link>

        <header className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 border border-[#191919] bg-[#191919] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#f7d66b]">
            Bundle preview
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold leading-tight md:text-4xl">
            {post.title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#5b6159]">
            <span className="font-bold uppercase tracking-[0.14em] text-[#1e211e]">Idea</span> ·{' '}
            {post.idea}
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[#9aa097]">
            {new Date(post.updated_at).toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}{' '}
            · status: {post.status}
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          {organic && (
            <VariantCard
              icon={<MessageSquare className="h-3.5 w-3.5" />}
              label="Organic post"
              variant={organic}
            />
          )}
          {hardAd && (
            <VariantCard
              icon={<Megaphone className="h-3.5 w-3.5" />}
              label="Hard ad"
              variant={hardAd}
            />
          )}
        </div>

        <footer className="mt-10 border-t border-[#e2d7bd] pt-6">
          <div className="mb-3 inline-flex items-center gap-2 border border-[#1e211e] bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#1e211e]">
            Step 3 · Ship it
          </div>
          <p className="text-sm leading-relaxed text-[#5b6159]">
            Copy the variant you want, post manually, then mark it{' '}
            <code className="bg-white px-1.5 py-0.5 text-[#6a4b00]">published</code> via{' '}
            <code className="bg-white px-1.5 py-0.5 text-[#6a4b00]">
              scripts/posts.sh publish {post.id}
            </code>
            .
          </p>
        </footer>
      </div>
    </div>
  )
}

function VariantCard({
  icon,
  label,
  variant,
}: {
  icon: React.ReactNode
  label: string
  variant: Variant
}) {
  const imageSrc = variant.image
    ? variant.image.startsWith('/')
      ? variant.image
      : `/api/media/${variant.image.replace(/^\/+/, '')}`
    : null
  const copyText = [variant.body, variant.cta ? `CTA: ${variant.cta}` : null]
    .filter(Boolean)
    .join('\n\n')
  const isHardAd = variant.type === 'hard_ad'

  return (
    <article className="border border-[#d8cdae] bg-[#fff8df] p-4 shadow-[8px_8px_0_#d9a441]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 border border-[#1e211e] bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#1e211e]">
          {icon}
          {label}
        </div>
        <CopyVariantButton label={`Copy ${label}`} text={copyText} />
      </div>

      <div className="overflow-hidden border border-[#d7d2bf] bg-white">
        <div className="flex items-center gap-3 border-b border-[#ece9dc] p-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center bg-[#191919] font-[family-name:var(--font-display)] text-sm font-bold text-[#f7d66b]">
            M
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-[#1e211e]">
              {isHardAd ? 'MCH Projects' : 'Matt Henderson'}
            </div>
            <div className="text-xs text-[#6d726a]">
              {isHardAd ? 'Sponsored' : 'Full-stack dev + marketing'}
            </div>
          </div>
        </div>

        <div className="whitespace-pre-wrap px-4 py-3 font-[family-name:var(--font-body)] text-sm leading-relaxed text-[#1e211e]">
          {variant.body}
        </div>

        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt=""
            className="aspect-[4/3] w-full border-y border-[#d7d2bf] object-cover"
          />
        ) : (
          <ImagePlaceholder />
        )}

        {isHardAd ? (
          <div className="flex items-center justify-between gap-3 bg-[#fff8df] px-4 py-3">
            <div className="min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#6d726a]">
                mchproj.com
              </div>
              <div className="truncate text-sm font-bold text-[#1e211e]">
                Websites and marketing systems
              </div>
            </div>
            {variant.cta && (
              <div className="shrink-0 bg-[#191919] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#f7d66b]">
                {variant.cta}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between border-t border-[#ece9dc] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#6d726a]">
            <span>Like</span>
            <span>Comment</span>
            <span>Repost</span>
            <span>Send</span>
          </div>
        )}
      </div>
    </article>
  )
}

function ImagePlaceholder() {
  return (
    <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border-y border-[#d7d2bf] bg-[#191919] text-[#f7d66b]">
      <div className="absolute inset-0 grid grid-cols-3 gap-px opacity-40">
        {Array.from({ length: 18 }).map((_, index) => (
          <span
            key={index}
            className={
              index % 4 === 0
                ? 'bg-[#f0c866]'
                : index % 3 === 0
                  ? 'bg-[#d9a441]'
                  : 'bg-[#e7e2cf]'
            }
          />
        ))}
      </div>
      <div className="relative inline-flex items-center gap-2 bg-[#e9e3ca] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#1e211e]">
        <ImageIcon className="h-4 w-4" />
        No image generated yet
      </div>
    </div>
  )
}

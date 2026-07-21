import type { Post, PostStatus, Variant } from '@/lib/posts'

export const statusStyles: Record<PostStatus, string> = {
  draft: 'border-[#a08842] bg-[#f6e6b8] text-[#5a4612]',
  ready: 'border-[#d8bf62] bg-[#fff2bd] text-[#6a4b00]',
  published: 'border-[#191919] bg-[#191919] text-[#f7d66b]',
}

export const statusLabels: Record<PostStatus, string> = {
  draft: 'Draft',
  ready: 'Ready',
  published: 'Published',
}

export const statusOrder: PostStatus[] = ['draft', 'ready', 'published']

export function getVariant(post: Post, type: Variant['type']) {
  return post.variants.find((variant) => variant.type === type)
}

export function hasImage(post: Post) {
  return post.variants.some((variant) => Boolean(variant.image))
}

export function hasEveryVariantImage(post: Post) {
  return post.variants.length > 0 && post.variants.every((variant) => Boolean(variant.image))
}

export function getPostExcerpt(post: Post) {
  return (getVariant(post, 'organic') ?? post.variants[0])?.body.split('\n').filter(Boolean)[0] ?? ''
}

export function getPostStats(posts: Post[]) {
  const draft = posts.filter((post) => post.status === 'draft').length
  const ready = posts.filter((post) => post.status === 'ready').length
  const published = posts.filter((post) => post.status === 'published').length
  const missingImages = posts.filter((post) => !hasEveryVariantImage(post)).length

  return {
    draft,
    missingImages,
    published,
    ready,
    total: posts.length,
  }
}

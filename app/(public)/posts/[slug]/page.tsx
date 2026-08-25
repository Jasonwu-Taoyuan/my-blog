import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, Calendar, ArrowLeft } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import PostContent from '@/components/post/PostContent'
import TagChip from '@/components/post/TagChip'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: rawSlug } = await params
  const slug = decodeURIComponent(rawSlug)
  const post = await prisma.post.findFirst({
    where: { slug, status: 'published' },
  })

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      images: post.coverImageUrl ? [post.coverImageUrl] : [],
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { slug: rawSlug } = await params
  const slug = decodeURIComponent(rawSlug)
  const post = await prisma.post.findFirst({
    where: { slug, status: 'published' },
    include: {
      author: {
        select: { name: true },
      },
    },
  })

  if (!post) {
    notFound()
  }

  const tags = JSON.parse(post.tags || '[]')

  // Get prev/next posts
  const [prevPost, nextPost] = post.publishedAt
    ? await Promise.all([
        prisma.post.findFirst({
          where: {
            status: 'published',
            publishedAt: { lt: post.publishedAt },
          },
          orderBy: { publishedAt: 'desc' },
          select: { slug: true, title: true },
        }),
        prisma.post.findFirst({
          where: {
            status: 'published',
            publishedAt: { gt: post.publishedAt },
          },
          orderBy: { publishedAt: 'asc' },
          select: { slug: true, title: true },
        }),
      ])
    : [null, null]

  return (
    <article>
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        {/* Back Link */}
        <Link
          href="/posts"
          className="inline-flex items-center text-sm font-semibold text-neutral-500 hover:text-neutral-900 mb-7"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          返回文章列表
        </Link>

        {/* Cover Image */}
        {post.coverImageUrl && (
          <div className="relative w-full h-96 mb-8 rounded-2xl overflow-hidden">
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag: string) => (
              <TagChip key={tag} tag={tag} href={`/posts?tag=${tag}`} />
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-[34px] font-bold tracking-tight text-neutral-900 leading-tight mb-4">
          {post.title}
        </h1>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-400 mb-9">
          {post.publishedAt && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <time>{formatDate(post.publishedAt)}</time>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {post.readingTimeMinutes} 分鐘閱讀
          </div>
          {post.author && <div>{post.author.name}</div>}
        </div>

        {/* Content */}
        <PostContent content={post.content} />

        {/* Prev/Next Navigation */}
        {(prevPost || nextPost) && (
          <div className="mt-14 pt-8 border-t border-neutral-200/70 grid grid-cols-1 md:grid-cols-2 gap-4">
            {prevPost && (
              <Link
                href={`/posts/${prevPost.slug}`}
                className="p-4 bg-white border border-neutral-200/70 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-xs text-neutral-400 mb-1">← 上一篇</div>
                <div className="font-medium text-neutral-900">{prevPost.title}</div>
              </Link>
            )}
            {nextPost && (
              <Link
                href={`/posts/${nextPost.slug}`}
                className="p-4 bg-white border border-neutral-200/70 rounded-xl shadow-sm hover:shadow-md transition-shadow md:text-right"
              >
                <div className="text-xs text-neutral-400 mb-1">下一篇 →</div>
                <div className="font-medium text-neutral-900">{nextPost.title}</div>
              </Link>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

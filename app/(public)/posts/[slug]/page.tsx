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
  const { slug } = await params
  const post = await prisma.post.findUnique({
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
  const { slug } = await params
  const post = await prisma.post.findUnique({
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
  const [prevPost, nextPost] = await Promise.all([
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

  return (
    <article className="bg-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Back Link */}
        <Link
          href="/posts"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Posts
        </Link>

        {/* Cover Image */}
        {post.coverImageUrl && (
          <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b">
          {post.publishedAt && (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <time>{formatDate(post.publishedAt)}</time>
            </div>
          )}
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            {post.readingTimeMinutes} min read
          </div>
          {post.author && <div>By {post.author.name}</div>}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {tags.map((tag: string) => (
              <TagChip key={tag} tag={tag} href={`/posts?tag=${tag}`} />
            ))}
          </div>
        )}

        {/* Summary */}
        <div className="text-xl text-gray-600 mb-8 leading-relaxed">
          {post.summary}
        </div>

        {/* Content */}
        <div className="prose-content">
          <PostContent content={post.content} />
        </div>

        {/* Prev/Next Navigation */}
        {(prevPost || nextPost) && (
          <div className="mt-12 pt-8 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
            {prevPost && (
              <Link
                href={`/posts/${prevPost.slug}`}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="text-sm text-gray-500 mb-1">← Previous</div>
                <div className="font-medium text-gray-900">{prevPost.title}</div>
              </Link>
            )}
            {nextPost && (
              <Link
                href={`/posts/${nextPost.slug}`}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors md:text-right"
              >
                <div className="text-sm text-gray-500 mb-1">Next →</div>
                <div className="font-medium text-gray-900">{nextPost.title}</div>
              </Link>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

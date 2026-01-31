import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'
import { Clock } from 'lucide-react'

interface PostCardProps {
  post: {
    id: string
    title: string
    slug: string
    summary: string
    coverImageUrl?: string | null
    tags: string[]
    publishedAt?: Date | null
    readingTimeMinutes: number
  }
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      {post.coverImageUrl && (
        <Link href={`/posts/${post.slug}`}>
          <div className="relative h-48 w-full">
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        </Link>
      )}

      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <time dateTime={post.publishedAt?.toISOString()}>
            {formatDate(post.publishedAt)}
          </time>
          <span className="mx-2">•</span>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {post.readingTimeMinutes} min read
          </div>
        </div>

        <Link href={`/posts/${post.slug}`}>
          <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
            {post.title}
          </h3>
        </Link>

        <p className="text-gray-600 mb-4 line-clamp-3">{post.summary}</p>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/posts?tag=${encodeURIComponent(tag)}`}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

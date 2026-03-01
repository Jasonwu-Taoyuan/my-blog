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
    <article className="bg-slate-800 rounded-lg border border-slate-700/50 overflow-hidden hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5 transition-all">
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
        <div className="flex items-center text-sm text-slate-400 mb-3">
          <time dateTime={post.publishedAt?.toISOString()}>
            {formatDate(post.publishedAt)}
          </time>
          <span className="mx-2">&middot;</span>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {post.readingTimeMinutes} min read
          </div>
        </div>

        <Link href={`/posts/${post.slug}`}>
          <h3 className="text-xl font-bold text-slate-100 mb-2 hover:text-amber-500 transition-colors">
            {post.title}
          </h3>
        </Link>

        <p className="text-slate-400 mb-4 line-clamp-3">{post.summary}</p>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/posts?tag=${encodeURIComponent(tag)}`}
                className="px-3 py-1 bg-slate-700/50 text-amber-400/80 rounded-full text-sm hover:bg-slate-700 transition-colors"
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

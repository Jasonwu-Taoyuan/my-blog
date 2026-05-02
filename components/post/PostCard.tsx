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
    <article className="post-card mg-fadeUp">
      {/* Accent top strip */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 2, background: 'var(--accent)', opacity: 0.4,
      }} />

      {post.coverImageUrl && (
        <Link href={`/posts/${post.slug}`} style={{ display: 'block' }}>
          <div className="relative h-44 w-full overflow-hidden">
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        </Link>
      )}

      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, fontSize: 12, color: 'var(--text-muted)' }}>
          <time dateTime={post.publishedAt?.toISOString()}>
            {formatDate(post.publishedAt)}
          </time>
          <span>·</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock style={{ width: 12, height: 12 }} />
            {post.readingTimeMinutes} min
          </div>
        </div>

        <Link href={`/posts/${post.slug}`} className="post-card-title">
          {post.title}
        </Link>

        <p style={{
          fontSize: 13,
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          marginBottom: 14,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {post.summary}
        </p>

        {post.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/posts?tag=${encodeURIComponent(tag)}`}
                style={{
                  padding: '2px 10px',
                  background: 'var(--accent-dim)',
                  color: 'var(--accent)',
                  borderRadius: 99,
                  fontSize: 11,
                  fontWeight: 600,
                  textDecoration: 'none',
                  letterSpacing: '.02em',
                }}
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

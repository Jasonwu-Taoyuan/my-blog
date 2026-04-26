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
    <article
      className="mg-fadeUp"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        transition: 'all var(--transition)',
        position: 'relative',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = 'var(--border)'
        el.style.transform = 'translateY(-3px)'
        el.style.boxShadow = '0 8px 24px rgba(0,0,0,.3)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = 'var(--border-subtle)'
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = 'none'
      }}
    >
      {/* Accent top strip */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 2, background: 'var(--accent)', opacity: 0.4,
      }} />

      {post.coverImageUrl && (
        <Link href={`/posts/${post.slug}`}>
          <div className="relative h-44 w-full overflow-hidden">
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              fill
              className="object-cover"
              style={{ transition: 'transform 0.3s ease' }}
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

        <Link href={`/posts/${post.slug}`} style={{ textDecoration: 'none' }}>
          <h3 style={{
            fontSize: 15,
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 8,
            lineHeight: 1.4,
            transition: 'color var(--transition)',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--accent)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'}
          >
            {post.title}
          </h3>
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
                  transition: 'opacity var(--transition)',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.75'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
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

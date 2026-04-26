import Link from 'next/link'
import { ChevronRight, BookOpen, Map, ArrowRight } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import PostCard from '@/components/post/PostCard'
import ReactMarkdown from 'react-markdown'

export const metadata = {
  title: 'Home | My Blog',
  description: '分享關於逆齡大腦、商業與科技、歷史的閱讀筆記',
}

const CATEGORY_META = [
  {
    slug: 'anti-aging',
    name: '逆齡大腦',
    desc: '探索大腦健康與神經可塑性，從科學角度實踐逆齡',
    emoji: '🧠',
    color: 'var(--accent)',
    bg: 'var(--accent-dim)',
  },
  {
    slug: 'business-tech',
    name: '商業與科技',
    desc: '商業思維與科技趨勢的閱讀筆記，連結知識與實務',
    emoji: '📚',
    color: 'var(--emerald)',
    bg: 'rgba(16,185,129,.12)',
  },
  {
    slug: 'history',
    name: '歷史',
    desc: '從歷史事件與人物汲取智慧，理解現在、洞見未來',
    emoji: '🏛️',
    color: 'var(--purple)',
    bg: 'rgba(139,92,246,.12)',
  },
  {
    slug: 'sports',
    name: '運動',
    desc: 'NBA 馬刺與運動世界的深度觀察與分析',
    emoji: '🏀',
    color: 'var(--sky)',
    bg: 'rgba(56,189,248,.12)',
  },
]

export default async function Home() {
  const [latestPosts, about] = await Promise.all([
    prisma.post.findMany({
      where: { status: 'published' },
      orderBy: { publishedAt: 'desc' },
      take: 6,
    }),
    prisma.about.findFirst(),
  ])

  const formattedPosts = latestPosts.map((post) => ({
    ...post,
    tags: JSON.parse(post.tags || '[]'),
  }))

  return (
    <div style={{ padding: '32px 0' }}>
      <div className="container mx-auto px-4" style={{ maxWidth: 1100 }}>

        {/* ── Hero ─────────────────────────────────────── */}
        <div
          className="mg-fadeUp"
          style={{
            background: 'linear-gradient(135deg, rgba(217,119,6,.12), rgba(13,17,23,.8))',
            border: '1px solid rgba(217,119,6,.2)',
            borderRadius: 'var(--radius-lg)',
            padding: '32px 36px',
            marginBottom: 36,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative background text */}
          <div style={{
            position: 'absolute', right: 32, top: '50%', transform: 'translateY(-50%)',
            fontSize: 88, opacity: .07, pointerEvents: 'none', lineHeight: 1,
          }}>📖</div>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: 'var(--accent-dim)', color: 'var(--accent)',
            fontSize: 11, fontWeight: 700, padding: '3px 10px',
            borderRadius: 99, letterSpacing: '.04em', marginBottom: 14,
          }}>
            ✨ 閱讀筆記 · 知識整理
          </div>

          <h1 style={{
            fontSize: 26, fontWeight: 800, color: 'var(--text-primary)',
            marginBottom: 8, lineHeight: 1.3,
          }}>
            Jason&apos;s Blog
          </h1>
          <p style={{
            fontSize: 14, color: 'var(--text-secondary)',
            maxWidth: 480, lineHeight: 1.65, margin: 0,
          }}>
            紀錄逆齡大腦、商業科技、歷史與運動的閱讀心得，把知識內化為行動力。
          </p>

          <div style={{ display: 'flex', gap: 10, marginTop: 22, flexWrap: 'wrap' }}>
            <Link href="/posts" className="mg-btn mg-btn-primary">
              <BookOpen size={14} /> 所有文章
            </Link>
            <Link href="/mind-maps" className="mg-btn mg-btn-ghost">
              <Map size={14} /> 思維導圖
            </Link>
          </div>
        </div>

        {/* ── Categories ───────────────────────────────── */}
        <div className="section-hdr mg-fadeUp" style={{ animationDelay: '.06s' }}>
          <h2 className="section-hdr-title">分類瀏覽</h2>
          <Link href="/posts" className="section-hdr-link">
            所有文章 <ChevronRight size={13} />
          </Link>
        </div>

        <div
          className="mg-fadeUp-delay"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 14,
            marginBottom: 36,
          }}
        >
          {CATEGORY_META.map(({ slug, name, desc, emoji, color, bg }) => (
            <Link
              key={slug}
              href={`/category/${slug}`}
              className="mod-card"
              style={{ '--card-color': color } as React.CSSProperties}
            >
              <div className="mod-icon" style={{ background: bg }}>{emoji}</div>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>
                {name}
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.55, margin: 0 }}>
                {desc}
              </p>
              <div style={{
                marginTop: 12, fontSize: 11, color, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                進入分類 <ArrowRight size={11} />
              </div>
            </Link>
          ))}
        </div>

        {/* ── Latest Posts ─────────────────────────────── */}
        <div className="section-hdr mg-fadeUp" style={{ animationDelay: '.12s' }}>
          <h2 className="section-hdr-title">最新文章</h2>
          <Link href="/posts" className="section-hdr-link">
            查看全部 <ChevronRight size={13} />
          </Link>
        </div>

        {formattedPosts.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
            marginBottom: 36,
          }}>
            {formattedPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div style={{
            padding: '48px 20px', textAlign: 'center',
            background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius)', marginBottom: 36,
          }}>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              尚未有文章，敬請期待！
            </p>
          </div>
        )}

        {/* ── About ────────────────────────────────────── */}
        {about && (
          <div
            className="mg-card mg-fadeUp"
            style={{ animationDelay: '.18s', textAlign: 'center' }}
          >
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
              {about.displayName}
            </h2>
            {about.headline && (
              <p style={{ fontSize: 13, color: 'var(--accent)', marginBottom: 16, fontWeight: 600 }}>
                {about.headline}
              </p>
            )}
            <div className="prose" style={{ textAlign: 'left', maxWidth: 680, margin: '0 auto' }}>
              <ReactMarkdown>{about.bioMarkdown}</ReactMarkdown>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

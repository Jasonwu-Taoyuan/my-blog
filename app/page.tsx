import Link from 'next/link'
import { ChevronRight, BookOpen, Map, ArrowRight } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import PostCard from '@/components/post/PostCard'
import ReactMarkdown from 'react-markdown'

export const metadata = {
  title: 'Home | My Blog',
  description: '專業知識、知識管理、旅遊足跡與運動觀察',
}

const CATEGORY_META = [
  {
    slug: 'category/operations',
    name: '專業知識',
    desc: '營運管理的實務心得與方法論',
    color: 'var(--accent)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20V10M12 20V4M20 20v-6" /></svg>
    ),
  },
  {
    slug: 'knowledge',
    name: '知識管理',
    desc: '讀書筆記、歷史與跨領域思考的整理',
    color: 'var(--emerald)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5.5C4 4.67 4.67 4 5.5 4H12v16H5.5A1.5 1.5 0 0 1 4 18.5V5.5Z" /><path d="M20 5.5c0-.83-.67-1.5-1.5-1.5H12v16h6.5a1.5 1.5 0 0 0 1.5-1.5V5.5Z" /></svg>
    ),
  },
  {
    slug: 'travel',
    name: '旅遊地圖',
    desc: '去過的地方，一個一個標記下來',
    color: 'var(--purple)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
    ),
  },
  {
    slug: 'category/sports',
    name: '運動',
    desc: 'NBA 馬刺與運動世界的深度觀察與分析',
    color: 'var(--sky)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><circle cx="12" cy="12" r="8.5" /><path d="M4 12h16M12 3.5v17M6.3 6.3c2.8 2.8 2.8 8.6 0 11.4M17.7 6.3c-2.8 2.8-2.8 8.6 0 11.4" /></svg>
    ),
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
        <div className="mg-fadeUp" style={{ textAlign: 'center', padding: '48px 0 56px' }}>
          <h1 style={{
            fontSize: 40, fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1.15,
            color: 'var(--text-primary)', margin: '0 0 16px',
          }}>
            把知識，<br />化為行動力。
          </h1>
          <p style={{
            fontSize: 16, color: 'var(--text-secondary)',
            maxWidth: 460, lineHeight: 1.6, margin: '0 auto',
          }}>
            紀錄營運管理的專業心得、讀書筆記、旅遊足跡與運動觀察，把知識內化為行動力。
          </p>

          <div style={{ display: 'flex', gap: 10, marginTop: 26, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/posts" className="mg-btn mg-btn-primary">
              <BookOpen size={14} /> 所有文章
            </Link>
            <Link href="/travel" className="mg-btn mg-btn-ghost">
              <Map size={14} /> 旅遊地圖
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
            marginBottom: 40,
          }}
        >
          {CATEGORY_META.map(({ slug, name, desc, color, icon }) => (
            <Link
              key={slug}
              href={`/${slug}`}
              className="mod-card"
              style={{ '--card-color': color } as React.CSSProperties}
            >
              <div className="mod-icon" style={{ background: color }}>{icon}</div>
              <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px', letterSpacing: '-.01em' }}>
                {name}
              </p>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                {desc}
              </p>
              <div style={{
                marginTop: 14, fontSize: 11, color, fontWeight: 600,
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
            marginBottom: 40,
          }}>
            {formattedPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="mg-card" style={{ padding: '48px 20px', textAlign: 'center', marginBottom: 40 }}>
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
            <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-.01em', color: 'var(--text-primary)', marginBottom: 4 }}>
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

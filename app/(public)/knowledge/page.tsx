import Link from 'next/link'
import { ArrowRight, ArrowUpRight, BookOpen, NotebookText, Sparkles } from 'lucide-react'
import { fetchBooks } from '@/lib/notion'
import { prisma } from '@/lib/prisma'
import { KNOWLEDGE_LEGACY_CATEGORIES } from '@/lib/categories'

export const revalidate = 86400 // 每 24 小時從 Notion 重新抓取

export const metadata = {
  title: '知識管理 | My Blog',
  description: '讀書筆記、歷史與跨領域思考的整理。完整心智圖與長文筆記收錄在知識宮殿。',
}

const KNOWLEDGE_PALACE_URL = 'https://memorygym-app.zeabur.app/mind-maps'

export default async function KnowledgePage() {
  let bookCount = 0
  try {
    const books = await fetchBooks()
    const hidden = await prisma.hiddenBook.findMany({ select: { notionId: true } })
    const hiddenIds = new Set(hidden.map((h) => h.notionId))
    bookCount = books.filter((b) => !hiddenIds.has(b.id)).length
  } catch (e) {
    console.error('Notion fetch error:', e)
  }

  const articleCount = await prisma.post.count({
    where: { status: 'published', category: { in: KNOWLEDGE_LEGACY_CATEGORIES } },
  })

  const categories = [
    {
      href: '/knowledge/books',
      external: false,
      name: '讀書清單',
      desc: '借閱過的書籍與分類摘要',
      count: `${bookCount} 本書籍`,
      color: 'var(--accent)',
      icon: <BookOpen size={22} />,
    },
    {
      href: '/knowledge/articles',
      external: false,
      name: '文章筆記',
      desc: '讀書心得、歷史與跨領域思考',
      count: `${articleCount} 篇文章`,
      color: 'var(--emerald)',
      icon: <NotebookText size={22} />,
    },
    {
      href: KNOWLEDGE_PALACE_URL,
      external: true,
      name: '知識萃取',
      desc: '逐章逐頁的心智圖與筆記',
      count: '前往知識宮殿',
      color: 'var(--purple)',
      icon: <Sparkles size={22} />,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12" style={{ maxWidth: 1100 }}>
      <div className="mb-8">
        <p className="text-sm font-semibold mb-2" style={{ color: 'var(--accent)' }}>知識管理</p>
        <h1 className="text-4xl font-bold text-neutral-900 tracking-tight mb-3">讀書筆記、歷史與跨領域思考的整理</h1>
        <p className="text-base text-neutral-500">這裡只放精選摘要與心得，完整的心智圖與長文筆記收錄在知識宮殿。</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const cardProps = cat.external
            ? { href: cat.href, target: '_blank', rel: 'noopener noreferrer' }
            : { href: cat.href }
          const Wrapper: any = cat.external ? 'a' : Link
          return (
            <Wrapper
              key={cat.name}
              {...cardProps}
              className="mod-card"
              style={{ '--card-color': cat.color } as React.CSSProperties}
            >
              <div className="mod-icon" style={{ background: cat.color }}>{cat.icon}</div>
              <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px', letterSpacing: '-.01em' }}>
                {cat.name}
              </p>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                {cat.desc}
              </p>
              <div style={{
                marginTop: 14, fontSize: 11, color: cat.color, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                {cat.count} {cat.external ? <ArrowUpRight size={11} /> : <ArrowRight size={11} />}
              </div>
            </Wrapper>
          )
        })}
      </div>
    </div>
  )
}

import Link from 'next/link'
import { Clock } from 'lucide-react'
import { fetchBooks, type Book } from '@/lib/notion'
import { prisma } from '@/lib/prisma'
import { KNOWLEDGE_LEGACY_CATEGORIES } from '@/lib/categories'
import BookList from './BookList'

export const revalidate = 86400 // 每 24 小時從 Notion 重新抓取

export const metadata = {
  title: '知識管理 | My Blog',
  description: '讀書筆記、歷史與跨領域思考的整理。完整心智圖與長文筆記收錄在知識宮殿。',
}

export default async function KnowledgePage() {
  let books: Book[] = []
  let error = ''

  try {
    books = await fetchBooks()
  } catch (e: any) {
    error = e.message || '無法載入書單，請確認 Notion API Key 設定是否正確。'
    console.error('Notion fetch error:', e)
  }

  const categories = [...new Set(books.map((b) => b.mainCategory).filter(Boolean))].sort()

  const posts = await prisma.post.findMany({
    where: { status: 'published', category: { in: KNOWLEDGE_LEGACY_CATEGORIES } },
    orderBy: { publishedAt: 'desc' },
  })
  const formattedPosts = posts.map((post) => ({
    ...post,
    tags: JSON.parse(post.tags || '[]') as string[],
  }))

  return (
    <div className="container mx-auto px-4 py-12" style={{ maxWidth: 1100 }}>
      <div className="mb-4">
        <p className="text-sm font-semibold mb-2" style={{ color: 'var(--accent)' }}>知識管理</p>
        <h1 className="text-4xl font-bold text-neutral-900 tracking-tight mb-3">讀書筆記、歷史與跨領域思考的整理</h1>
        <p className="text-base text-neutral-500 mb-1">這裡只放精選摘要與心得。</p>
        <p className="text-sm text-neutral-400">完整的心智圖與長文筆記收錄在我的知識宮殿。</p>
      </div>

      {/* 讀書清單 */}
      <section className="py-11 border-b border-neutral-200/70">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">讀書清單</h2>
          {books.length > 0 && (
            <p className="text-sm text-neutral-400">
              共 <span className="font-semibold" style={{ color: 'var(--accent)' }}>{books.length}</span> 本書籍 ·
              資料來源：Notion
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 mb-8 text-sm">
            ⚠ {error}
          </div>
        )}

        {books.length > 0 && <BookList books={books} categories={categories} />}
      </section>

      {/* 文章筆記（含歷史、跨領域思考） */}
      <section className="py-11">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">文章筆記</h2>
          {formattedPosts.length > 0 && (
            <p className="text-sm text-neutral-400">
              共 <span className="font-semibold" style={{ color: 'var(--accent)' }}>{formattedPosts.length}</span> 篇文章
            </p>
          )}
        </div>

        {formattedPosts.length === 0 ? (
          <p className="text-neutral-400 text-center py-12">尚無文章</p>
        ) : (
          <div className="flex flex-col rounded-2xl border border-neutral-200/70 bg-neutral-200/70 overflow-hidden shadow-sm" style={{ gap: 1 }}>
            {formattedPosts.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
                className="bg-white px-6 py-5 flex items-center gap-4 hover:bg-neutral-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-bold text-neutral-900 tracking-tight mb-1">{post.title}</div>
                  <div className="text-sm text-neutral-500 truncate">{post.summary}</div>
                </div>
                <div className="flex items-center gap-3 text-xs text-neutral-400 whitespace-nowrap">
                  {post.tags[0] && (
                    <span
                      className="px-2.5 py-1 rounded-full font-semibold"
                      style={
                        post.category === 'knowledge'
                          ? { background: 'color-mix(in srgb, var(--accent) 12%, transparent)', color: 'var(--accent)' }
                          : { background: 'rgba(0,0,0,.05)', color: 'var(--text-secondary)' }
                      }
                    >
                      {post.tags[0]}
                    </span>
                  )}
                  <span className="flex items-center gap-1"><Clock size={12} />{post.readingTimeMinutes} 分鐘</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

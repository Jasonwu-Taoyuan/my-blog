import { fetchBooks, type Book } from '@/lib/notion'
import { prisma } from '@/lib/prisma'
import { KNOWLEDGE_LEGACY_CATEGORIES } from '@/lib/categories'
import BookList from './BookList'
import PostList from '@/components/post/PostList'

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
    tags: JSON.parse(post.tags || '[]'),
  }))

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-100 mb-3">知識管理</h1>
        <p className="text-lg text-slate-400">讀書筆記、歷史與跨領域思考的整理</p>
        <p className="text-sm text-slate-500 mt-2">
          這裡只放精選摘要與心得，完整的心智圖與長文筆記收錄在我的知識宮殿。
        </p>
      </div>

      {/* 讀書清單 */}
      <section className="mb-16">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-100">讀書清單</h2>
          {books.length > 0 && (
            <p className="text-sm text-slate-500">
              共 <span className="text-amber-400 font-semibold">{books.length}</span> 本書籍 ·
              資料來源：Notion
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-300 mb-8">
            ⚠ {error}
          </div>
        )}

        {books.length > 0 && <BookList books={books} categories={categories} />}
      </section>

      {/* 文章筆記（含歷史、跨領域思考） */}
      <section>
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-100">文章筆記</h2>
          {formattedPosts.length > 0 && (
            <p className="text-sm text-slate-500">
              共 <span className="text-amber-400 font-semibold">{formattedPosts.length}</span> 篇文章
            </p>
          )}
        </div>
        <PostList posts={formattedPosts} />
      </section>
    </div>
  )
}

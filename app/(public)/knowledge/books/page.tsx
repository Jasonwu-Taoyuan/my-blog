import Link from 'next/link'
import { auth } from '@/auth'
import { fetchBooks, type Book } from '@/lib/notion'
import { prisma } from '@/lib/prisma'
import BookList from './BookList'
import UnhideButton from './UnhideButton'

export const revalidate = 86400 // 每 24 小時從 Notion 重新抓取

export const metadata = {
  title: '讀書清單 | My Blog',
  description: '借閱過的書籍與分類摘要',
}

export default async function BooksPage() {
  const session = await auth()

  let books: Book[] = []
  let error = ''

  try {
    books = await fetchBooks()
  } catch (e: any) {
    error = e.message || '無法載入書單，請確認 Notion API Key 設定是否正確。'
    console.error('Notion fetch error:', e)
  }

  const hidden = await prisma.hiddenBook.findMany({ orderBy: { createdAt: 'desc' } })
  const hiddenIds = new Set(hidden.map((h) => h.notionId))
  const visibleBooks = books.filter((b) => !hiddenIds.has(b.id))
  const hiddenBooks = books.filter((b) => hiddenIds.has(b.id))

  const reviews = await prisma.bookReview.findMany()
  const ratings = Object.fromEntries(
    reviews.filter((r) => r.rating).map((r) => [r.notionId, r.rating as number])
  )

  const categories = [...new Set(visibleBooks.map((b) => b.mainCategory).filter(Boolean))].sort()

  return (
    <div className="container mx-auto px-4 py-12" style={{ maxWidth: 1100 }}>
      <Link
        href="/knowledge"
        className="inline-flex items-center gap-2 text-neutral-400 hover:text-[var(--accent)] transition-colors mb-6 text-sm"
      >
        ← 返回知識管理
      </Link>

      <div className="mb-8 flex items-baseline justify-between flex-wrap gap-2">
        <h1 className="text-4xl font-bold text-neutral-900 tracking-tight">讀書清單</h1>
        {visibleBooks.length > 0 && (
          <p className="text-sm text-neutral-400">
            共 <span className="font-semibold" style={{ color: 'var(--accent)' }}>{visibleBooks.length}</span> 本書籍 ·
            資料來源：Notion
          </p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 mb-8 text-sm">
          ⚠ {error}
        </div>
      )}

      {visibleBooks.length > 0 && (
        <BookList books={visibleBooks} categories={categories} isAdmin={!!session} ratings={ratings} />
      )}

      {session && hiddenBooks.length > 0 && (
        <section className="mt-14 pt-8 border-t border-neutral-200/70">
          <h2 className="text-sm font-semibold text-neutral-400 mb-4">已隱藏書籍（{hiddenBooks.length}）</h2>
          <div className="flex flex-col gap-2">
            {hiddenBooks.map((book) => (
              <div
                key={book.id}
                className="flex items-center justify-between bg-neutral-50 border border-neutral-200/70 rounded-xl px-4 py-3"
              >
                <span className="text-sm text-neutral-500">{book.title}</span>
                <UnhideButton notionId={book.id} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

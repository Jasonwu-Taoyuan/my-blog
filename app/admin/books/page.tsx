import Link from 'next/link'
import { BookOpen, Edit } from 'lucide-react'

import { fetchBooks, type Book } from '@/lib/notion'
import { prisma } from '@/lib/prisma'
import StarRating from '@/components/books/StarRating'
import UnhideButton from '@/components/books/UnhideButton'

export default async function AdminBooksPage() {
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
  const reviewMap = new Map(reviews.map((r) => [r.notionId, r]))

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <BookOpen className="h-7 w-7 text-[var(--accent)]" />
        <h1 className="text-3xl font-bold text-neutral-900">讀書清單管理</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 mb-8 text-sm">
          ⚠ {error}
        </div>
      )}

      {visibleBooks.length === 0 ? (
        !error && (
          <div className="text-center py-20 bg-neutral-50 rounded-xl border border-neutral-200">
            <BookOpen className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-400">尚無書籍資料</p>
          </div>
        )
      ) : (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">書名</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">分類</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">評價</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">摘要</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">心得</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-400 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {visibleBooks.map((book) => {
                const review = reviewMap.get(book.id)
                return (
                  <tr key={book.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-neutral-800">
                      {book.number && <span className="text-neutral-400 mr-1">#{book.number}</span>}
                      {book.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--accent)]">{book.mainCategory || '—'}</td>
                    <td className="px-6 py-4">
                      {review?.rating ? (
                        <StarRating rating={review.rating} size={15} />
                      ) : (
                        <span className="text-sm text-neutral-300">未評價</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-400 max-w-xs truncate">
                      {review?.summary || '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-400 max-w-xs truncate">
                      {review?.notes || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <Link
                          href={`/admin/books/${book.id}/edit`}
                          className="text-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {hiddenBooks.length > 0 && (
        <section className="mt-10 pt-8 border-t border-neutral-200/70">
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

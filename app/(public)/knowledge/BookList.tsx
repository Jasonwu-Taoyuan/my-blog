'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { Book } from '@/lib/notion'

interface Props {
  books: Book[]
  categories: string[]
}

export default function BookList({ books, categories }: Props) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('全部')

  const filtered = useMemo(() => {
    return books.filter((book) => {
      const matchCat =
        activeCategory === '全部' || book.mainCategory === activeCategory
      const q = search.toLowerCase()
      const matchSearch =
        !q ||
        book.title.toLowerCase().includes(q) ||
        book.mainCategory.toLowerCase().includes(q) ||
        book.subCategory.toLowerCase().includes(q)
      return matchCat && matchSearch
    })
  }, [books, search, activeCategory])

  const categoryCount = useMemo(() => {
    const map: Record<string, number> = { 全部: books.length }
    categories.forEach((cat) => {
      map[cat] = books.filter((b) => b.mainCategory === cat).length
    })
    return map
  }, [books, categories])

  return (
    <div>
      {/* 搜尋欄 */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="搜尋書名、分類..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-96 bg-white border border-neutral-200 rounded-xl px-4 py-2 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)] transition-colors"
        />
      </div>

      {/* 分類篩選 */}
      <div className="flex flex-wrap gap-2 mb-8">
        {['全部', ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-[var(--accent)] text-white'
                : 'bg-neutral-100 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200'
            }`}
          >
            {cat}
            <span className="ml-1.5 text-xs opacity-70">
              {categoryCount[cat] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* 結果數量 */}
      <p className="text-sm text-neutral-400 mb-4">
        顯示 {filtered.length} / {books.length} 本
      </p>

      {/* 書籍列表 */}
      {filtered.length === 0 ? (
        <p className="text-neutral-400 text-center py-12">找不到符合的書籍</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((book) => (
            <Link
              key={book.id}
              href={`/knowledge/${book.id}`}
              className="block bg-white border border-neutral-200/70 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
            >
              {/* 編號 + 書名 */}
              <div className="flex items-start gap-3 mb-3">
                {book.number && (
                  <span className="text-xs text-neutral-400 mt-1 shrink-0">
                    #{book.number}
                  </span>
                )}
                <h3 className="text-neutral-900 font-semibold text-base leading-snug group-hover:text-[var(--accent)] transition-colors">
                  {book.title}
                </h3>
              </div>

              {/* 標籤 */}
              <div className="flex flex-wrap gap-2">
                {book.mainCategory && (
                  <span className="text-xs bg-[var(--accent)]/10 text-[var(--accent)] px-2 py-0.5 rounded-full">
                    {book.mainCategory}
                  </span>
                )}
                {book.subCategory && (
                  <span className="text-xs bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full">
                    {book.subCategory}
                  </span>
                )}
              </div>

              {/* 借閱日期 + 閱讀提示 */}
              <div className="flex items-center justify-between mt-3">
                {book.borrowDate ? (
                  <p className="text-xs text-neutral-400">
                    借閱：
                    {new Date(book.borrowDate).toLocaleDateString('zh-TW', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                ) : <span />}
                <span className="text-xs text-neutral-400 group-hover:text-[var(--accent)] transition-colors">
                  查看摘要 →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

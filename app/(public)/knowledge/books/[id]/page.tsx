import { notFound } from 'next/navigation'
import Link from 'next/link'
import { fetchBookById, fetchBookBlocks } from '@/lib/notion'
import { prisma } from '@/lib/prisma'
import StarRating from '@/components/books/StarRating'

export const revalidate = 3600

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const book = await fetchBookById(id)
  if (!book) return { title: 'Not Found' }
  return {
    title: `${book.title} | 讀書清單`,
    description: `${book.mainCategory} · ${book.subCategory}`,
  }
}

export default async function BookDetailPage({ params }: Props) {
  const { id } = await params
  const [book, blocks, review] = await Promise.all([
    fetchBookById(id),
    fetchBookBlocks(id),
    prisma.bookReview.findUnique({ where: { notionId: id } }),
  ])

  if (!book) notFound()

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      {/* 返回 */}
      <Link
        href="/knowledge/books"
        className="inline-flex items-center gap-2 text-neutral-400 hover:text-[var(--accent)] transition-colors mb-8 text-sm"
      >
        ← 返回讀書清單
      </Link>

      {/* 書籍資訊 */}
      <div className="mb-10">
        {book.number && (
          <p className="text-neutral-400 text-sm mb-2">#{book.number}</p>
        )}
        <h1 className="text-3xl font-bold text-neutral-900 tracking-tight mb-4 leading-snug">
          {book.title}
        </h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {book.mainCategory && (
            <span className="text-sm bg-[var(--accent)]/10 text-[var(--accent)] px-3 py-1 rounded-full">
              {book.mainCategory}
            </span>
          )}
          {book.subCategory && (
            <span className="text-sm bg-neutral-100 text-neutral-500 px-3 py-1 rounded-full">
              {book.subCategory}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-neutral-400">
          {book.borrowDate && (
            <span>
              借閱日期：
              {new Date(book.borrowDate).toLocaleDateString('zh-TW', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          )}
          {book.callNumber && <span>索書號：{book.callNumber}</span>}
        </div>
      </div>

      {/* 評價與心得 */}
      {(review?.rating || review?.review) && (
        <div className="bg-[var(--accent)]/5 border border-[var(--accent)]/10 rounded-2xl p-6 mb-8">
          {review.rating && (
            <div className="flex items-center gap-2 mb-3">
              <StarRating rating={review.rating} size={18} />
            </div>
          )}
          {review.review && (
            <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">{review.review}</p>
          )}
        </div>
      )}

      {/* 分隔線 */}
      <hr className="border-neutral-200 mb-8" />

      {/* Notion 內容 */}
      {blocks.length === 0 ? (
        <p className="text-neutral-400">尚無摘要內容</p>
      ) : (
        <div className="space-y-4">
          {blocks.map((block) => {
            if (!block.content && block.type !== 'divider') return null

            switch (block.type) {
              case 'heading_1':
                return (
                  <h1 key={block.id} className="text-2xl font-bold text-neutral-900 mt-8 mb-2">
                    {block.content}
                  </h1>
                )
              case 'heading_2':
                return (
                  <h2 key={block.id} className="text-xl font-semibold mt-6 mb-2" style={{ color: 'var(--accent)' }}>
                    {block.content}
                  </h2>
                )
              case 'heading_3':
                return (
                  <h3 key={block.id} className="text-lg font-semibold text-neutral-800 mt-4 mb-1">
                    {block.content}
                  </h3>
                )
              case 'paragraph':
                return (
                  <p key={block.id} className="text-neutral-600 leading-relaxed">
                    {block.content}
                  </p>
                )
              case 'bulleted_list_item':
                return (
                  <li key={block.id} className="text-neutral-600 leading-relaxed ml-4 list-disc">
                    {block.content}
                  </li>
                )
              case 'numbered_list_item':
                return (
                  <li key={block.id} className="text-neutral-600 leading-relaxed ml-4 list-decimal">
                    {block.content}
                  </li>
                )
              case 'quote':
                return (
                  <blockquote
                    key={block.id}
                    className="border-l-[3px] pl-4 text-neutral-500 italic"
                    style={{ borderColor: 'var(--accent)' }}
                  >
                    {block.content}
                  </blockquote>
                )
              case 'divider':
                return <hr key={block.id} className="border-neutral-200" />
              case 'code':
                return (
                  <pre
                    key={block.id}
                    className="bg-neutral-900 text-neutral-100 rounded-xl p-4 text-sm overflow-x-auto"
                  >
                    <code>{block.content}</code>
                  </pre>
                )
              default:
                return block.content ? (
                  <p key={block.id} className="text-neutral-600 leading-relaxed">
                    {block.content}
                  </p>
                ) : null
            }
          })}
        </div>
      )}
    </div>
  )
}

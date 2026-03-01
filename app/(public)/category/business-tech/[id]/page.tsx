import { notFound } from 'next/navigation'
import Link from 'next/link'
import { fetchBookById, fetchBookBlocks } from '@/lib/notion'
import { prisma } from '@/lib/prisma'
import { GitBranch } from 'lucide-react'

export const revalidate = 3600

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const book = await fetchBookById(id)
  if (!book) return { title: 'Not Found' }
  return {
    title: `${book.title} | 商業與科技書籍`,
    description: `${book.mainCategory} · ${book.subCategory}`,
  }
}

export default async function BookDetailPage({ params }: Props) {
  const { id } = await params
  const [book, blocks, mindMap] = await Promise.all([
    fetchBookById(id),
    fetchBookBlocks(id),
    prisma.mindMap.findFirst({
      where: { bookId: id },
      select: { id: true, title: true },
    }),
  ])

  if (!book) notFound()

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      {/* 返回 */}
      <Link
        href="/category/business-tech"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors mb-8 text-sm"
      >
        ← 返回書單
      </Link>

      {/* 書籍資訊 */}
      <div className="mb-10">
        {book.number && (
          <p className="text-slate-500 text-sm mb-2">#{book.number}</p>
        )}
        <h1 className="text-3xl font-bold text-slate-100 mb-4 leading-snug">
          {book.title}
        </h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {book.mainCategory && (
            <span className="text-sm bg-amber-500/15 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full">
              {book.mainCategory}
            </span>
          )}
          {book.subCategory && (
            <span className="text-sm bg-slate-700 text-slate-300 px-3 py-1 rounded-full">
              {book.subCategory}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-slate-500">
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

      {/* 思維導圖連結 */}
      {mindMap && (
        <div className="mb-6">
          <Link
            href={`/mind-maps/${mindMap.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg hover:bg-amber-500/20 transition-colors text-sm font-medium"
          >
            <GitBranch className="h-4 w-4" />
            查看思維導圖：{mindMap.title}
          </Link>
        </div>
      )}

      {/* 分隔線 */}
      <hr className="border-slate-700 mb-8" />

      {/* Notion 內容 */}
      {blocks.length === 0 ? (
        <p className="text-slate-500">尚無摘要內容</p>
      ) : (
        <div className="space-y-4">
          {blocks.map((block) => {
            if (!block.content && block.type !== 'divider') return null

            switch (block.type) {
              case 'heading_1':
                return (
                  <h1 key={block.id} className="text-2xl font-bold text-slate-100 mt-8 mb-2">
                    {block.content}
                  </h1>
                )
              case 'heading_2':
                return (
                  <h2 key={block.id} className="text-xl font-semibold text-amber-400 mt-6 mb-2">
                    {block.content}
                  </h2>
                )
              case 'heading_3':
                return (
                  <h3 key={block.id} className="text-lg font-semibold text-slate-200 mt-4 mb-1">
                    {block.content}
                  </h3>
                )
              case 'paragraph':
                return (
                  <p key={block.id} className="text-slate-300 leading-relaxed">
                    {block.content}
                  </p>
                )
              case 'bulleted_list_item':
                return (
                  <li key={block.id} className="text-slate-300 leading-relaxed ml-4 list-disc">
                    {block.content}
                  </li>
                )
              case 'numbered_list_item':
                return (
                  <li key={block.id} className="text-slate-300 leading-relaxed ml-4 list-decimal">
                    {block.content}
                  </li>
                )
              case 'quote':
                return (
                  <blockquote
                    key={block.id}
                    className="border-l-4 border-amber-500 pl-4 text-slate-400 italic"
                  >
                    {block.content}
                  </blockquote>
                )
              case 'divider':
                return <hr key={block.id} className="border-slate-700" />
              case 'code':
                return (
                  <pre
                    key={block.id}
                    className="bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm text-slate-300 overflow-x-auto"
                  >
                    <code>{block.content}</code>
                  </pre>
                )
              default:
                return block.content ? (
                  <p key={block.id} className="text-slate-300 leading-relaxed">
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

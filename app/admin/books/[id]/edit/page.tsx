import { notFound } from 'next/navigation'

import { fetchBookById, fetchBookBlocks, blocksToText } from '@/lib/notion'
import { prisma } from '@/lib/prisma'
import BookReviewForm from './BookReviewForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditBookReviewPage({ params }: Props) {
  const { id } = await params
  const book = await fetchBookById(id)
  if (!book) notFound()

  const hidden = await prisma.hiddenBook.findUnique({ where: { notionId: id } })
  if (hidden) notFound()

  const review = await prisma.bookReview.findUnique({ where: { notionId: id } })

  // 尚未儲存過摘要時，帶入 Notion 頁面原有的內容作為起始文字
  let initialSummary = review?.summary || ''
  if (!initialSummary) {
    try {
      const blocks = await fetchBookBlocks(id)
      initialSummary = blocksToText(blocks)
    } catch {
      // Notion 無法連線時忽略，讓摘要維持空白
    }
  }

  return (
    <div>
      <p className="text-sm text-neutral-400 mb-1">編輯讀書清單評價</p>
      <h1 className="text-3xl font-bold text-neutral-900 mb-6">{book.title}</h1>
      <BookReviewForm
        notionId={id}
        initialRating={review?.rating || 0}
        initialSummary={initialSummary}
        initialNotes={review?.notes || ''}
      />
    </div>
  )
}

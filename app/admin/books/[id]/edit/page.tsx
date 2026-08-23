import { notFound } from 'next/navigation'

import { fetchBookById } from '@/lib/notion'
import { prisma } from '@/lib/prisma'
import BookReviewForm from './BookReviewForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditBookReviewPage({ params }: Props) {
  const { id } = await params
  const book = await fetchBookById(id)
  if (!book) notFound()

  const review = await prisma.bookReview.findUnique({ where: { notionId: id } })

  return (
    <div>
      <p className="text-sm text-neutral-400 mb-1">編輯讀書清單評價</p>
      <h1 className="text-3xl font-bold text-neutral-900 mb-6">{book.title}</h1>
      <BookReviewForm
        notionId={id}
        initialRating={review?.rating || 0}
        initialReview={review?.review || ''}
      />
    </div>
  )
}

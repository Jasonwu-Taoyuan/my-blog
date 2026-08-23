import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { notionId, rating, review } = body

    if (!notionId) {
      return NextResponse.json({ error: 'notionId is required' }, { status: 400 })
    }
    if (rating != null && (rating < 1 || rating > 5)) {
      return NextResponse.json({ error: 'rating must be between 1 and 5' }, { status: 400 })
    }

    const hidden = await prisma.hiddenBook.findUnique({ where: { notionId: String(notionId) } })
    if (hidden) {
      return NextResponse.json({ error: 'Cannot review a hidden book' }, { status: 400 })
    }

    const data = {
      rating: rating != null ? Number(rating) : null,
      review: review || null,
    }

    const saved = await prisma.bookReview.upsert({
      where: { notionId: String(notionId) },
      update: data,
      create: { notionId: String(notionId), ...data },
    })

    return NextResponse.json(saved)
  } catch (error) {
    console.error('POST /api/book-reviews error:', error)
    return NextResponse.json(
      { error: 'Failed to save book review' },
      { status: 500 }
    )
  }
}

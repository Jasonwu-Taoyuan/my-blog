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
    const { notionId } = body

    if (!notionId) {
      return NextResponse.json({ error: 'notionId is required' }, { status: 400 })
    }

    const hidden = await prisma.hiddenBook.upsert({
      where: { notionId: String(notionId) },
      update: {},
      create: { notionId: String(notionId) },
    })

    return NextResponse.json(hidden)
  } catch (error) {
    console.error('POST /api/hidden-books error:', error)
    return NextResponse.json(
      { error: 'Failed to hide book' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ notionId: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { notionId } = await params
    await prisma.hiddenBook.deleteMany({ where: { notionId } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/hidden-books/[notionId] error:', error)
    return NextResponse.json(
      { error: 'Failed to unhide book' },
      { status: 500 }
    )
  }
}

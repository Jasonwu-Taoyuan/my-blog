import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const bookId = request.nextUrl.searchParams.get('bookId')
    const where: any = {}
    if (bookId) where.bookId = bookId

    const mindMaps = await prisma.mindMap.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      select: { id: true, title: true, bookTitle: true, bookId: true, createdAt: true, updatedAt: true },
    })
    return NextResponse.json({ mindMaps })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch mind maps' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { title, bookTitle, bookId, data } = await request.json()
    if (!title || !data) {
      return NextResponse.json({ error: 'title and data are required' }, { status: 400 })
    }

    const mindMap = await prisma.mindMap.create({
      data: {
        title,
        bookTitle: bookTitle || null,
        bookId: bookId || null,
        data: typeof data === 'string' ? data : JSON.stringify(data),
      },
    })
    return NextResponse.json(mindMap)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create mind map' }, { status: 500 })
  }
}

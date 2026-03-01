import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

interface Params {
  params: Promise<{ id: string }>
}

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params
  const mindMap = await prisma.mindMap.findUnique({ where: { id } })
  if (!mindMap) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(mindMap)
}

export async function PUT(request: Request, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { title, bookTitle, bookId, data } = await request.json()

  try {
    const mindMap = await prisma.mindMap.update({
      where: { id },
      data: {
        title,
        bookTitle: bookTitle || null,
        bookId: bookId || null,
        data: typeof data === 'string' ? data : JSON.stringify(data),
      },
    })
    return NextResponse.json(mindMap)
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  try {
    await prisma.mindMap.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}

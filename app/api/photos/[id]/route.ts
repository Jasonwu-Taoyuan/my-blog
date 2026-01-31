import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { removeNullValues } from '@/lib/utils'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { description } = body

    const photo = await prisma.photo.update({
      where: { id },
      data: {
        ...(description ? { description } : {}),
      },
    })

    return NextResponse.json(photo)
  } catch (error) {
    console.error('PATCH /api/photos/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to update photo' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await prisma.photo.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/photos/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to delete photo' },
      { status: 500 }
    )
  }
}

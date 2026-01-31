import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { removeNullValues } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const album = searchParams.get('album')

    const where: any = {}
    if (album) {
      where.album = album
    }

    const photos = await prisma.photo.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ photos })
  } catch (error) {
    console.error('GET /api/photos error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch photos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, imageUrl, album, description, takenAt, linkUrl } = body

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      )
    }

    const data: Prisma.PhotoCreateInput = {
      imageUrl,
    }

    if (title) {
      data.title = String(title)
    }
    if (album) {
      data.album = String(album)
    }
    if (description) {
      data.description = String(description)
    }
    if (takenAt) {
      data.takenAt = new Date(takenAt)
    }
    if (linkUrl) {
      data.linkUrl = String(linkUrl)
    }

    const photo = await prisma.photo.create({ data })

    return NextResponse.json(photo)
  } catch (error) {
    console.error('POST /api/photos error:', error)
    return NextResponse.json(
      { error: 'Failed to create photo' },
      { status: 500 }
    )
  }
}

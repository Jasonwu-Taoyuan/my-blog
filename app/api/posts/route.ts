import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { generateSlug, calculateReadingTime, removeNullValues } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const tag = searchParams.get('tag')
    const q = searchParams.get('q')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 10

    const session = await auth()
    const where: any = {}

    if (!session) {
      where.status = 'published'
    } else if (status) {
      where.status = status
    }

    if (tag) {
      where.tags = { contains: tag }
    }

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { summary: { contains: q, mode: 'insensitive' } },
      ]
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          author: {
            select: { name: true, email: true },
          },
        },
      }),
      prisma.post.count({ where }),
    ])

    const formattedPosts = posts.map((post) => ({
      ...post,
      tags: JSON.parse(post.tags || '[]'),
    }))

    return NextResponse.json({
      posts: formattedPosts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('GET /api/posts error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
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
    const {
      title,
      summary,
      content,
      coverImageUrl,
      tags,
      category,
      status = 'draft',
    } = body

    if (!title || !summary || !content) {
      return NextResponse.json(
        { error: 'Title, summary, and content are required' },
        { status: 400 }
      )
    }

    const slug = generateSlug(title)
    const readingTimeMinutes = calculateReadingTime(content)

    const data: any = {
      title,
      slug,
      summary,
      content,
      tags: JSON.stringify(tags || []),
      status,
      readingTimeMinutes,
      authorId: session.user.id,
    }

    if (coverImageUrl !== null && coverImageUrl !== undefined) {
      data.coverImageUrl = coverImageUrl
    }
    if (category !== null && category !== undefined) {
      data.category = category
    }
    if (status === 'published') {
      data.publishedAt = new Date()
    }

    const post = await prisma.post.create({ data })

    return NextResponse.json({
      ...post,
      tags: JSON.parse(post.tags),
    })
  } catch (error) {
    console.error('POST /api/posts error:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}

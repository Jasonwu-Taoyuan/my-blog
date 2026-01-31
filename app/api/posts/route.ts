import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { generateSlug, calculateReadingTime } from '@/lib/utils'

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

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        summary,
        content,
        coverImageUrl,
        tags: JSON.stringify(tags || []),
        category,
        status,
        publishedAt: status === 'published' ? new Date() : undefined,
        readingTimeMinutes,
        authorId: session.user.id,
      },
    })

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

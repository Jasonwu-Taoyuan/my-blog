import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const about = await prisma.about.findFirst()

    if (!about) {
      return NextResponse.json(
        { error: 'About page not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...about,
      links: JSON.parse(about.links || '[]'),
      experience: about.experience ? JSON.parse(about.experience) : null,
      skills: about.skills ? JSON.parse(about.skills) : null,
    })
  } catch (error) {
    console.error('GET /api/about error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch about page' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { displayName, headline, bioMarkdown, links, experience, skills } =
      body

    if (!displayName || !headline || !bioMarkdown) {
      return NextResponse.json(
        { error: 'Display name, headline, and bio are required' },
        { status: 400 }
      )
    }

    const existingAbout = await prisma.about.findFirst()

    const data = {
      displayName,
      headline,
      bioMarkdown,
      links: JSON.stringify(links || []),
      experience: experience ? JSON.stringify(experience) : null,
      skills: skills ? JSON.stringify(skills) : null,
    }

    let about
    if (existingAbout) {
      about = await prisma.about.update({
        where: { id: existingAbout.id },
        data,
      })
    } else {
      about = await prisma.about.create({ data })
    }

    return NextResponse.json({
      ...about,
      links: JSON.parse(about.links),
      experience: about.experience ? JSON.parse(about.experience) : null,
      skills: about.skills ? JSON.parse(about.skills) : null,
    })
  } catch (error) {
    console.error('PUT /api/about error:', error)
    return NextResponse.json(
      { error: 'Failed to update about page' },
      { status: 500 }
    )
  }
}

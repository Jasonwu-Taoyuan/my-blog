import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const trips = await prisma.trip.findMany({
      orderBy: { visitedAt: 'desc' },
    })

    return NextResponse.json({ trips })
  } catch (error) {
    console.error('GET /api/trips error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trips' },
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
    const { placeName, country, lat, lng, visitedAt, note, coverImageUrl } = body

    if (!placeName || lat === undefined || lat === null || lng === undefined || lng === null) {
      return NextResponse.json(
        { error: 'placeName, lat and lng are required' },
        { status: 400 }
      )
    }

    const data: Prisma.TripCreateInput = {
      placeName: String(placeName),
      lat: Number(lat),
      lng: Number(lng),
    }

    if (country) data.country = String(country)
    if (visitedAt) data.visitedAt = new Date(visitedAt)
    if (note) data.note = String(note)
    if (coverImageUrl) data.coverImageUrl = String(coverImageUrl)

    const trip = await prisma.trip.create({ data })

    return NextResponse.json(trip)
  } catch (error) {
    console.error('POST /api/trips error:', error)
    return NextResponse.json(
      { error: 'Failed to create trip' },
      { status: 500 }
    )
  }
}

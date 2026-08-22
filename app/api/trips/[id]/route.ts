import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'

import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const trip = await prisma.trip.findUnique({ where: { id } })

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
    }

    return NextResponse.json(trip)
  } catch (error) {
    console.error('GET /api/trips/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trip' },
      { status: 500 }
    )
  }
}

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
    const { placeName, country, lat, lng, visitedAt, note, coverImageUrl } = body

    const data: Prisma.TripUpdateInput = {}

    if (placeName) data.placeName = String(placeName)
    if (lat !== undefined && lat !== null) data.lat = Number(lat)
    if (lng !== undefined && lng !== null) data.lng = Number(lng)
    if (country !== undefined) data.country = country ? String(country) : null
    if (visitedAt !== undefined) data.visitedAt = visitedAt ? new Date(visitedAt) : null
    if (note !== undefined) data.note = note ? String(note) : null
    if (coverImageUrl !== undefined) data.coverImageUrl = coverImageUrl ? String(coverImageUrl) : null

    const trip = await prisma.trip.update({
      where: { id },
      data,
    })

    return NextResponse.json(trip)
  } catch (error) {
    console.error('PATCH /api/trips/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to update trip' },
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
    await prisma.trip.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/trips/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to delete trip' },
      { status: 500 }
    )
  }
}

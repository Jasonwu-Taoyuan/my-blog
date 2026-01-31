import { NextRequest, NextResponse } from 'next/server'

import { auth } from '@/auth'
import { saveImage } from '@/lib/upload'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = (formData.get('folder') as string) || 'posts'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (folder !== 'posts' && folder !== 'photos') {
      return NextResponse.json({ error: 'Invalid folder' }, { status: 400 })
    }

    const url = await saveImage(file, folder)

    return NextResponse.json({ url })
  } catch (error) {
    console.error('POST /api/upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}

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

    const ext = file.name.split('.').pop()?.toLowerCase() || ''
    const allowedExts = ['jpg', 'jpeg', 'png', 'gif', 'webp']
    if (!allowedExts.includes(ext)) {
      return NextResponse.json(
        {
          error:
            ext === 'heic' || ext === 'heif'
              ? '不支援 iPhone 的 HEIC/HEIF 格式，瀏覽器無法直接顯示，請先在手機或電腦上轉存成 JPG 或 PNG 再上傳。'
              : `不支援的圖片格式（.${ext || '未知'}），請上傳 JPG、PNG、GIF 或 WebP 格式。`,
        },
        { status: 400 }
      )
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

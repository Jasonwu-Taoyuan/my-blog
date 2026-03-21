import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const MIME_TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params

  if (path.length !== 2) {
    return new NextResponse('Not Found', { status: 404 })
  }

  const [folder, filename] = path

  if (folder !== 'posts' && folder !== 'photos') {
    return new NextResponse('Not Found', { status: 404 })
  }

  if (!/^[\w.-]+$/.test(filename)) {
    return new NextResponse('Not Found', { status: 404 })
  }

  const filepath = join(process.cwd(), 'public', 'uploads', folder, filename)

  if (!existsSync(filepath)) {
    return new NextResponse('Not Found', { status: 404 })
  }

  const file = await readFile(filepath)
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  const contentType = MIME_TYPES[ext] || 'application/octet-stream'

  return new NextResponse(file, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}

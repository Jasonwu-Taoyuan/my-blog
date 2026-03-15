import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function saveImage(
  file: File,
  folder: 'posts' | 'photos'
): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const uploadDir = join(process.cwd(), 'public', 'uploads', folder)

  console.log('[upload] process.cwd():', process.cwd())
  console.log('[upload] uploadDir:', uploadDir)

  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true })
  }

  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
  const ext = file.name.split('.').pop()
  const filename = `${uniqueSuffix}.${ext}`
  const filepath = join(uploadDir, filename)

  await writeFile(filepath, buffer)

  console.log('[upload] saved to:', filepath)

  return `/uploads/${folder}/${filename}`
}

export function getImageUrl(path: string): string {
  return path.startsWith('http') ? path : path
}

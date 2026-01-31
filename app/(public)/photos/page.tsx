import { prisma } from '@/lib/prisma'
import PhotoGrid from '@/components/photo/PhotoGrid'

export const metadata = {
  title: 'Photos | My Blog',
  description: 'Photo gallery',
}

export default async function PhotosPage() {
  const photos = await prisma.photo.findMany({
    orderBy: { createdAt: 'desc' },
  })

  // Serialize data for client component
  const serializedPhotos = photos.map(photo => ({
    id: photo.id,
    imageUrl: photo.imageUrl,
    title: photo.title,
    description: photo.description,
  }))

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Photos</h1>
      <PhotoGrid photos={serializedPhotos} />
    </div>
  )
}

'use client'

import { useState } from 'react'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

interface Photo {
  id: string
  imageUrl: string
  title?: string | null
  description?: string | null
}

interface PhotoGridProps {
  photos: Photo[]
}

export default function PhotoGrid({ photos }: PhotoGridProps) {
  const [open, setOpen] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0)

  const slides = photos.map((photo) => ({
    src: photo.imageUrl,
    alt: photo.title || '',
    title: photo.title || '',
    description: photo.description || '',
  }))

  const handlePhotoClick = (index: number) => {
    setPhotoIndex(index)
    setOpen(true)
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No photos found.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div key={photo.id} className="cursor-pointer group">
            <div
              onClick={() => handlePhotoClick(index)}
              className="overflow-hidden rounded-lg"
            >
              <img
                src={photo.imageUrl}
                alt={photo.title || 'Photo'}
                className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            {photo.description && (
              <p className="text-sm text-gray-600 mt-2 text-center">
                {photo.description}
              </p>
            )}
          </div>
        ))}
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        index={photoIndex}
      />
    </>
  )
}

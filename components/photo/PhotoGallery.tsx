'use client'

import { useState } from 'react'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

interface Photo {
  id: string
  title: string | null
  imageUrl: string
  description: string | null
  takenAt: Date | null
  linkUrl: string | null
}

interface PhotoGalleryProps {
  photos: Photo[]
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const slides = photos.map((photo) => ({
    src: photo.imageUrl,
    alt: photo.title || '',
    title: photo.title || undefined,
    description: photo.description || undefined,
  }))

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo, idx) => (
          <div
            key={photo.id}
            className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg"
            onClick={() => {
              setIndex(idx)
              setOpen(true)
            }}
          >
            <Image
              src={photo.imageUrl}
              alt={photo.title || 'Photo'}
              fill
              className="object-cover transition-transform group-hover:scale-110"
            />
            {photo.title && (
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-end">
                <p className="text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  {photo.title}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
      />
    </>
  )
}

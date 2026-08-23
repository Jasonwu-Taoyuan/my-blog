'use client'

import { Star } from 'lucide-react'

interface Props {
  rating: number
  onChange?: (rating: number) => void
  size?: number
}

export default function StarRating({ rating, onChange, size = 18 }: Props) {
  const interactive = !!onChange

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(star)}
          className={interactive ? 'cursor-pointer' : 'cursor-default'}
          aria-label={`${star} 星`}
        >
          <Star
            size={size}
            fill={star <= rating ? '#ff9500' : 'none'}
            stroke={star <= rating ? '#ff9500' : '#d4d4d4'}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  )
}

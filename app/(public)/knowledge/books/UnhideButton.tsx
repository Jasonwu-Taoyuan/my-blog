'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function UnhideButton({ notionId }: { notionId: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleUnhide = async () => {
    setIsLoading(true)
    const res = await fetch(`/api/hidden-books/${notionId}`, { method: 'DELETE' })
    if (res.ok) {
      router.refresh()
    } else {
      alert('取消隱藏失敗，請重試')
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleUnhide}
      disabled={isLoading}
      className="text-xs font-semibold px-3 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors disabled:opacity-50"
    >
      {isLoading ? '處理中...' : '取消隱藏'}
    </button>
  )
}

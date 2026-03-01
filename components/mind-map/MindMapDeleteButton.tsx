'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

export default function MindMapDeleteButton({ id, title }: { id: string; title: string }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`確定要刪除「${title}」嗎？`)) return
    setIsDeleting(true)
    const res = await fetch(`/api/mind-maps/${id}`, { method: 'DELETE' })
    if (res.ok) {
      router.refresh()
    } else {
      alert('刪除失敗')
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-400 hover:text-red-300 disabled:opacity-50 transition-colors"
    >
      <Trash2 className="h-5 w-5" />
    </button>
  )
}

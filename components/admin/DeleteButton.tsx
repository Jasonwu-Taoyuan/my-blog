'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

interface DeleteButtonProps {
  postId: string
  postTitle: string
}

export default function DeleteButton({ postId, postTitle }: DeleteButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`確定要刪除文章「${postTitle}」嗎?此操作無法復原。`)) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('刪除失敗,請重試')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('刪除失敗,請重試')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-900 disabled:opacity-50"
      title="刪除文章"
    >
      <Trash2 className="h-5 w-5" />
    </button>
  )
}

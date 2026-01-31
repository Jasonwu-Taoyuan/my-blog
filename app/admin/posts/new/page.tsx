'use client'

import { useRouter } from 'next/navigation'
import PostEditor from '@/components/post/PostEditor'

export default function NewPostPage() {
  const router = useRouter()

  const handleSave = async (data: any) => {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (response.ok) {
      router.push('/admin/posts')
      router.refresh()
    } else {
      throw new Error('Failed to create post')
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">New Post</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <PostEditor onSave={handleSave} onCancel={() => router.push('/admin/posts')} />
      </div>
    </div>
  )
}

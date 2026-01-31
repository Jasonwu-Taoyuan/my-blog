'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PostEditor from '@/components/post/PostEditor'

interface Props {
  params: Promise<{ id: string }>
}

export default function EditPostPage({ params }: Props) {
  const { id } = use(params)
  const router = useRouter()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPost(data)
        setLoading(false)
      })
  }, [id])

  const handleSave = async (data: any) => {
    const response = await fetch(`/api/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (response.ok) {
      router.push('/admin/posts')
      router.refresh()
    } else {
      throw new Error('Failed to update post')
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Post</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <PostEditor
          initialData={post}
          onSave={handleSave}
          onCancel={() => router.push('/admin/posts')}
        />
      </div>
    </div>
  )
}

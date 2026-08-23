'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { CATEGORIES } from '@/lib/categories'
import 'easymde/dist/easymde.min.css'

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
  ssr: false,
})

interface PostEditorProps {
  initialData?: {
    title: string
    summary: string
    content: string
    coverImageUrl?: string
    tags: string[]
    category?: string
    status: 'draft' | 'published'
  }
  onSave: (data: any) => Promise<void>
  onCancel: () => void
}

export default function PostEditor({
  initialData,
  onSave,
  onCancel,
}: PostEditorProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [summary, setSummary] = useState(initialData?.summary || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [coverImageUrl, setCoverImageUrl] = useState(
    initialData?.coverImageUrl || ''
  )
  const [tags, setTags] = useState(initialData?.tags?.join(', ') || '')
  const [category, setCategory] = useState(initialData?.category || '')
  const [status, setStatus] = useState<'draft' | 'published'>(
    initialData?.status || 'draft'
  )
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'posts')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (data.url) {
        setCoverImageUrl(data.url)
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('圖片上傳失敗')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent, submitStatus?: 'draft' | 'published') => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const postData = {
        title,
        summary,
        content,
        coverImageUrl: coverImageUrl || null,
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        category: category || null,
        status: submitStatus || status,
      }

      await onSave(postData)
    } catch (error) {
      console.error('Save failed:', error)
      alert('文章儲存失敗')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-neutral-600 mb-2">
          標題 *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-600 mb-2">
          摘要 *
        </label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-600 mb-2">
          封面圖片
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={isUploading}
          className="w-full text-neutral-600"
        />
        {coverImageUrl && (
          <img
            src={coverImageUrl}
            alt="Cover"
            className="mt-2 h-32 object-cover rounded"
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-2">
            標籤（以逗號分隔）
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="營運管理, 讀書筆記, 旅遊"
            className="w-full px-4 py-2 bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-2">
            分類 *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
            required
          >
            <option value="">-- 選擇分類 --</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-600 mb-2">
          內容 *（Markdown）
        </label>
        <SimpleMDE value={content} onChange={setContent} />
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-neutral-600 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50"
          disabled={isSaving}
        >
          取消
        </button>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'draft')}
            className="px-4 py-2 text-neutral-600 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50"
            disabled={isSaving}
          >
            {isSaving ? '儲存中...' : '儲存草稿'}
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'published')}
            className="px-4 py-2 text-white bg-[var(--accent)] rounded-lg hover:bg-[var(--accent-hover)]"
            disabled={isSaving}
          >
            {isSaving ? '發布中...' : '發布'}
          </button>
        </div>
      </div>
    </form>
  )
}

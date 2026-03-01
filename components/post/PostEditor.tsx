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
      alert('Failed to upload image')
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
      alert('Failed to save post')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Summary *
        </label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Cover Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={isUploading}
          className="w-full text-slate-300"
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
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Tags (comma separated)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="nextjs, react, typescript"
            className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Category *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Content * (Markdown)
        </label>
        <SimpleMDE value={content} onChange={setContent} />
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-slate-300 bg-slate-800 border border-slate-600 rounded-lg hover:bg-slate-700"
          disabled={isSaving}
        >
          Cancel
        </button>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'draft')}
            className="px-4 py-2 text-slate-300 bg-slate-800 border border-slate-600 rounded-lg hover:bg-slate-700"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'published')}
            className="px-4 py-2 text-white bg-amber-600 rounded-lg hover:bg-amber-700"
            disabled={isSaving}
          >
            {isSaving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>
    </form>
  )
}

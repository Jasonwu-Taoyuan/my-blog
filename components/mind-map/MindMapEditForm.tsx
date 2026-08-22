'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const MindElixirEditor = dynamic(() => import('./MindElixirEditor'), {
  ssr: false,
  loading: () => (
    <div className="w-full rounded-xl border border-neutral-200 bg-neutral-50 animate-pulse" style={{ height: '600px' }} />
  ),
})

interface MindMapData {
  id: string
  title: string
  bookTitle: string | null
  bookId: string | null
  data: string
}

export default function MindMapEditForm({ mindMap }: { mindMap: MindMapData }) {
  const router = useRouter()
  const editorRef = useRef<any>(null)
  const [title, setTitle] = useState(mindMap.title)
  const [bookTitle, setBookTitle] = useState(mindMap.bookTitle || '')
  const [bookId, setBookId] = useState(mindMap.bookId || '')
  const [isSaving, setIsSaving] = useState(false)

  const initialData = JSON.parse(mindMap.data)

  const handleSave = async () => {
    if (!title.trim()) { alert('請輸入標題'); return }
    if (!editorRef.current) { alert('編輯器尚未就緒'); return }

    setIsSaving(true)
    const data = editorRef.current.getData()

    const res = await fetch(`/api/mind-maps/${mindMap.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        bookTitle: bookTitle || null,
        bookId: bookId || null,
        data,
      }),
    })

    if (res.ok) {
      router.push('/admin/mind-maps')
      router.refresh()
    } else {
      alert('儲存失敗，請重試')
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-neutral-600 mb-2">標題 *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-2">關聯書名（可選）</label>
          <input
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
            placeholder="輸入書名"
            className="w-full px-4 py-2 bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-2">Notion Book ID（可選）</label>
          <input
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            placeholder="從書籍 URL 取得"
            className="w-full px-4 py-2 bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </div>
      </div>

      <MindElixirEditor initialData={initialData} editorRef={editorRef} />

      <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
        <button
          onClick={() => router.push('/admin/mind-maps')}
          className="px-4 py-2 border border-neutral-300 text-neutral-600 rounded-lg hover:bg-neutral-50 transition-colors"
          disabled={isSaving}
        >
          取消
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-colors"
        >
          {isSaving ? '儲存中...' : '儲存'}
        </button>
      </div>
    </div>
  )
}

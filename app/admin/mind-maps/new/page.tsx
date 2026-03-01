'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const MindElixirEditor = dynamic(() => import('@/components/mind-map/MindElixirEditor'), {
  ssr: false,
  loading: () => (
    <div className="w-full rounded-xl border border-slate-700 bg-slate-900 animate-pulse" style={{ height: '600px' }} />
  ),
})

export default function NewMindMapPage() {
  const router = useRouter()
  const editorRef = useRef<any>(null)
  const [title, setTitle] = useState('')
  const [bookTitle, setBookTitle] = useState('')
  const [bookId, setBookId] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!title.trim()) { alert('請輸入標題'); return }
    if (!editorRef.current) { alert('編輯器尚未就緒，請稍候再試'); return }

    setIsSaving(true)
    const data = editorRef.current.getData()

    const res = await fetch('/api/mind-maps', {
      method: 'POST',
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
      <h1 className="text-3xl font-bold text-slate-100">新增思維導圖</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-2">標題 *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="思維導圖標題"
            className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">關聯書名（可選）</label>
          <input
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
            placeholder="輸入書名"
            className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Notion Book ID（可選）</label>
          <input
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            placeholder="從書籍 URL 取得"
            className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      <div>
        <p className="text-sm text-slate-500 mb-2">💡 雙擊節點編輯文字，右鍵新增子節點，拖拉重新排列</p>
        <MindElixirEditor editorRef={editorRef} />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
        <button
          onClick={() => router.push('/admin/mind-maps')}
          className="px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
          disabled={isSaving}
        >
          取消
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors font-medium"
        >
          {isSaving ? '儲存中...' : '儲存'}
        </button>
      </div>
    </div>
  )
}

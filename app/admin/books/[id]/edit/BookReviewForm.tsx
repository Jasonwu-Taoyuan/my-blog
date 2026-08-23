'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import StarRating from '@/components/books/StarRating'

interface Props {
  notionId: string
  initialRating: number
  initialSummary: string
  initialNotes: string
}

export default function BookReviewForm({ notionId, initialRating, initialSummary, initialNotes }: Props) {
  const router = useRouter()
  const [rating, setRating] = useState(initialRating)
  const [summary, setSummary] = useState(initialSummary)
  const [notes, setNotes] = useState(initialNotes)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    const res = await fetch('/api/book-reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notionId, rating: rating || null, summary: summary || null, notes: notes || null }),
    })
    if (res.ok) {
      router.push('/admin/books')
      router.refresh()
    } else {
      alert('儲存失敗，請重試')
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 flex flex-col gap-6">
      <div>
        <label className="block text-sm font-medium text-neutral-600 mb-2">評價</label>
        <div className="flex items-center gap-3">
          <StarRating rating={rating} onChange={setRating} size={26} />
          {rating > 0 && (
            <button
              type="button"
              onClick={() => setRating(0)}
              className="text-xs text-neutral-400 hover:text-red-500 transition-colors"
            >
              清除評價
            </button>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="summary" className="block text-sm font-medium text-neutral-600 mb-2">
          摘要
        </label>
        <textarea
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={6}
          placeholder="寫下這本書的重點摘要..."
          className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)] transition-colors resize-y"
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-neutral-600 mb-2">
          心得
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={6}
          placeholder="寫下個人心得..."
          className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)] transition-colors resize-y"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-5 py-2.5 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] transition-colors text-sm font-medium disabled:opacity-50"
        >
          {isSaving ? '儲存中...' : '儲存'}
        </button>
        <button
          onClick={() => router.push('/admin/books')}
          disabled={isSaving}
          className="px-5 py-2.5 bg-neutral-100 text-neutral-600 rounded-lg hover:bg-neutral-200 transition-colors text-sm font-medium disabled:opacity-50"
        >
          取消
        </button>
      </div>
    </div>
  )
}

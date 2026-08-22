'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface TripData {
  id?: string
  placeName: string
  country?: string | null
  lat: number | string
  lng: number | string
  visitedAt?: Date | string | null
  note?: string | null
  coverImageUrl?: string | null
}

function toDateInputValue(value?: Date | string | null) {
  if (!value) return ''
  const d = typeof value === 'string' ? new Date(value) : value
  return d.toISOString().slice(0, 10)
}

export default function TripForm({ trip }: { trip?: TripData }) {
  const router = useRouter()
  const isEditing = Boolean(trip?.id)

  const [placeName, setPlaceName] = useState(trip?.placeName || '')
  const [country, setCountry] = useState(trip?.country || '')
  const [lat, setLat] = useState(trip?.lat != null ? String(trip.lat) : '')
  const [lng, setLng] = useState(trip?.lng != null ? String(trip.lng) : '')
  const [visitedAt, setVisitedAt] = useState(toDateInputValue(trip?.visitedAt))
  const [note, setNote] = useState(trip?.note || '')
  const [coverImageUrl, setCoverImageUrl] = useState(trip?.coverImageUrl || '')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!placeName.trim()) { alert('請輸入地點名稱'); return }
    if (!lat || !lng) { alert('請輸入經緯度'); return }

    setIsSaving(true)
    const payload = {
      placeName,
      country: country || null,
      lat: Number(lat),
      lng: Number(lng),
      visitedAt: visitedAt || null,
      note: note || null,
      coverImageUrl: coverImageUrl || null,
    }

    const res = await fetch(
      isEditing ? `/api/trips/${trip!.id}` : '/api/trips',
      {
        method: isEditing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    )

    if (res.ok) {
      router.push('/admin/travel')
      router.refresh()
    } else {
      alert('儲存失敗，請重試')
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-2">地點名稱 *</label>
          <input
            value={placeName}
            onChange={(e) => setPlaceName(e.target.value)}
            placeholder="例如：京都"
            className="w-full px-4 py-2 bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-2">國家 / 地區</label>
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="例如：日本"
            className="w-full px-4 py-2 bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-2">緯度 (lat) *</label>
          <input
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder="例如：35.0116"
            className="w-full px-4 py-2 bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-2">經度 (lng) *</label>
          <input
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            placeholder="例如：135.7681"
            className="w-full px-4 py-2 bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-2">到訪日期</label>
          <input
            type="date"
            value={visitedAt}
            onChange={(e) => setVisitedAt(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-600 mb-2">封面照片 URL</label>
          <input
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-4 py-2 bg-white border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        </div>
      </div>

      <p className="text-xs text-neutral-400">
        💡 座標可從 Google Maps 上對地點按右鍵複製取得
      </p>

      <div>
        <label className="block text-sm font-medium text-neutral-600 mb-2">備註</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="一句話心得或備註"
          rows={3}
          className="w-full px-4 py-2 bg-white border border-neutral-300 rounded-lg text-neutral-900 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
        <button
          onClick={() => router.push('/admin/travel')}
          className="px-4 py-2 border border-neutral-300 text-neutral-600 rounded-lg hover:bg-neutral-50 transition-colors"
          disabled={isSaving}
        >
          取消
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] disabled:opacity-50 transition-colors font-medium"
        >
          {isSaving ? '儲存中...' : '儲存'}
        </button>
      </div>
    </div>
  )
}

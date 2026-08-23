'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminAboutPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [headline, setHeadline] = useState('')
  const [bioMarkdown, setBioMarkdown] = useState('')
  const [links, setLinks] = useState<any[]>([])
  const [skills, setSkills] = useState('')

  useEffect(() => {
    fetch('/api/about')
      .then((res) => res.json())
      .then((data) => {
        setDisplayName(data.displayName || '')
        setHeadline(data.headline || '')
        setBioMarkdown(data.bioMarkdown || '')
        setLinks(data.links || [])
        setSkills(data.skills?.join(', ') || '')
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName,
          headline,
          bioMarkdown,
          links,
          skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
        }),
      })

      if (response.ok) {
        alert('關於我頁面已更新！')
      } else {
        throw new Error('Failed to update')
      }
    } catch (error) {
      console.error('Save failed:', error)
      alert('更新失敗')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-neutral-400">載入中...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-neutral-900 mb-8">編輯關於我頁面</h1>
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">
              顯示名稱 *
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">
              副標題 *
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full px-4 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">
              個人簡介（Markdown）*
            </label>
            <textarea
              value={bioMarkdown}
              onChange={(e) => setBioMarkdown(e.target.value)}
              rows={10}
              className="w-full px-4 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-2">
              專長（以逗號分隔）
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="營運管理, 流程優化, 團隊領導"
              className="w-full px-4 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.push('/admin/dashboard')}
              className="px-4 py-2 text-neutral-600 bg-neutral-100 border border-neutral-300 rounded-lg hover:bg-neutral-200"
              disabled={saving}
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-[var(--accent)] rounded-lg hover:bg-[var(--accent-hover)]"
              disabled={saving}
            >
              {saving ? '儲存中...' : '儲存變更'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

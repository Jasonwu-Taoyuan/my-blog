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
        alert('About page updated successfully!')
      } else {
        throw new Error('Failed to update')
      }
    } catch (error) {
      console.error('Save failed:', error)
      alert('Failed to update about page')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-slate-400">Loading...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-100 mb-8">Edit About Page</h1>
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Display Name *
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Headline *
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Bio (Markdown) *
            </label>
            <textarea
              value={bioMarkdown}
              onChange={(e) => setBioMarkdown(e.target.value)}
              rows={10}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Skills (comma separated)
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="React, Next.js, TypeScript"
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.push('/admin/dashboard')}
              className="px-4 py-2 text-slate-300 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-amber-600 rounded-lg hover:bg-amber-700"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
  currentTag?: string
  currentQuery?: string
  allTags: string[]
}

export default function SearchBar({
  currentTag,
  currentQuery,
  allTags,
}: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState(currentQuery || '')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (currentTag) params.set('tag', currentTag)
    router.push(`/posts?${params.toString()}`)
  }

  const handleTagClick = (tag: string) => {
    const params = new URLSearchParams()
    params.set('tag', tag)
    if (query) params.set('q', query)
    router.push(`/posts?${params.toString()}`)
  }

  const clearFilters = () => {
    setQuery('')
    router.push('/posts')
  }

  return (
    <div className="mb-8 space-y-4">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Active filters */}
      {(currentTag || currentQuery) && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Active filters:</span>
          {currentTag && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2">
              Tag: {currentTag}
              <button
                onClick={() => {
                  const params = new URLSearchParams()
                  if (query) params.set('q', query)
                  router.push(`/posts?${params.toString()}`)
                }}
                className="hover:text-blue-900"
              >
                <X className="h-4 w-4" />
              </button>
            </span>
          )}
          {currentQuery && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2">
              Search: {currentQuery}
              <button
                onClick={() => {
                  setQuery('')
                  const params = new URLSearchParams()
                  if (currentTag) params.set('tag', currentTag)
                  router.push(`/posts?${params.toString()}`)
                }}
                className="hover:text-blue-900"
              >
                <X className="h-4 w-4" />
              </button>
            </span>
          )}
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Tags */}
      {allTags.length > 0 && (
        <div>
          <p className="text-sm text-gray-600 mb-2">Filter by tag:</p>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  currentTag === tag
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

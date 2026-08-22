'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath?: string
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath = '/posts',
}: PaginationProps) {
  const searchParams = useSearchParams()

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    return `${basePath}?${params.toString()}`
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      {currentPage > 1 && (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="inline-flex items-center px-3 py-2 border border-neutral-200 rounded-lg text-sm font-medium text-neutral-600 bg-white hover:bg-neutral-50"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          上一頁
        </Link>
      )}

      <div className="flex items-center space-x-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          if (
            page === 1 ||
            page === totalPages ||
            (page >= currentPage - 1 && page <= currentPage + 1)
          ) {
            return (
              <Link
                key={page}
                href={createPageUrl(page)}
                className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                  page === currentPage
                    ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                    : 'text-neutral-600 bg-white border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                {page}
              </Link>
            )
          } else if (page === currentPage - 2 || page === currentPage + 2) {
            return (
              <span key={page} className="px-2 text-neutral-400">
                ...
              </span>
            )
          }
          return null
        })}
      </div>

      {currentPage < totalPages && (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="inline-flex items-center px-3 py-2 border border-neutral-200 rounded-lg text-sm font-medium text-neutral-600 bg-white hover:bg-neutral-50"
        >
          下一頁
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      )}
    </div>
  )
}

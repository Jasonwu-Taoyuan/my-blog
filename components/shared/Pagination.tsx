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
          className="inline-flex items-center px-3 py-2 border border-slate-600 rounded-md text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
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
                className={`px-4 py-2 border rounded-md text-sm font-medium ${
                  page === currentPage
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'text-slate-300 bg-slate-800 border-slate-600 hover:bg-slate-700'
                }`}
              >
                {page}
              </Link>
            )
          } else if (page === currentPage - 2 || page === currentPage + 2) {
            return (
              <span key={page} className="px-2 text-slate-500">
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
          className="inline-flex items-center px-3 py-2 border border-slate-600 rounded-md text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      )}
    </div>
  )
}

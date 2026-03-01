import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { GitBranch } from 'lucide-react'

export const metadata = {
  title: '思維導圖 | My Blog',
  description: '以視覺化思維導圖整理書籍與想法',
}

export default async function MindMapsPage() {
  const mindMaps = await prisma.mindMap.findMany({
    orderBy: { updatedAt: 'desc' },
    select: { id: true, title: true, bookTitle: true, updatedAt: true },
  })

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <GitBranch className="h-8 w-8 text-amber-500" />
          <h1 className="text-4xl font-bold text-slate-100">思維導圖</h1>
        </div>
        <p className="text-lg text-slate-400">以視覺化思維導圖整理書籍與想法</p>
        {mindMaps.length > 0 && (
          <p className="text-sm text-slate-500 mt-2">
            共 <span className="text-amber-400 font-semibold">{mindMaps.length}</span> 張思維導圖
          </p>
        )}
      </div>

      {mindMaps.length === 0 ? (
        <div className="text-center py-20">
          <GitBranch className="h-16 w-16 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-500 text-lg mb-2">尚無思維導圖</p>
          <p className="text-slate-600 text-sm">在後台新增思維導圖後會顯示於此</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mindMaps.map((mm) => (
            <Link
              key={mm.id}
              href={`/mind-maps/${mm.id}`}
              className="block bg-slate-800/60 border border-slate-700 rounded-xl p-6 hover:border-amber-500/50 hover:bg-slate-800 transition-colors group"
            >
              <div className="flex items-start gap-3 mb-3">
                <GitBranch className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <h2 className="text-lg font-semibold text-slate-100 group-hover:text-amber-400 transition-colors leading-snug">
                  {mm.title}
                </h2>
              </div>
              {mm.bookTitle && (
                <p className="text-sm text-amber-400/80 mb-3 ml-8">
                  書籍：{mm.bookTitle}
                </p>
              )}
              <div className="flex items-center justify-between ml-8">
                <p className="text-xs text-slate-600">更新於 {formatDate(mm.updatedAt)}</p>
                <span className="text-xs text-slate-600 group-hover:text-amber-500 transition-colors">
                  查看 →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

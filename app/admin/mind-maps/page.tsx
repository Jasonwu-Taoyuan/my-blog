import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Plus, Edit, GitBranch } from 'lucide-react'
import MindMapDeleteButton from '@/components/mind-map/MindMapDeleteButton'

export default async function AdminMindMapsPage() {
  const mindMaps = await prisma.mindMap.findMany({
    orderBy: { updatedAt: 'desc' },
    select: { id: true, title: true, bookTitle: true, updatedAt: true },
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <GitBranch className="h-7 w-7 text-amber-500" />
          <h1 className="text-3xl font-bold text-slate-100">思維導圖管理</h1>
        </div>
        <Link
          href="/admin/mind-maps/new"
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          新增導圖
        </Link>
      </div>

      {mindMaps.length === 0 ? (
        <div className="text-center py-20 bg-slate-800/50 rounded-xl border border-slate-700">
          <GitBranch className="h-12 w-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 mb-4">尚無思維導圖</p>
          <Link
            href="/admin/mind-maps/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm"
          >
            <Plus className="h-4 w-4" />
            建立第一張思維導圖
          </Link>
        </div>
      ) : (
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-800/80">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">標題</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">關聯書籍</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">更新時間</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {mindMaps.map((mm) => (
                <tr key={mm.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-200">{mm.title}</td>
                  <td className="px-6 py-4 text-sm text-amber-400">{mm.bookTitle || '—'}</td>
                  <td className="px-6 py-4 text-sm text-slate-400">{formatDate(mm.updatedAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end items-center gap-3">
                      <Link
                        href={`/admin/mind-maps/${mm.id}/edit`}
                        className="text-amber-500 hover:text-amber-400 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <MindMapDeleteButton id={mm.id} title={mm.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

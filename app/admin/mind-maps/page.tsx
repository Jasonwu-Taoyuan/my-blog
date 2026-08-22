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
          <GitBranch className="h-7 w-7 text-[var(--accent)]" />
          <h1 className="text-3xl font-bold text-neutral-900">思維導圖管理</h1>
        </div>
        <Link
          href="/admin/mind-maps/new"
          className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] transition-colors text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          新增導圖
        </Link>
      </div>

      {mindMaps.length === 0 ? (
        <div className="text-center py-20 bg-neutral-50 rounded-xl border border-neutral-200">
          <GitBranch className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
          <p className="text-neutral-400 mb-4">尚無思維導圖</p>
          <Link
            href="/admin/mind-maps/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] transition-colors text-sm"
          >
            <Plus className="h-4 w-4" />
            建立第一張思維導圖
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">標題</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">關聯書籍</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">更新時間</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-400 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {mindMaps.map((mm) => (
                <tr key={mm.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-neutral-800">{mm.title}</td>
                  <td className="px-6 py-4 text-sm text-[var(--accent)]">{mm.bookTitle || '—'}</td>
                  <td className="px-6 py-4 text-sm text-neutral-400">{formatDate(mm.updatedAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end items-center gap-3">
                      <Link
                        href={`/admin/mind-maps/${mm.id}/edit`}
                        className="text-[var(--accent)] hover:text-[var(--accent)] transition-colors"
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

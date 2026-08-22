import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Plus, Edit, MapPin } from 'lucide-react'
import TripDeleteButton from '@/components/travel/TripDeleteButton'

export default async function AdminTravelPage() {
  const trips = await prisma.trip.findMany({
    orderBy: { visitedAt: 'desc' },
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <MapPin className="h-7 w-7 text-[var(--accent)]" />
          <h1 className="text-3xl font-bold text-neutral-900">旅遊地點管理</h1>
        </div>
        <Link
          href="/admin/travel/new"
          className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] transition-colors text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          新增地點
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-20 bg-neutral-50 rounded-xl border border-neutral-200">
          <MapPin className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
          <p className="text-neutral-400 mb-4">尚無旅遊地點</p>
          <Link
            href="/admin/travel/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] transition-colors text-sm"
          >
            <Plus className="h-4 w-4" />
            新增第一個地點
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">地點</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">國家</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">到訪日期</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-400 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {trips.map((trip) => (
                <tr key={trip.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-neutral-800">{trip.placeName}</td>
                  <td className="px-6 py-4 text-sm text-[var(--accent)]">{trip.country || '—'}</td>
                  <td className="px-6 py-4 text-sm text-neutral-400">
                    {trip.visitedAt ? formatDate(trip.visitedAt) : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end items-center gap-3">
                      <Link
                        href={`/admin/travel/${trip.id}/edit`}
                        className="text-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <TripDeleteButton id={trip.id} placeName={trip.placeName} />
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

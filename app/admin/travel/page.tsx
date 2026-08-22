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
          <MapPin className="h-7 w-7 text-amber-500" />
          <h1 className="text-3xl font-bold text-slate-100">旅遊地點管理</h1>
        </div>
        <Link
          href="/admin/travel/new"
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          新增地點
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-20 bg-slate-800/50 rounded-xl border border-slate-700">
          <MapPin className="h-12 w-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 mb-4">尚無旅遊地點</p>
          <Link
            href="/admin/travel/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm"
          >
            <Plus className="h-4 w-4" />
            新增第一個地點
          </Link>
        </div>
      ) : (
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-800/80">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">地點</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">國家</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">到訪日期</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {trips.map((trip) => (
                <tr key={trip.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-200">{trip.placeName}</td>
                  <td className="px-6 py-4 text-sm text-amber-400">{trip.country || '—'}</td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {trip.visitedAt ? formatDate(trip.visitedAt) : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end items-center gap-3">
                      <Link
                        href={`/admin/travel/${trip.id}/edit`}
                        className="text-amber-500 hover:text-amber-400 transition-colors"
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

import { MapPin } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import TravelMapLoader from '@/components/travel/TravelMapLoader'

export const metadata = {
  title: '旅遊地圖 | My Blog',
  description: '去過的地方，一個一個標記下來',
}

export default async function TravelPage() {
  const trips = await prisma.trip.findMany({
    orderBy: { visitedAt: 'desc' },
  })

  const points = trips.map((trip) => ({
    id: trip.id,
    placeName: trip.placeName,
    country: trip.country,
    lat: trip.lat,
    lng: trip.lng,
    visitedAt: trip.visitedAt ? trip.visitedAt.toISOString() : null,
    note: trip.note,
    coverImageUrl: trip.coverImageUrl,
  }))

  const byCountry = trips.reduce<Record<string, typeof trips>>((acc, trip) => {
    const key = trip.country || '未分類'
    acc[key] = acc[key] || []
    acc[key].push(trip)
    return acc
  }, {})

  return (
    <div className="container mx-auto px-4 py-12" style={{ maxWidth: 1100 }}>
      <div className="mb-4">
        <p className="text-sm font-semibold mb-2" style={{ color: 'var(--purple)' }}>旅遊地圖</p>
        <h1 className="text-4xl font-bold text-neutral-900 tracking-tight mb-3">去過的地方，一個一個標記下來</h1>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-neutral-200/70 shadow-sm mt-8">
          <MapPin className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
          <p className="text-neutral-400">尚無足跡紀錄</p>
        </div>
      ) : (
        <>
          <div className="my-8 rounded-2xl overflow-hidden shadow-sm border border-neutral-200/70">
            <TravelMapLoader trips={points} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-neutral-900 tracking-tight mb-5">足跡列表</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(byCountry).map(([country, list]) => (
                <div
                  key={country}
                  className="bg-white border border-neutral-200/70 rounded-2xl p-5 shadow-sm"
                >
                  <h3 className="font-semibold mb-3" style={{ color: 'var(--purple)' }}>{country}</h3>
                  <ul className="space-y-2">
                    {list.map((trip) => (
                      <li key={trip.id} className="text-sm">
                        <span className="text-neutral-900">{trip.placeName}</span>
                        {trip.visitedAt && (
                          <span className="text-neutral-400 ml-2">
                            {new Date(trip.visitedAt).toLocaleDateString('zh-TW', {
                              year: 'numeric',
                              month: 'long',
                            })}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

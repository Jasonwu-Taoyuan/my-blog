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
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex items-center gap-3">
        <MapPin className="h-8 w-8 text-amber-500" />
        <div>
          <h1 className="text-4xl font-bold text-slate-100">旅遊地圖</h1>
          <p className="text-lg text-slate-400 mt-1">去過的地方，一個一個標記下來</p>
        </div>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-20 bg-slate-800/50 rounded-xl border border-slate-700">
          <MapPin className="h-12 w-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500">尚無足跡紀錄</p>
        </div>
      ) : (
        <>
          <div className="mb-10">
            <TravelMapLoader trips={points} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-100 mb-4">足跡列表</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(byCountry).map(([country, list]) => (
                <div
                  key={country}
                  className="bg-slate-800/60 border border-slate-700 rounded-xl p-5"
                >
                  <h3 className="text-amber-400 font-semibold mb-3">{country}</h3>
                  <ul className="space-y-2">
                    {list.map((trip) => (
                      <li key={trip.id} className="text-sm">
                        <span className="text-slate-200">{trip.placeName}</span>
                        {trip.visitedAt && (
                          <span className="text-slate-500 ml-2">
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

'use client'

import dynamic from 'next/dynamic'
import type { TripPoint } from './TravelMap'

const TravelMap = dynamic(() => import('./TravelMap'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full rounded-xl border border-slate-700 bg-slate-900 animate-pulse"
      style={{ height: 480 }}
    />
  ),
})

export default function TravelMapLoader({ trips }: { trips: TripPoint[] }) {
  return <TravelMap trips={trips} />
}

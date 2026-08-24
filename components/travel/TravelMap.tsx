'use client'

import { MapContainer, TileLayer, Marker, Popup, AttributionControl } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export interface TripPoint {
  id: string
  placeName: string
  country: string | null
  lat: number
  lng: number
  visitedAt: string | null
  note: string | null
  coverImageUrl: string | null
}

const pinIcon = L.divIcon({
  html: `
    <div style="width:22px;height:22px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);
      background:#af52de;box-shadow:0 6px 14px rgba(0,0,0,.25);
      display:flex;align-items:center;justify-content:center;">
      <div style="width:7px;height:7px;border-radius:50%;background:#fff;transform:rotate(45deg);"></div>
    </div>
  `,
  className: '',
  iconSize: [22, 22],
  iconAnchor: [11, 22],
  popupAnchor: [0, -22],
})

const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY

const tileUrl = MAPTILER_KEY
  ? `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${MAPTILER_KEY}&language=zh-Hant`
  : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

const tileAttribution = MAPTILER_KEY
  ? '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap 貢獻者</a>'
  : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> 貢獻者'

export default function TravelMap({ trips }: { trips: TripPoint[] }) {
  const center: [number, number] =
    trips.length > 0 ? [trips[0].lat, trips[0].lng] : [23.5, 121]

  return (
    <MapContainer
      center={center}
      zoom={trips.length > 0 ? 3 : 4}
      scrollWheelZoom
      style={{ height: 480, width: '100%', borderRadius: 20 }}
      attributionControl={false}
    >
      <AttributionControl prefix={false} />
      <TileLayer attribution={tileAttribution} url={tileUrl} />
      {trips.map((trip) => (
        <Marker key={trip.id} position={[trip.lat, trip.lng]} icon={pinIcon}>
          <Popup>
            <div style={{ minWidth: 160, fontFamily: '-apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,sans-serif' }}>
              {trip.coverImageUrl && (
                <img
                  src={trip.coverImageUrl}
                  alt={trip.placeName}
                  style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 8, marginBottom: 6 }}
                />
              )}
              <strong style={{ color: '#1d1d1f' }}>{trip.placeName}</strong>
              {trip.country && (
                <div style={{ fontSize: 12, color: 'rgba(0,0,0,.5)' }}>{trip.country}</div>
              )}
              {trip.visitedAt && (
                <div style={{ fontSize: 12, color: 'rgba(0,0,0,.4)' }}>
                  {new Date(trip.visitedAt).toLocaleDateString('zh-TW', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </div>
              )}
              {trip.note && <p style={{ fontSize: 12, marginTop: 4, color: 'rgba(0,0,0,.65)' }}>{trip.note}</p>}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

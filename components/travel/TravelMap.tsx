'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
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
  html: '<div style="font-size:24px;line-height:1;filter:drop-shadow(0 1px 3px rgba(0,0,0,.6))">📍</div>',
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 22],
  popupAnchor: [0, -20],
})

export default function TravelMap({ trips }: { trips: TripPoint[] }) {
  const center: [number, number] =
    trips.length > 0 ? [trips[0].lat, trips[0].lng] : [23.5, 121]

  return (
    <MapContainer
      center={center}
      zoom={trips.length > 0 ? 3 : 4}
      scrollWheelZoom
      style={{ height: 480, width: '100%', borderRadius: 12 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {trips.map((trip) => (
        <Marker key={trip.id} position={[trip.lat, trip.lng]} icon={pinIcon}>
          <Popup>
            <div style={{ minWidth: 160 }}>
              {trip.coverImageUrl && (
                <img
                  src={trip.coverImageUrl}
                  alt={trip.placeName}
                  style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 6, marginBottom: 6 }}
                />
              )}
              <strong>{trip.placeName}</strong>
              {trip.country && (
                <div style={{ fontSize: 12, color: '#666' }}>{trip.country}</div>
              )}
              {trip.visitedAt && (
                <div style={{ fontSize: 12, color: '#888' }}>
                  {new Date(trip.visitedAt).toLocaleDateString('zh-TW', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </div>
              )}
              {trip.note && <p style={{ fontSize: 12, marginTop: 4 }}>{trip.note}</p>}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

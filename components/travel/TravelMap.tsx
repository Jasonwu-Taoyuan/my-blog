'use client'

import { useEffect, useRef } from 'react'
import { Map as MaplibreMap, Marker, Popup, NavigationControl, AttributionControl } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

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

const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY

const styleUrl = MAPTILER_KEY
  ? `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}&language=zh-Hant`
  : 'https://demotiles.maplibre.org/style.json'

const mapAttribution = MAPTILER_KEY
  ? '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap 貢獻者</a>'
  : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> 貢獻者'

function pinElement() {
  const el = document.createElement('div')
  el.innerHTML = `
    <div style="width:22px;height:22px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);
      background:#af52de;box-shadow:0 6px 14px rgba(0,0,0,.25);
      display:flex;align-items:center;justify-content:center;">
      <div style="width:7px;height:7px;border-radius:50%;background:#fff;transform:rotate(45deg);"></div>
    </div>
  `
  return el.firstElementChild as HTMLElement
}

function popupHtml(trip: TripPoint) {
  const cover = trip.coverImageUrl
    ? `<img src="${trip.coverImageUrl}" alt="${trip.placeName}" style="width:100%;height:90px;object-fit:cover;border-radius:8px;margin-bottom:6px;" />`
    : ''
  const country = trip.country
    ? `<div style="font-size:12px;color:rgba(0,0,0,.5);">${trip.country}</div>`
    : ''
  const date = trip.visitedAt
    ? `<div style="font-size:12px;color:rgba(0,0,0,.4);">${new Date(trip.visitedAt).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long' })}</div>`
    : ''
  const note = trip.note
    ? `<p style="font-size:12px;margin-top:4px;color:rgba(0,0,0,.65);">${trip.note}</p>`
    : ''
  return `
    <div style="min-width:160px;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',system-ui,sans-serif;">
      ${cover}
      <strong style="color:#1d1d1f;">${trip.placeName}</strong>
      ${country}
      ${date}
      ${note}
    </div>
  `
}

export default function TravelMap({ trips }: { trips: TripPoint[] }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const center: [number, number] =
      trips.length > 0 ? [trips[0].lng, trips[0].lat] : [121, 23.5]

    const map = new MaplibreMap({
      container: containerRef.current,
      style: styleUrl,
      center,
      zoom: trips.length > 0 ? 3 : 4,
      attributionControl: false,
    })

    map.addControl(new NavigationControl({ showCompass: false }), 'top-left')
    map.addControl(new AttributionControl({ compact: false, customAttribution: mapAttribution }))

    const markers = trips.map((trip) => {
      const popup = new Popup({ offset: 25 }).setHTML(popupHtml(trip))
      return new Marker({ element: pinElement(), anchor: 'bottom' })
        .setLngLat([trip.lng, trip.lat])
        .setPopup(popup)
        .addTo(map)
    })

    return () => {
      markers.forEach((marker) => marker.remove())
      map.remove()
    }
  }, [trips])

  return <div ref={containerRef} style={{ height: 480, width: '100%', borderRadius: 20, overflow: 'hidden' }} />
}

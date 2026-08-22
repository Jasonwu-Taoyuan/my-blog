import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import TripForm from '@/components/travel/TripForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditTripPage({ params }: Props) {
  const { id } = await params
  const trip = await prisma.trip.findUnique({ where: { id } })
  if (!trip) notFound()

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-100 mb-6">編輯旅遊地點</h1>
      <TripForm trip={trip} />
    </div>
  )
}

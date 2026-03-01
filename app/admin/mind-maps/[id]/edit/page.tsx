import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import MindMapEditForm from '@/components/mind-map/MindMapEditForm'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditMindMapPage({ params }: Props) {
  const { id } = await params
  const mindMap = await prisma.mindMap.findUnique({ where: { id } })
  if (!mindMap) notFound()

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-100 mb-6">編輯思維導圖</h1>
      <MindMapEditForm mindMap={mindMap} />
    </div>
  )
}

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import MindElixirViewer from '@/components/mind-map/MindElixirViewer'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const mm = await prisma.mindMap.findUnique({ where: { id }, select: { title: true } })
  return mm ? { title: `${mm.title} | 思維導圖` } : { title: 'Not Found' }
}

export default async function MindMapDetailPage({ params }: Props) {
  const { id } = await params
  const mindMap = await prisma.mindMap.findUnique({ where: { id } })
  if (!mindMap) notFound()

  const data = JSON.parse(mindMap.data)

  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        href="/mind-maps"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors mb-8 text-sm"
      >
        ← 返回思維導圖列表
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">{mindMap.title}</h1>
        {mindMap.bookTitle && (
          <p className="text-amber-400 text-sm mb-1">書籍：{mindMap.bookTitle}</p>
        )}
        <p className="text-xs text-slate-600">更新於 {formatDate(mindMap.updatedAt)}</p>
      </div>

      <MindElixirViewer data={data} />
    </div>
  )
}

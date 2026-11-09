import Link from 'next/link'
import { graphData, type GraphBook } from '@/lib/bookGraph'
import KnowledgeGraph from '@/components/books/KnowledgeGraph'

export const revalidate = 3600

export const metadata = {
  title: '知識圖譜 | My Blog',
  description: '讀過的書透過共同概念連成一張知識網',
}

export default async function KnowledgeGraphPage() {
  let books: GraphBook[] = []
  let error = ''
  try {
    books = await graphData()
  } catch (e: any) {
    error = e?.message || '無法載入知識圖譜'
    console.error('Knowledge graph error:', e)
  }

  return (
    <div className="container mx-auto px-4 py-8" style={{ maxWidth: 1400 }}>
      <div className="flex items-end justify-between flex-wrap gap-3 mb-5">
        <div>
          <Link href="/knowledge/books" className="inline-flex items-center gap-2 text-neutral-400 hover:text-[var(--accent)] transition-colors mb-3 text-sm">
            ← 返回讀書清單
          </Link>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">知識圖譜</h1>
          <p className="text-sm text-neutral-500 mt-1">讀過的書透過共同概念連成一張網，找出跨領域的連結。</p>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 mb-6 text-sm">⚠ {error}</div>}

      {!error && books.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-neutral-200">
          <p className="text-4xl mb-3">🕸</p>
          <p className="font-semibold text-neutral-700">知識圖譜尚未建立</p>
          <p className="text-sm text-neutral-400 mt-1">管理員可在後台「讀書清單管理」按「建立知識圖譜」。</p>
        </div>
      ) : (
        books.length > 0 && <KnowledgeGraph books={books} />
      )}
    </div>
  )
}

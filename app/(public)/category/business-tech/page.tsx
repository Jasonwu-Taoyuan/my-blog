import { fetchBooks } from '@/lib/notion'
import BookList from './BookList'

export const revalidate = 3600 // 每小時從 Notion 重新抓取

export const metadata = {
  title: '商業與科技書籍 | My Blog',
  description: '商業思維與科技趨勢的閱讀筆記',
}

export default async function BusinessTechPage() {
  let books = []
  let error = ''

  try {
    books = await fetchBooks()
  } catch (e: any) {
    error = e.message || '無法載入書單，請確認 Notion API Key 設定是否正確。'
    console.error('Notion fetch error:', e)
  }

  const categories = [...new Set(books.map((b) => b.mainCategory).filter(Boolean))].sort()

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-100 mb-3">完整閱讀清單</h1>
        <p className="text-lg text-slate-400">商業思維與科技趨勢的閱讀筆記</p>
        {books.length > 0 && (
          <p className="text-sm text-slate-500 mt-2">
            共 <span className="text-amber-400 font-semibold">{books.length}</span> 本書籍 ·
            資料來源：Notion（每小時自動更新）
          </p>
        )}
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-300 mb-8">
          ⚠ {error}
        </div>
      )}

      {books.length > 0 && (
        <BookList books={books} categories={categories} />
      )}
    </div>
  )
}

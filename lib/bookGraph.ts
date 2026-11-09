/**
 * 讀書清單知識圖譜：用 AI 為每本書抽出核心概念，共用概念的書彼此相連。
 */
import { fetchBooks, type Book } from '@/lib/notion'
import { prisma } from '@/lib/prisma'
import { groqChat, extractJson } from '@/lib/groq'

export const BATCH_SIZE = 12

// 太廣泛、無法區分書的詞
const STOP = new Set(['知識', '學習', '方法', '技巧', '管理', '入門', '思考', '能力', '成長', '概念', '理論',
  '實務', '應用', '基礎', '指南', '工具', '策略', '書籍', '閱讀', '人生', '經驗', '案例', '教學'])

/** 概念名稱正規化：去括號說明、空白、標點，英文小寫 */
export function normalizeConcept(raw: string): string | null {
  let c = String(raw || '')
    .replace(/[（(][^）)]*[）)]/g, '')
    .replace(/[「」『』《》"'“”‘’。．.、，,;；:：!！?？#*]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  c = c.replace(/([\u3400-\u9fff])\s+(?=[\u3400-\u9fff])/g, '$1')
  if (c.length < 2 || c.length > 16 || STOP.has(c)) return null
  return c
}

let cache: { at: number; books: Book[] } | null = null
async function allBooks(): Promise<Book[]> {
  if (cache && Date.now() - cache.at < 10 * 60 * 1000) return cache.books
  const books = await fetchBooks()
  cache = { at: Date.now(), books }
  return books
}

export async function visibleBooks(): Promise<Book[]> {
  const [books, hidden] = await Promise.all([allBooks(), prisma.hiddenBook.findMany({ select: { notionId: true } })])
  const hiddenIds = new Set(hidden.map(h => h.notionId))
  return books.filter(b => !hiddenIds.has(b.id) && b.title.trim())
}

export async function graphStatus() {
  const books = await visibleBooks()
  const done = new Set((await prisma.bookGraphProcessed.findMany({ select: { notionId: true } })).map(p => p.notionId))
  const concepts = await prisma.bookConcept.groupBy({ by: ['concept'], _count: { concept: true } })
  return {
    total: books.length,
    processed: books.filter(b => done.has(b.id)).length,
    remaining: books.filter(b => !done.has(b.id)).length,
    concepts: concepts.length,
  }
}

export function buildPrompt(batch: { title: string; main: string; sub: string; note?: string }[], existing: string[]) {
  const list = batch.map((b, i) =>
    `${i + 1}. 《${b.title}》（${[b.main, b.sub].filter(Boolean).join('／') || '未分類'}）${b.note ? ` 讀者摘要：${b.note}` : ''}`,
  ).join('\n')
  return `你是知識圖譜專家。為下面每本書抽出 3-5 個「核心概念」，用來把不同的書連在一起。

規則：
1. 概念是能跨書共用的具體知識主題，例如：間隔重複、複利效應、認知偏誤、資料視覺化、機器學習、迴歸分析、領導力、行為經濟學
2. 每個概念 2-8 個繁體中文字；專有名詞可用英文（例如 Python、Excel、Power BI）
3. 不要用書名、作者，也不要用太廣泛的詞（知識、學習、方法、技巧、管理、入門、思考、成長）
4. 意思相同的概念請用同一個名稱${existing.length ? `；優先沿用這些已存在的概念：${existing.join('、')}` : ''}
5. 依書名與分類判斷；不熟悉的書，依書名推論最可能的主題

書單：
${list}

只輸出 JSON，鍵是書的編號，例如：{"1": ["概念", "概念", "概念"], "2": ["概念", "概念", "概念"]}`
}

export function parseConcepts(raw: unknown, count: number): string[][] {
  const out: string[][] = Array.from({ length: count }, () => [])
  const obj = Array.isArray(raw)
    ? Object.fromEntries(raw.map((v, i) => [String(i + 1), v]))
    : (raw && typeof raw === 'object' ? raw as Record<string, unknown> : {})
  for (const [k, v] of Object.entries(obj)) {
    const i = Number(String(k).replace(/\D/g, '')) - 1
    if (!(i >= 0 && i < count) || !Array.isArray(v)) continue
    const seen = new Set<string>()
    for (const c of v) {
      const n = normalizeConcept(typeof c === 'string' ? c : (c as { name?: string })?.name || '')
      if (n && !seen.has(n)) { seen.add(n); out[i].push(n) }
    }
    out[i] = out[i].slice(0, 5)
  }
  return out
}

/** 處理下一批尚未處理的書，回傳最新進度 */
export async function processNextBatch() {
  const books = await visibleBooks()
  const done = new Set((await prisma.bookGraphProcessed.findMany({ select: { notionId: true } })).map(p => p.notionId))
  const todo = books.filter(b => !done.has(b.id)).slice(0, BATCH_SIZE)
  if (!todo.length) return { ...(await graphStatus()), added: 0 }

  const reviews = await prisma.bookReview.findMany({ where: { notionId: { in: todo.map(b => b.id) } } })
  const notes = new Map<string, string>(reviews.map((r: { notionId: string; summary: string | null; notes: string | null }) =>
    [r.notionId, String(r.summary || r.notes || '').replace(/\s+/g, ' ').slice(0, 120)]))
  const top = await prisma.bookConcept.groupBy({
    by: ['concept'], _count: { concept: true }, orderBy: { _count: { concept: 'desc' } }, take: 60,
  })

  const prompt = buildPrompt(
    todo.map(b => ({ title: b.title, main: b.mainCategory, sub: b.subCategory, note: notes.get(b.id) || undefined })),
    top.map((t: { concept: string }) => t.concept),
  )
  const raw = await groqChat(prompt, 1500)
  const concepts = parseConcepts(extractJson(raw), todo.length)

  let added = 0
  for (let i = 0; i < todo.length; i++) {
    const b = todo[i]
    if (concepts[i].length) {
      const r = await prisma.bookConcept.createMany({
        data: concepts[i].map(concept => ({ notionId: b.id, concept })), skipDuplicates: true,
      })
      added += r.count
    }
    await prisma.bookGraphProcessed.upsert({
      where: { notionId: b.id }, update: { title: b.title, processedAt: new Date() },
      create: { notionId: b.id, title: b.title },
    })
  }
  return { ...(await graphStatus()), added }
}

export async function resetGraph() {
  await prisma.bookConcept.deleteMany({})
  await prisma.bookGraphProcessed.deleteMany({})
}

export interface GraphBook { id: string; title: string; main: string; sub: string; year: number | null; rating: number | null; concepts: string[] }

/** 圖譜頁面用的資料 */
export async function graphData(): Promise<GraphBook[]> {
  const [books, rows, reviews] = await Promise.all([
    visibleBooks(),
    prisma.bookConcept.findMany({ select: { notionId: true, concept: true } }),
    prisma.bookReview.findMany({ select: { notionId: true, rating: true } }),
  ])
  const byBook = new Map<string, string[]>()
  rows.forEach(r => { const l = byBook.get(r.notionId) || []; l.push(r.concept); byBook.set(r.notionId, l) })
  const ratings = new Map<string, number | null>(reviews.map((r: { notionId: string; rating: number | null }) => [r.notionId, r.rating]))
  return books
    .filter(b => byBook.has(b.id))
    .map(b => ({
      id: b.id, title: b.title, main: b.mainCategory || '未分類', sub: b.subCategory,
      year: b.borrowYear, rating: ratings.get(b.id) ?? null, concepts: byBook.get(b.id)!,
    }))
}

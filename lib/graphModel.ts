/** 知識圖譜的資料模型（純函式，前端使用） */
import type { GraphBook } from '@/lib/bookGraph'

// 分類色（依書本數量排序固定分配；第 9 類之後併入「其他」灰色）
export const CATEGORY_COLORS = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#6250d6', '#e34948']
export const OTHER_COLOR = '#9b9a93'
export const CONCEPT_COLOR = '#8e8d86'

export interface GNode {
  id: string
  kind: 'book' | 'concept'
  label: string
  color: string
  deg: number
  book?: GraphBook
  x?: number
  y?: number
}
export interface GLink { source: string | GNode; target: string | GNode }

export interface Category { name: string; color: string; count: number }

export function categories(books: GraphBook[]): Category[] {
  const counts = new Map<string, number>()
  books.forEach(b => counts.set(b.main, (counts.get(b.main) || 0) + 1))
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  return sorted.map(([name, count], i) => ({ name, count, color: CATEGORY_COLORS[i] ?? OTHER_COLOR }))
}

const key = (c: string) => c.trim().toLowerCase()

/** 概念 → 書本（大小寫不同視為同一概念，顯示最常見的寫法） */
export function conceptIndex(books: GraphBook[]) {
  const map = new Map<string, { label: string; forms: Map<string, number>; books: GraphBook[] }>()
  for (const b of books) {
    for (const c of b.concepts) {
      const k = key(c)
      let e = map.get(k)
      if (!e) { e = { label: c, forms: new Map(), books: [] }; map.set(k, e) }
      e.forms.set(c, (e.forms.get(c) || 0) + 1)
      if (!e.books.includes(b)) e.books.push(b)
    }
  }
  map.forEach(e => { e.label = [...e.forms.entries()].sort((a, b) => b[1] - a[1])[0][0] })
  return map
}

export interface GraphOptions { minShared: number; hiddenCats: Set<string> }

export function buildGraph(books: GraphBook[], cats: Category[], opts: GraphOptions) {
  const color = new Map(cats.map(c => [c.name, c.color]))
  const shown = books.filter(b => !opts.hiddenCats.has(b.main))
  const idx = conceptIndex(shown)
  const nodes: GNode[] = []
  const links: GLink[] = []
  const used = new Set<string>()
  idx.forEach((e, k) => {
    if (e.books.length < opts.minShared) return
    const cid = `c:${k}`
    nodes.push({ id: cid, kind: 'concept', label: e.label, color: CONCEPT_COLOR, deg: e.books.length })
    e.books.forEach(b => { links.push({ source: `b:${b.id}`, target: cid }); used.add(b.id) })
  })
  shown.filter(b => used.has(b.id)).forEach(b => {
    nodes.push({ id: `b:${b.id}`, kind: 'book', label: b.title, color: color.get(b.main) || OTHER_COLOR, deg: 0, book: b })
  })
  const deg = new Map<string, number>()
  links.forEach(l => { const s = l.source as string; deg.set(s, (deg.get(s) || 0) + 1) })
  nodes.forEach(n => { if (n.kind === 'book') n.deg = deg.get(n.id) || 0 })
  return { nodes, links, isolated: shown.length - used.size }
}

/** 與這本書共用概念最多的書 */
export function relatedBooks(book: GraphBook, books: GraphBook[], limit = 8) {
  const mine = new Set(book.concepts.map(key))
  return books
    .filter(b => b.id !== book.id)
    .map(b => ({ book: b, shared: b.concepts.filter(c => mine.has(key(c))) }))
    .filter(x => x.shared.length > 0)
    .sort((a, b) => b.shared.length - a.shared.length || a.book.title.localeCompare(b.book.title))
    .slice(0, limit)
}

/** 常和這個概念一起出現的其他概念 */
export function coConcepts(concept: string, books: GraphBook[], limit = 10) {
  const k = key(concept)
  const counts = new Map<string, { label: string; n: number }>()
  books.filter(b => b.concepts.some(c => key(c) === k)).forEach(b => b.concepts.forEach(c => {
    if (key(c) === k) return
    const e = counts.get(key(c)) || { label: c, n: 0 }
    e.n++; counts.set(key(c), e)
  }))
  return [...counts.values()].sort((a, b) => b.n - a.n).slice(0, limit)
}

/** 跨領域橋樑書：透過共用概念連到最多「不同主分類」的書 */
export function bridgeBooks(books: GraphBook[], limit = 8) {
  const idx = conceptIndex(books)
  return books.map(b => {
    const cats = new Set<string>()
    b.concepts.forEach(c => idx.get(key(c))?.books.forEach(o => { if (o.id !== b.id && o.main !== b.main) cats.add(o.main) }))
    return { book: b, cats: [...cats] }
  }).filter(x => x.cats.length > 0).sort((a, b) => b.cats.length - a.cats.length).slice(0, limit)
}

export function topConcepts(books: GraphBook[], limit = 20) {
  return [...conceptIndex(books).values()]
    .map(e => ({ label: e.label, n: e.books.length }))
    .filter(e => e.n >= 2)
    .sort((a, b) => b.n - a.n || a.label.localeCompare(b.label))
    .slice(0, limit)
}

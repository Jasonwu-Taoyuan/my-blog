'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Search, X, Maximize2, BookOpen, Sparkles, Waypoints } from 'lucide-react'
import type { GraphBook } from '@/lib/bookGraph'
import {
  buildGraph, categories, relatedBooks, coConcepts, bridgeBooks, topConcepts, conceptIndex,
  type GNode, type GLink,
} from '@/lib/graphModel'
import StarRating from '@/components/books/StarRating'

type Sel = { kind: 'book'; id: string } | { kind: 'concept'; key: string } | null

const nid = (x: string | GNode) => (typeof x === 'string' ? x : x.id)

export default function KnowledgeGraph({ books }: { books: GraphBook[] }) {
  const box = useRef<HTMLDivElement>(null)
  const fg = useRef<any>(null)
  const [sel, setSel] = useState<Sel>(null)
  const [hover, setHover] = useState<string | null>(null)
  const [hiddenCats, setHiddenCats] = useState<Set<string>>(new Set())
  const [minShared, setMinShared] = useState(2)
  const [q, setQ] = useState('')
  const [zoom, setZoom] = useState(1)

  const cats = useMemo(() => categories(books), [books])
  const graph = useMemo(() => buildGraph(books, cats, { minShared, hiddenCats }), [books, cats, minShared, hiddenCats])
  const idx = useMemo(() => conceptIndex(books), [books])
  const bookById = useMemo(() => new Map(books.map(b => [b.id, b])), [books])
  const tops = useMemo(() => topConcepts(books, 16), [books])
  const bridges = useMemo(() => bridgeBooks(books, 6), [books])

  // 相鄰節點（highlight 用）
  const neighbors = useMemo(() => {
    const m = new Map<string, Set<string>>()
    graph.links.forEach(l => {
      const s = nid(l.source), t = nid(l.target)
      if (!m.has(s)) m.set(s, new Set()); if (!m.has(t)) m.set(t, new Set())
      m.get(s)!.add(t); m.get(t)!.add(s)
    })
    return m
  }, [graph])

  const selId = sel ? (sel.kind === 'book' ? `b:${sel.id}` : `c:${sel.key}`) : null
  const focus = hover || selId
  const focusSet = useMemo(() => {
    if (!focus) return null
    const s = new Set<string>([focus, ...(neighbors.get(focus) || [])])
    return s
  }, [focus, neighbors])

  // 只取前 25 大概念常駐標籤
  const labelConcepts = useMemo(() => new Set(
    graph.nodes.filter(n => n.kind === 'concept').sort((a, b) => b.deg - a.deg).slice(0, 25).map(n => n.id)), [graph])

  const hoverRef = useRef<string | null>(null)
  const fitted = useRef(false)
  const graphRef = useRef(graph)
  graphRef.current = graph
  const state = useRef({ focusSet, selId, labelConcepts })
  state.current = { focusSet, selId, labelConcepts }

  /* ── 建立畫布（只做一次） ── */
  useEffect(() => {
    let alive = true
    let ro: ResizeObserver | null = null
    import('force-graph').then(({ default: ForceGraph }) => {
      if (!alive || !box.current) return
      const g = new ForceGraph(box.current)
        .backgroundColor('#fbfbfd')
        .autoPauseRedraw(false)
        .nodeRelSize(4)
        .linkColor((l: any) => {
          const f = state.current.focusSet
          if (!f) return 'rgba(0,0,0,0.07)'
          return f.has(nid(l.source)) && f.has(nid(l.target)) && (nid(l.source) === (hoverRef.current || state.current.selId) || nid(l.target) === (hoverRef.current || state.current.selId))
            ? 'rgba(0,113,227,0.55)' : 'rgba(0,0,0,0.03)'
        })
        .linkWidth((l: any) => {
          const f = state.current.focusSet
          return f && f.has(nid(l.source)) && f.has(nid(l.target)) ? 1.6 : 0.6
        })
        .nodeCanvasObject((node: any, ctx: CanvasRenderingContext2D, scale: number) => {
          const { focusSet: f, selId: s, labelConcepts: lc } = state.current
          const dim = f && !f.has(node.id)
          const isC = node.kind === 'concept'
          const r = isC ? 3 + Math.sqrt(node.deg) * 1.7 : 4.5
          ctx.globalAlpha = dim ? 0.12 : 1
          ctx.beginPath()
          ctx.arc(node.x, node.y, r, 0, 2 * Math.PI)
          ctx.fillStyle = isC ? '#ffffff' : node.color
          ctx.fill()
          ctx.lineWidth = isC ? 1.6 / Math.sqrt(scale) + 0.4 : 1.2
          ctx.strokeStyle = isC ? '#8e8d86' : '#ffffff'
          ctx.stroke()
          if (node.id === s) {
            ctx.beginPath(); ctx.arc(node.x, node.y, r + 3, 0, 2 * Math.PI)
            ctx.strokeStyle = '#0071e3'; ctx.lineWidth = 2 / scale + 0.6; ctx.stroke()
          }
          const showLabel = (f && f.has(node.id)) || (isC && (lc.has(node.id) || scale > 1.6)) || (!isC && scale > 3.2)
          if (showLabel && !dim) {
            const fs = (isC ? 12 : 11) / scale
            ctx.font = `${isC ? 700 : 500} ${fs}px "Noto Sans TC", system-ui, sans-serif`
            ctx.textAlign = 'center'; ctx.textBaseline = 'top'
            const text = node.label.length > 18 ? node.label.slice(0, 17) + '…' : node.label
            ctx.lineWidth = 3 / scale; ctx.strokeStyle = 'rgba(251,251,253,0.95)'
            ctx.strokeText(text, node.x, node.y + r + 2 / scale)
            ctx.fillStyle = isC ? '#1d1d1f' : 'rgba(0,0,0,0.62)'
            ctx.fillText(text, node.x, node.y + r + 2 / scale)
          }
          ctx.globalAlpha = 1
        })
        .nodePointerAreaPaint((node: any, color: string, ctx: CanvasRenderingContext2D) => {
          const r = node.kind === 'concept' ? 3 + Math.sqrt(node.deg) * 1.7 : 4.5
          ctx.fillStyle = color; ctx.beginPath(); ctx.arc(node.x, node.y, r + 3, 0, 2 * Math.PI); ctx.fill()
        })
        .onNodeHover((n: any) => { hoverRef.current = n ? n.id : null; setHover(n ? n.id : null); if (box.current) box.current.style.cursor = n ? 'pointer' : 'grab' })
        .onNodeClick((n: any) => {
          setSel(n.kind === 'book' ? { kind: 'book', id: n.id.slice(2) } : { kind: 'concept', key: n.id.slice(2) })
        })
        .onBackgroundClick(() => setSel(null))
        .onZoomEnd(({ k }: { k: number }) => setZoom(k))
        .cooldownTicks(200)
        .onEngineStop(() => { if (!fitted.current) { fitted.current = true; g.zoomToFit(500, 40) } })
      g.d3Force('charge')?.strength(-38)
      g.d3Force('link')?.distance(26)
      fg.current = g
      const resize = () => { if (box.current) g.width(box.current.clientWidth).height(box.current.clientHeight) }
      resize()
      ro = new ResizeObserver(resize); ro.observe(box.current)
      g.graphData(cloneGraph(graphRef.current))
    })
    return () => { alive = false; ro?.disconnect(); fg.current?._destructor?.() }
  }, [])


  /* ── 資料變更（篩選） ── */
  useEffect(() => {
    if (!fg.current) return
    fitted.current = false
    fg.current.graphData(cloneGraph(graph))
  }, [graph])


  const focusNode = (id: string) => {
    const g = fg.current
    if (!g) return
    const node = g.graphData().nodes.find((n: any) => n.id === id)
    if (node && node.x != null) { g.centerAt(node.x, node.y, 700); g.zoom(Math.max(zoom, 2.6), 700) }
  }

  const pickBook = (id: string) => { setSel({ kind: 'book', id }); focusNode(`b:${id}`) }
  const pickConcept = (label: string) => { const k = label.trim().toLowerCase(); setSel({ kind: 'concept', key: k }); focusNode(`c:${k}`) }

  // 搜尋建議
  const suggestions = useMemo(() => {
    const k = q.trim().toLowerCase()
    if (!k) return []
    const cs = [...idx.entries()].filter(([key]) => key.includes(k)).slice(0, 6).map(([key, e]) => ({ type: 'concept' as const, key, label: e.label, n: e.books.length }))
    const bs = books.filter(b => b.title.toLowerCase().includes(k)).slice(0, 6).map(b => ({ type: 'book' as const, key: b.id, label: b.title, n: 0 }))
    return [...cs, ...bs]
  }, [q, idx, books])

  const toggleCat = (name: string) => setHiddenCats(s => {
    const n = new Set(s); if (n.has(name)) n.delete(name); else n.add(name); return n
  })

  /* ── 側欄 ── */
  const selBook = sel?.kind === 'book' ? bookById.get(sel.id) : undefined
  const selConcept = sel?.kind === 'concept' ? idx.get(sel.key) : undefined
  const catColor = new Map(cats.map(c => [c.name, c.color]))

  return (
    <div className="kg">
      <div className="kg-canvas-wrap">
        <div ref={box} className="kg-canvas" />

        {/* 搜尋 */}
        <div className="kg-search">
          <Search className="h-4 w-4 text-neutral-400" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="搜尋書名或概念…" />
          {q && <button onClick={() => setQ('')} aria-label="清除"><X className="h-4 w-4 text-neutral-400" /></button>}
          {suggestions.length > 0 && (
            <div className="kg-suggest">
              {suggestions.map(s => (
                <button key={s.type + s.key} onClick={() => { setQ(''); s.type === 'book' ? pickBook(s.key) : pickConcept(s.label) }}>
                  {s.type === 'book' ? <BookOpen className="h-3.5 w-3.5 text-neutral-400" /> : <Sparkles className="h-3.5 w-3.5 text-neutral-400" />}
                  <span className="truncate">{s.label}</span>
                  {s.type === 'concept' && <span className="ml-auto text-xs text-neutral-400">{s.n} 本</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 控制 */}
        <div className="kg-tools">
          <label title="只顯示至少被幾本書共用的概念">
            共用 ≥
            <select value={minShared} onChange={e => setMinShared(Number(e.target.value))}>
              {[2, 3, 4, 5].map(n => <option key={n} value={n}>{n} 本</option>)}
            </select>
          </label>
          <button onClick={() => fg.current?.zoomToFit(600, 40)} title="顯示全部"><Maximize2 className="h-4 w-4" /></button>
        </div>

        {/* 圖例＝分類篩選 */}
        <div className="kg-legend">
          {cats.slice(0, 9).map(c => (
            <button key={c.name} onClick={() => toggleCat(c.name)} className={hiddenCats.has(c.name) ? 'off' : ''} title={hiddenCats.has(c.name) ? '點擊顯示' : '點擊隱藏'}>
              <span className="dot" style={{ background: c.color }} />{c.name}<span className="n">{c.count}</span>
            </button>
          ))}
          <span className="kg-legend-c"><span className="ring" />概念（越大越多書共用）</span>
        </div>
      </div>

      {/* 側欄 */}
      <aside className="kg-side">
        {selBook ? (
          <div>
            <button className="kg-close" onClick={() => setSel(null)} aria-label="關閉"><X className="h-4 w-4" /></button>
            <div className="kg-kicker"><span className="dot" style={{ background: catColor.get(selBook.main) }} />{selBook.main}{selBook.sub ? ` · ${selBook.sub}` : ''}</div>
            <h2 className="kg-title">{selBook.title}</h2>
            <div className="flex items-center gap-3 text-sm text-neutral-500 mb-4">
              {selBook.year && <span>{selBook.year} 年借閱</span>}
              {selBook.rating && <StarRating rating={selBook.rating} size={13} />}
              <Link href={`/knowledge/books/${selBook.id}`} className="text-[var(--accent)] font-semibold hover:underline">書籍頁 →</Link>
            </div>
            <div className="kg-label">核心概念</div>
            <div className="kg-chips">
              {selBook.concepts.map(c => (
                <button key={c} onClick={() => pickConcept(c)}>{c}<span>{idx.get(c.toLowerCase())?.books.length || 1}</span></button>
              ))}
            </div>
            <div className="kg-label">相關的書（共用概念）</div>
            {relatedBooks(selBook, books).map(r => (
              <button key={r.book.id} className="kg-row" onClick={() => pickBook(r.book.id)}>
                <span className="dot" style={{ background: catColor.get(r.book.main) }} />
                <span className="flex-1 min-w-0">
                  <span className="block truncate font-semibold text-neutral-800">{r.book.title}</span>
                  <span className="block truncate text-xs text-neutral-400">{r.shared.join('・')}</span>
                </span>
                <span className="text-xs font-bold text-neutral-400">{r.shared.length}</span>
              </button>
            ))}
            {relatedBooks(selBook, books).length === 0 && <p className="text-sm text-neutral-400">目前沒有其他書共用這些概念。</p>}
          </div>
        ) : selConcept ? (
          <div>
            <button className="kg-close" onClick={() => setSel(null)} aria-label="關閉"><X className="h-4 w-4" /></button>
            <div className="kg-kicker"><Sparkles className="h-3.5 w-3.5" /> 概念</div>
            <h2 className="kg-title">{selConcept.label}</h2>
            <p className="text-sm text-neutral-500 mb-4">
              {selConcept.books.length} 本書提到 · 橫跨 {new Set(selConcept.books.map(b => b.main)).size} 個分類
            </p>
            <div className="kg-label">常一起出現的概念</div>
            <div className="kg-chips">
              {coConcepts(selConcept.label, books).map(c => <button key={c.label} onClick={() => pickConcept(c.label)}>{c.label}<span>{c.n}</span></button>)}
            </div>
            <div className="kg-label">提到這個概念的書</div>
            {[...selConcept.books].sort((a, b) => a.main.localeCompare(b.main)).map(b => (
              <button key={b.id} className="kg-row" onClick={() => pickBook(b.id)}>
                <span className="dot" style={{ background: catColor.get(b.main) }} />
                <span className="flex-1 min-w-0">
                  <span className="block truncate font-semibold text-neutral-800">{b.title}</span>
                  <span className="block truncate text-xs text-neutral-400">{b.main}</span>
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div>
            <div className="kg-kicker"><Waypoints className="h-3.5 w-3.5" /> 探索</div>
            <h2 className="kg-title">我的閱讀知識網</h2>
            <p className="text-sm text-neutral-500 mb-4 leading-relaxed">
              {books.length} 本書、{[...idx.values()].filter(e => e.books.length >= 2).length} 個共用概念。點任一本書或概念，看它和哪些書相連；點分類可隱藏。
            </p>
            <div className="kg-label">最常出現的概念</div>
            <div className="kg-chips">
              {tops.map(t => <button key={t.label} onClick={() => pickConcept(t.label)}>{t.label}<span>{t.n}</span></button>)}
            </div>
            <div className="kg-label">跨領域橋樑書</div>
            <p className="text-xs text-neutral-400 -mt-1 mb-2">透過共用概念，連到最多其他分類的書</p>
            {bridges.map(x => (
              <button key={x.book.id} className="kg-row" onClick={() => pickBook(x.book.id)}>
                <span className="dot" style={{ background: catColor.get(x.book.main) }} />
                <span className="flex-1 min-w-0">
                  <span className="block truncate font-semibold text-neutral-800">{x.book.title}</span>
                  <span className="block truncate text-xs text-neutral-400">連到 {x.cats.join('、')}</span>
                </span>
                <span className="text-xs font-bold text-neutral-400">{x.cats.length}</span>
              </button>
            ))}
            {graph.isolated > 0 && (
              <p className="text-xs text-neutral-400 mt-4">另有 {graph.isolated} 本書的概念沒有和其他書共用，未顯示在圖上（可把「共用 ≥」調低或搜尋書名）。</p>
            )}
          </div>
        )}
      </aside>
    </div>
  )
}

function cloneGraph(g: { nodes: GNode[]; links: GLink[] }) {
  return { nodes: g.nodes.map(n => ({ ...n })), links: g.links.map(l => ({ source: nid(l.source), target: nid(l.target) })) }
}

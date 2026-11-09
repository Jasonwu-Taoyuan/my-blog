'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Network, Play, Pause, RotateCcw, ExternalLink } from 'lucide-react'

interface Status { total: number; processed: number; remaining: number; concepts: number; groq?: boolean; added?: number }

/** 後台：建立／更新讀書清單知識圖譜（逐批呼叫 AI，可隨時暫停、下次接續） */
export default function BookGraphBuilder() {
  const [status, setStatus] = useState<Status | null>(null)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState('')
  const [log, setLog] = useState<string[]>([])
  const stop = useRef(false)

  useEffect(() => {
    fetch('/api/book-graph').then(r => r.json()).then(d => d.error ? setError(d.error) : setStatus(d)).catch(() => setError('無法讀取進度'))
  }, [])

  const run = async () => {
    setRunning(true); setError(''); stop.current = false
    try {
      while (!stop.current) {
        const t0 = Date.now()
        const res = await fetch('/api/book-graph', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'next' }) })
        const d = await res.json()
        if (!res.ok) { setError(d.error || '處理失敗'); break }
        setStatus(s => ({ ...s, ...d }))
        setLog(l => [`已處理 ${d.processed} / ${d.total} 本，新增 ${d.added} 個連結（${Math.round((Date.now() - t0) / 1000)} 秒）`, ...l].slice(0, 5))
        if (!d.remaining) break
      }
    } catch { setError('連線中斷，請再按一次繼續') }
    setRunning(false)
  }

  const reset = async () => {
    if (!confirm('確定要清空並重新建立整個知識圖譜？（大約需要 15–20 分鐘）')) return
    const res = await fetch('/api/book-graph', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'reset' }) })
    const d = await res.json()
    if (res.ok) { setStatus(s => ({ ...s, ...d })); setLog([]) } else setError(d.error)
  }

  const pct = status && status.total ? Math.round((status.processed / status.total) * 100) : 0
  const mins = status ? Math.max(1, Math.ceil(status.remaining / 12 * 20 / 60)) : 0

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-5 mb-8">
      <div className="flex items-start gap-3 flex-wrap">
        <Network className="h-6 w-6 text-[var(--accent)] mt-0.5" />
        <div className="flex-1 min-w-[240px]">
          <h2 className="text-lg font-bold text-neutral-900">知識圖譜</h2>
          <p className="text-sm text-neutral-500 mt-0.5">
            AI 為每本書抽出 3–5 個核心概念，共用概念的書在圖譜上會連在一起。使用免費的 Groq，已處理的書不會重複處理。
          </p>
        </div>
        <Link href="/knowledge/graph" target="_blank" className="text-sm font-semibold text-[var(--accent)] inline-flex items-center gap-1 hover:underline">
          查看圖譜 <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      {status && (
        <div className="mt-4">
          <div className="flex justify-between text-sm text-neutral-500 mb-1.5">
            <span>已處理 <b className="text-neutral-800">{status.processed}</b> / {status.total} 本 · {status.concepts} 個概念</span>
            <span>{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: 'var(--accent)' }} />
          </div>
        </div>
      )}

      {status?.groq === false && (
        <p className="mt-3 text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
          尚未設定 GROQ_API_KEY：請到 Railway 的 blog 服務新增這個變數（可用記憶宮殿同一把金鑰），部署後再回來。
        </p>
      )}
      {error && <p className="mt-3 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">⚠ {error}</p>}

      <div className="mt-4 flex items-center gap-2 flex-wrap">
        {running ? (
          <button onClick={() => { stop.current = true }} className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-200">
            <Pause className="h-4 w-4" /> 暫停（目前這批完成後停止）
          </button>
        ) : (
          <button onClick={run} disabled={!status || status.remaining === 0 || status.groq === false}
                  className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
                  style={{ background: 'var(--accent)' }}>
            <Play className="h-4 w-4" />
            {status && status.processed > 0 ? (status.remaining ? `繼續處理剩下 ${status.remaining} 本（約 ${mins} 分鐘）` : '已全部處理完成') : `建立知識圖譜（約 ${mins} 分鐘）`}
          </button>
        )}
        {!running && status && status.processed > 0 && (
          <button onClick={reset} className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-neutral-500 hover:bg-neutral-100">
            <RotateCcw className="h-4 w-4" /> 全部重建
          </button>
        )}
      </div>
      {running && <p className="mt-2 text-xs text-neutral-400">處理中請勿關閉頁面；關掉也沒關係，下次按「繼續」會從中斷處接續。</p>}
      {log.length > 0 && (
        <ul className="mt-3 text-xs text-neutral-400 space-y-0.5">{log.map((l, i) => <li key={i}>{l}</li>)}</ul>
      )}
    </div>
  )
}

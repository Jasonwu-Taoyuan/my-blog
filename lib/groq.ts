/**
 * Groq（免費方案）呼叫工具，OpenAI 相容 API，不需額外套件。
 * - Llama 3.x 已於 2026-08-16 下架；改用 gpt-oss / qwen，可用 GROQ_MODEL 覆寫
 * - 模型下架（404）或每日額度用完 → 自動換下一個模型
 * - 每分鐘額度（8,000 tokens）用完 → 等 Groq 建議的秒數再重試
 */
const MODELS = ['openai/gpt-oss-120b', 'qwen/qwen3.8-27b', 'openai/gpt-oss-20b']
const deadModels = new Set<string>()

export function groqConfigured() {
  return !!process.env.GROQ_API_KEY?.trim()
}

function models() {
  const first = process.env.GROQ_MODEL?.trim()
  const list = [...(first ? [first] : []), ...MODELS.filter(m => m !== first)]
  const alive = list.filter(m => !deadModels.has(m))
  return alive.length ? alive : list
}

function extra(model: string): Record<string, string> {
  if (model.startsWith('openai/gpt-oss')) return { reasoning_effort: 'low' }
  if (model.startsWith('qwen/')) return { reasoning_format: 'hidden' }
  return {}
}

function retryAfter(msg: string, header: string | null) {
  const m = msg.match(/try again in (?:(\d+)m)?([\d.]+)s/)
  if (m) return Number(m[1] || 0) * 60 + Number(m[2])
  return Number(header) || 20
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

export class GroqError extends Error {}

export async function groqChat(prompt: string, maxTokens = 1500): Promise<string> {
  const key = process.env.GROQ_API_KEY?.trim()
  if (!key) throw new GroqError('尚未設定 GROQ_API_KEY（免費，console.groq.com 申請）')
  let last = '沒有可用的 Groq 模型'
  for (const model of models()) {
    for (let attempt = 0; attempt < 3; attempt++) {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model, max_tokens: maxTokens, temperature: 0.2,
          messages: [{ role: 'user', content: prompt }], ...extra(model),
        }),
      })
      if (res.ok) {
        const data = await res.json()
        const text: string = data?.choices?.[0]?.message?.content || ''
        return text.replace(/<think>[\s\S]*?<\/think>/g, '').trim()
      }
      const body = await res.text()
      last = `Groq ${res.status}：${body.slice(0, 200)}`
      const lower = body.toLowerCase()
      if (res.status === 404 || lower.includes('model_not_found') || lower.includes('decommissioned')) {
        deadModels.add(model); break
      }
      if (res.status === 429 && (lower.includes('per day') || lower.includes('(tpd)') || lower.includes('(rpd)'))) {
        break // 這個模型今天的額度用完 → 換下一個
      }
      if (res.status === 429 && attempt < 2) {
        await sleep(Math.min(retryAfter(body, res.headers.get('retry-after')) + 1, 65) * 1000)
        continue
      }
      throw new GroqError(last)
    }
  }
  throw new GroqError(last)
}

/** 從 AI 回應中取出 JSON 物件或陣列 */
export function extractJson(text: string): unknown {
  const t = text.replace(/<think>[\s\S]*?<\/think>/g, '')
  const fenced = t.match(/```(?:json)?\s*([\[{][\s\S]*?[\]}])\s*```/)
  if (fenced) return JSON.parse(fenced[1])
  const starts = [t.indexOf('{'), t.indexOf('[')].filter(i => i >= 0)
  if (!starts.length) throw new Error('No JSON in AI response')
  const end = Math.max(t.lastIndexOf('}'), t.lastIndexOf(']'))
  return JSON.parse(t.slice(Math.min(...starts), end + 1))
}

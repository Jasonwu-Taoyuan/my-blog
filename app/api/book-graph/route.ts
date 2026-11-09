import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

import { auth } from '@/auth'
import { graphStatus, processNextBatch, resetGraph } from '@/lib/bookGraph'
import { groqConfigured, GroqError } from '@/lib/groq'

export const dynamic = 'force-dynamic'

/** 目前進度（後台用） */
export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    return NextResponse.json({ ...(await graphStatus()), groq: groqConfigured() })
  } catch (error) {
    console.error('GET /api/book-graph error:', error)
    return NextResponse.json({ error: '無法讀取進度（請確認 Notion 設定）' }, { status: 500 })
  }
}

/** action=next：處理下一批書；action=reset：清空重建 */
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { action } = await request.json().catch(() => ({ action: 'next' }))
  try {
    if (action === 'reset') {
      await resetGraph()
      revalidatePath('/knowledge/graph')
      return NextResponse.json({ ...(await graphStatus()), added: 0 })
    }
    const result = await processNextBatch()
    revalidatePath('/knowledge/graph')
    return NextResponse.json(result)
  } catch (error) {
    console.error('POST /api/book-graph error:', error)
    const msg = error instanceof GroqError ? error.message
      : error instanceof SyntaxError ? 'AI 回傳格式無法解析，請再按一次繼續'
      : '處理失敗，請再按一次繼續'
    return NextResponse.json({ error: msg }, { status: 502 })
  }
}

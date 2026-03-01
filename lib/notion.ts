import { Client } from '@notionhq/client'

export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

export const BOOKS_DATABASE_ID = process.env.NOTION_DATABASE_ID || '307a747382e48053bbafe57f523e146b'

export interface Book {
  id: string
  title: string
  borrowDate: string | null
  borrowYear: number | null
  callNumber: string
  mainCategory: string
  subCategory: string
  number: number | null
}

function getText(property: any): string {
  if (!property) return ''
  if (property.type === 'rich_text') {
    return property.rich_text?.map((t: any) => t.plain_text).join('') || ''
  }
  if (property.type === 'title') {
    return property.title?.map((t: any) => t.plain_text).join('') || ''
  }
  return ''
}

export interface NotionBlock {
  id: string
  type: string
  content: string
  annotations?: {
    bold: boolean
    italic: boolean
    code: boolean
  }
}

export async function fetchBookById(pageId: string): Promise<Book | null> {
  try {
    const page: any = await notion.pages.retrieve({ page_id: pageId })
    const props = page.properties
    return {
      id: page.id,
      number: props['編號']?.number || null,
      title: getText(props['書名']),
      borrowDate: props['借閱日期']?.date?.start || null,
      borrowYear: props['借閱年份']?.number || null,
      callNumber: getText(props['索書號']),
      mainCategory: getText(props['主分類']),
      subCategory: getText(props['次分類']),
    }
  } catch {
    return null
  }
}

export async function fetchBookBlocks(pageId: string): Promise<NotionBlock[]> {
  const response: any = await notion.blocks.children.list({ block_id: pageId })
  return response.results.map((block: any) => {
    const richText = block[block.type]?.rich_text || []
    const content = richText.map((t: any) => t.plain_text).join('')
    const annotations = richText[0]?.annotations
    return {
      id: block.id,
      type: block.type,
      content,
      annotations,
    }
  })
}

export async function fetchBooks(): Promise<Book[]> {
  const allBooks: Book[] = []
  let cursor: string | undefined = undefined

  // 分頁取得全部資料
  do {
    const response: any = await notion.databases.query({
      database_id: BOOKS_DATABASE_ID,
      sorts: [{ property: '編號', direction: 'ascending' }],
      start_cursor: cursor,
      page_size: 100,
    })

    const books = response.results.map((page: any) => {
      const props = page.properties
      return {
        id: page.id,
        number: props['編號']?.number || null,
        title: getText(props['書名']),
        borrowDate: props['借閱日期']?.date?.start || null,
        borrowYear: props['借閱年份']?.number || null,
        callNumber: getText(props['索書號']),
        mainCategory: getText(props['主分類']),
        subCategory: getText(props['次分類']),
      }
    })

    allBooks.push(...books)
    cursor = response.next_cursor ?? undefined
  } while (cursor)

  return allBooks
}

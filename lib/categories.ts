export const CATEGORIES = [
  { slug: 'anti-aging', name: '逆齡大腦', description: '探索大腦健康與逆齡的知識' },
  { slug: 'business-tech', name: '商業與科技書籍', description: '商業思維與科技趨勢的閱讀筆記' },
  { slug: 'history', name: '歷史', description: '歷史事件與人物的深度探討' },
  { slug: 'sports', name: '運動', description: 'NBA馬刺與運動世界的觀察' },
] as const

export type CategorySlug = (typeof CATEGORIES)[number]['slug']

export function getCategoryBySlug(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug)
}

export function getCategoryName(slug: string) {
  return getCategoryBySlug(slug)?.name || slug
}

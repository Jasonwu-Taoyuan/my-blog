export const CATEGORIES = [
  { slug: 'operations', name: '專業知識', description: '營運管理的實務心得與方法論' },
  { slug: 'knowledge', name: '知識管理', description: '讀書筆記、歷史與跨領域思考的整理' },
  { slug: 'sports', name: '運動', description: 'NBA馬刺與運動世界的觀察' },
] as const

// 舊分類保留相容：文章仍標記為這些 category 值時，一併併入知識管理頁面呈現
export const KNOWLEDGE_LEGACY_CATEGORIES = ['knowledge', 'history', 'anti-aging']

export type CategorySlug = (typeof CATEGORIES)[number]['slug']

export function getCategoryBySlug(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug)
}

export function getCategoryName(slug: string) {
  return getCategoryBySlug(slug)?.name || slug
}

import Link from 'next/link'
import { Clock } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { KNOWLEDGE_LEGACY_CATEGORIES } from '@/lib/categories'

export const metadata = {
  title: '文章筆記 | My Blog',
  description: '讀書心得、歷史與跨領域思考的整理',
}

export default async function ArticlesPage() {
  const posts = await prisma.post.findMany({
    where: { status: 'published', category: { in: KNOWLEDGE_LEGACY_CATEGORIES } },
    orderBy: { publishedAt: 'desc' },
  })
  const formattedPosts = posts.map((post) => ({
    ...post,
    tags: JSON.parse(post.tags || '[]') as string[],
  }))

  return (
    <div className="container mx-auto px-4 py-12" style={{ maxWidth: 1100 }}>
      <Link
        href="/knowledge"
        className="inline-flex items-center gap-2 text-neutral-400 hover:text-[var(--accent)] transition-colors mb-6 text-sm"
      >
        ← 返回知識管理
      </Link>

      <div className="mb-8 flex items-baseline justify-between flex-wrap gap-2">
        <h1 className="text-4xl font-bold text-neutral-900 tracking-tight">文章筆記</h1>
        {formattedPosts.length > 0 && (
          <p className="text-sm text-neutral-400">
            共 <span className="font-semibold" style={{ color: 'var(--accent)' }}>{formattedPosts.length}</span> 篇文章
          </p>
        )}
      </div>

      {formattedPosts.length === 0 ? (
        <p className="text-neutral-400 text-center py-12">尚無文章</p>
      ) : (
        <div className="flex flex-col rounded-2xl border border-neutral-200/70 bg-neutral-200/70 overflow-hidden shadow-sm" style={{ gap: 1 }}>
          {formattedPosts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.slug}`}
              className="bg-white px-6 py-5 flex items-center gap-4 hover:bg-neutral-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-bold text-neutral-900 tracking-tight mb-1">{post.title}</div>
                <div className="text-sm text-neutral-500 truncate">{post.summary}</div>
              </div>
              <div className="flex items-center gap-3 text-xs text-neutral-400 whitespace-nowrap">
                {post.tags[0] && (
                  <span
                    className="px-2.5 py-1 rounded-full font-semibold"
                    style={
                      post.category === 'knowledge'
                        ? { background: 'color-mix(in srgb, var(--accent) 12%, transparent)', color: 'var(--accent)' }
                        : { background: 'rgba(0,0,0,.05)', color: 'var(--text-secondary)' }
                    }
                  >
                    {post.tags[0]}
                  </span>
                )}
                <span className="flex items-center gap-1"><Clock size={12} />{post.readingTimeMinutes} 分鐘</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

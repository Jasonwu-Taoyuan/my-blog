import { prisma } from '@/lib/prisma'
import PostList from '@/components/post/PostList'
import Pagination from '@/components/shared/Pagination'

export const metadata = {
  title: '運動 | My Blog',
  description: 'NBA馬刺與運動世界的觀察',
}

interface Props {
  searchParams: Promise<{ page?: string }>
}

export default async function SportsPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams
  const page = parseInt(pageParam || '1')
  const limit = 9

  const where = { status: 'published' as const, category: 'sports' }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.post.count({ where }),
  ])

  const formattedPosts = posts.map((post) => ({
    ...post,
    tags: JSON.parse(post.tags || '[]'),
  }))

  return (
    <div className="container mx-auto px-4 py-12">
      {/* 馬刺主題 Header */}
      <div className="mb-10 rounded-2xl overflow-hidden border border-slate-700">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 relative">
          {/* 背景裝飾 */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #C0C0C0 0, #C0C0C0 1px, transparent 0, transparent 50%)',
            backgroundSize: '12px 12px'
          }} />

          <div className="relative flex items-center gap-6">
            {/* SAS 徽章 */}
            <div className="shrink-0 w-20 h-20 rounded-full bg-slate-900 border-2 border-slate-400 flex flex-col items-center justify-center shadow-lg shadow-black/50">
              <span className="text-slate-200 text-xs font-black tracking-widest">SAN</span>
              <span className="text-white text-lg font-black leading-none">SAS</span>
              <span className="text-slate-400 text-[9px] font-bold tracking-widest">SPURS</span>
            </div>

            <div>
              <p className="text-slate-400 text-sm font-medium tracking-widest uppercase mb-1">
                NBA · San Antonio
              </p>
              <h1 className="text-4xl font-black text-white tracking-tight">
                運動觀察
              </h1>
              <p className="text-slate-400 mt-2">
                馬刺隊動態、賽事分析與運動世界的深度觀察
              </p>
            </div>
          </div>

          {/* 底部資訊列 */}
          <div className="relative mt-6 pt-4 border-t border-slate-700 flex gap-6 text-sm text-slate-500">
            <span>
              <span className="text-slate-300 font-semibold">{total}</span> 篇文章
            </span>
            <span className="text-slate-300 font-semibold" style={{ color: '#C0C0C0' }}>
              Go Spurs Go!
            </span>
          </div>
        </div>
      </div>

      {/* 文章列表 */}
      {formattedPosts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-500 text-lg mb-2">尚無文章</p>
          <p className="text-slate-600 text-sm">在後台新增分類為「運動」的文章即可顯示於此</p>
        </div>
      ) : (
        <>
          <PostList posts={formattedPosts} />
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(total / limit)}
            basePath="/category/sports"
          />
        </>
      )}
    </div>
  )
}

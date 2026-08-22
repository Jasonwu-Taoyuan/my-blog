import { prisma } from '@/lib/prisma'
import PostList from '@/components/post/PostList'
import SearchBar from '@/components/shared/SearchBar'
import Pagination from '@/components/shared/Pagination'
import TagChip from '@/components/post/TagChip'

interface Props {
  searchParams: Promise<{
    page?: string
    tag?: string
    q?: string
  }>
}

export default async function PostsPage({ searchParams }: Props) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const tag = params.tag
  const query = params.q
  const limit = 9

  const where: any = { status: 'published' }

  if (tag) {
    where.tags = { contains: tag }
  }

  if (query) {
    where.OR = [
      { title: { contains: query, mode: 'insensitive' } },
      { summary: { contains: query, mode: 'insensitive' } },
    ]
  }

  const [posts, total, allTags] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.post.count({ where }),
    prisma.post
      .findMany({
        where: { status: 'published' },
        select: { tags: true },
      })
      .then((posts) => {
        const tagSet = new Set<string>()
        posts.forEach((post) => {
          const tags = JSON.parse(post.tags || '[]')
          tags.forEach((tag: string) => tagSet.add(tag))
        })
        return Array.from(tagSet).sort()
      }),
  ])

  const formattedPosts = posts.map((post) => ({
    ...post,
    tags: JSON.parse(post.tags || '[]'),
  }))

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="container mx-auto px-4 py-12" style={{ maxWidth: 1100 }}>
      <h1 className="text-4xl font-bold text-neutral-900 tracking-tight mb-8">所有文章</h1>

      {/* Search Bar */}
      <div className="mb-8 max-w-md">
        <SearchBar />
      </div>

      {/* Tags Filter */}
      {allTags.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-neutral-400 mb-3">依標籤篩選：</h2>
          <div className="flex flex-wrap gap-2">
            {tag && (
              <a href="/posts" className="inline-block">
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-neutral-200 text-neutral-700 hover:bg-neutral-300">
                  清除篩選 &times;
                </span>
              </a>
            )}
            {allTags.map((t) => (
              <TagChip
                key={t}
                tag={t}
                href={`/posts?tag=${t}`}
                variant={tag === t ? 'default' : 'outline'}
              />
            ))}
          </div>
        </div>
      )}

      {/* Active Filters */}
      {(tag || query) && (
        <div className="mb-6">
          <p className="text-sm text-neutral-400">
            {tag && <span>標籤：<strong className="text-neutral-700">{tag}</strong></span>}
            {tag && query && ' • '}
            {query && <span>搜尋：<strong className="text-neutral-700">{query}</strong></span>}
            {' '}（共 {total} 筆結果）
          </p>
        </div>
      )}

      {/* Posts Grid */}
      <PostList posts={formattedPosts} />

      {/* Pagination */}
      <Pagination currentPage={page} totalPages={totalPages} />
    </div>
  )
}

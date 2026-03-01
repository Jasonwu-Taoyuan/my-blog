import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getCategoryBySlug, CATEGORIES } from '@/lib/categories'
import PostList from '@/components/post/PostList'
import Pagination from '@/components/shared/Pagination'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)

  if (!category) {
    return { title: 'Not Found' }
  }

  return {
    title: `${category.name} | My Blog`,
    description: category.description,
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { page: pageParam } = await searchParams
  const category = getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  const page = parseInt(pageParam || '1')
  const limit = 9

  const where = {
    status: 'published' as const,
    category: slug,
  }

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

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-100 mb-3">{category.name}</h1>
        <p className="text-lg text-slate-400">{category.description}</p>
      </div>

      <PostList posts={formattedPosts} />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath={`/category/${slug}`}
      />
    </div>
  )
}

import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { CATEGORIES } from '@/lib/categories'
import PostCard from '@/components/post/PostCard'
import ReactMarkdown from 'react-markdown'

export const metadata = {
  title: 'Home | My Blog',
  description: '分享關於逆齡大腦、商業與科技、歷史的閱讀筆記',
}

export default async function Home() {
  const [latestPosts, about] = await Promise.all([
    prisma.post.findMany({
      where: { status: 'published' },
      orderBy: { publishedAt: 'desc' },
      take: 6,
    }),
    prisma.about.findFirst(),
  ])

  const formattedPosts = latestPosts.map((post) => ({
    ...post,
    tags: JSON.parse(post.tags || '[]'),
  }))

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24 border-b border-slate-700/50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-slate-100 mb-4 tracking-tight">
            Welcome to My Blog
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            分享關於逆齡大腦、商業與科技、歷史的閱讀筆記與心得
          </p>

          {/* Category Cards */}
          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto mt-12">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="group p-6 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:border-amber-500/50 hover:bg-slate-800 transition-all"
              >
                <h3 className="text-xl font-semibold text-slate-100 mb-2 group-hover:text-amber-500 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm text-slate-400">{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-slate-100">最新文章</h2>
        </div>

        {formattedPosts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {formattedPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">
              尚未有文章，敬請期待！
            </p>
          </div>
        )}
      </section>

      {/* About Section */}
      {about && (
        <section className="border-t border-slate-700/50 py-16">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-slate-100 mb-2">
              {about.displayName}
            </h2>
            {about.headline && (
              <p className="text-lg text-amber-500/80 mb-6">{about.headline}</p>
            )}
            <div className="prose prose-lg max-w-none text-slate-400 text-left">
              <ReactMarkdown>{about.bioMarkdown}</ReactMarkdown>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

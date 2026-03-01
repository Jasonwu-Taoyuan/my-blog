import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { getCategoryName } from '@/lib/categories'
import { Plus, Edit } from 'lucide-react'
import DeleteButton from '@/components/admin/DeleteButton'

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      author: {
        select: { name: true },
      },
    },
  })

  const formattedPosts = posts.map((post) => ({
    ...post,
    tags: JSON.parse(post.tags || '[]'),
  }))

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-slate-100">Manage Posts</h1>
        <Link
          href="/admin/posts/new"
          className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Post
        </Link>
      </div>

      {formattedPosts.length > 0 ? (
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Published
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Tags
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {formattedPosts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-700/30">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-200">
                      {post.title}
                    </div>
                    <div className="text-sm text-slate-500">
                      /{post.slug}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-amber-400">
                      {post.category ? getCategoryName(post.category) : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        post.status === 'published'
                          ? 'bg-green-900/50 text-green-400'
                          : 'bg-yellow-900/50 text-yellow-400'
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {post.publishedAt
                      ? formatDate(post.publishedAt)
                      : 'Not published'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-slate-700/50 text-amber-400/80 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="text-amber-500 hover:text-amber-400"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      <DeleteButton postId={post.id} postTitle={post.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
          <p className="text-slate-500 mb-4">No posts yet.</p>
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create your first post
          </Link>
        </div>
      )}
    </div>
  )
}

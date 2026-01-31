import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { FileText, Image, Eye } from 'lucide-react'

export default async function DashboardPage() {
  const [postsCount, photosCount, publishedCount, draftCount] = await Promise.all([
    prisma.post.count(),
    prisma.photo.count(),
    prisma.post.count({ where: { status: 'published' } }),
    prisma.post.count({ where: { status: 'draft' } }),
  ])

  const stats = [
    { label: 'Total Posts', value: postsCount, icon: FileText, color: 'bg-blue-500' },
    { label: 'Published', value: publishedCount, icon: Eye, color: 'bg-green-500' },
    { label: 'Drafts', value: draftCount, icon: FileText, color: 'bg-yellow-500' },
    { label: 'Photos', value: photosCount, icon: Image, color: 'bg-purple-500' },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/posts/new"
            className="block p-4 border-2 border-blue-500 rounded-lg hover:bg-blue-50 transition-colors text-center"
          >
            <FileText className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <span className="font-medium text-gray-900">New Post</span>
          </Link>
          <Link
            href="/admin/photos"
            className="block p-4 border-2 border-purple-500 rounded-lg hover:bg-purple-50 transition-colors text-center"
          >
            <Image className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <span className="font-medium text-gray-900">Upload Photo</span>
          </Link>
          <Link
            href="/admin/posts"
            className="block p-4 border-2 border-gray-500 rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            <FileText className="h-8 w-8 mx-auto mb-2 text-gray-500" />
            <span className="font-medium text-gray-900">Manage Posts</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

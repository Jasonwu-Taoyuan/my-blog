import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { FileText, Image as ImageIcon, User, LogOut } from 'lucide-react'
import { signOut } from '@/auth'

export default async function AdminPage() {
  const session = await auth()

  const [postsCount, photosCount, draftCount] = await Promise.all([
    prisma.post.count({ where: { status: 'published' } }),
    prisma.photo.count(),
    prisma.post.count({ where: { status: 'draft' } }),
  ])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Welcome back, {session?.user?.name}</p>
        </div>
        <form
          action={async () => {
            'use server'
            await signOut()
          }}
        >
          <button
            type="submit"
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </form>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Published Posts</p>
              <p className="text-3xl font-bold text-gray-900">{postsCount}</p>
            </div>
            <FileText className="h-12 w-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Draft Posts</p>
              <p className="text-3xl font-bold text-gray-900">{draftCount}</p>
            </div>
            <FileText className="h-12 w-12 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Photos</p>
              <p className="text-3xl font-bold text-gray-900">{photosCount}</p>
            </div>
            <ImageIcon className="h-12 w-12 text-green-500" />
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/posts"
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
        >
          <FileText className="h-12 w-12 mx-auto mb-4 text-blue-500" />
          <h3 className="font-semibold text-gray-900 mb-2">Manage Posts</h3>
          <p className="text-sm text-gray-600">Create, edit, and delete posts</p>
        </Link>

        <Link
          href="/admin/photos"
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
        >
          <ImageIcon className="h-12 w-12 mx-auto mb-4 text-green-500" />
          <h3 className="font-semibold text-gray-900 mb-2">Manage Photos</h3>
          <p className="text-sm text-gray-600">Upload and manage photos</p>
        </Link>

        <Link
          href="/admin/about"
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
        >
          <User className="h-12 w-12 mx-auto mb-4 text-purple-500" />
          <h3 className="font-semibold text-gray-900 mb-2">Edit About</h3>
          <p className="text-sm text-gray-600">Update your profile</p>
        </Link>

        <Link
          href="/"
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
        >
          <svg
            className="h-12 w-12 mx-auto mb-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <h3 className="font-semibold text-gray-900 mb-2">View Site</h3>
          <p className="text-sm text-gray-600">Go to public site</p>
        </Link>
      </div>
    </div>
  )
}

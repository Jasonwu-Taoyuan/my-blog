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
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">
            管理後台
          </h1>
          <p className="text-neutral-400">歡迎回來，{session?.user?.name}</p>
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
            登出
          </button>
        </form>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg border border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-400 text-sm mb-1">已發布文章</p>
              <p className="text-3xl font-bold text-neutral-900">{postsCount}</p>
            </div>
            <FileText className="h-12 w-12 text-[var(--accent)]" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-400 text-sm mb-1">草稿文章</p>
              <p className="text-3xl font-bold text-neutral-900">{draftCount}</p>
            </div>
            <FileText className="h-12 w-12 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-400 text-sm mb-1">相片</p>
              <p className="text-3xl font-bold text-neutral-900">{photosCount}</p>
            </div>
            <ImageIcon className="h-12 w-12 text-green-500" />
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/posts"
          className="p-6 bg-white rounded-lg border border-neutral-200 hover:border-[var(--accent)]/50 transition-all text-center"
        >
          <FileText className="h-12 w-12 mx-auto mb-4 text-[var(--accent)]" />
          <h3 className="font-semibold text-neutral-900 mb-2">管理文章</h3>
          <p className="text-sm text-neutral-400">新增、編輯、刪除文章</p>
        </Link>

        <Link
          href="/admin/photos"
          className="p-6 bg-white rounded-lg border border-neutral-200 hover:border-[var(--accent)]/50 transition-all text-center"
        >
          <ImageIcon className="h-12 w-12 mx-auto mb-4 text-green-500" />
          <h3 className="font-semibold text-neutral-900 mb-2">管理相片</h3>
          <p className="text-sm text-neutral-400">上傳與管理相片</p>
        </Link>

        <Link
          href="/admin/about"
          className="p-6 bg-white rounded-lg border border-neutral-200 hover:border-[var(--accent)]/50 transition-all text-center"
        >
          <User className="h-12 w-12 mx-auto mb-4 text-purple-500" />
          <h3 className="font-semibold text-neutral-900 mb-2">編輯關於我</h3>
          <p className="text-sm text-neutral-400">更新個人簡介</p>
        </Link>

        <Link
          href="/"
          className="p-6 bg-white rounded-lg border border-neutral-200 hover:border-[var(--accent)]/50 transition-all text-center"
        >
          <svg
            className="h-12 w-12 mx-auto mb-4 text-neutral-400"
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
          <h3 className="font-semibold text-neutral-900 mb-2">查看網站</h3>
          <p className="text-sm text-neutral-400">前往公開網站</p>
        </Link>
      </div>
    </div>
  )
}

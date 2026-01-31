import Link from 'next/link'
import { auth } from '@/auth'

export default async function Header() {
  const session = await auth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-gray-900">
          My Blog
        </Link>

        <div className="flex items-center space-x-6">
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/posts"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Posts
          </Link>
          <Link
            href="/photos"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Photos
          </Link>
          <Link
            href="/about"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            About
          </Link>
          {session?.user && (
            <Link
              href="/admin"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Admin
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}

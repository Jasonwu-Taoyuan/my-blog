import Link from 'next/link'
import { auth } from '@/auth'
import { CATEGORIES } from '@/lib/categories'

export default async function Header() {
  const session = await auth()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-700/50 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/80">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-amber-500 tracking-wide">
          My Blog
        </Link>

        <div className="flex items-center space-x-6">
          <Link
            href="/"
            className="text-slate-300 hover:text-amber-500 transition-colors font-medium"
          >
            首頁
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="text-slate-300 hover:text-amber-500 transition-colors font-medium"
            >
              {cat.name}
            </Link>
          ))}
          <Link
            href="/photos"
            className="text-slate-300 hover:text-amber-500 transition-colors font-medium"
          >
            相片
          </Link>
          {session?.user && (
            <Link
              href="/admin"
              className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
            >
              Admin
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}

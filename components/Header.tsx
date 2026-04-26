import Link from 'next/link'
import { auth } from '@/auth'
import { CATEGORIES } from '@/lib/categories'

export default async function Header() {
  const session = await auth()

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'var(--bg-sidebar)',
      borderBottom: '1px solid var(--border-subtle)',
      backdropFilter: 'blur(8px)',
    }}>
      <nav className="container mx-auto px-4" style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1100 }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32,
            background: 'var(--accent-dim)',
            border: '1px solid rgba(217,119,6,.4)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16,
          }}>📖</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.25 }}>
              Jason&apos;s Blog
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 400 }}>
              閱讀 · 思考 · 成長
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Link href="/" className="header-nav-item">首頁</Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="header-nav-item"
            >
              {cat.name}
            </Link>
          ))}
          <Link href="/mind-maps" className="header-nav-item">思維導圖</Link>
          <Link href="/photos" className="header-nav-item">相片</Link>
          {session?.user && (
            <Link href="/admin" className="header-admin-btn" style={{ marginLeft: 8 }}>
              Admin
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}

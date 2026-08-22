import Link from 'next/link'
import { auth } from '@/auth'

const NAV_ITEMS = [
  { href: '/', label: '首頁' },
  { href: '/about', label: '關於我' },
  { href: '/category/operations', label: '專業知識' },
  { href: '/knowledge', label: '知識管理' },
  { href: '/travel', label: '旅遊地圖' },
  { href: '/category/sports', label: '運動' },
  { href: '/photos', label: '相片' },
]

export default async function Header() {
  const session = await auth()

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'var(--bg-sidebar)',
      borderBottom: '.5px solid var(--border-subtle)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    }}>
      <nav className="container mx-auto px-4" style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1100 }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30,
            background: 'linear-gradient(160deg, #0071e3, #0058b0)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: '#fff',
            flexShrink: 0,
          }}>J</div>
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
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="header-nav-item">
              {item.label}
            </Link>
          ))}
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

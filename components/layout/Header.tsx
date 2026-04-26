'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { CATEGORIES } from '@/lib/categories'

export default function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { href: '/', label: '首頁', exact: true },
    ...CATEGORIES.map((cat) => ({
      href: `/category/${cat.slug}`,
      label: cat.name,
      exact: false,
    })),
    { href: '/mind-maps', label: '思維導圖', exact: false },
    { href: '/photos', label: '相片', exact: false },
  ]

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'var(--bg-sidebar)',
      borderBottom: '1px solid var(--border-subtle)',
      backdropFilter: 'blur(8px)',
    }}>
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: 32, height: 32,
              background: 'var(--accent-dim)',
              border: '1px solid rgba(217,119,6,.4)',
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16,
              flexShrink: 0,
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center" style={{ gap: 2 }}>
            {navItems.map((item) => {
              const active = isActive(item.href, item.exact)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 13,
                    fontWeight: active ? 600 : 500,
                    color: active ? 'var(--accent)' : 'var(--text-secondary)',
                    backgroundColor: active ? 'var(--accent-dim)' : 'transparent',
                    textDecoration: 'none',
                    transition: 'all var(--transition)',
                    position: 'relative',
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'
                      ;(e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg-card)'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'
                      ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
                    }
                  }}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden" style={{ marginTop: 12, paddingBottom: 12, borderTop: '1px solid var(--border-subtle)', paddingTop: 12 }}>
            {navItems.map((item) => {
              const active = isActive(item.href, item.exact)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'block',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 13,
                    fontWeight: active ? 600 : 500,
                    color: active ? 'var(--accent)' : 'var(--text-secondary)',
                    backgroundColor: active ? 'var(--accent-dim)' : 'transparent',
                    textDecoration: 'none',
                    marginBottom: 2,
                  }}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        )}
      </nav>
    </header>
  )
}

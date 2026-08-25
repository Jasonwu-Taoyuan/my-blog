'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

interface NavItem {
  href: string
  label: string
}

export default function MobileNav({
  navItems,
  isLoggedIn,
}: {
  navItems: NavItem[]
  isLoggedIn: boolean
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? '關閉選單' : '開啟選單'}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 36,
          height: 36,
          borderRadius: 8,
          color: 'var(--text-primary)',
          background: 'transparent',
          border: 'none',
        }}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 56,
            left: 0,
            right: 0,
            background: 'var(--bg-card)',
            borderBottom: '.5px solid var(--border-subtle)',
            boxShadow: '0 12px 24px rgba(0,0,0,.08)',
          }}
        >
          <nav style={{ display: 'flex', flexDirection: 'column', padding: '8px 20px 16px' }}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                style={{
                  padding: '13px 4px',
                  fontSize: 15,
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  borderBottom: '.5px solid var(--border-subtle)',
                }}
              >
                {item.label}
              </Link>
            ))}
            {isLoggedIn && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                style={{
                  padding: '13px 4px',
                  fontSize: 15,
                  fontWeight: 600,
                  color: 'var(--accent)',
                  textDecoration: 'none',
                }}
              >
                Admin
              </Link>
            )}
          </nav>
        </div>
      )}
    </div>
  )
}

import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import Link from 'next/link'
import { LayoutDashboard, FileText, Image, User, LogOut, GitBranch, MapPin } from 'lucide-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect('/admin-login')
  }

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/posts', label: 'Posts', icon: FileText },
    { href: '/admin/photos', label: 'Photos', icon: Image },
    { href: '/admin/travel', label: '旅遊地點', icon: MapPin },
    { href: '/admin/mind-maps', label: '思維導圖', icon: GitBranch },
    { href: '/admin/about', label: 'About', icon: User },
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-neutral-200/70 min-h-screen flex flex-col">
          <div className="p-6 flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
              style={{ background: 'linear-gradient(160deg, #0071e3, #0058b0)' }}
            >
              J
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-neutral-900 leading-tight">Admin Panel</h2>
              <p className="text-xs text-neutral-400 truncate">{session.user?.email}</p>
            </div>
          </div>
          <nav className="mt-2 px-3 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors text-sm font-medium"
                >
                  <Icon className="h-[18px] w-[18px]" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <div className="p-6">
            <a
              href="/api/auth/signout"
              className="flex items-center gap-3 text-sm font-medium text-neutral-400 hover:text-red-500 transition-colors"
            >
              <LogOut className="h-[18px] w-[18px]" />
              Sign Out
            </a>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}

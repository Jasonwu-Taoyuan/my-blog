import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import Link from 'next/link'
import { LayoutDashboard, FileText, Image, User, LogOut, GitBranch } from 'lucide-react'

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
    { href: '/admin/mind-maps', label: '思維導圖', icon: GitBranch },
    { href: '/admin/about', label: 'About', icon: User },
  ]

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-800 border-r border-slate-700 min-h-screen">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-slate-100">Admin Panel</h2>
            <p className="text-sm text-slate-400 mt-1">{session.user?.email}</p>
          </div>
          <nav className="mt-6">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center px-6 py-3 text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <div className="absolute bottom-0 w-64 p-6">
            <a
              href="/api/auth/signout"
              className="flex items-center text-slate-400 hover:text-red-400 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
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

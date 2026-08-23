import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import LoginForm from '@/components/admin/LoginForm'

export const metadata = {
  title: 'Admin Login | My Blog',
}

export default async function LoginPage() {
  const session = await auth()

  if (session?.user) {
    redirect('/admin')
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold text-neutral-900">
            後台登入
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-400">
            登入以管理你的網站
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

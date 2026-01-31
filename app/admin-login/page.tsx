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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to manage your blog
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

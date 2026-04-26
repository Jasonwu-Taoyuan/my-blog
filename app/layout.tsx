import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'My Blog',
  description: '分享關於逆齡大腦、商業與科技、歷史的閱讀筆記',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <head>
        <link rel="stylesheet" href="/mind-elixir.css" />
      </head>
      <body style={{ backgroundColor: 'var(--bg)', color: 'var(--text-primary)' }}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

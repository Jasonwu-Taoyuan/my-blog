import type { Metadata } from 'next'
import { Noto_Sans_TC } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-noto-sans-tc',
  display: 'swap',
})

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
    <html lang="zh-TW" className={notoSansTC.variable}>
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

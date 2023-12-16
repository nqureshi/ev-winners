import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const runtime = 'edge' // 'nodejs' (default) | 'edge'

export const metadata: Metadata = {
  title: 'Emergent Ventures Winners',
  description: 'Semantic search for EV winners.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

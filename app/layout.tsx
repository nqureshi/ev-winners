import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Emergent Ventures Winners',
  description: 'Emergent Ventures is a fellowship and grant program founded by Tyler Cowen, economist and author of the blog Marginal Revolution, from the Mercatus Center at GMU. It funds moonshots and highly ambitious ideas to improve society. This site collects all winners in one place. You can also find a CSV by clicking the Github link on the top right.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

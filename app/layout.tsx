import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Emergent Ventures Winners',
  description: 'Semantic search for all Emergent Ventures winners.',
  twitter: {
    card: "summary_large_image",
    title: "Emergent Ventures Winners",
    description: "Semantic search for all Emergent Ventures winners.",
    creator: "@nabeelqu",
    images: ["https://www.mercatus.org/themes/custom/mercatus/images/mercatus-social-media.png"],
  }
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

import type { Metadata } from 'next'
import { Inter, Instrument_Serif } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument',
  display: 'swap',
})

const description = 'Every Emergent Ventures winner in one place, with semantic search over what they are working on.'

export const metadata: Metadata = {
  metadataBase: new URL('https://evwinners.org'),
  title: 'Emergent Ventures Winners',
  description,
  openGraph: {
    title: 'Emergent Ventures Winners',
    description,
    url: 'https://evwinners.org',
    siteName: 'Emergent Ventures Winners',
    type: 'website',
    images: ["https://www.mercatus.org/themes/custom/mercatus/images/mercatus-social-media.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Emergent Ventures Winners",
    description,
    creator: "@nabeelqu",
    images: ["https://www.mercatus.org/themes/custom/mercatus/images/mercatus-social-media.png"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}

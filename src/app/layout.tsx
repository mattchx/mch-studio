import type { Metadata } from 'next'
import { DM_Sans, IBM_Plex_Sans, Geist_Mono } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['500', '700'],
})

const plexSans = IBM_Plex_Sans({
  variable: '--font-ibm-plex-sans',
  subsets: ['latin'],
  weight: ['400', '500'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'MCH Studio',
  description: 'Internal content approval dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${plexSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full bg-bg text-foreground antialiased">
        {children}
      </body>
    </html>
  )
}

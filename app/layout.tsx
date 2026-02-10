import React from "react"
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'

// Build version 4 - Complete rebuild required
const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'QuizMaster - Q&A Game Platform',
  description: 'A comprehensive Q&A game platform with admin dashboard, teacher tools, and real-time gameplay',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#1a4d4d',
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased bg-slate-900 text-white">{children}</body>
    </html>
  )
}

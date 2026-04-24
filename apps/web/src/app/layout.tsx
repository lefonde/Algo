import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Study Aid',
  description: 'Multi-course study platform with AI-powered exam prediction',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

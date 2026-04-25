'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Plus, RotateCcw, TrendingUp } from 'lucide-react'

type Props = {
  courseName?: string
  courseSlug?: string
  showRevise?: boolean
  showTrends?: boolean
}

export function TopBar({ courseName, courseSlug, showRevise, showTrends }: Props) {
  const pathname = usePathname()
  const isHome = pathname === '/'

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-surface-border-subtle)] bg-[var(--color-surface-base)]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-12 flex items-center gap-3">
        {/* Wordmark */}
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-white font-medium text-[15px] shrink-0 hover:opacity-80 transition-opacity"
        >
          <BookOpen size={16} className="text-violet-400" />
          <span>Algo Study</span>
        </Link>

        {/* Course breadcrumb */}
        {courseName && courseSlug && (
          <>
            <span className="text-[var(--color-zinc-700)]">/</span>
            <Link
              href={`/${courseSlug}`}
              className={`text-sm truncate max-w-[160px] md:max-w-xs transition-colors ${
                isHome ? 'text-[var(--color-zinc-400)]' : 'text-[var(--color-zinc-300)] hover:text-white'
              }`}
              dir="auto"
            >
              {courseName}
            </Link>
          </>
        )}

        <span className="flex-1" />

        {/* Actions */}
        <nav className="flex items-center gap-2">
          {showTrends && courseSlug && (
            <Link
              href={`/${courseSlug}/trends`}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[var(--color-zinc-400)] hover:text-amber-400 transition-colors px-2.5 py-1.5 rounded-md hover:bg-amber-950/30"
            >
              <TrendingUp size={13} />
              <span>Trends</span>
            </Link>
          )}
          {showRevise && courseSlug && (
            <Link
              href={`/${courseSlug}/revise`}
              className="inline-flex items-center gap-1.5 text-xs bg-violet-600 hover:bg-violet-500 text-white px-3 py-1.5 rounded-md font-medium transition-colors"
            >
              <RotateCcw size={13} />
              <span>Revise</span>
            </Link>
          )}
          {isHome && (
            <Link
              href="/new"
              className="inline-flex items-center gap-1.5 text-xs bg-[var(--color-surface-raised)] border border-[var(--color-surface-border)] hover:border-violet-500/50 text-[var(--color-zinc-300)] hover:text-white px-3 py-1.5 rounded-md font-medium transition-colors"
            >
              <Plus size={13} />
              <span>New course</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

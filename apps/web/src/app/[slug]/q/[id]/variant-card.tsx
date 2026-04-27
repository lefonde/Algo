'use client'

import { useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Lightbulb,
  AlertTriangle,
  BookOpenCheck,
} from 'lucide-react'
import type { QuestionVariant } from '@repo/content'
import { Markdown } from '@/components/markdown'

type Props = {
  variant: QuestionVariant
  index: number
  total: number
}

type Section = 'hints' | 'solution' | 'mistakes' | null

export function VariantCard({ variant, index, total }: Props) {
  const [openSection, setOpenSection] = useState<Section>(null)
  const [copyState, setCopyState] = useState<'prompt' | 'solution' | null>(null)

  function handleCopy(text: string, kind: 'prompt' | 'solution') {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopyState(kind)
    setTimeout(() => setCopyState(null), 2000)
  }

  const ts = new Date(variant.generated_at).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <article className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-card)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-[var(--color-surface-border-subtle)] bg-[var(--color-surface-raised)]">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-mono font-bold text-violet-400 shrink-0">
            Variant {index} of {total}
          </span>
          <span className="text-[10px] text-[var(--color-zinc-600)] font-mono truncate">
            {ts} · {variant.model}
          </span>
        </div>
      </div>

      {/* Prompt — always visible */}
      <div className="px-5 py-4 border-b border-[var(--color-surface-border-subtle)]">
        <div className="flex items-center justify-between gap-2 mb-2">
          <p className="text-[10px] font-semibold text-[var(--color-zinc-500)] uppercase tracking-wider">
            Question
          </p>
          <button
            type="button"
            onClick={() => handleCopy(variant.prompt_md, 'prompt')}
            className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded transition-colors ${
              copyState === 'prompt'
                ? 'text-emerald-400'
                : 'text-[var(--color-zinc-600)] hover:text-[var(--color-zinc-300)]'
            }`}
          >
            {copyState === 'prompt' ? <Check size={10} /> : <Copy size={10} />}
            {copyState === 'prompt' ? 'Copied' : 'Copy'}
          </button>
        </div>
        <Markdown rtl>{variant.prompt_md}</Markdown>
      </div>

      {/* Hints */}
      {variant.hints_md.length > 0 && (
        <CollapsibleSection
          open={openSection === 'hints'}
          onToggle={() => setOpenSection(openSection === 'hints' ? null : 'hints')}
          icon={<Lightbulb size={12} className="text-amber-400" />}
          label="Hints"
          count={variant.hints_md.length}
        >
          <ol className="space-y-3 pt-2">
            {variant.hints_md.map((hint, i) => (
              <li key={i} className="flex gap-3">
                <span className="shrink-0 w-5 h-5 rounded-full bg-amber-900/40 border border-amber-800/50 flex items-center justify-center text-[10px] font-bold text-amber-300 mt-0.5">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <Markdown rtl>{hint}</Markdown>
                </div>
              </li>
            ))}
          </ol>
        </CollapsibleSection>
      )}

      {/* Solution */}
      <CollapsibleSection
        open={openSection === 'solution'}
        onToggle={() => setOpenSection(openSection === 'solution' ? null : 'solution')}
        icon={<BookOpenCheck size={12} className="text-emerald-400" />}
        label="Full solution"
        rightAction={
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleCopy(variant.solution_md, 'solution')
            }}
            className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded transition-colors ${
              copyState === 'solution'
                ? 'text-emerald-400'
                : 'text-[var(--color-zinc-600)] hover:text-[var(--color-zinc-300)]'
            }`}
          >
            {copyState === 'solution' ? <Check size={10} /> : <Copy size={10} />}
            {copyState === 'solution' ? 'Copied' : 'Copy'}
          </button>
        }
      >
        <div className="pt-2">
          <Markdown rtl>{variant.solution_md}</Markdown>
        </div>
      </CollapsibleSection>

      {/* Common mistakes */}
      {variant.common_mistakes_md && (
        <CollapsibleSection
          open={openSection === 'mistakes'}
          onToggle={() => setOpenSection(openSection === 'mistakes' ? null : 'mistakes')}
          icon={<AlertTriangle size={12} className="text-red-400" />}
          label="Common mistakes"
        >
          <div className="pt-2">
            <Markdown rtl>{variant.common_mistakes_md}</Markdown>
          </div>
        </CollapsibleSection>
      )}
    </article>
  )
}

type CollapsibleProps = {
  open: boolean
  onToggle: () => void
  icon: React.ReactNode
  label: string
  count?: number
  rightAction?: React.ReactNode
  children: React.ReactNode
}

function CollapsibleSection({
  open,
  onToggle,
  icon,
  label,
  count,
  rightAction,
  children,
}: CollapsibleProps) {
  return (
    <div className="border-b border-[var(--color-surface-border-subtle)] last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-5 py-3 flex items-center gap-2 hover:bg-white/[0.02] transition-colors text-left"
      >
        {icon}
        <span className="text-xs font-medium text-[var(--color-zinc-300)] uppercase tracking-wide">
          {label}
        </span>
        {typeof count === 'number' && (
          <span className="text-[10px] text-[var(--color-zinc-600)] font-mono">{count}</span>
        )}
        <span className="flex-1" />
        {rightAction}
        {open ? (
          <ChevronUp size={14} className="text-[var(--color-zinc-600)]" />
        ) : (
          <ChevronDown size={14} className="text-[var(--color-zinc-600)]" />
        )}
      </button>
      {open && <div className="px-5 pb-4">{children}</div>}
    </div>
  )
}

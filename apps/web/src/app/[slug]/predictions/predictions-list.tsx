'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react'
import type { Question, Insight, Trends } from '@repo/content'
import { QuestionCard } from '@repo/ui'

type Subject = 'all' | 'data-structures' | 'linear-programming' | 'expander-graphs' | 'mixed'
type Priority = 'all' | 'critical' | 'high' | 'medium'

const SUBJECT_LABELS: Record<string, string> = {
  'data-structures': 'DS',
  'linear-programming': 'LP',
  'expander-graphs': 'EG',
  mixed: 'Mix',
}

type Props = {
  slug: string
  questions: Question[]
  insights?: Insight[]
  trends?: Trends | null
  siteOrigin?: string
}

export function PredictionsList({ slug, questions, insights, trends, siteOrigin = '' }: Props) {
  const [subjectFilter, setSubjectFilter] = useState<Subject>('all')
  const [priorityFilter, setPriorityFilter] = useState<Priority>('all')
  const [search, setSearch] = useState('')
  const [insightsOpen, setInsightsOpen] = useState(false)

  const trendsContext = trends
    ? {
        absences: trends.absences.map((a) => a.topic),
        confirmed: trends.confirmed.map((c) => c.pattern),
      }
    : undefined

  const insightsContext = insights?.map((i) => (i.bold ? `${i.bold}: ${i.text}` : i.text))

  const filtered = questions
    .filter((q) => subjectFilter === 'all' || q.subject === subjectFilter)
    .filter((q) => {
      if (priorityFilter === 'critical') return q.score >= 8
      if (priorityFilter === 'high') return q.score >= 7 && q.score < 8
      if (priorityFilter === 'medium') return q.score < 7
      return true
    })
    .filter((q) => {
      if (!search) return true
      const term = search.toLowerCase()
      return q.prompt_md.toLowerCase().includes(term) || q.rationale_md.toLowerCase().includes(term)
    })
    .sort((a, b) => b.score - a.score)

  const critCount = questions.filter((q) => q.score >= 8).length
  const highCount = questions.filter((q) => q.score >= 7 && q.score < 8).length
  const medCount = questions.filter((q) => q.score < 7).length

  return (
    <div className="space-y-5">
      {/* Inline stats */}
      <div className="flex items-center gap-2 text-sm flex-wrap">
        <span className="text-[var(--color-zinc-400)]">{questions.length} questions</span>
        <span className="text-[var(--color-zinc-700)]">·</span>
        <span className="text-red-400 font-medium">{critCount} critical</span>
        <span className="text-[var(--color-zinc-700)]">·</span>
        <span className="text-orange-400 font-medium">{highCount} high</span>
        <span className="text-[var(--color-zinc-700)]">·</span>
        <span className="text-yellow-400 font-medium">{medCount} medium</span>
      </div>

      {/* Insights — collapsible */}
      {insights && insights.length > 0 && (
        <div className="rounded-xl border border-violet-900/30 bg-violet-950/10 overflow-hidden">
          <button
            type="button"
            onClick={() => setInsightsOpen((v) => !v)}
            className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-white/5 transition-colors"
          >
            <Lightbulb size={14} className="text-violet-400 shrink-0" />
            <span className="text-xs font-semibold text-violet-400 uppercase tracking-wide flex-1">
              Key insights from course analysis
            </span>
            <span className="text-[10px] text-violet-600 mr-1">{insights.length} items</span>
            {insightsOpen ? (
              <ChevronUp size={14} className="text-violet-600" />
            ) : (
              <ChevronDown size={14} className="text-violet-600" />
            )}
          </button>
          {insightsOpen && (
            <ul className="px-4 pb-4 space-y-1.5 border-t border-violet-900/20">
              {insights.map((item) => (
                <li key={item.id} className="text-sm leading-relaxed pt-1" dir="auto">
                  {item.negative ? (
                    <span className="text-red-400">{item.text}</span>
                  ) : item.bold ? (
                    <span className="text-[var(--color-zinc-300)]">
                      <strong className="text-white">{item.bold}</strong>
                      {item.text.replace(item.bold, '').replace(/^[—–: ]+/, ' — ')}
                    </span>
                  ) : (
                    <span className="text-[var(--color-zinc-300)]">{item.text}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Filter bar */}
      <div className="space-y-2">
        {/* Subject chips — horizontal scroll on mobile */}
        <div className="chip-scroll-wrap">
          <div className="chip-scroll">
            {(
              [
                'all',
                'data-structures',
                'linear-programming',
                'expander-graphs',
                'mixed',
              ] as Subject[]
            ).map((s) => (
              <FilterChip
                key={s}
                active={subjectFilter === s}
                onClick={() => setSubjectFilter(s)}
                label={s === 'all' ? 'All' : (SUBJECT_LABELS[s] ?? s)}
              />
            ))}
            <div className="w-px bg-[var(--color-surface-border)] self-stretch mx-0.5 shrink-0" />
            {(['all', 'critical', 'high', 'medium'] as Priority[]).map((p) => (
              <FilterChip
                key={p}
                active={priorityFilter === p}
                onClick={() => setPriorityFilter(p)}
                label={p === 'all' ? 'Any priority' : p.charAt(0).toUpperCase() + p.slice(1)}
                priority={p !== 'all' ? p : undefined}
              />
            ))}
          </div>
        </div>

        {/* Search */}
        <input
          type="search"
          placeholder="Search questions…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg bg-[var(--color-surface-card)] border border-[var(--color-surface-border)] text-[var(--color-zinc-200)] placeholder-[var(--color-zinc-600)] focus:outline-none focus:ring-2 focus:ring-violet-500/60 text-sm transition-shadow"
        />
      </div>

      {/* Question list */}
      {filtered.length === 0 ? (
        <p className="text-center text-[var(--color-zinc-500)] py-16 text-sm">
          No questions match the current filters.
        </p>
      ) : (
        <div className="space-y-2">
          {filtered.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              siteOrigin={siteOrigin}
              workspaceHref={`/${slug}/q/${q.id}`}
              trendsContext={trendsContext}
              insightsContext={insightsContext}
            />
          ))}
        </div>
      )}
    </div>
  )
}

type FilterChipProps = {
  active: boolean
  onClick: () => void
  label: string
  priority?: 'critical' | 'high' | 'medium'
}

function FilterChip({ active, onClick, label, priority }: FilterChipProps) {
  const priorityColor = priority
    ? {
        critical: active
          ? 'bg-red-900/60 text-red-300 border-red-800/60'
          : 'text-red-500/70 border-[var(--color-surface-border)] hover:border-red-800/60 hover:text-red-400',
        high: active
          ? 'bg-orange-900/60 text-orange-300 border-orange-800/60'
          : 'text-orange-500/70 border-[var(--color-surface-border)] hover:border-orange-800/60 hover:text-orange-400',
        medium: active
          ? 'bg-yellow-900/60 text-yellow-300 border-yellow-800/60'
          : 'text-yellow-500/70 border-[var(--color-surface-border)] hover:border-yellow-800/60 hover:text-yellow-400',
      }[priority]
    : null

  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
        priorityColor ??
        (active
          ? 'bg-violet-600 text-white border-violet-600'
          : 'bg-[var(--color-surface-raised)] text-[var(--color-zinc-400)] border-[var(--color-surface-border)] hover:text-white hover:border-violet-500/50')
      }`}
    >
      {label}
    </button>
  )
}

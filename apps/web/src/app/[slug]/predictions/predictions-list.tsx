'use client'

import { useState } from 'react'
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
  questions: Question[]
  insights?: Insight[]
  trends?: Trends | null
  siteOrigin?: string
}

export function PredictionsList({ questions, insights, trends, siteOrigin = '' }: Props) {
  const [subjectFilter, setSubjectFilter] = useState<Subject>('all')
  const [priorityFilter, setPriorityFilter] = useState<Priority>('all')
  const [search, setSearch] = useState('')

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
    <div className="space-y-6">
      {/* Insights panel */}
      {insights && insights.length > 0 && (
        <section className="rounded-xl border border-violet-900/40 bg-violet-950/20 px-5 py-4">
          <h2 className="text-xs font-semibold text-violet-400 uppercase tracking-wide mb-3">
            💡 Key Insights from Course Analysis
          </h2>
          <ul className="space-y-1.5">
            {insights.map((item) => (
              <li key={item.id} className="text-sm leading-relaxed" dir="auto">
                {item.negative ? (
                  <span className="text-red-400">{item.text}</span>
                ) : item.bold ? (
                  <span className="text-neutral-300">
                    <strong className="text-white">{item.bold}</strong>
                    {item.text.replace(item.bold, '').replace(/^[—–: ]+/, ' — ')}
                  </span>
                ) : (
                  <span className="text-neutral-300">{item.text}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Stats bar */}
      <div className="flex flex-wrap gap-3">
        <Stat label="Critical (8–10)" value={critCount} color="text-red-400" />
        <Stat label="High (7)" value={highCount} color="text-orange-400" />
        <Stat label="Medium (<7)" value={medCount} color="text-yellow-400" />
        <Stat label="Total" value={questions.length} color="text-neutral-300" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {/* Subject */}
        {(
          ['all', 'data-structures', 'linear-programming', 'expander-graphs', 'mixed'] as Subject[]
        ).map((s) => (
          <FilterChip
            key={s}
            active={subjectFilter === s}
            onClick={() => setSubjectFilter(s)}
            label={s === 'all' ? 'All subjects' : (SUBJECT_LABELS[s] ?? s)}
          />
        ))}
        <span className="w-px bg-neutral-800 self-stretch mx-1" />
        {(['all', 'critical', 'high', 'medium'] as Priority[]).map((p) => (
          <FilterChip
            key={p}
            active={priorityFilter === p}
            onClick={() => setPriorityFilter(p)}
            label={p === 'all' ? 'All priorities' : p.charAt(0).toUpperCase() + p.slice(1)}
          />
        ))}
      </div>

      {/* Search */}
      <input
        type="search"
        placeholder="Search questions…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2.5 rounded-lg bg-[#0d0d14] border border-[#2a2a35] text-neutral-200 placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
      />

      {/* Question list */}
      {filtered.length === 0 ? (
        <p className="text-center text-neutral-500 py-12">
          No questions match the current filters.
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              siteOrigin={siteOrigin}
              trendsContext={trendsContext}
              insightsContext={insightsContext}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5 text-sm">
      <span className={`font-bold ${color}`}>{value}</span>
      <span className="text-neutral-500">{label}</span>
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
        active
          ? 'bg-violet-600 text-white'
          : 'bg-[#1e1e2e] text-neutral-400 border border-[#3a3a4a] hover:text-white hover:border-violet-500'
      }`}
    >
      {label}
    </button>
  )
}

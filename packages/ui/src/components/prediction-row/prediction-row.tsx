import type { Question } from '@repo/content'
import { ScoreBadge } from '../score-badge/score-badge'
import { SubjectTag } from '../subject-tag/subject-tag'

export type PredictionRowProps = {
  question: Question
  expanded?: boolean
  onToggle?: () => void
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>

export function PredictionRow({
  question,
  expanded = false,
  onToggle,
  className = '',
  ...props
}: PredictionRowProps) {
  return (
    <article
      data-testid="prediction-row"
      className={`border-b border-[#2a2a35] ${className}`}
      {...props}
    >
      <button
        type="button"
        aria-expanded={expanded}
        onClick={onToggle}
        className="flex w-full items-start gap-3 px-4 py-3 text-start transition-colors duration-150 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
      >
        <ScoreBadge score={question.score} className="mt-0.5 shrink-0" />
        <SubjectTag subject={question.subject} className="mt-0.5 shrink-0" />
        <span className="flex-1 truncate text-sm text-neutral-200">{question.id}</span>
        <span
          aria-hidden
          className={`shrink-0 text-neutral-500 transition-transform duration-150 ${expanded ? 'rotate-90' : ''}`}
        >
          ›
        </span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-1 text-sm text-neutral-300">
          <p className="mb-3 font-medium text-neutral-100">{question.prompt_md}</p>
          <p className="mb-3 text-neutral-400">{question.rationale_md}</p>
          {question.trend && (
            <p className="mb-3 text-xs text-neutral-500">
              {question.trend.direction === 'up' ? '↑' : '↓'} {question.trend.delta} pts —{' '}
              {question.trend.reason}
            </p>
          )}
          <ul className="space-y-1">
            {question.sources.map((s, i) => (
              <li key={i} className="flex gap-2 text-xs text-neutral-500">
                <span className="rounded bg-neutral-800 px-1.5 py-0.5">{s.kind}</span>
                <span>{s.ref}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  )
}

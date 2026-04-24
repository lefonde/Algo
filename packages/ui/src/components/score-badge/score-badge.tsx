import { scoreBand, scoreBandLabel } from '@repo/shared'

export type ScoreBadgeProps = {
  score: number
} & React.HTMLAttributes<HTMLSpanElement>

const bandStyles = {
  critical: 'bg-red-900/50 text-red-300 ring-red-700/50',
  high: 'bg-orange-900/50 text-orange-300 ring-orange-700/50',
  medium: 'bg-yellow-900/50 text-yellow-300 ring-yellow-700/50',
  low: 'bg-neutral-800 text-neutral-400 ring-neutral-700',
} as const

export function ScoreBadge({ score, className = '', ...props }: ScoreBadgeProps) {
  const band = scoreBand(score)
  return (
    <span
      role="status"
      aria-label={`Score: ${score} (${scoreBandLabel(score)})`}
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${bandStyles[band]} ${className}`}
      {...props}
    >
      {score}/10
    </span>
  )
}

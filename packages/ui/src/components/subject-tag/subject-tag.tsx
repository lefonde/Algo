export type SubjectTagProps = {
  subject: 'data-structures' | 'linear-programming' | 'expander-graphs' | 'mixed'
} & React.HTMLAttributes<HTMLSpanElement>

const subjectStyles = {
  'data-structures': 'bg-violet-900/50 text-violet-300 ring-violet-700/50',
  'linear-programming': 'bg-pink-900/50 text-pink-300 ring-pink-700/50',
  'expander-graphs': 'bg-green-900/50 text-green-300 ring-green-700/50',
  mixed: 'bg-amber-900/50 text-amber-300 ring-amber-700/50',
} as const

const subjectLabels = {
  'data-structures': 'Data Structures',
  'linear-programming': 'Linear Programming',
  'expander-graphs': 'Expander Graphs',
  mixed: 'Mixed',
} as const

export function SubjectTag({ subject, className = '', ...props }: SubjectTagProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${subjectStyles[subject]} ${className}`}
      {...props}
    >
      {subjectLabels[subject]}
    </span>
  )
}

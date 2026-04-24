export type BadgeProps = {
  variant?: 'default' | 'outline'
  children: React.ReactNode
} & React.HTMLAttributes<HTMLSpanElement>

export function Badge({ variant = 'default', children, className = '', ...props }: BadgeProps) {
  const base = 'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium'
  const variants = {
    default: 'bg-primary-900/50 text-primary-300 ring-1 ring-inset ring-primary-700/50',
    outline: 'ring-1 ring-inset ring-neutral-700 text-neutral-300',
  }
  return (
    <span className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  )
}

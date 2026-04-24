export type CardProps = {
  variant?: 'default' | 'elevated' | 'bordered'
  children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>

export function Card({ variant = 'default', children, className = '', ...props }: CardProps) {
  const base = 'rounded-xl p-4'
  const variants = {
    default: 'bg-[#1a1a1f] border border-[#2a2a35]',
    elevated: 'bg-[#1a1a1f] shadow-lg border border-[#2a2a35]',
    bordered: 'bg-transparent border border-[#2a2a35]',
  }
  return (
    <div className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  )
}

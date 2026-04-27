'use client'

import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

type Props = {
  children: string
  className?: string
  rtl?: boolean
}

export function Markdown({ children, className = '', rtl = false }: Props) {
  return (
    <div
      className={`prose prose-invert prose-sm max-w-none prose-p:my-2 prose-headings:text-white prose-strong:text-white prose-code:text-violet-300 prose-code:bg-[var(--color-surface-overlay)] prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-[12px] prose-code:before:content-none prose-code:after:content-none ${className}`}
      dir={rtl ? 'auto' : 'ltr'}
    >
      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
        {children}
      </ReactMarkdown>
    </div>
  )
}

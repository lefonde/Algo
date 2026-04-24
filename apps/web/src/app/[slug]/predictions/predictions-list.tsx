'use client'

import { useState } from 'react'
import type { Question } from '@repo/content'
import { PredictionRow } from '@repo/ui'

export function PredictionsList({ questions }: { questions: Question[] }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const sorted = [...questions].sort((a, b) => b.score - a.score)

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 overflow-hidden">
      {sorted.map((q) => (
        <PredictionRow
          key={q.id}
          question={q}
          expanded={openId === q.id}
          onToggle={() => setOpenId(openId === q.id ? null : q.id)}
        />
      ))}
    </div>
  )
}

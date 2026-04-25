'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Question, RefPin, ChatMessage, Image as QImage } from '@repo/content'

const SUBJECT_LABELS: Record<string, string> = {
  'data-structures': 'Data Structures',
  'linear-programming': 'Linear Programming',
  'expander-graphs': 'Expander Graphs',
  mixed: 'Mixed / Cross-Topic',
}

const SOURCE_KIND_ICONS: Record<string, string> = {
  lecture: '🎓',
  maman: '📝',
  book: '📖',
  exam: '📋',
  booklet: '📓',
  whatsapp: '💬',
}

function priorityLabel(score: number) {
  if (score >= 8) return { label: 'Critical', color: 'text-red-400 bg-red-900/40' }
  if (score >= 7) return { label: 'High', color: 'text-orange-400 bg-orange-900/40' }
  return { label: 'Medium', color: 'text-yellow-400 bg-yellow-900/40' }
}

type CopyState = 'idle' | 'copied'

function useCopy(): [CopyState, (text: string) => void] {
  const [state, setState] = useState<CopyState>('idle')
  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).catch(() => {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.cssText = 'position:fixed;opacity:0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    })
    setState('copied')
    setTimeout(() => setState('idle'), 2000)
  }, [])
  return [state, copy]
}

function buildPracticePrompt(q: Question): string {
  const subjectLabel = SUBJECT_LABELS[q.subject] ?? q.subject
  const refsText =
    q.refs?.map((r) => `- ${r.file}: ${r.loc}`).join('\n') ?? 'General course material'
  return `You are helping me study for an Advanced Algorithms university exam ("נושאים מתקדמים באלגוריתמים", Open University of Israel).

Please generate a practice exam question on the following topic, then provide a detailed step-by-step solution.

## Topic
**${q.prompt_md}**

## Subject Area
${subjectLabel}

## Context
${q.rationale_md}

## Source References (where this question type appears)
${refsText}

## Instructions
1. Generate a realistic exam question at the level of this Israeli university course (score: ${q.score}/10 likelihood of appearing)
2. The question should be worth ${q.score >= 8 ? '29 points' : '13 points'} (${q.score >= 8 ? 'major mandatory question' : 'minor choice question'})
3. Write the question in Hebrew (this is a Hebrew-language course)
4. Then provide a complete, detailed solution in Hebrew
5. Include all mathematical proofs and formal arguments
6. Highlight common mistakes students make on this type of question
7. If there are multiple approaches, mention them`
}

function buildNotebookLMPrompt(
  q: Question,
  trends?: { absences: string[]; confirmed: string[] },
  insights?: string[],
): string {
  const subjectLabel = SUBJECT_LABELS[q.subject] ?? q.subject
  const absences = trends?.absences.join(', ') ?? 'unknown'
  const confirmed = trends?.confirmed.join(', ') ?? 'unknown'
  const insightLines = insights?.slice(0, 3).join('\n- ') ?? ''

  return `Based on the sources I've added, generate three full exam-style questions on the topic:
"${q.prompt_md}" (${subjectLabel})

For each question:
- Write in Hebrew at the level of an Open University advanced algorithms course.
- Worth ${q.score >= 8 ? '29' : '13'} points.
- Provide a complete formal solution citing specific source passages.
- Vary the angle (one proof, one construction, one counterexample if possible).

Then explain which of the three is most likely to actually appear, given:
- Exam topics absent from 2025A and now "due": ${absences}
- Confirmed recurring patterns from 2025A: ${confirmed}
${insightLines ? `- Key instructor insights:\n- ${insightLines}` : ''}

Finally, list the 3 most common mistakes students make on this question type.`
}

function buildSourceList(q: Question, siteOrigin: string): string {
  const urls = (q.refs ?? q.links ?? [])
    .map((r) => {
      const href = 'href' in r ? r.href : ''
      if (!href || href === '#') return null
      return href.startsWith('http') ? href : `${siteOrigin}${href}`
    })
    .filter(Boolean)

  return [...new Set(urls)].join('\n')
}

export type QuestionCardProps = {
  question: Question
  siteOrigin?: string
  trendsContext?: { absences: string[]; confirmed: string[] }
  insightsContext?: string[]
  initialStudied?: boolean
  onStudiedChange?: (id: string, studied: boolean) => void
}

export function QuestionCard({
  question: q,
  siteOrigin = '',
  trendsContext,
  insightsContext,
  initialStudied = false,
  onStudiedChange,
}: QuestionCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [studied, setStudied] = useState(initialStudied)
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)

  const [practiceCopyState, copyPractice] = useCopy()
  const [nbCopyState, copyNB] = useCopy()
  const [srcCopyState, copySrc] = useCopy()

  useEffect(() => {
    const stored = localStorage.getItem('algStudied')
    const map: Record<string, boolean> = stored ? JSON.parse(stored) : {}
    setStudied(!!map[q.id])
  }, [q.id])

  function toggleStudied(e: React.MouseEvent) {
    e.stopPropagation()
    const stored = localStorage.getItem('algStudied')
    const map: Record<string, boolean> = stored ? JSON.parse(stored) : {}
    const next = !studied
    map[q.id] = next
    localStorage.setItem('algStudied', JSON.stringify(map))
    setStudied(next)
    onStudiedChange?.(q.id, next)
  }

  const priority = priorityLabel(q.score)

  return (
    <>
      <article
        data-testid="question-card"
        className={`border border-[#2a2a35] rounded-xl overflow-hidden transition-colors ${studied ? 'opacity-60' : ''}`}
      >
        {/* Header row */}
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
          className="flex w-full items-start gap-3 px-4 py-4 text-start hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 transition-colors"
        >
          {/* Score badge */}
          <span className="shrink-0 mt-0.5 w-8 h-8 rounded-full bg-[#1e1e2e] border border-[#3a3a4a] flex items-center justify-center text-sm font-bold text-white">
            {q.score}
          </span>

          {/* Priority + subject */}
          <div className="shrink-0 mt-0.5 flex flex-col gap-1">
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${priority.color}`}>
              {priority.label}
            </span>
            <span className="text-[10px] text-neutral-500 uppercase tracking-wide">
              {SUBJECT_LABELS[q.subject]}
            </span>
          </div>

          {/* Title */}
          <span className="flex-1 text-sm text-neutral-100 leading-snug text-right" dir="auto">
            {q.prompt_md}
          </span>

          {/* Trend */}
          {q.trend && (
            <span
              className={`shrink-0 mt-0.5 text-xs font-bold ${q.trend.direction === 'up' ? 'text-green-400' : 'text-red-400'}`}
              title={q.trend.reason}
            >
              {q.trend.direction === 'up' ? '↑' : '↓'}
              {q.trend.delta}
            </span>
          )}

          {/* Points badge */}
          <span className="shrink-0 mt-0.5 text-xs text-neutral-500">{q.points}pt</span>

          {/* Chevron */}
          <span
            aria-hidden
            className={`shrink-0 mt-1 text-neutral-500 transition-transform duration-150 ${expanded ? 'rotate-90' : ''}`}
          >
            ›
          </span>
        </button>

        {/* Expanded body */}
        {expanded && (
          <div className="px-4 pb-5 pt-1 border-t border-[#2a2a35] space-y-4">
            {/* Rationale */}
            <p className="text-sm text-neutral-300 leading-relaxed" dir="auto">
              {q.rationale_md}
            </p>

            {/* Trend detail */}
            {q.trend && (
              <div
                className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${q.trend.direction === 'up' ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'}`}
              >
                <span>{q.trend.direction === 'up' ? '↑' : '↓'}</span>
                <span>{q.trend.reason}</span>
              </div>
            )}

            {/* Ref pins */}
            {q.refs && q.refs.length > 0 && (
              <div>
                <p className="text-[11px] text-neutral-500 uppercase tracking-wide mb-2">
                  📍 Exact References
                </p>
                <div className="flex flex-wrap gap-2">
                  {q.refs.map((ref, i) => (
                    <RefPinChip key={i} pin={ref} />
                  ))}
                </div>
              </div>
            )}

            {/* Source links */}
            {q.links && q.links.length > 0 && (
              <div>
                <p className="text-[11px] text-neutral-500 uppercase tracking-wide mb-2">
                  📄 Source Documents
                </p>
                <div className="flex flex-wrap gap-2">
                  {q.links.map((link, i) => (
                    <a
                      key={i}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-[#1e1e2e] border border-[#3a3a4a] text-neutral-300 hover:text-white hover:border-violet-500 transition-colors"
                    >
                      <span>{SOURCE_KIND_ICONS[link.type] ?? '📄'}</span>
                      <span>{link.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* WhatsApp chat excerpts */}
            {q.chat && q.chat.length > 0 && (
              <div>
                <p className="text-[11px] text-neutral-500 uppercase tracking-wide mb-2">
                  💬 Course Chat
                </p>
                <div className="space-y-1.5 bg-[#0d0d14] rounded-lg p-3">
                  {q.chat.map((msg, i) => (
                    <ChatBubble key={i} message={msg} />
                  ))}
                </div>
              </div>
            )}

            {/* Images grid */}
            {q.images && q.images.length > 0 && (
              <div>
                <p className="text-[11px] text-neutral-500 uppercase tracking-wide mb-2">
                  🖼 Whiteboard / Photos
                </p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {q.images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setLightboxSrc(img.src)
                      }}
                      className="aspect-square overflow-hidden rounded-lg bg-[#1a1a28] hover:ring-2 hover:ring-violet-500 focus-visible:ring-2 focus-visible:ring-violet-500 transition-all"
                      title={img.label}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.src}
                        alt={img.label}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2 pt-1">
              <ActionButton
                onClick={(e) => {
                  e.stopPropagation()
                  copyPractice(buildPracticePrompt(q))
                }}
                copied={practiceCopyState === 'copied'}
                icon="📋"
                label="Copy AI prompt"
                copiedLabel="Copied!"
              />
              <ActionButton
                onClick={(e) => {
                  e.stopPropagation()
                  copyNB(buildNotebookLMPrompt(q, trendsContext, insightsContext))
                  window.open('https://notebooklm.google.com/', '_blank', 'noopener')
                }}
                copied={nbCopyState === 'copied'}
                icon="🧪"
                label="Open NotebookLM"
                copiedLabel="Prompt copied!"
              />
              <ActionButton
                onClick={(e) => {
                  e.stopPropagation()
                  copySrc(buildSourceList(q, siteOrigin))
                }}
                copied={srcCopyState === 'copied'}
                icon="📚"
                label="Copy source URLs"
                copiedLabel="URLs copied!"
              />
              <button
                type="button"
                onClick={toggleStudied}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  studied
                    ? 'bg-green-900/40 border-green-700 text-green-300'
                    : 'bg-[#1e1e2e] border-[#3a3a4a] text-neutral-400 hover:text-white'
                }`}
              >
                {studied ? '✓ Studied' : 'Mark studied'}
              </button>
            </div>
          </div>
        )}
      </article>

      {/* Lightbox */}
      {lightboxSrc && (
        <div
          role="dialog"
          aria-modal
          aria-label="Image preview"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxSrc(null)}
        >
          <button
            type="button"
            aria-label="Close"
            className="absolute top-4 right-4 text-white text-2xl hover:text-neutral-300"
            onClick={() => setLightboxSrc(null)}
          >
            ✕
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxSrc}
            alt="Preview"
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}

function RefPinChip({ pin }: { pin: RefPin }) {
  const icon = SOURCE_KIND_ICONS[pin.type] ?? '📄'
  return (
    <a
      href={pin.href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-[#12121c] border border-[#3a3a4a] text-neutral-400 hover:text-white hover:border-violet-500 transition-colors"
      title={pin.loc}
    >
      <span>{icon}</span>
      <span className="font-medium text-neutral-300">{pin.file}</span>
      <span className="text-neutral-600">→</span>
      <span className="max-w-[180px] truncate">{pin.loc}</span>
    </a>
  )
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isDima = message.d === true
  return (
    <div className={`flex gap-2 ${isDima ? 'flex-row-reverse' : ''}`}>
      <span
        className={`shrink-0 text-xs font-semibold px-1.5 py-0.5 rounded self-start mt-0.5 ${
          isDima ? 'bg-violet-900/50 text-violet-300' : 'bg-[#1e1e2e] text-neutral-400'
        }`}
      >
        {message.s}
      </span>
      <p
        dir="rtl"
        className={`text-xs leading-relaxed rounded-lg px-3 py-2 max-w-[75%] ${
          isDima
            ? 'bg-violet-900/30 text-violet-100 rounded-tr-none'
            : 'bg-[#1a1a28] text-neutral-300 rounded-tl-none'
        }`}
      >
        {message.t}
      </p>
    </div>
  )
}

type ActionButtonProps = {
  onClick: (e: React.MouseEvent) => void
  copied: boolean
  icon: string
  label: string
  copiedLabel: string
}

function ActionButton({ onClick, copied, icon, label, copiedLabel }: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
        copied
          ? 'bg-green-900/40 border-green-700 text-green-300'
          : 'bg-[#1e1e2e] border-[#3a3a4a] text-neutral-300 hover:text-white hover:border-violet-500'
      }`}
    >
      <span>{icon}</span>
      <span>{copied ? copiedLabel : label}</span>
    </button>
  )
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  ChevronRight,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
  FileText,
  MessageCircle,
  GraduationCap,
  NotebookPen,
  Image as ImageIcon,
  MapPin,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
} from 'lucide-react'
import type { Question, RefPin, ChatMessage, Image as QImage } from '@repo/content'

const SUBJECT_LABELS: Record<string, string> = {
  'data-structures': 'Data Structures',
  'linear-programming': 'Linear Programming',
  'expander-graphs': 'Expander Graphs',
  mixed: 'Mixed / Cross-Topic',
}

const SUBJECT_SHORT: Record<string, string> = {
  'data-structures': 'DS',
  'linear-programming': 'LP',
  'expander-graphs': 'EG',
  mixed: 'Mix',
}

function priorityConfig(score: number) {
  if (score >= 8)
    return {
      label: 'Critical',
      stripe: 'bg-red-500',
      badge: 'text-red-400 bg-red-950/60 border border-red-900/60',
      glow: 'shadow-[0_0_0_1px_rgba(239,68,68,0.2)]',
    }
  if (score >= 7)
    return {
      label: 'High',
      stripe: 'bg-orange-500',
      badge: 'text-orange-400 bg-orange-950/60 border border-orange-900/60',
      glow: 'shadow-[0_0_0_1px_rgba(249,115,22,0.15)]',
    }
  return {
    label: 'Medium',
    stripe: 'bg-yellow-500',
    badge: 'text-yellow-400 bg-yellow-950/60 border border-yellow-900/60',
    glow: '',
  }
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

function sourceIcon(kind: string) {
  switch (kind) {
    case 'lecture':
      return <GraduationCap size={12} />
    case 'maman':
    case 'booklet':
      return <NotebookPen size={12} />
    case 'exam':
    case 'past-exam':
    case 'recent-exam':
    case 'sample-exam':
      return <FileText size={12} />
    case 'whatsapp':
    case 'whatsapp-hint':
      return <MessageCircle size={12} />
    default:
      return <BookOpen size={12} />
  }
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

  const priority = priorityConfig(q.score)

  return (
    <>
      <article
        id={q.id}
        data-testid="question-card"
        className={`relative rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-card)] overflow-hidden transition-all duration-200 ${priority.glow} ${studied ? 'opacity-50' : ''}`}
      >
        {/* Left accent stripe */}
        <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${priority.stripe}`} aria-hidden />

        {/* Header — click to expand */}
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
          className="w-full text-start pl-4 pr-3 py-3.5 hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-500 transition-colors"
        >
          {/* Row 1 (mobile): meta pills */}
          <div className="flex items-center gap-2 mb-2 sm:hidden">
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${priority.badge}`}
            >
              {priority.label}
            </span>
            <span className="text-[10px] text-[var(--color-zinc-500)] font-mono uppercase">
              {SUBJECT_SHORT[q.subject]}
            </span>
            {q.trend && (
              <span
                className={`flex items-center gap-0.5 text-[10px] font-bold ${q.trend.direction === 'up' ? 'text-emerald-400' : 'text-red-400'}`}
              >
                {q.trend.direction === 'up' ? (
                  <TrendingUp size={10} />
                ) : (
                  <TrendingDown size={10} />
                )}
                {q.trend.delta}
              </span>
            )}
            <span className="flex-1" />
            <span className="text-[10px] text-[var(--color-zinc-600)] font-mono">
              {q.points}pt
            </span>
            <span className="text-[10px] font-bold text-[var(--color-zinc-300)] tabular-nums font-mono">
              {q.score}/10
            </span>
          </div>

          {/* Main row */}
          <div className="flex items-center gap-3">
            {/* Score badge — desktop only */}
            <span className="hidden sm:flex shrink-0 w-9 h-9 rounded-full bg-[var(--color-surface-overlay)] border border-[var(--color-surface-border)] items-center justify-center text-sm font-bold text-white tabular-nums font-mono">
              {q.score}
            </span>

            {/* Priority + subject — desktop only */}
            <div className="hidden sm:flex shrink-0 flex-col gap-1 w-16">
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded text-center ${priority.badge}`}
              >
                {priority.label}
              </span>
              <span className="text-[10px] text-[var(--color-zinc-500)] uppercase tracking-wide text-center font-mono">
                {SUBJECT_SHORT[q.subject]}
              </span>
            </div>

            {/* Topic title */}
            <span
              className="flex-1 text-sm text-[var(--color-zinc-100)] leading-snug"
              dir="auto"
            >
              {q.prompt_md}
            </span>

            {/* Trend — desktop */}
            {q.trend && (
              <span
                className={`hidden sm:flex shrink-0 items-center gap-0.5 text-xs font-bold ${q.trend.direction === 'up' ? 'text-emerald-400' : 'text-red-400'}`}
                title={q.trend.reason}
              >
                {q.trend.direction === 'up' ? (
                  <TrendingUp size={12} />
                ) : (
                  <TrendingDown size={12} />
                )}
                {q.trend.delta}
              </span>
            )}

            {/* Points — desktop */}
            <span className="hidden sm:block shrink-0 text-xs text-[var(--color-zinc-600)] font-mono">
              {q.points}pt
            </span>

            {/* Studied toggle */}
            <button
              type="button"
              onClick={toggleStudied}
              aria-label={studied ? 'Mark as not studied' : 'Mark as studied'}
              className={`shrink-0 p-1 rounded-full transition-colors ${
                studied
                  ? 'text-emerald-400 hover:text-emerald-300'
                  : 'text-[var(--color-zinc-600)] hover:text-[var(--color-zinc-400)]'
              }`}
            >
              <CheckCircle2 size={16} />
            </button>

            {/* Chevron */}
            <ChevronRight
              size={16}
              aria-hidden
              className={`shrink-0 text-[var(--color-zinc-600)] transition-transform duration-150 ${expanded ? 'rotate-90' : ''}`}
            />
          </div>
        </button>

        {/* Expanded body */}
        {expanded && (
          <div className="pl-4 pr-4 pb-5 pt-1 border-t border-[var(--color-surface-border-subtle)] space-y-4">
            {/* Rationale */}
            <p className="text-sm text-[var(--color-zinc-300)] leading-relaxed" dir="auto">
              {q.rationale_md}
            </p>

            {/* Trend detail */}
            {q.trend && (
              <div
                className={`flex items-start gap-2 text-xs px-3 py-2 rounded-lg ${
                  q.trend.direction === 'up'
                    ? 'bg-emerald-900/20 text-emerald-300 border border-emerald-900/40'
                    : 'bg-red-900/20 text-red-300 border border-red-900/40'
                }`}
              >
                {q.trend.direction === 'up' ? (
                  <TrendingUp size={12} className="mt-0.5 shrink-0" />
                ) : (
                  <TrendingDown size={12} className="mt-0.5 shrink-0" />
                )}
                <span>{q.trend.reason}</span>
              </div>
            )}

            {/* Ref pins */}
            {q.refs && q.refs.length > 0 && (
              <div>
                <SectionLabel icon={<MapPin size={11} />} label="Exact References" />
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
                <SectionLabel icon={<FileText size={11} />} label="Source Documents" />
                <div className="flex flex-wrap gap-2">
                  {q.links.map((link, i) => (
                    <a
                      key={i}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-[var(--color-surface-raised)] border border-[var(--color-surface-border)] text-[var(--color-zinc-300)] hover:text-white hover:border-violet-500/60 transition-colors"
                    >
                      {sourceIcon(link.type)}
                      <span>{link.label}</span>
                      <ExternalLink size={10} className="text-[var(--color-zinc-600)]" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* WhatsApp chat excerpts */}
            {q.chat && q.chat.length > 0 && (
              <div>
                <SectionLabel icon={<MessageCircle size={11} />} label="Course Chat" />
                <div className="space-y-1.5 bg-[var(--color-surface-base)] rounded-lg p-3 border border-[var(--color-surface-border-subtle)]">
                  {q.chat.map((msg, i) => (
                    <ChatBubble key={i} message={msg} />
                  ))}
                </div>
              </div>
            )}

            {/* Images grid */}
            {q.images && q.images.length > 0 && (
              <div>
                <SectionLabel icon={<ImageIcon size={11} />} label="Whiteboard / Photos" />
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {q.images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setLightboxSrc(img.src)
                      }}
                      className="aspect-square overflow-hidden rounded-lg bg-[var(--color-surface-raised)] hover:ring-2 hover:ring-violet-500/60 focus-visible:ring-2 focus-visible:ring-violet-500 transition-all"
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
            <div className="flex flex-wrap gap-2 pt-2">
              <ActionButton
                onClick={(e) => {
                  e.stopPropagation()
                  copyPractice(buildPracticePrompt(q))
                }}
                copied={practiceCopyState === 'copied'}
                icon={<Copy size={12} />}
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
                icon={<ExternalLink size={12} />}
                label="Open NotebookLM"
                copiedLabel="Prompt copied!"
              />
              <ActionButton
                onClick={(e) => {
                  e.stopPropagation()
                  copySrc(buildSourceList(q, siteOrigin))
                }}
                copied={srcCopyState === 'copied'}
                icon={<Copy size={12} />}
                label="Copy source URLs"
                copiedLabel="URLs copied!"
              />
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
            className="absolute top-4 right-4 p-2 text-white hover:text-[var(--color-zinc-300)] transition-colors"
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

function SectionLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <p className="flex items-center gap-1.5 text-[10px] text-[var(--color-zinc-500)] uppercase tracking-wider mb-2">
      {icon}
      {label}
    </p>
  )
}

function RefPinChip({ pin }: { pin: RefPin }) {
  return (
    <a
      href={pin.href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-[var(--color-surface-raised)] border border-[var(--color-surface-border)] text-[var(--color-zinc-400)] hover:text-white hover:border-violet-500/60 transition-colors"
      title={pin.loc}
    >
      <MapPin size={10} />
      <span className="font-medium text-[var(--color-zinc-300)]">{pin.file}</span>
      <span className="text-[var(--color-zinc-700)]">→</span>
      <span className="max-w-[180px] truncate">{pin.loc}</span>
      <ExternalLink size={9} className="text-[var(--color-zinc-700)] shrink-0" />
    </a>
  )
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isDima = message.d === true
  return (
    <div className={`flex gap-2 ${isDima ? 'flex-row-reverse' : ''}`}>
      <span
        className={`shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded self-start mt-0.5 ${
          isDima
            ? 'bg-violet-900/50 text-violet-300'
            : 'bg-[var(--color-surface-overlay)] text-[var(--color-zinc-400)]'
        }`}
      >
        {message.s}
      </span>
      <p
        dir="rtl"
        className={`text-xs leading-relaxed rounded-lg px-3 py-2 max-w-[75%] ${
          isDima
            ? 'bg-violet-900/25 text-violet-100 rounded-tr-none border border-violet-900/40'
            : 'bg-[var(--color-surface-raised)] text-[var(--color-zinc-300)] rounded-tl-none'
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
  icon: React.ReactNode
  label: string
  copiedLabel: string
}

function ActionButton({ onClick, copied, icon, label, copiedLabel }: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
        copied
          ? 'bg-emerald-900/30 border-emerald-800/60 text-emerald-300'
          : 'bg-[var(--color-surface-raised)] border-[var(--color-surface-border)] text-[var(--color-zinc-300)] hover:text-white hover:border-violet-500/50'
      }`}
    >
      {copied ? <Check size={12} className="text-emerald-400" /> : icon}
      <span>{copied ? copiedLabel : label}</span>
    </button>
  )
}

'use client'

import { useState } from 'react'
import {
  Sparkles,
  Loader2,
  Download,
  TrendingUp,
  TrendingDown,
  MapPin,
  ExternalLink,
  FileText,
  GraduationCap,
  NotebookPen,
  MessageCircle,
  BookOpen,
} from 'lucide-react'
import type { Question, QuestionVariant, TutorMessage, Attachment } from '@repo/content'
import { VariantCard } from './variant-card'
import { TutorChat } from './tutor-chat'
import { Attachments } from './attachments'

const SUBJECT_LABELS: Record<string, string> = {
  'data-structures': 'Data Structures',
  'linear-programming': 'Linear Programming',
  'expander-graphs': 'Expander Graphs',
  mixed: 'Mixed / Cross-Topic',
}

function priorityConfig(score: number) {
  if (score >= 8)
    return {
      label: 'Critical',
      stripe: 'bg-red-500',
      badge: 'text-red-400 bg-red-950/60 border border-red-900/60',
    }
  if (score >= 7)
    return {
      label: 'High',
      stripe: 'bg-orange-500',
      badge: 'text-orange-400 bg-orange-950/60 border border-orange-900/60',
    }
  return {
    label: 'Medium',
    stripe: 'bg-yellow-500',
    badge: 'text-yellow-400 bg-yellow-950/60 border border-yellow-900/60',
  }
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

type Props = {
  slug: string
  initialQuestion: Question
}

export function Workspace({ slug, initialQuestion }: Props) {
  const [question, setQuestion] = useState<Question>(initialQuestion)
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState('')

  const priority = priorityConfig(question.score)

  async function handleGenerateVariants() {
    setGenerating(true)
    setGenError('')
    try {
      const res = await fetch(`/api/questions/${question.id}/generate-variants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, count: 3 }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Generation failed')
      const newVariants = data.variants as QuestionVariant[]
      setQuestion((prev) => ({
        ...prev,
        variants: [...newVariants, ...(prev.variants ?? [])],
      }))
    } catch (err) {
      setGenError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setGenerating(false)
    }
  }

  function handleAppendTutorPair(userMsg: TutorMessage, assistantMsg: TutorMessage) {
    setQuestion((prev) => ({
      ...prev,
      tutor_history: [...(prev.tutor_history ?? []), userMsg, assistantMsg],
    }))
  }

  function handleAttachmentAdded(attachment: Attachment) {
    setQuestion((prev) => ({
      ...prev,
      attachments: [...(prev.attachments ?? []), attachment],
    }))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
      {/* Left column — question + variants + attachments */}
      <div className="space-y-6 min-w-0">
        {/* Question header */}
        <article className="relative rounded-2xl border border-[var(--color-surface-border)] bg-[var(--color-surface-card)] overflow-hidden">
          <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${priority.stripe}`} />
          <div className="pl-5 pr-5 py-5 space-y-4">
            <div className="flex items-start gap-3 flex-wrap">
              <span className="shrink-0 w-12 h-12 rounded-full bg-[var(--color-surface-overlay)] border border-[var(--color-surface-border)] flex items-center justify-center text-lg font-bold text-white tabular-nums font-mono">
                {question.score}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${priority.badge}`}
                  >
                    {priority.label}
                  </span>
                  <span className="text-[10px] text-[var(--color-zinc-500)] font-mono uppercase tracking-wide">
                    {SUBJECT_LABELS[question.subject]}
                  </span>
                  <span className="text-[10px] text-[var(--color-zinc-600)] font-mono">
                    {question.points}pt · id={question.id}
                  </span>
                  {question.trend && (
                    <span
                      className={`flex items-center gap-0.5 text-[10px] font-bold ${question.trend.direction === 'up' ? 'text-emerald-400' : 'text-red-400'}`}
                    >
                      {question.trend.direction === 'up' ? (
                        <TrendingUp size={10} />
                      ) : (
                        <TrendingDown size={10} />
                      )}
                      {question.trend.delta}
                    </span>
                  )}
                </div>
                <h1 className="text-xl font-semibold text-white leading-snug" dir="auto">
                  {question.prompt_md}
                </h1>
              </div>
            </div>

            <p className="text-sm text-[var(--color-zinc-400)] leading-relaxed" dir="auto">
              {question.rationale_md}
            </p>

            {/* Refs and links combined */}
            {((question.refs && question.refs.length > 0) ||
              (question.links && question.links.length > 0)) && (
              <div className="flex flex-wrap gap-2 pt-1">
                {question.refs?.map((ref, i) => (
                  <a
                    key={`ref-${i}`}
                    href={ref.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-[var(--color-surface-raised)] border border-[var(--color-surface-border)] text-[var(--color-zinc-400)] hover:text-white hover:border-violet-500/60 transition-colors"
                    title={ref.loc}
                  >
                    <MapPin size={10} />
                    <span className="font-medium text-[var(--color-zinc-300)]">{ref.file}</span>
                    <span className="text-[var(--color-zinc-700)]">→</span>
                    <span className="max-w-[160px] truncate">{ref.loc}</span>
                  </a>
                ))}
                {question.links?.map((link, i) => (
                  <a
                    key={`link-${i}`}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-[var(--color-surface-raised)] border border-[var(--color-surface-border)] text-[var(--color-zinc-300)] hover:text-white hover:border-violet-500/60 transition-colors"
                  >
                    {sourceIcon(link.type)}
                    <span>{link.label}</span>
                    <ExternalLink size={10} className="text-[var(--color-zinc-600)]" />
                  </a>
                ))}
              </div>
            )}

            {/* Export button */}
            <div className="pt-2">
              <a
                href={`/api/questions/${question.id}/export?slug=${slug}`}
                download
                className="inline-flex items-center gap-1.5 text-[10px] text-[var(--color-zinc-600)] hover:text-[var(--color-zinc-400)] transition-colors"
              >
                <Download size={10} />
                Export this question's JSON
              </a>
            </div>
          </div>
        </article>

        {/* Variants section */}
        <section>
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <div>
              <h2 className="font-display text-lg text-white flex items-center gap-2">
                <Sparkles size={16} className="text-violet-400" />
                AI variants
              </h2>
              <p className="text-xs text-[var(--color-zinc-500)] mt-0.5">
                Practice questions Claude writes for you, with hints and full solutions
              </p>
            </div>
            <button
              type="button"
              onClick={handleGenerateVariants}
              disabled={generating}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
            >
              {generating ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  Generate 3 variants
                </>
              )}
            </button>
          </div>

          {genError && (
            <div className="rounded-lg border border-red-900/40 bg-red-950/20 px-4 py-3 text-sm text-red-300 mb-4">
              {genError}
            </div>
          )}

          {!question.variants || question.variants.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[var(--color-surface-border)] p-10 text-center">
              <Sparkles size={20} className="text-[var(--color-zinc-700)] mx-auto mb-3" />
              <p className="text-sm text-[var(--color-zinc-500)]">
                No variants yet. Click &ldquo;Generate 3 variants&rdquo; to start practicing.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {question.variants.map((variant, i) => (
                <VariantCard
                  key={variant.id}
                  variant={variant}
                  index={question.variants!.length - i}
                  total={question.variants!.length}
                />
              ))}
            </div>
          )}
        </section>

        {/* Attachments */}
        <Attachments
          slug={slug}
          questionId={question.id}
          attachments={question.attachments ?? []}
          onAdd={handleAttachmentAdded}
        />
      </div>

      {/* Right column — Tutor chat (sticky on desktop) */}
      <aside className="lg:sticky lg:top-16 lg:self-start min-w-0">
        <TutorChat
          slug={slug}
          questionId={question.id}
          initialHistory={question.tutor_history ?? []}
          onAppendPair={handleAppendTutorPair}
        />
      </aside>
    </div>
  )
}

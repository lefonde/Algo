'use client'

import { useState, useRef } from 'react'

type ReviseChange = {
  question_id: string
  old_score: number
  new_score: number
  delta_reason: string
  trend_flag?: 'up' | 'down' | 'confirmed' | null
}

type NewQuestion = {
  subject: string
  title: string
  rationale: string
  initial_score: number
}

type ReviseResult = {
  reasoning: string
  changes: ReviseChange[]
  proposed_new_questions: NewQuestion[]
  removed_question_ids: string[]
  ordering: Record<string, string[]>
}

type UploadState = 'idle' | 'uploading' | 'done' | 'error'

type Props = {
  slug: string
  currentQuestionCount: number
}

export function ReviseClient({ slug, currentQuestionCount }: Props) {
  const [userNote, setUserNote] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [result, setResult] = useState<ReviseResult | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const [uploadState, setUploadState] = useState<UploadState>('idle')
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploadState('uploading')
    const uploaded: string[] = []
    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append('slug', slug)
      fd.append('file', file)
      const res = await fetch('/api/ingest', { method: 'POST', body: fd })
      if (res.ok) uploaded.push(file.name)
    }
    setUploadedFiles((prev) => [...prev, ...uploaded])
    setUploadState(uploaded.length > 0 ? 'done' : 'error')
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleRevise() {
    setStatus('loading')
    setResult(null)
    setErrorMsg('')
    try {
      const res = await fetch('/api/revise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, userNote }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Revision failed')
      setResult(data.result)
      setStatus('done')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error')
      setStatus('error')
    }
  }

  return (
    <div className="space-y-8">
      {/* Step 1: Upload new material */}
      <section className="rounded-xl border border-[#2a2a35] bg-[#0d0d14] p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white uppercase tracking-wide">
          1 · Add new course material{' '}
          <span className="text-neutral-500 font-normal normal-case">(optional)</span>
        </h2>
        <p className="text-xs text-neutral-500">
          Drop new PDFs, lecture notes, exam scans, or WhatsApp exports into the course inbox. The
          AI will factor them into the revision.
        </p>
        <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#3a3a4a] rounded-lg p-8 cursor-pointer hover:border-violet-600 transition-colors">
          <span className="text-2xl">📁</span>
          <span className="text-sm text-neutral-400">Click to select files</span>
          <span className="text-xs text-neutral-600">PDF, JPG, PNG, DOCX — any format</span>
          <input ref={fileRef} type="file" multiple className="sr-only" onChange={handleUpload} />
        </label>
        {uploadState === 'uploading' && (
          <p className="text-xs text-neutral-400 animate-pulse">Uploading…</p>
        )}
        {uploadedFiles.length > 0 && (
          <ul className="space-y-1">
            {uploadedFiles.map((f) => (
              <li key={f} className="flex items-center gap-2 text-xs text-green-400">
                <span>✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Step 2: User note */}
      <section className="rounded-xl border border-[#2a2a35] bg-[#0d0d14] p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white uppercase tracking-wide">
          2 · Add a note{' '}
          <span className="text-neutral-500 font-normal normal-case">(optional)</span>
        </h2>
        <p className="text-xs text-neutral-500">
          New hints from the course WhatsApp, instructor comments, topics added or removed from
          scope, anything that changes the prediction landscape.
        </p>
        <textarea
          value={userNote}
          onChange={(e) => setUserNote(e.target.value)}
          placeholder={
            'e.g. "דימה said Ramanujan won\'t be on the exam this year. Asaf added a new LP example in office hours covering tight constraints."'
          }
          dir="auto"
          rows={5}
          className="w-full px-4 py-3 rounded-lg bg-[#12121c] border border-[#3a3a4a] text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
        />
      </section>

      {/* Step 3: Run */}
      <section className="rounded-xl border border-[#2a2a35] bg-[#0d0d14] p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white uppercase tracking-wide">3 · Revise</h2>
        <p className="text-xs text-neutral-500">
          AI will re-score all {currentQuestionCount} questions against existing evidence + any new
          material, then show you a diff. You review and accept before anything is saved.
        </p>
        <button
          type="button"
          disabled={status === 'loading'}
          onClick={handleRevise}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-violet-700 hover:bg-violet-600 disabled:opacity-50 text-white text-sm font-medium transition-colors"
        >
          {status === 'loading' ? (
            <>
              <span className="animate-spin">⟳</span> Analysing…
            </>
          ) : (
            <>🔄 Run revision</>
          )}
        </button>
        {status === 'error' && <p className="text-sm text-red-400">Error: {errorMsg}</p>}
      </section>

      {/* Results diff */}
      {result && status === 'done' && <RevisionDiff result={result} />}
    </div>
  )
}

function RevisionDiff({ result }: { result: ReviseResult }) {
  const [accepted, setAccepted] = useState<Set<string>>(new Set())
  const [rejected, setRejected] = useState<Set<string>>(new Set())

  function toggle(id: string, action: 'accept' | 'reject') {
    if (action === 'accept') {
      setAccepted((prev) => new Set([...prev, id]))
      setRejected((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    } else {
      setRejected((prev) => new Set([...prev, id]))
      setAccepted((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  const pendingCount =
    result.changes.length - accepted.size - rejected.size + result.proposed_new_questions.length

  return (
    <div className="space-y-6">
      {/* Reasoning */}
      <section className="rounded-xl border border-blue-900/40 bg-blue-950/20 px-5 py-4">
        <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wide mb-2">
          AI Analysis
        </h3>
        <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap">
          {result.reasoning}
        </p>
      </section>

      {/* Changes */}
      {result.changes.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-white mb-3">
            Score changes{' '}
            <span className="text-neutral-500 font-normal">({result.changes.length})</span>
          </h3>
          <div className="space-y-2">
            {result.changes.map((change) => {
              const delta = change.new_score - change.old_score
              const isAccepted = accepted.has(change.question_id)
              const isRejected = rejected.has(change.question_id)
              return (
                <div
                  key={change.question_id}
                  className={`rounded-lg border px-4 py-3 transition-colors ${
                    isAccepted
                      ? 'border-green-700 bg-green-950/20'
                      : isRejected
                        ? 'border-neutral-800 bg-neutral-900/30 opacity-50'
                        : 'border-[#2a2a35] bg-[#0d0d14]'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-wrap">
                    <code className="text-xs text-violet-400 font-mono">{change.question_id}</code>
                    <span className="text-xs text-neutral-500">
                      {change.old_score} →{' '}
                      <span
                        className={
                          delta > 0 ? 'text-green-400 font-bold' : 'text-red-400 font-bold'
                        }
                      >
                        {change.new_score}
                      </span>{' '}
                      ({delta > 0 ? '+' : ''}
                      {delta})
                    </span>
                    {change.trend_flag && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
                        {change.trend_flag}
                      </span>
                    )}
                    <span className="flex-1" />
                    {!isRejected && (
                      <button
                        type="button"
                        onClick={() => toggle(change.question_id, 'accept')}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                          isAccepted
                            ? 'bg-green-900/40 border-green-700 text-green-300'
                            : 'border-[#3a3a4a] text-neutral-400 hover:border-green-600 hover:text-green-300'
                        }`}
                      >
                        {isAccepted ? '✓ Accepted' : 'Accept'}
                      </button>
                    )}
                    {!isAccepted && (
                      <button
                        type="button"
                        onClick={() => toggle(change.question_id, 'reject')}
                        className="text-xs px-2.5 py-1 rounded-full border border-[#3a3a4a] text-neutral-400 hover:border-red-600 hover:text-red-300 transition-colors"
                      >
                        {isRejected ? 'Rejected' : 'Reject'}
                      </button>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-neutral-400 leading-relaxed" dir="auto">
                    {change.delta_reason}
                  </p>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Proposed new questions */}
      {result.proposed_new_questions.length > 0 && (
        <section>
          <h3 className="text-sm font-semibold text-white mb-3">
            Proposed new questions{' '}
            <span className="text-neutral-500 font-normal">
              ({result.proposed_new_questions.length})
            </span>
          </h3>
          <div className="space-y-2">
            {result.proposed_new_questions.map((q, i) => (
              <div
                key={i}
                className="rounded-lg border border-[#2a2a35] bg-[#0d0d14] px-4 py-3 space-y-1"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
                    {q.subject}
                  </span>
                  <span className="text-xs text-neutral-500">score {q.initial_score}/10</span>
                </div>
                <p className="text-sm text-neutral-200" dir="auto">
                  {q.title}
                </p>
                <p className="text-xs text-neutral-500 leading-relaxed" dir="auto">
                  {q.rationale}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* No changes */}
      {result.changes.length === 0 && result.proposed_new_questions.length === 0 && (
        <p className="text-sm text-neutral-400 text-center py-6">
          No score changes proposed — predictions are already well-calibrated given current
          evidence.
        </p>
      )}

      {/* Commit bar */}
      {pendingCount > 0 && (
        <div className="sticky bottom-4 rounded-xl border border-violet-700 bg-violet-950/90 backdrop-blur px-5 py-3 flex items-center justify-between gap-4">
          <p className="text-sm text-violet-200">
            {accepted.size} change{accepted.size !== 1 ? 's' : ''} accepted · {pendingCount} pending
          </p>
          <p className="text-xs text-violet-400">
            Copy the accepted changes and apply them to predictions.json manually or via the CLI
            skill.
          </p>
        </div>
      )}
    </div>
  )
}

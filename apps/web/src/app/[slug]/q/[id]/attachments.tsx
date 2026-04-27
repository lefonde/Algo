'use client'

import { useState, useRef } from 'react'
import {
  Paperclip,
  FileText,
  Image as ImageIcon,
  FileType,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import type { Attachment } from '@repo/content'

type Props = {
  slug: string
  questionId: string
  attachments: Attachment[]
  onAdd: (attachment: Attachment) => void
}

export function Attachments({ slug, questionId, attachments, onAdd }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setError('')

    for (const file of Array.from(files)) {
      try {
        const fd = new FormData()
        fd.append('slug', slug)
        fd.append('file', file)
        const res = await fetch(`/api/questions/${questionId}/attach`, {
          method: 'POST',
          body: fd,
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error ?? 'Upload failed')
        onAdd(data.attachment)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed')
      }
    }

    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <section>
      <h2 className="font-display text-lg text-white flex items-center gap-2 mb-1">
        <Paperclip size={16} className="text-sky-400" />
        Attachments
      </h2>
      <p className="text-xs text-[var(--color-zinc-500)] mb-4">
        Drop files specific to this question — visible to the tutor and the variant generator
      </p>

      <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[var(--color-surface-border)] hover:border-sky-500/40 rounded-xl p-6 cursor-pointer transition-colors">
        {uploading ? (
          <>
            <Loader2 size={20} className="text-[var(--color-zinc-500)] animate-spin" />
            <span className="text-sm text-[var(--color-zinc-500)]">Uploading…</span>
          </>
        ) : (
          <>
            <Paperclip size={20} className="text-[var(--color-zinc-700)]" />
            <span className="text-sm text-[var(--color-zinc-400)]">Click to add files</span>
            <span className="text-[10px] text-[var(--color-zinc-700)]">
              PDFs, images, notes — any format
            </span>
          </>
        )}
        <input
          ref={fileRef}
          type="file"
          multiple
          className="sr-only"
          onChange={handleUpload}
          disabled={uploading}
        />
      </label>

      {error && (
        <div className="mt-3 flex items-start gap-2 text-xs text-red-300 bg-red-950/30 border border-red-900/40 rounded-lg p-3">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {attachments.length > 0 && (
        <ul className="mt-4 space-y-2">
          {attachments.map((att) => (
            <li key={att.id}>
              <a
                href={att.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg border border-[var(--color-surface-border)] bg-[var(--color-surface-card)] hover:border-sky-500/40 transition-colors group"
              >
                <AttachmentIcon kind={att.kind} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--color-zinc-200)] truncate group-hover:text-white transition-colors">
                    {att.label}
                  </p>
                  <p className="text-[10px] text-[var(--color-zinc-600)] font-mono">
                    {new Date(att.uploaded_at).toLocaleString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function AttachmentIcon({ kind }: { kind: Attachment['kind'] }) {
  const className =
    'shrink-0 p-2 rounded-lg bg-[var(--color-surface-overlay)] border border-[var(--color-surface-border)]'
  switch (kind) {
    case 'image':
      return (
        <div className={className}>
          <ImageIcon size={14} className="text-emerald-400" />
        </div>
      )
    case 'pdf':
      return (
        <div className={className}>
          <FileType size={14} className="text-red-400" />
        </div>
      )
    case 'note':
      return (
        <div className={className}>
          <FileText size={14} className="text-amber-400" />
        </div>
      )
    default:
      return (
        <div className={className}>
          <Paperclip size={14} className="text-[var(--color-zinc-400)]" />
        </div>
      )
  }
}

'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, MessageCircle, Trash2, AlertCircle } from 'lucide-react'
import type { TutorMessage } from '@repo/content'
import { Markdown } from '@/components/markdown'

type Props = {
  slug: string
  questionId: string
  initialHistory: TutorMessage[]
  onAppendPair: (user: TutorMessage, assistant: TutorMessage) => void
}

export function TutorChat({ slug, questionId, initialHistory, onAppendPair }: Props) {
  const [history, setHistory] = useState<TutorMessage[]>(initialHistory)
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [error, setError] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [history.length, streamingText])

  async function handleSend() {
    const message = input.trim()
    if (!message || streaming) return

    const now = new Date().toISOString()
    const userMsg: TutorMessage = { role: 'user', content: message, timestamp: now }
    setHistory((prev) => [...prev, userMsg])
    setInput('')
    setStreaming(true)
    setStreamingText('')
    setError('')

    try {
      const res = await fetch(`/api/questions/${questionId}/tutor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          message,
          history: [...history], // not including userMsg — server adds it
        }),
      })

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? `HTTP ${res.status}`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let assistantText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        assistantText += chunk
        setStreamingText(assistantText)
      }

      const assistantMsg: TutorMessage = {
        role: 'assistant',
        content: assistantText,
        timestamp: new Date().toISOString(),
      }
      setHistory((prev) => [...prev, assistantMsg])
      setStreamingText('')
      onAppendPair(userMsg, assistantMsg)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Stream error')
      // Remove the optimistic user message since we failed
      setHistory((prev) => prev.slice(0, -1))
      setInput(message)
    } finally {
      setStreaming(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  async function handleClear() {
    if (!window.confirm("Clear this question's tutor history? This cannot be undone.")) return
    setHistory([])
    // Note: server-side history persists. To truly clear, would need a DELETE route.
    // For now, this clears the UI state only.
  }

  return (
    <div className="rounded-2xl border border-[var(--color-surface-border)] bg-[var(--color-surface-card)] flex flex-col h-[calc(100vh-12rem)] min-h-[500px] max-h-[800px]">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[var(--color-surface-border-subtle)]">
        <div className="flex items-center gap-2">
          <MessageCircle size={14} className="text-violet-400" />
          <h2 className="text-sm font-semibold text-white">AI Tutor</h2>
          <span className="text-[10px] text-[var(--color-zinc-600)] font-mono">
            {history.length > 0
              ? `${history.length} message${history.length !== 1 ? 's' : ''}`
              : 'scoped to this question'}
          </span>
        </div>
        {history.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 rounded-md text-[var(--color-zinc-600)] hover:text-red-400 hover:bg-red-950/30 transition-colors"
            aria-label="Clear history"
            title="Clear conversation"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
        {history.length === 0 && !streaming && (
          <div className="text-center py-12">
            <MessageCircle size={20} className="text-[var(--color-zinc-700)] mx-auto mb-3" />
            <p className="text-sm text-[var(--color-zinc-500)] mb-1">
              Ask anything about this question
            </p>
            <p className="text-xs text-[var(--color-zinc-700)] leading-relaxed max-w-xs mx-auto">
              &ldquo;Explain step 3&rdquo; · &ldquo;Why does this proof work?&rdquo; · &ldquo;Give
              me a similar problem&rdquo;
            </p>
          </div>
        )}

        {history.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}

        {streaming && streamingText && (
          <ChatMessage
            message={{
              role: 'assistant',
              content: streamingText,
              timestamp: new Date().toISOString(),
            }}
            streaming
          />
        )}
        {streaming && !streamingText && (
          <div className="flex items-center gap-2 text-xs text-[var(--color-zinc-500)] py-2">
            <Loader2 size={12} className="animate-spin" />
            Tutor is thinking…
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 text-xs text-red-300 bg-red-950/30 border border-red-900/40 rounded-lg p-3">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-3 py-3 border-t border-[var(--color-surface-border-subtle)]">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask the tutor…"
            rows={1}
            dir="auto"
            disabled={streaming}
            className="flex-1 px-3 py-2 rounded-lg bg-[var(--color-surface-base)] border border-[var(--color-surface-border)] text-sm text-[var(--color-zinc-200)] placeholder-[var(--color-zinc-600)] focus:outline-none focus:ring-2 focus:ring-violet-500/60 disabled:opacity-50 resize-none max-h-32"
            style={{ minHeight: '38px' }}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || streaming}
            className="shrink-0 p-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors"
            aria-label="Send"
          >
            {streaming ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
        <p className="mt-1.5 text-[10px] text-[var(--color-zinc-700)] px-1">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}

function ChatMessage({
  message,
  streaming = false,
}: {
  message: TutorMessage
  streaming?: boolean
}) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-xl px-3 py-2 ${
          isUser
            ? 'bg-violet-600/90 text-white rounded-br-sm'
            : 'bg-[var(--color-surface-raised)] border border-[var(--color-surface-border)] text-[var(--color-zinc-200)] rounded-bl-sm'
        }`}
      >
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap leading-relaxed" dir="auto">
            {message.content}
          </p>
        ) : (
          <Markdown rtl>{message.content + (streaming ? ' ▍' : '')}</Markdown>
        )}
      </div>
    </div>
  )
}

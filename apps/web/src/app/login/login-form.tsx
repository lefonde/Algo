'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Lock, ArrowRight, AlertCircle } from 'lucide-react'

export default function LoginForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') ?? '/'

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        router.push(from)
        router.refresh()
      } else {
        setError('Incorrect password')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <Lock
          size={14}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-zinc-600)]"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          className="w-full pl-9 pr-4 py-3 rounded-xl bg-[var(--color-surface-raised)] border border-[var(--color-surface-border)] text-white placeholder-[var(--color-zinc-600)] focus:outline-none focus:ring-2 focus:ring-violet-500/60 focus:border-violet-500/60 transition-shadow text-sm"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-400 bg-red-950/30 border border-red-900/40 rounded-lg px-3 py-2">
          <AlertCircle size={14} className="shrink-0" />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending || !password}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors text-sm"
      >
        {isPending ? (
          'Verifying…'
        ) : (
          <>
            Continue
            <ArrowRight size={15} />
          </>
        )}
      </button>
    </form>
  )
}

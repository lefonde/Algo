import { Suspense } from 'react'
import { BookOpen } from 'lucide-react'
import LoginForm from './login-form'

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
        <div className="w-[500px] h-[500px] rounded-full bg-violet-600/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Wordmark */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <BookOpen size={20} className="text-violet-400" />
          <span className="font-display text-xl text-white">Algo Study</span>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[var(--color-surface-border)] bg-[var(--color-surface-card)] p-8">
          <h1 className="text-lg font-semibold text-white mb-1">Welcome back</h1>
          <p className="text-sm text-[var(--color-zinc-500)] mb-7">
            Enter the site password to continue
          </p>
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  )
}

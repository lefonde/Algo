import { Suspense } from 'react'
import LoginForm from './login-form'

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-white mb-2 text-center">Algo Study</h1>
        <p className="text-gray-400 text-sm text-center mb-8">
          Enter the site password to continue
        </p>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  )
}

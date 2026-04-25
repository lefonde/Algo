import { TopBar } from '@/components/top-bar'
import NewCourseForm from './new-course-form'

export default function NewCoursePage() {
  return (
    <>
      <TopBar />
      <main className="max-w-2xl mx-auto px-4 md:px-8 py-10 md:py-14">
        <header className="mb-8">
          <div className="flex items-baseline justify-between gap-4">
            <h1 className="font-display text-3xl text-white">New course</h1>
            <a
              href="/how-it-works#new-course"
              className="text-xs text-[var(--color-zinc-600)] hover:text-[var(--color-zinc-400)] transition-colors shrink-0"
            >
              ⓘ What happens next
            </a>
          </div>
          <p className="mt-1.5 text-[var(--color-zinc-500)] text-sm">
            Create a course skeleton. Add material and predictions after.
          </p>
        </header>

        <NewCourseForm />
      </main>
    </>
  )
}

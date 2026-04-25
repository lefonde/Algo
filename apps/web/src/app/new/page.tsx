import { TopBar } from '@/components/top-bar'
import NewCourseForm from './new-course-form'

export default function NewCoursePage() {
  return (
    <>
      <TopBar />
      <main className="max-w-2xl mx-auto px-4 md:px-8 py-10 md:py-14">
        <header className="mb-8">
          <h1 className="font-display text-3xl text-white">New course</h1>
          <p className="mt-1.5 text-[var(--color-zinc-500)] text-sm">
            Create a course skeleton. Add material and predictions after.
          </p>
        </header>

        <NewCourseForm />
      </main>
    </>
  )
}

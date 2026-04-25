import NewCourseForm from './new-course-form'

export default function NewCoursePage() {
  return (
    <main className="min-h-screen px-4 py-12 md:px-10 md:py-20 max-w-2xl mx-auto">
      <a
        href="/"
        className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors mb-8 inline-block"
      >
        ← All courses
      </a>

      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white">New course</h1>
        <p className="mt-2 text-neutral-400 text-sm">
          Create a course skeleton. You can add material and predictions after.
        </p>
      </header>

      <NewCourseForm />
    </main>
  )
}

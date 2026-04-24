import Link from 'next/link'
import { listCourses } from '@repo/content'

export default function HomePage() {
  const courses = listCourses()
  const today = new Date()

  return (
    <main className="min-h-screen px-6 py-16 md:px-10 md:py-24 max-w-6xl mx-auto">
      <header className="mb-16">
        <p className="text-sm uppercase tracking-widest text-neutral-500 mb-3">
          Study Aid
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          Your course library
        </h1>
        <p className="mt-4 text-lg text-neutral-400 max-w-2xl">
          Evidence-linked exam predictions, lecture archives, and study guides
          for every course.
        </p>
      </header>

      {courses.length === 0 ? (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-10 text-center">
          <p className="text-neutral-400">
            No courses yet. Run{' '}
            <code className="font-mono text-neutral-300">/new-course</code> to
            add one.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => {
            const examDate = new Date(course.exam_date)
            const daysToExam = Math.ceil(
              (examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
            )
            return (
              <li key={course.slug}>
                <Link
                  href={`/${course.slug}`}
                  className="block rounded-xl border border-neutral-800 bg-neutral-900/50 p-8 hover:border-purple-500/50 hover:bg-neutral-900 transition-colors"
                >
                  <p className="text-xs font-mono text-neutral-500 mb-2">
                    {course.course_code} · {course.term}
                  </p>
                  <h2
                    className="text-2xl font-semibold text-white mb-1"
                    dir={course.locale === 'he' ? 'rtl' : 'ltr'}
                    lang={course.locale}
                  >
                    {course.locale === 'he' ? course.title_he : course.title_en}
                  </h2>
                  <p className="text-sm text-neutral-400 mb-6">
                    {course.locale === 'he' ? course.title_en : course.title_he}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500">
                      {course.subjects.length} subjects
                    </span>
                    <span
                      className={
                        daysToExam <= 30
                          ? 'text-pink-400 font-medium'
                          : 'text-neutral-400'
                      }
                    >
                      {daysToExam > 0
                        ? `${daysToExam} days to exam`
                        : 'Exam passed'}
                    </span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </main>
  )
}

import Link from 'next/link'
import { Clock, BookOpen, ChevronRight, Plus } from 'lucide-react'
import { listCourses } from '@repo/content'
import { TopBar } from '@/components/top-bar'

export default function HomePage() {
  const courses = listCourses()
  const today = new Date()

  return (
    <>
      <TopBar />
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <header className="mb-14">
          <p className="text-xs font-mono text-[var(--color-zinc-600)] uppercase tracking-widest mb-3">
            Study Aid
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-white leading-tight">
            Your course library
          </h1>
          <p className="mt-4 text-[var(--color-zinc-400)] max-w-xl leading-relaxed">
            Evidence-linked exam predictions, lecture archives, and AI-powered study guides for every course.
          </p>
        </header>

        {courses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--color-surface-border)] p-16 text-center">
            <BookOpen size={32} className="text-[var(--color-zinc-700)] mx-auto mb-4" />
            <p className="text-[var(--color-zinc-400)] mb-6">No courses yet.</p>
            <Link
              href="/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
            >
              <Plus size={16} />
              Create your first course
            </Link>
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {courses.map((course) => {
              const examDate = new Date(course.exam_date)
              const daysToExam = Math.ceil(
                (examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
              )
              const isUrgent = daysToExam > 0 && daysToExam <= 30

              return (
                <li key={course.slug}>
                  <Link
                    href={`/${course.slug}`}
                    className="group block rounded-2xl border border-[var(--color-surface-border)] bg-[var(--color-surface-card)] p-6 hover:border-violet-500/40 hover:bg-[var(--color-surface-raised)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-900/10"
                  >
                    {/* Course code + term */}
                    <p className="text-[10px] font-mono text-[var(--color-zinc-600)] uppercase tracking-widest mb-3">
                      {course.course_code} · {course.term}
                    </p>

                    {/* Title */}
                    <h2
                      className="text-xl font-semibold text-white mb-1 leading-snug group-hover:text-violet-100 transition-colors"
                      dir={course.locale === 'he' ? 'rtl' : 'ltr'}
                      lang={course.locale}
                    >
                      {course.locale === 'he' ? course.title_he : course.title_en}
                    </h2>
                    <p className="text-sm text-[var(--color-zinc-500)] mb-5">
                      {course.locale === 'he' ? course.title_en : course.title_he}
                    </p>

                    {/* Subject pills */}
                    {course.subjects.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {course.subjects.slice(0, 4).map((s) => (
                          <span
                            key={s.slug}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-surface-overlay)] text-[var(--color-zinc-500)] border border-[var(--color-surface-border)]"
                          >
                            {s.title_en}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Clock
                          size={13}
                          className={isUrgent ? 'text-red-400' : 'text-[var(--color-zinc-600)]'}
                        />
                        <span
                          className={`text-sm font-medium ${isUrgent ? 'text-red-400' : 'text-[var(--color-zinc-500)]'}`}
                        >
                          {daysToExam > 0 ? (
                            <>
                              <span className={`text-lg font-bold tabular-nums font-mono ${isUrgent ? 'text-red-400' : 'text-[var(--color-zinc-300)]'}`}>
                                {daysToExam}
                              </span>{' '}
                              days
                            </>
                          ) : (
                            'Exam passed'
                          )}
                        </span>
                      </div>
                      <ChevronRight
                        size={16}
                        className="text-[var(--color-zinc-700)] group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all"
                      />
                    </div>
                  </Link>
                </li>
              )
            })}

            {/* Add course card */}
            <li>
              <Link
                href="/new"
                className="group flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-surface-border)] hover:border-violet-500/40 p-6 h-full min-h-[200px] transition-colors"
              >
                <Plus
                  size={24}
                  className="text-[var(--color-zinc-700)] group-hover:text-violet-400 transition-colors mb-2"
                />
                <span className="text-sm text-[var(--color-zinc-600)] group-hover:text-[var(--color-zinc-400)] transition-colors">
                  Add course
                </span>
              </Link>
            </li>
          </ul>
        )}
      </main>
    </>
  )
}

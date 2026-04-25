import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BarChart3, Library, TrendingUp, RefreshCw, Calendar, User, Building } from 'lucide-react'
import {
  getCourse,
  getLectures,
  getMamans,
  getTests,
  getPredictions,
  getTrends,
  listCourseSlugs,
} from '@repo/content'
import { TopBar } from '@/components/top-bar'

export function generateStaticParams() {
  return listCourseSlugs().map((slug) => ({ slug }))
}

type Params = { params: Promise<{ slug: string }> }

export default async function CoursePage({ params }: Params) {
  const { slug } = await params

  let course
  try {
    course = getCourse(slug)
  } catch {
    notFound()
  }

  const lectures = getLectures(slug)
  const mamans = getMamans(slug)
  const tests = getTests(slug)
  const predictions = getPredictions(slug)
  const trends = getTrends(slug)
  const isRtl = course.locale === 'he'
  const displayName = isRtl ? course.title_he : course.title_en

  const tiles = [
    {
      href: `/${slug}/predictions`,
      icon: <BarChart3 size={20} className="text-violet-400" />,
      label: 'Predictions',
      desc: 'Exam question probabilities',
      count: predictions?.questions.length ?? 0,
      countLabel: 'questions',
      accent: 'hover:border-violet-500/40',
    },
    {
      href: `/${slug}/library`,
      icon: <Library size={20} className="text-sky-400" />,
      label: 'Library',
      desc: 'Lectures, mamans & past tests',
      count: lectures.length + mamans.length + tests.length,
      countLabel: 'documents',
      accent: 'hover:border-sky-500/40',
    },
  ]

  return (
    <>
      <TopBar
        courseName={displayName}
        courseSlug={slug}
        showRevise
        showTrends={!!trends}
      />
      <main className="max-w-4xl mx-auto px-4 md:px-8 py-10 md:py-16">
        {/* Course header */}
        <header className="mb-10" dir={isRtl ? 'rtl' : 'ltr'} lang={course.locale}>
          <p className="text-[10px] font-mono text-[var(--color-zinc-600)] uppercase tracking-widest mb-2">
            {course.course_code} · {course.term}
          </p>
          <h1 className="font-display text-3xl md:text-4xl text-white leading-tight mb-1">
            {displayName}
          </h1>
          <p className="text-lg text-[var(--color-zinc-400)]">
            {isRtl ? course.title_en : course.title_he}
          </p>

          {/* Meta row */}
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-[var(--color-zinc-500)]">
            {course.professor && (
              <span className="flex items-center gap-1.5">
                <User size={13} />
                {course.professor}
              </span>
            )}
            {course.institution_en && (
              <span className="flex items-center gap-1.5">
                <Building size={13} />
                {course.institution_en}
              </span>
            )}
            {course.exam_date && (
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                Exam {course.exam_date}
              </span>
            )}
          </div>
        </header>

        {/* Main tiles */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {tiles.map((tile) => (
            <Link
              key={tile.href}
              href={tile.href}
              className={`group rounded-2xl border border-[var(--color-surface-border)] bg-[var(--color-surface-card)] p-6 transition-all duration-200 hover:bg-[var(--color-surface-raised)] hover:-translate-y-0.5 hover:shadow-lg ${tile.accent}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 rounded-xl bg-[var(--color-surface-overlay)] border border-[var(--color-surface-border)]">
                  {tile.icon}
                </div>
                <span className="font-display text-3xl text-white tabular-nums">
                  {tile.count}
                </span>
              </div>
              <h2 className="font-semibold text-white mb-0.5">{tile.label}</h2>
              <p className="text-xs text-[var(--color-zinc-500)]">{tile.desc}</p>
            </Link>
          ))}

          {/* Trends tile — only when data exists */}
          {trends && (
            <Link
              href={`/${slug}/trends`}
              className="group rounded-2xl border border-amber-900/30 bg-amber-950/10 p-6 transition-all duration-200 hover:bg-amber-950/20 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 rounded-xl bg-amber-900/20 border border-amber-900/30">
                  <TrendingUp size={20} className="text-amber-400" />
                </div>
                <span className="font-display text-3xl text-amber-300 tabular-nums">
                  {trends.surprises.length + trends.absences.length}
                </span>
              </div>
              <h2 className="font-semibold text-white mb-0.5">Trends</h2>
              <p className="text-xs text-amber-700">2025A surprises &amp; gaps</p>
            </Link>
          )}

          {/* Revise tile */}
          <Link
            href={`/${slug}/revise`}
            className="group rounded-2xl border border-[var(--color-surface-border)] bg-[var(--color-surface-card)] p-6 transition-all duration-200 hover:bg-[var(--color-surface-raised)] hover:border-violet-500/40 hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-xl bg-[var(--color-surface-overlay)] border border-[var(--color-surface-border)]">
                <RefreshCw size={20} className="text-violet-400" />
              </div>
            </div>
            <h2 className="font-semibold text-white mb-0.5">Revise predictions</h2>
            <p className="text-xs text-[var(--color-zinc-500)]">AI re-scores with new material</p>
          </Link>
        </section>

        {/* Subjects */}
        {course.subjects.length > 0 && (
          <section>
            <h2 className="text-xs font-mono uppercase tracking-widest text-[var(--color-zinc-600)] mb-4">
              Subjects
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {course.subjects.map((subject) => (
                <li
                  key={subject.slug}
                  className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-card)] px-4 py-3"
                >
                  <h3
                    className="font-medium text-white text-sm mb-0.5"
                    dir={isRtl ? 'rtl' : 'ltr'}
                    lang={course.locale}
                  >
                    {isRtl ? subject.title_he : subject.title_en}
                  </h3>
                  <p className="text-[11px] text-[var(--color-zinc-600)] font-mono">
                    {subject.topics?.length ?? 0} topics
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </>
  )
}

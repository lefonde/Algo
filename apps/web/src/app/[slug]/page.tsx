import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  getCourse,
  getLectures,
  getMamans,
  getTests,
  getPredictions,
  listCourseSlugs,
} from '@repo/content'

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
  const isRtl = course.locale === 'he'

  const tiles = [
    {
      href: `/${slug}/predictions`,
      label_en: 'Predictions',
      label_he: 'חיזויים',
      count: predictions?.questions.length ?? 0,
      accent: 'purple',
    },
    {
      href: `/${slug}/library`,
      label_en: 'Library',
      label_he: 'ספרייה',
      count: lectures.length + mamans.length + tests.length,
      accent: 'neutral',
    },
  ]

  return (
    <main className="min-h-screen px-6 py-16 md:px-10 md:py-24 max-w-5xl mx-auto">
      <Link
        href="/"
        className="inline-block text-sm text-neutral-500 hover:text-neutral-300 mb-8"
      >
        ← All courses
      </Link>

      <header
        className="mb-12"
        dir={isRtl ? 'rtl' : 'ltr'}
        lang={course.locale}
      >
        <p className="text-xs font-mono text-neutral-500 mb-2">
          {course.course_code} · {course.term}
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          {isRtl ? course.title_he : course.title_en}
        </h1>
        <p className="mt-2 text-lg text-neutral-400">
          {isRtl ? course.title_en : course.title_he}
        </p>
        <p className="mt-4 text-sm text-neutral-500">
          {course.professor} · {course.institution_en} · Exam {course.exam_date}
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {tiles.map((tile) => (
          <Link
            key={tile.href}
            href={tile.href}
            className="block rounded-xl border border-neutral-800 bg-neutral-900/50 p-8 hover:border-purple-500/50 transition-colors"
          >
            <p className="text-sm text-neutral-400 mb-2">
              {isRtl ? tile.label_he : tile.label_en}
            </p>
            <p className="text-4xl font-bold text-white">{tile.count}</p>
          </Link>
        ))}
      </section>

      <section>
        <h2 className="text-sm uppercase tracking-widest text-neutral-500 mb-4">
          Subjects
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {course.subjects.map((subject) => (
            <li
              key={subject.slug}
              className="rounded-lg border border-neutral-800 bg-neutral-900/30 p-5"
            >
              <h3
                className="font-semibold text-white mb-1"
                dir={isRtl ? 'rtl' : 'ltr'}
                lang={course.locale}
              >
                {isRtl ? subject.title_he : subject.title_en}
              </h3>
              <p className="text-xs text-neutral-500">
                {subject.topics.length} topics
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  getCourse,
  getLectures,
  getMamans,
  getTests,
  listCourseSlugs,
} from '@repo/content'

export function generateStaticParams() {
  return listCourseSlugs().map((slug) => ({ slug }))
}

type Params = { params: Promise<{ slug: string }> }

export default async function LibraryPage({ params }: Params) {
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
  const isRtl = course.locale === 'he'

  return (
    <main className="min-h-screen px-6 py-16 md:px-10 md:py-24 max-w-5xl mx-auto">
      <Link
        href={`/${slug}`}
        className="inline-block text-sm text-neutral-500 hover:text-neutral-300 mb-8"
      >
        ← {isRtl ? course.title_he : course.title_en}
      </Link>

      <header className="mb-12">
        <h1 className="text-4xl font-bold text-white">Library</h1>
        <p className="mt-2 text-neutral-400">
          {lectures.length} lectures · {mamans.length} mamans · {tests.length}{' '}
          past exams
        </p>
      </header>

      <section className="mb-12">
        <h2 className="text-sm uppercase tracking-widest text-neutral-500 mb-4">
          Lectures
        </h2>
        <ul className="rounded-xl border border-neutral-800 bg-neutral-900/50 divide-y divide-neutral-800">
          {lectures.map((lecture) => (
            <li
              key={`${lecture.number}-${lecture.source}`}
              className="flex items-baseline gap-4 px-5 py-4"
            >
              <span className="font-mono text-xs text-neutral-500 w-10">
                #{lecture.number}
              </span>
              <span className="flex-1 text-neutral-200">
                {lecture.title_en ?? lecture.title_he}
              </span>
              <span className="text-xs text-neutral-500 font-mono">
                {lecture.source}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-sm uppercase tracking-widest text-neutral-500 mb-4">
          Mamans
        </h2>
        <ul className="rounded-xl border border-neutral-800 bg-neutral-900/50 divide-y divide-neutral-800">
          {mamans.map((maman) => (
            <li
              key={maman.number}
              className="flex items-baseline gap-4 px-5 py-4"
            >
              <span className="font-mono text-xs text-neutral-500 w-10">
                #{maman.number}
              </span>
              <span className="flex-1 text-neutral-200">
                {maman.topics.join(', ')}
              </span>
              {maman.partner && (
                <span className="text-xs text-neutral-500" dir="rtl">
                  {maman.partner}
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-sm uppercase tracking-widest text-neutral-500 mb-4">
          Past exams
        </h2>
        <ul className="rounded-xl border border-neutral-800 bg-neutral-900/50 divide-y divide-neutral-800">
          {tests.map((test, i) => (
            <li
              key={`${test.year}-${test.semester}-${test.moed}-${i}`}
              className="flex items-baseline gap-4 px-5 py-4"
            >
              <span className="font-mono text-xs text-neutral-500 w-20">
                {test.year} {test.semester}
                {test.moed}
              </span>
              <span className="flex-1 text-sm text-neutral-300 truncate">
                {test.topics.length > 0
                  ? test.topics.join(', ')
                  : test.notes ?? '—'}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

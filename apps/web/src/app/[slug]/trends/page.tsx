import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourse, getTrends, listCourseSlugs } from '@repo/content'

export async function generateStaticParams() {
  return listCourseSlugs().map((slug) => ({ slug }))
}

type Params = { params: Promise<{ slug: string }> }

export default async function TrendsPage({ params }: Params) {
  const { slug } = await params

  let course
  try {
    course = getCourse(slug)
  } catch {
    notFound()
  }

  const trends = getTrends(slug)
  if (!trends) notFound()

  const isRtl = course.locale === 'he'

  return (
    <main className="min-h-screen px-4 py-12 md:px-10 md:py-20 max-w-4xl mx-auto">
      <Link
        href={`/${slug}/predictions`}
        className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors mb-8 inline-block"
      >
        ← Predictions
      </Link>

      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white">Exam trends</h1>
        <p className="mt-2 text-neutral-400 text-sm">
          {isRtl ? course.title_he : course.title_en} · Based on {trends.reference_exam}
        </p>
      </header>

      {/* Surprises */}
      <section className="mb-12">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-amber-400 mb-5">
          <span className="text-base">⚡</span> Surprises
          <span className="text-neutral-600 font-normal normal-case tracking-normal text-xs">
            — topics that appeared unexpectedly or at higher weight than predicted
          </span>
        </h2>
        <div className="space-y-4">
          {trends.surprises.map((item) => (
            <div
              key={item.topic}
              className="rounded-xl border border-amber-900/40 bg-amber-950/10 px-5 py-4 space-y-2"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <h3 className="font-semibold text-white">{item.topic}</h3>
                {item.question_ids && item.question_ids.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap">
                    {item.question_ids.map((id) => (
                      <Link
                        key={id}
                        href={`/${slug}/predictions#${id}`}
                        className="text-xs font-mono px-1.5 py-0.5 rounded bg-amber-900/30 text-amber-400 hover:bg-amber-900/50 transition-colors"
                      >
                        {id}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              {item.expected && (
                <p className="text-xs text-neutral-500">
                  <span className="text-neutral-600">Expected: </span>
                  {item.expected}
                </p>
              )}
              <p className="text-xs text-neutral-400">
                <span className="text-neutral-500">Actual: </span>
                {item.actual}
              </p>
              <p className="text-sm text-amber-200/80 leading-relaxed" dir="auto">
                {item.implication}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Absences */}
      <section className="mb-12">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-sky-400 mb-5">
          <span className="text-base">🕳</span> Absent from {trends.reference_exam} — now "due"
          <span className="text-neutral-600 font-normal normal-case tracking-normal text-xs">
            — topics not tested → higher probability for next exam
          </span>
        </h2>
        <div className="space-y-4">
          {trends.absences.map((item) => (
            <div
              key={item.topic}
              className="rounded-xl border border-sky-900/40 bg-sky-950/10 px-5 py-4 space-y-2"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <h3 className="font-semibold text-white">{item.topic}</h3>
                {item.question_ids && item.question_ids.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap">
                    {item.question_ids.map((id) => (
                      <Link
                        key={id}
                        href={`/${slug}/predictions#${id}`}
                        className="text-xs font-mono px-1.5 py-0.5 rounded bg-sky-900/30 text-sky-400 hover:bg-sky-900/50 transition-colors"
                      >
                        {id}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-neutral-400">
                <span className="text-neutral-500">2025A: </span>
                {item.actual}
              </p>
              <p className="text-sm text-sky-200/80 leading-relaxed" dir="auto">
                {item.implication}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Confirmed */}
      <section>
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-emerald-400 mb-5">
          <span className="text-base">✓</span> Confirmed patterns
          <span className="text-neutral-600 font-normal normal-case tracking-normal text-xs">
            — appear every exam cycle, treat as certain
          </span>
        </h2>
        <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/10 divide-y divide-emerald-900/30">
          {trends.confirmed.map((item, i) => (
            <div key={i} className="px-5 py-4 flex gap-4 items-start">
              <span className="mt-0.5 text-emerald-500 text-sm shrink-0">✓</span>
              <div className="space-y-1">
                <p className="text-sm font-medium text-white">{item.pattern}</p>
                <p className="text-xs text-emerald-200/60 leading-relaxed">{item.confirmation}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

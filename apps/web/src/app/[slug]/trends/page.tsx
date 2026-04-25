import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Zap, CircleSlash, CheckCircle, ExternalLink } from 'lucide-react'
import { getCourse, getTrends, listCourseSlugs } from '@repo/content'
import { TopBar } from '@/components/top-bar'

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
  const displayName = isRtl ? course.title_he : course.title_en

  return (
    <>
      <TopBar courseName={displayName} courseSlug={slug} showRevise />
      <main className="max-w-3xl mx-auto px-4 md:px-8 py-10 md:py-14">
        <header className="mb-10">
          <h1 className="font-display text-3xl text-white">Exam trends</h1>
          <p className="mt-1.5 text-[var(--color-zinc-500)] text-sm">
            Based on {trends.reference_exam}
          </p>
        </header>

        {/* Surprises */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-5">
            <div className="p-1.5 rounded-lg bg-amber-900/20 border border-amber-900/30">
              <Zap size={14} className="text-amber-400" />
            </div>
            <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-widest">
              Surprises
            </h2>
            <span className="text-[10px] text-[var(--color-zinc-600)] font-mono ml-1">
              appeared at higher weight than predicted
            </span>
          </div>
          <div className="space-y-3">
            {trends.surprises.map((item) => (
              <div
                key={item.topic}
                className="rounded-xl border border-amber-900/30 bg-amber-950/10 px-5 py-4 space-y-2"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <h3 className="font-semibold text-white">{item.topic}</h3>
                  {item.question_ids && item.question_ids.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap">
                      {item.question_ids.map((id) => (
                        <Link
                          key={id}
                          href={`/${slug}/predictions#${id}`}
                          className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-900/30 text-amber-400 hover:bg-amber-900/50 transition-colors"
                        >
                          {id}
                          <ExternalLink size={8} />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                {item.expected && (
                  <p className="text-xs text-[var(--color-zinc-600)]">
                    <span className="text-[var(--color-zinc-700)]">Expected: </span>
                    {item.expected}
                  </p>
                )}
                <p className="text-xs text-[var(--color-zinc-500)]">
                  <span className="text-[var(--color-zinc-600)]">Actual: </span>
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
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-5">
            <div className="p-1.5 rounded-lg bg-sky-900/20 border border-sky-900/30">
              <CircleSlash size={14} className="text-sky-400" />
            </div>
            <h2 className="text-sm font-semibold text-sky-400 uppercase tracking-widest">
              Absent — now due
            </h2>
            <span className="text-[10px] text-[var(--color-zinc-600)] font-mono ml-1">
              not tested in {trends.reference_exam}
            </span>
          </div>
          <div className="space-y-3">
            {trends.absences.map((item) => (
              <div
                key={item.topic}
                className="rounded-xl border border-sky-900/30 bg-sky-950/10 px-5 py-4 space-y-2"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <h3 className="font-semibold text-white">{item.topic}</h3>
                  {item.question_ids && item.question_ids.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap">
                      {item.question_ids.map((id) => (
                        <Link
                          key={id}
                          href={`/${slug}/predictions#${id}`}
                          className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-900/30 text-sky-400 hover:bg-sky-900/50 transition-colors"
                        >
                          {id}
                          <ExternalLink size={8} />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-[var(--color-zinc-500)]">
                  <span className="text-[var(--color-zinc-600)]">{trends.reference_exam}: </span>
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
          <div className="flex items-center gap-2 mb-5">
            <div className="p-1.5 rounded-lg bg-emerald-900/20 border border-emerald-900/30">
              <CheckCircle size={14} className="text-emerald-400" />
            </div>
            <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-widest">
              Confirmed patterns
            </h2>
            <span className="text-[10px] text-[var(--color-zinc-600)] font-mono ml-1">
              appear every exam cycle
            </span>
          </div>
          <div className="rounded-xl border border-emerald-900/30 bg-emerald-950/10 divide-y divide-emerald-900/20">
            {trends.confirmed.map((item, i) => (
              <div key={i} className="px-5 py-3.5 flex gap-3 items-start">
                <CheckCircle size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">{item.pattern}</p>
                  <p className="text-xs text-emerald-300/50 mt-0.5 leading-relaxed">
                    {item.confirmation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}

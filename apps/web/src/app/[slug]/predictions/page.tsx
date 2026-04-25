import { notFound } from 'next/navigation'
import { getCourse, getPredictions, getInsights, getTrends, listCourseSlugs } from '@repo/content'
import { headers } from 'next/headers'
import { PredictionsList } from './predictions-list'
import { TopBar } from '@/components/top-bar'

export async function generateStaticParams() {
  return listCourseSlugs().map((slug) => ({ slug }))
}

type Params = { params: Promise<{ slug: string }> }

export default async function PredictionsPage({ params }: Params) {
  const { slug } = await params

  let course
  try {
    course = getCourse(slug)
  } catch {
    notFound()
  }

  const predictions = getPredictions(slug)
  const insights = getInsights(slug)
  const trends = getTrends(slug)
  const isRtl = course.locale === 'he'
  const displayName = isRtl ? course.title_he : course.title_en

  const headersList = await headers()
  const host = headersList.get('host') ?? ''
  const proto = headersList.get('x-forwarded-proto') ?? 'https'
  const siteOrigin = host ? `${proto}://${host}` : ''

  return (
    <>
      <TopBar
        courseName={displayName}
        courseSlug={slug}
        showRevise
        showTrends={!!trends}
      />
      <main className="max-w-4xl mx-auto px-4 md:px-8 py-10 md:py-14">
        <header className="mb-8">
          <h1 className="font-display text-3xl text-white">Exam predictions</h1>
          <p className="mt-1.5 text-[var(--color-zinc-500)] text-sm">
            Scoring v{predictions?.scoring_version ?? '—'} · updated{' '}
            {predictions?.generated_at
              ? new Date(predictions.generated_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : '—'}
          </p>
        </header>

        {!predictions || predictions.questions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--color-surface-border)] p-16 text-center">
            <p className="text-[var(--color-zinc-400)] mb-6">No predictions yet.</p>
            <a
              href={`/${slug}/revise`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
            >
              Generate first predictions
            </a>
          </div>
        ) : (
          <PredictionsList
            questions={predictions.questions}
            insights={insights?.items}
            trends={trends}
            siteOrigin={siteOrigin}
          />
        )}
      </main>
    </>
  )
}

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourse, getPredictions, getInsights, getTrends, listCourseSlugs } from '@repo/content'
import { PredictionsList } from './predictions-list'
import { headers } from 'next/headers'

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

  const headersList = await headers()
  const host = headersList.get('host') ?? ''
  const proto = headersList.get('x-forwarded-proto') ?? 'https'
  const siteOrigin = host ? `${proto}://${host}` : ''

  return (
    <main className="min-h-screen px-4 py-12 md:px-10 md:py-20 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Link
          href={`/${slug}`}
          className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors"
        >
          ← {isRtl ? course.title_he : course.title_en}
        </Link>
        <Link
          href={`/${slug}/revise`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-700 hover:bg-violet-600 text-white text-sm font-medium transition-colors"
        >
          🔄 Revise predictions
        </Link>
      </div>

      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white">Exam predictions</h1>
        <p className="mt-2 text-neutral-400 text-sm">
          {predictions?.questions.length ?? 0} questions · scoring v
          {predictions?.scoring_version ?? '—'} · updated{' '}
          {predictions?.generated_at
            ? new Date(predictions.generated_at).toLocaleDateString()
            : '—'}
        </p>
      </header>

      {!predictions || predictions.questions.length === 0 ? (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-10 text-center">
          <p className="text-neutral-400 mb-4">No predictions yet.</p>
          <Link
            href={`/${slug}/revise`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-700 hover:bg-violet-600 text-white text-sm font-medium transition-colors"
          >
            🔄 Generate first predictions
          </Link>
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
  )
}

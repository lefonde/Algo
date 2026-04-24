import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourse, getPredictions, listCourseSlugs } from '@repo/content'
import { PredictionsList } from './predictions-list'

export function generateStaticParams() {
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
        <h1 className="text-4xl font-bold text-white">Exam predictions</h1>
        <p className="mt-2 text-neutral-400">
          {predictions?.questions.length ?? 0} questions · scoring v
          {predictions?.scoring_version ?? '—'} · generated{' '}
          {predictions?.generated_at
            ? new Date(predictions.generated_at).toLocaleDateString()
            : '—'}
        </p>
      </header>

      {!predictions || predictions.questions.length === 0 ? (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-10 text-center">
          <p className="text-neutral-400">
            No predictions yet. Run{' '}
            <code className="font-mono text-neutral-300">
              /recalc-predictions {slug}
            </code>{' '}
            to generate.
          </p>
        </div>
      ) : (
        <PredictionsList questions={predictions.questions} />
      )}
    </main>
  )
}

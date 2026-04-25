import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCourse, getPredictions, listCourseSlugs } from '@repo/content'
import { ReviseClient } from './revise-client'

export async function generateStaticParams() {
  return listCourseSlugs().map((slug) => ({ slug }))
}

type Params = { params: Promise<{ slug: string }> }

export default async function RevisePage({ params }: Params) {
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
    <main className="min-h-screen px-4 py-12 md:px-10 md:py-20 max-w-4xl mx-auto">
      <Link
        href={`/${slug}/predictions`}
        className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors mb-8 inline-block"
      >
        ← Predictions
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Revise predictions</h1>
        <p className="mt-2 text-neutral-400 text-sm">
          {isRtl ? course.title_he : course.title_en} · {predictions?.questions.length ?? 0} current
          questions
        </p>
      </header>

      <ReviseClient slug={slug} currentQuestionCount={predictions?.questions.length ?? 0} />
    </main>
  )
}

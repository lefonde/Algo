import { notFound } from 'next/navigation'
import { getCourse, getPredictions, listCourseSlugs } from '@repo/content'
import { ReviseClient } from './revise-client'
import { TopBar } from '@/components/top-bar'

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
  const displayName = isRtl ? course.title_he : course.title_en

  return (
    <>
      <TopBar courseName={displayName} courseSlug={slug} />
      <main className="max-w-3xl mx-auto px-4 md:px-8 py-10 md:py-14">
        <header className="mb-8">
          <div className="flex items-baseline justify-between gap-4">
            <h1 className="font-display text-3xl text-white">Revise predictions</h1>
            <a
              href="/how-it-works#recalculate"
              className="text-xs text-[var(--color-zinc-600)] hover:text-[var(--color-zinc-400)] transition-colors shrink-0"
            >
              ⓘ How this works
            </a>
          </div>
          <p className="mt-1.5 text-[var(--color-zinc-500)] text-sm">
            {predictions?.questions.length ?? 0} current questions
          </p>
        </header>

        <ReviseClient slug={slug} currentQuestionCount={predictions?.questions.length ?? 0} />
      </main>
    </>
  )
}

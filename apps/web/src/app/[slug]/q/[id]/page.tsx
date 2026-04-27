import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getCourse, getPredictions, listCourseSlugs } from '@repo/content'
import { TopBar } from '@/components/top-bar'
import { Workspace } from './workspace'

export async function generateStaticParams() {
  const params: { slug: string; id: string }[] = []
  for (const slug of listCourseSlugs()) {
    const predictions = getPredictions(slug)
    if (!predictions) continue
    for (const q of predictions.questions) {
      params.push({ slug, id: q.id })
    }
  }
  return params
}

type Params = { params: Promise<{ slug: string; id: string }> }

export default async function QuestionWorkspacePage({ params }: Params) {
  const { slug, id } = await params

  let course
  try {
    course = getCourse(slug)
  } catch {
    notFound()
  }

  const predictions = getPredictions(slug)
  const question = predictions?.questions.find((q) => q.id === id)
  if (!question) notFound()

  const isRtl = course.locale === 'he'
  const displayName = isRtl ? course.title_he : course.title_en

  return (
    <>
      <TopBar courseName={displayName} courseSlug={slug} showRevise />
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-10">
        <Link
          href={`/${slug}/predictions`}
          className="inline-flex items-center gap-1.5 text-xs text-[var(--color-zinc-500)] hover:text-[var(--color-zinc-300)] transition-colors mb-4"
        >
          <ArrowLeft size={12} /> Back to predictions
        </Link>

        <Workspace slug={slug} initialQuestion={question} />
      </main>
    </>
  )
}

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

function contentRoot() {
  return join(process.cwd(), '..', '..', 'content', 'courses')
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { slug, title_he, title_en, institution, professor, term, exam_date, subjects } = body

  if (!slug || !title_he) {
    return NextResponse.json({ error: 'slug and title_he are required' }, { status: 400 })
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: 'slug must be lowercase kebab-case' }, { status: 400 })
  }

  const courseDir = join(contentRoot(), slug)
  if (existsSync(courseDir)) {
    return NextResponse.json({ error: 'Course already exists' }, { status: 409 })
  }

  const dirs = [
    courseDir,
    join(courseDir, 'lectures', 'pdfs'),
    join(courseDir, 'mamans', 'pdfs'),
    join(courseDir, 'tests', 'pdfs'),
    join(courseDir, 'textbooks'),
    join(courseDir, 'summaries'),
    join(courseDir, 'guide'),
    join(courseDir, 'ingest-inbox'),
    join(courseDir, 'whatsapp'),
  ]
  for (const dir of dirs) mkdirSync(dir, { recursive: true })

  const course = {
    slug,
    title_he: title_he ?? '',
    title_en: title_en ?? slug,
    institution: institution ?? '',
    professor: professor ?? '',
    term: term ?? '',
    exam_date: exam_date ?? null,
    subjects: subjects ?? [],
    locale: 'he',
  }
  writeFileSync(join(courseDir, 'course.json'), JSON.stringify(course, null, 2))

  const predictions = {
    course: slug,
    generated_at: new Date().toISOString(),
    exam_date: exam_date ?? '',
    scoring_version: '2.0',
    questions: [],
  }
  writeFileSync(join(courseDir, 'predictions.json'), JSON.stringify(predictions, null, 2))

  writeFileSync(join(courseDir, 'lectures', 'index.json'), '[]')
  writeFileSync(join(courseDir, 'mamans', 'index.json'), '[]')
  writeFileSync(join(courseDir, 'tests', 'index.json'), '[]')

  return NextResponse.json({ ok: true, slug })
}

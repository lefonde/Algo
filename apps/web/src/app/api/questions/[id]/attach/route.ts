import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Attachment } from '@repo/content'

function contentRoot() {
  return join(process.cwd(), '..', '..', 'content', 'courses')
}

function classifyKind(filename: string): Attachment['kind'] {
  const lower = filename.toLowerCase()
  if (lower.endsWith('.pdf')) return 'pdf'
  if (lower.match(/\.(jpg|jpeg|png|gif|webp|heic)$/)) return 'image'
  if (lower.match(/\.(md|txt|docx?|odt)$/)) return 'note'
  return 'other'
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: questionId } = await params
  const formData = await request.formData()
  const slug = String(formData.get('slug') ?? '')
  const file = formData.get('file') as File | null
  const note = formData.get('note') ? String(formData.get('note')) : undefined

  if (!slug || !file) {
    return NextResponse.json({ error: 'slug and file required' }, { status: 400 })
  }

  // Save under content/courses/{slug}/uploads/{questionId}/{filename}
  const uploadDir = join(contentRoot(), slug, 'uploads', questionId)
  mkdirSync(uploadDir, { recursive: true })

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const finalName = `${Date.now()}-${safeName}`
  const filePath = join(uploadDir, finalName)
  const arrayBuffer = await file.arrayBuffer()
  writeFileSync(filePath, Buffer.from(arrayBuffer))

  // Append to question's attachments[] in predictions.json
  const predictionsPath = join(contentRoot(), slug, 'predictions.json')
  const predictions = JSON.parse(readFileSync(predictionsPath, 'utf-8'))
  const question = predictions.questions.find((q: { id: string }) => q.id === questionId)
  if (!question) {
    return NextResponse.json({ error: 'Question not found' }, { status: 404 })
  }

  const attachment: Attachment = {
    id: `${questionId}-att-${Date.now()}`,
    label: file.name,
    kind: classifyKind(file.name),
    href: `/content/courses/${slug}/uploads/${questionId}/${finalName}`,
    uploaded_at: new Date().toISOString(),
    note_md: note,
  }

  question.attachments = [...(question.attachments ?? []), attachment]
  writeFileSync(predictionsPath, JSON.stringify(predictions, null, 2))

  return NextResponse.json({ ok: true, attachment })
}

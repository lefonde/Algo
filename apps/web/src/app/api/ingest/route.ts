import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import { join, extname } from 'node:path'

function contentRoot() {
  return join(process.cwd(), '..', '..', 'content', 'courses')
}

type SourceKind = 'lecture' | 'maman' | 'exam' | 'textbook' | 'whatsapp' | 'unknown'

function classify(filename: string): SourceKind {
  const lower = filename.toLowerCase()
  if (lower.includes('lecture') || lower.includes('הרצאה')) return 'lecture'
  if (lower.includes('maman') || lower.includes('ממן')) return 'maman'
  if (lower.includes('exam') || lower.includes('מבחן') || lower.includes('test')) return 'exam'
  if (lower.includes('whatsapp') || /^\d{5}-/.test(filename)) return 'whatsapp'
  if (['.pdf'].includes(extname(lower))) return 'textbook'
  return 'unknown'
}

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const slug = formData.get('slug') as string
  const file = formData.get('file') as File | null

  if (!slug || !file) {
    return NextResponse.json({ error: 'slug and file are required' }, { status: 400 })
  }

  const courseDir = join(contentRoot(), slug)
  if (!existsSync(courseDir)) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 })
  }

  const kind = classify(file.name)
  const inboxDir = join(courseDir, 'ingest-inbox')
  const destPath = join(inboxDir, file.name)

  const buffer = Buffer.from(await file.arrayBuffer())
  writeFileSync(destPath, buffer)

  // Append to uploads.json log
  const uploadsPath = join(courseDir, 'uploads.json')
  const uploads: unknown[] = existsSync(uploadsPath)
    ? JSON.parse(readFileSync(uploadsPath, 'utf-8'))
    : []

  uploads.push({
    filename: file.name,
    kind,
    size: file.size,
    uploaded_at: new Date().toISOString(),
    path: `ingest-inbox/${file.name}`,
  })
  writeFileSync(uploadsPath, JSON.stringify(uploads, null, 2))

  return NextResponse.json({ ok: true, filename: file.name, kind })
}

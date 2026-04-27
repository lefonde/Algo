import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

function predictionsPath(slug: string) {
  return join(process.cwd(), '..', '..', 'content', 'courses', slug, 'predictions.json')
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: questionId } = await params
  const slug = request.nextUrl.searchParams.get('slug')

  if (!slug) {
    return NextResponse.json({ error: 'slug query param required' }, { status: 400 })
  }

  try {
    const predictions = JSON.parse(readFileSync(predictionsPath(slug), 'utf-8'))
    const question = predictions.questions.find((q: { id: string }) => q.id === questionId)
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }
    return NextResponse.json(question, {
      headers: {
        'Content-Disposition': `attachment; filename="${questionId}.json"`,
      },
    })
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: errMsg }, { status: 500 })
  }
}

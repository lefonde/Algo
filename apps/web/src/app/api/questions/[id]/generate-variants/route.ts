import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import Anthropic from '@anthropic-ai/sdk'
import { getInsights, getTrends } from '@repo/content'
import type { QuestionVariant } from '@repo/content'

const MODEL = 'claude-sonnet-4-6'
const client = new Anthropic()

function predictionsPath(slug: string) {
  return join(process.cwd(), '..', '..', 'content', 'courses', slug, 'predictions.json')
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: questionId } = await params
  const body = await request.json()
  const { slug, count = 3 } = body

  if (!slug) {
    return NextResponse.json({ error: 'slug required' }, { status: 400 })
  }

  // Load predictions
  const path = predictionsPath(slug)
  const predictions = JSON.parse(readFileSync(path, 'utf-8'))
  const question = predictions.questions.find((q: { id: string }) => q.id === questionId)
  if (!question) {
    return NextResponse.json({ error: 'Question not found' }, { status: 404 })
  }

  const insights = getInsights(slug)
  const trends = getTrends(slug)

  const trendsText = trends
    ? `\nRecent absences (now "due"): ${trends.absences.map((a) => a.topic).join(', ')}\nConfirmed patterns: ${trends.confirmed.map((c) => c.pattern).join(', ')}`
    : ''
  const insightsText = insights
    ? `\nKey instructor insights:\n${insights.items
        .slice(0, 5)
        .map((i) => `- ${i.text}`)
        .join('\n')}`
    : ''

  const attachmentsText =
    question.attachments && question.attachments.length > 0
      ? `\n\nUser-attached materials for this question:\n${question.attachments
          .map((a: { label: string; href: string }) => `- ${a.label} (${a.href})`)
          .join('\n')}`
      : ''

  const prompt = `You are an exam-prep assistant for the Open University of Israel "Advanced Algorithms" course (נושאים מתקדמים באלגוריתמים).

Generate ${count} distinct variants of the following exam question. Each variant should be a realistic question at the same level and weight, exploring a different angle (one proof, one construction, one counterexample/edge-case if possible).

ORIGINAL QUESTION:
Topic: ${question.prompt_md}
Subject: ${question.subject}
Score (likelihood): ${question.score}/10
Points: ${question.points} (${question.points === 29 ? 'major mandatory' : 'minor choice'})

Rationale (why this matters):
${question.rationale_md}

Source references:
${(question.refs ?? []).map((r: { file: string; loc: string }) => `- ${r.file}: ${r.loc}`).join('\n')}
${trendsText}${insightsText}${attachmentsText}

Output a JSON array with this exact shape (output ONLY valid JSON, no markdown fences):
[
  {
    "prompt_md": "Full question text in Hebrew. Use LaTeX with \\\\( ... \\\\) for inline math and \\\\[ ... \\\\] for blocks.",
    "hints_md": [
      "First hint — gentle nudge, 1 sentence",
      "Second hint — partial approach, 2-3 sentences",
      "Third hint — almost the answer, mentions the key insight"
    ],
    "solution_md": "Complete formal solution in Hebrew with all proofs. Use LaTeX. Include intermediate steps. Should be ~200-400 words.",
    "common_mistakes_md": "2-3 specific mistakes students make on this variant, with why they're wrong. In Hebrew."
  }
]

Generate exactly ${count} variants. Each must be a different angle/scenario, not paraphrases of the same question.`

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 8000,
    messages: [{ role: 'user', content: prompt }],
  })

  const firstBlock = message.content[0]
  const text = firstBlock?.type === 'text' ? firstBlock.text : ''

  let parsed
  try {
    parsed = JSON.parse(text)
  } catch {
    return NextResponse.json({ error: 'AI returned invalid JSON', raw: text }, { status: 500 })
  }

  if (!Array.isArray(parsed)) {
    return NextResponse.json({ error: 'AI did not return an array', raw: parsed }, { status: 500 })
  }

  const now = new Date().toISOString()
  const existing = (question.variants ?? []) as QuestionVariant[]
  const startIndex = existing.length
  const newVariants: QuestionVariant[] = parsed.map((v: Record<string, unknown>, i: number) => ({
    id: `${questionId}-v${startIndex + i + 1}-${Date.now()}`,
    prompt_md: String(v.prompt_md ?? ''),
    hints_md: Array.isArray(v.hints_md) ? v.hints_md.map(String) : [],
    solution_md: String(v.solution_md ?? ''),
    common_mistakes_md: v.common_mistakes_md ? String(v.common_mistakes_md) : undefined,
    generated_at: now,
    model: MODEL,
  }))

  question.variants = [...newVariants, ...existing]
  writeFileSync(path, JSON.stringify(predictions, null, 2))

  return NextResponse.json({ ok: true, variants: newVariants })
}

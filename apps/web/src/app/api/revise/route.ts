import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getPredictions, getInsights, getTrends } from '@repo/content'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function POST(request: NextRequest) {
  const { slug, userNote } = await request.json()

  if (!slug) {
    return NextResponse.json({ error: 'slug required' }, { status: 400 })
  }

  const predictions = getPredictions(slug)
  const insights = getInsights(slug)
  const trends = getTrends(slug)

  if (!predictions) {
    return NextResponse.json({ error: 'No predictions found for this course' }, { status: 404 })
  }

  const scoringWeights = `
Scoring weights (must use these, never improvise):
- lecture: ×3.0 (proved in lecture → exam proof)
- recent-exam (2025A): ×3.0 (most recent signal)
- maman: ×2.5 (homework guarantees one exam question)
- past-exam: ×2.0 (Asaf recycles)
- sample-exam: ×2.0 (direct signal from instructor)
- whatsapp-hint: ×1.5 (דימה has strong predictive track record)
- textbook: ×0.5 (lower unless also in maman/sample)
- booklet: ×2.0 (course booklet = sample exam)`

  const currentQuestions = predictions.questions
    .map(
      (q) =>
        `[${q.id}] score=${q.score} subject=${q.subject}\nTopic: ${q.prompt_md}\nSources: ${q.sources.map((s) => `${s.kind}(${s.ref})`).join(', ')}`,
    )
    .join('\n\n')

  const trendsText = trends
    ? `\nSurprises in 2025A: ${trends.surprises.map((s) => s.topic).join(', ')}\nAbsent from 2025A (now "due"): ${trends.absences.map((a) => a.topic).join(', ')}`
    : ''

  const insightsText = insights
    ? `\nKey instructor insights:\n${insights.items.map((i) => `- ${i.text}`).join('\n')}`
    : ''

  const prompt = `You are an exam prediction assistant for an Advanced Algorithms course at the Open University of Israel.

${scoringWeights}

Current predictions:
${currentQuestions}
${trendsText}
${insightsText}

User note (may contain new information, hints, or updated material):
${userNote || '(no additional note)'}

Based on all evidence, output a JSON object with this exact shape:
{
  "reasoning": "1-2 paragraph explanation of your analysis",
  "changes": [
    {
      "question_id": "ds-1",
      "old_score": 10,
      "new_score": 9,
      "delta_reason": "specific reason citing evidence",
      "trend_flag": "up" | "down" | "confirmed" | null
    }
  ],
  "proposed_new_questions": [
    {
      "subject": "data-structures",
      "title": "...",
      "rationale": "...",
      "initial_score": 7
    }
  ],
  "removed_question_ids": [],
  "ordering": {
    "data-structures": ["ds-1", "ds-2"],
    "linear-programming": ["lp-1", "lp-4"],
    "expander-graphs": ["eg-1", "eg-2"],
    "mixed": ["mix-1", "mix-5"]
  }
}

Only include questions in "changes" where the score actually changes. Keep "proposed_new_questions" and "removed_question_ids" empty unless evidence strongly warrants it. Output ONLY valid JSON, no markdown fences.`

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
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

  return NextResponse.json({ ok: true, result: parsed })
}

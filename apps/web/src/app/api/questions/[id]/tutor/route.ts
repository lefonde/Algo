import type { NextRequest } from 'next/server'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import Anthropic from '@anthropic-ai/sdk'
import type { TutorMessage } from '@repo/content'

const MODEL = 'claude-sonnet-4-6'
const client = new Anthropic()

function predictionsPath(slug: string) {
  return join(process.cwd(), '..', '..', 'content', 'courses', slug, 'predictions.json')
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: questionId } = await params
  const body = await request.json()
  const {
    slug,
    message,
    history = [],
  } = body as {
    slug: string
    message: string
    history?: TutorMessage[]
  }

  if (!slug || !message) {
    return new Response(JSON.stringify({ error: 'slug and message required' }), { status: 400 })
  }

  // Load predictions
  const path = predictionsPath(slug)
  const predictions = JSON.parse(readFileSync(path, 'utf-8'))
  const question = predictions.questions.find((q: { id: string }) => q.id === questionId)
  if (!question) {
    return new Response(JSON.stringify({ error: 'Question not found' }), { status: 404 })
  }

  const attachmentsText =
    question.attachments && question.attachments.length > 0
      ? `\n\nMaterials the student attached for this question:\n${question.attachments
          .map((a: { label: string; href: string }) => `- ${a.label} (${a.href})`)
          .join('\n')}`
      : ''

  const systemPrompt = `You are a patient, expert tutor for the Open University of Israel "Advanced Algorithms" course (נושאים מתקדמים באלגוריתמים).

You are helping the student understand THIS specific exam question:

**Topic:** ${question.prompt_md}
**Subject:** ${question.subject}
**Score (exam likelihood):** ${question.score}/10
**Points:** ${question.points}

**Rationale (why this question matters):**
${question.rationale_md}

**Source references:**
${(question.refs ?? []).map((r: { file: string; loc: string }) => `- ${r.file}: ${r.loc}`).join('\n')}${attachmentsText}

Guidelines:
- **Respond in Hebrew by default** unless the student writes to you in English. Match their language.
- Use LaTeX for math: \\( ... \\) for inline, \\[ ... \\] for block-level. Render actual proofs, not handwaving.
- Be precise. Cite the source references when they support a claim.
- If the student asks something off-topic for this question, gently redirect — but answer if it's directly related.
- Encourage step-by-step reasoning. When the student is stuck, provide a hint, not the full answer.
- Be concise. Long-winded explanations bury the insight. Aim for 100-300 words per response.`

  const messages = [
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user' as const, content: message },
  ]

  const encoder = new TextEncoder()
  let assistantText = ''

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await client.messages.stream({
          model: MODEL,
          max_tokens: 2048,
          system: systemPrompt,
          messages,
        })

        for await (const event of response) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            const chunk = event.delta.text
            assistantText += chunk
            controller.enqueue(encoder.encode(chunk))
          }
        }

        controller.close()
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : 'Stream error'
        controller.enqueue(encoder.encode(`\n\n[Error: ${errMsg}]`))
        controller.close()
        return
      }

      // After stream completes, persist user + assistant pair to predictions.json
      try {
        const fresh = JSON.parse(readFileSync(path, 'utf-8'))
        const q = fresh.questions.find((x: { id: string }) => x.id === questionId)
        if (q) {
          const now = new Date().toISOString()
          q.tutor_history = [
            ...(q.tutor_history ?? []),
            { role: 'user', content: message, timestamp: now },
            { role: 'assistant', content: assistantText, timestamp: now },
          ]
          writeFileSync(path, JSON.stringify(fresh, null, 2))
        }
      } catch {
        // Persistence is best-effort; the stream already returned.
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    },
  })
}

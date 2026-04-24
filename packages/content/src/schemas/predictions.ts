import { z } from 'zod'

export const SourceKindSchema = z.enum([
  'lecture',
  'maman',
  'past-exam',
  'recent-exam',
  'whatsapp-hint',
  'sample-exam',
  'textbook',
])

export const SourceSchema = z.object({
  kind: SourceKindSchema,
  ref: z.string(),
  weight: z.number().positive(),
  quote: z.string().optional(),
})

export const TrendSchema = z.object({
  direction: z.enum(['up', 'down']),
  delta: z.number().positive(),
  reason: z.string(),
})

export const QuestionSchema = z.object({
  id: z.string().regex(/^[a-z]+-\d+$/, 'id must be like "ds-1" or "lp-9"'),
  subject: z.enum(['data-structures', 'linear-programming', 'expander-graphs', 'mixed']),
  prompt_md: z.string().min(1),
  score: z.number().min(1).max(10),
  points: z.union([z.literal(13), z.literal(29)]),
  sources: z.array(SourceSchema).min(1),
  rationale_md: z.string().min(1),
  trend: TrendSchema.optional(),
})

export const PredictionsSchema = z.object({
  course: z.string(),
  generated_at: z.string().datetime(),
  exam_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  scoring_version: z.string(),
  questions: z.array(QuestionSchema),
})

export type Question = z.infer<typeof QuestionSchema>
export type Source = z.infer<typeof SourceSchema>
export type SourceKind = z.infer<typeof SourceKindSchema>
export type Trend = z.infer<typeof TrendSchema>
export type Predictions = z.infer<typeof PredictionsSchema>

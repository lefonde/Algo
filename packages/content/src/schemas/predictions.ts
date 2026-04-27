import { z } from 'zod'

export const SourceKindSchema = z.enum([
  'lecture',
  'maman',
  'past-exam',
  'recent-exam',
  'whatsapp-hint',
  'sample-exam',
  'textbook',
  'booklet',
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

export const LinkSchema = z.object({
  type: z.enum(['lecture', 'maman', 'book', 'exam', 'booklet', 'whatsapp']),
  label: z.string(),
  href: z.string(),
})

export const ImageSchema = z.object({
  src: z.string(),
  label: z.string(),
})

export const ChatMessageSchema = z.object({
  s: z.string(),
  t: z.string(),
  d: z.boolean().optional(),
})

export const RefPinSchema = z.object({
  type: z.enum(['lecture', 'maman', 'book', 'exam', 'booklet', 'whatsapp']),
  file: z.string(),
  loc: z.string(),
  href: z.string(),
})

export const QuestionVariantSchema = z.object({
  id: z.string(),
  prompt_md: z.string(),
  hints_md: z.array(z.string()),
  solution_md: z.string(),
  common_mistakes_md: z.string().optional(),
  generated_at: z.string(),
  model: z.string(),
})

export const TutorMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
  timestamp: z.string(),
})

export const AttachmentSchema = z.object({
  id: z.string(),
  label: z.string(),
  kind: z.enum(['pdf', 'image', 'note', 'other']),
  href: z.string(),
  uploaded_at: z.string(),
  note_md: z.string().optional(),
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
  links: z.array(LinkSchema).optional(),
  images: z.array(ImageSchema).optional(),
  chat: z.array(ChatMessageSchema).optional(),
  refs: z.array(RefPinSchema).optional(),
  variants: z.array(QuestionVariantSchema).optional(),
  tutor_history: z.array(TutorMessageSchema).optional(),
  attachments: z.array(AttachmentSchema).optional(),
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
export type Link = z.infer<typeof LinkSchema>
export type Image = z.infer<typeof ImageSchema>
export type ChatMessage = z.infer<typeof ChatMessageSchema>
export type RefPin = z.infer<typeof RefPinSchema>
export type QuestionVariant = z.infer<typeof QuestionVariantSchema>
export type TutorMessage = z.infer<typeof TutorMessageSchema>
export type Attachment = z.infer<typeof AttachmentSchema>

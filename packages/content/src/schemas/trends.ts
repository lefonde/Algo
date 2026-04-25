import { z } from 'zod'

export const TrendCardSchema = z.object({
  topic: z.string(),
  expected: z.string().optional(),
  actual: z.string(),
  implication: z.string(),
  question_ids: z.array(z.string()).optional(),
})

export const TrendsSchema = z.object({
  course: z.string(),
  reference_exam: z.string(),
  surprises: z.array(TrendCardSchema),
  absences: z.array(TrendCardSchema),
  confirmed: z.array(
    z.object({
      pattern: z.string(),
      confirmation: z.string(),
    }),
  ),
})

export type TrendCard = z.infer<typeof TrendCardSchema>
export type Trends = z.infer<typeof TrendsSchema>

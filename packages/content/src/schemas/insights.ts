import { z } from 'zod'

export const InsightSchema = z.object({
  id: z.string(),
  text: z.string(),
  bold: z.string().optional(),
  negative: z.boolean().optional(),
})

export const InsightsSchema = z.object({
  course: z.string(),
  source: z.string(),
  items: z.array(InsightSchema),
})

export type Insight = z.infer<typeof InsightSchema>
export type Insights = z.infer<typeof InsightsSchema>

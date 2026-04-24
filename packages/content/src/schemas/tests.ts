import { z } from 'zod'

export const TestSchema = z.object({
  year: z.number().int().min(2000).max(2100),
  semester: z.enum(['A', 'B']),
  moed: z.enum(['A', 'B']),
  topics: z.array(z.string()),
  pdf: z.string(),
  notes: z.string().optional(),
})

export const TestIndexSchema = z.array(TestSchema)

export type Test = z.infer<typeof TestSchema>
export type TestIndex = z.infer<typeof TestIndexSchema>

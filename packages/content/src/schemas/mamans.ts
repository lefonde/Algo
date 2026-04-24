import { z } from 'zod'

export const MamanSchema = z.object({
  number: z.number().int().positive(),
  due: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  topics: z.array(z.string()),
  partner: z.string().optional(),
  pdf: z.string(),
  grade: z.number().min(0).max(100).optional(),
})

export const MamanIndexSchema = z.array(MamanSchema)

export type Maman = z.infer<typeof MamanSchema>
export type MamanIndex = z.infer<typeof MamanIndexSchema>

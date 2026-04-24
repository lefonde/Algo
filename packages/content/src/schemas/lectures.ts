import { z } from 'zod'

export const LectureSchema = z.object({
  number: z.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  title_he: z.string(),
  title_en: z.string().optional(),
  pdf: z.string(),
  source: z.enum(['linoy', 'word', 'scan', 'other']),
  topics: z.array(z.string()),
})

export const LectureIndexSchema = z.array(LectureSchema)

export type Lecture = z.infer<typeof LectureSchema>
export type LectureIndex = z.infer<typeof LectureIndexSchema>

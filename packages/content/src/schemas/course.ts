import { z } from 'zod'

export const SubjectSchema = z.object({
  slug: z.string(),
  title_he: z.string(),
  title_en: z.string(),
  topics: z.array(z.string()),
})

export const CourseSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, 'slug must be kebab-case'),
  title_he: z.string(),
  title_en: z.string(),
  institution: z.string(),
  institution_en: z.string(),
  course_code: z.string(),
  professor: z.string(),
  term: z.string(),
  exam_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'exam_date must be YYYY-MM-DD'),
  locale: z.enum(['he', 'en']),
  subjects: z.array(SubjectSchema).min(1),
})

export type Course = z.infer<typeof CourseSchema>
export type Subject = z.infer<typeof SubjectSchema>

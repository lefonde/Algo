import { readFileSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'
import {
  CourseSchema,
  PredictionsSchema,
  LectureIndexSchema,
  MamanIndexSchema,
  TestIndexSchema,
} from '@repo/content'

const CONTENT_ROOT = join(process.cwd(), 'content', 'courses')
let errors = 0

function validate(filePath: string, schema: { parse: (v: unknown) => unknown }) {
  if (!existsSync(filePath)) return
  try {
    const raw = JSON.parse(readFileSync(filePath, 'utf-8'))
    schema.parse(raw)
    console.log(`  ✅ ${filePath.replace(process.cwd(), '')}`)
  } catch (err) {
    console.error(`  ❌ ${filePath.replace(process.cwd(), '')}`)
    console.error(`     ${err instanceof Error ? err.message : String(err)}`)
    errors++
  }
}

const courses = readdirSync(CONTENT_ROOT, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)

for (const course of courses) {
  const base = join(CONTENT_ROOT, course)
  console.log(`\nCourse: ${course}`)
  validate(join(base, 'course.json'), CourseSchema)
  validate(join(base, 'predictions.json'), PredictionsSchema)
  validate(join(base, 'lectures', 'index.json'), LectureIndexSchema)
  validate(join(base, 'mamans', 'index.json'), MamanIndexSchema)
  validate(join(base, 'tests', 'index.json'), TestIndexSchema)
}

if (errors > 0) {
  console.error(`\n${errors} validation error(s). Fix before continuing.`)
  process.exit(1)
} else {
  console.log(`\nAll content valid.`)
}

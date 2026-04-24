import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { CourseSchema, type Course } from './schemas/course'
import { PredictionsSchema, type Predictions } from './schemas/predictions'
import { LectureIndexSchema, type LectureIndex } from './schemas/lectures'
import { MamanIndexSchema, type MamanIndex } from './schemas/mamans'
import { TestIndexSchema, type TestIndex } from './schemas/tests'

function contentRoot(): string {
  return join(process.cwd(), '..', '..', 'content', 'courses')
}

function readJson(path: string): unknown {
  return JSON.parse(readFileSync(path, 'utf-8'))
}

export function listCourseSlugs(): string[] {
  const root = contentRoot()
  if (!existsSync(root)) return []
  return readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
}

export function getCourse(slug: string): Course {
  return CourseSchema.parse(readJson(join(contentRoot(), slug, 'course.json')))
}

export function listCourses(): Course[] {
  return listCourseSlugs().map(getCourse)
}

export function getPredictions(slug: string): Predictions | null {
  const path = join(contentRoot(), slug, 'predictions.json')
  if (!existsSync(path)) return null
  return PredictionsSchema.parse(readJson(path))
}

export function getLectures(slug: string): LectureIndex {
  const path = join(contentRoot(), slug, 'lectures', 'index.json')
  if (!existsSync(path)) return []
  return LectureIndexSchema.parse(readJson(path))
}

export function getMamans(slug: string): MamanIndex {
  const path = join(contentRoot(), slug, 'mamans', 'index.json')
  if (!existsSync(path)) return []
  return MamanIndexSchema.parse(readJson(path))
}

export function getTests(slug: string): TestIndex {
  const path = join(contentRoot(), slug, 'tests', 'index.json')
  if (!existsSync(path)) return []
  return TestIndexSchema.parse(readJson(path))
}

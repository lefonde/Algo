# Content Model

## Directory Layout

```
content/courses/<slug>/
├── course.json
├── predictions.json
├── guide/
│   ├── index.mdx
│   ├── data-structures.mdx
│   ├── linear-programming.mdx
│   └── expander-graphs.mdx      (add more as needed per course)
├── lectures/
│   ├── index.json
│   └── pdfs/
├── mamans/
│   ├── index.json
│   └── pdfs/
├── tests/
│   ├── index.json
│   └── pdfs/
├── summaries/
├── textbooks/
│   └── pdfs/
└── ingest-inbox/
    └── whatsapp/
```

All `index.json` and `predictions.json` are Zod-validated by `pnpm validate-content`.

## course.json

```ts
{
  slug: string                // URL-safe, kebab-case
  title_he: string            // Hebrew title
  title_en: string            // English title
  institution: string
  institution_en: string
  course_code: string
  professor: string
  term: string                // e.g. "2025B"
  exam_date: string           // ISO date "YYYY-MM-DD"
  locale: "he" | "en"
  subjects: Array<{
    slug: string
    title_he: string
    title_en: string
    topics: string[]
  }>
}
```

## predictions.json

```ts
{
  course: string              // matches course slug
  generated_at: string        // ISO datetime
  exam_date: string
  scoring_version: string
  questions: Question[]
}

Question {
  id: string                  // e.g. "ds-1", "lp-9"
  subject: "data-structures" | "linear-programming" | "expander-graphs" | "mixed"
  prompt_md: string           // markdown + LaTeX ($...$)
  score: number               // 1–10
  points: 13 | 29             // exam point value
  sources: Array<{
    kind: "lecture" | "maman" | "past-exam" | "recent-exam" | "whatsapp-hint" | "sample-exam" | "textbook"
    ref: string               // relative path into content/courses/<slug>/ or free-text label
    weight: number            // from scoring-methodology.md
    quote?: string
  }>
  rationale_md: string        // markdown explanation including score changes
  trend?: {
    direction: "up" | "down"
    delta: number
    reason: string
  }
}
```

## lectures/index.json

```ts
Array<{
  number: number
  date: string                // ISO date
  title_he: string
  title_en?: string
  pdf: string                 // relative path in lectures/pdfs/
  source: "linoy" | "word" | "scan" | "other"
  topics: string[]
}>
```

## mamans/index.json

```ts
Array<{
  number: number              // e.g. 11, 12, 13, 14, 15
  due?: string                // ISO date
  topics: string[]
  partner?: string
  pdf: string                 // relative path in mamans/pdfs/
  grade?: number
}>
```

## tests/index.json

```ts
Array<{
  year: number                // e.g. 2025
  semester: "A" | "B"
  moed: "A" | "B"
  topics: string[]
  pdf: string                 // relative path in tests/pdfs/
  notes?: string
}>
```

## Naming conventions

- Never modify `predictions.json` by hand — always use `/recalc-predictions` skill or `exam-predictor` agent.
- `index.json` files may be edited directly or via `pdf-ingestor` agent after ingestion.
- MDX files may use `$...$` for inline math and `$$...$$` for display math (rendered via KaTeX).
- Images referenced in MDX must live in `public/courses/<slug>/` and use `/courses/<slug>/image.png` paths.

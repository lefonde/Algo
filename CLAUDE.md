# Study Aid

A multi-course study platform for exam prep, question prediction, and course material management. Built with Next.js 15, deployable to Vercel.

## Architecture

```
apps/web              → Next.js 15 (App Router, Tailwind CSS 4, React 19)
packages/ui           → Presentational components (RTL-aware, no data fetching)
packages/tokens       → Design tokens: colors, spacing, typography, breakpoints, radii
packages/shared       → Types, Zod schemas, scoring logic
packages/content      → Content loaders, MDX/JSON schemas, course data access
packages/ingest       → PDF OCR, WhatsApp classifier, metadata normalizer (local scripts)
content/courses/      → Course data (JSON + MDX, Git-versioned source of truth)
scripts/              → One-off migration and ingestion scripts
```

**Dependency direction**: apps → packages → content. Packages never depend on apps. `shared` never depends on `ui`.

**Content is the DB.** All course data lives in `content/courses/<slug>/`. No database for v1 — Zod-validated JSON + MDX, committed to Git, served statically. Vercel rebuilds on push.

## Commands

```bash
pnpm dev                    # Start all dev servers
pnpm build                  # Build all packages/apps
pnpm typecheck              # TypeScript check all
pnpm lint                   # Lint all
pnpm test                   # Run all tests
pnpm format                 # Format with Prettier
pnpm validate-content       # Zod-validate all content JSON
pnpm ingest                 # Run ingestion pipeline on inbox files
pnpm --filter @repo/web dev # Start only the web app
```

## Coding Standards

- **TypeScript**: strict mode, no `any` without comment justification
- **Components**: functional, named exports, props type co-located, extend native HTML attrs
- **Types**: `type` over `interface` unless extending. Derive TS types from Zod schemas
- **Validation**: Zod for all runtime validation, especially content JSON
- **Styling**: Tailwind CSS utility classes. All values from `@repo/tokens` — no magic numbers, no hardcoded hex
- **RTL**: Hebrew content uses `dir="rtl"`. Tailwind logical properties (`ps-*`, `pe-*`, `ms-*`, `me-*`). Mixed-direction inline text uses `<span dir="ltr">` for English terms inside Hebrew paragraphs
- **Imports order**: react → next → external libs → @repo/* packages → relative
- **No barrel re-exports** beyond package entry points

## File Naming

- Files: `kebab-case.ts(x)`
- Components: `PascalCase` (exported name)
- Functions/variables: `camelCase`
- Types/Schemas: `PascalCase`
- Content files: `kebab-case.json` / `kebab-case.mdx`

## Content Model

See `.claude/rules/content-model.md` for the full schema. Short version:

```
content/courses/<slug>/
├── course.json          # Course metadata (Zod: CourseSchema)
├── predictions.json     # Question prediction DB (Zod: PredictionsSchema)
├── guide/*.mdx          # Study guide, one file per subject
├── lectures/index.json  # Lecture index (Zod: LectureIndexSchema)
├── mamans/index.json    # Homework index (Zod: MamanIndexSchema)
├── tests/index.json     # Past exam index (Zod: TestIndexSchema)
├── textbooks/           # Course PDF books
└── ingest-inbox/        # Drop zone for new material
```

## Testing

- Unit tests: Vitest, colocated as `*.test.ts(x)`
- E2e tests: Playwright, in `apps/web/e2e/`
- Content validation: `pnpm validate-content` (runs on every content JSON write via hook)
- Test behavior, not implementation

## Design

Dark theme (background `#0f0f11`, cards `#1a1a1f`, accent purple `#6c63ff`, accent pink `#ff6b9d`). Fonts: Heebo/Rubik for Hebrew, Inter for Latin. Score color system: red (8-10 critical), orange (7 high), yellow (5-6 medium), gray (1-4 low). See `packages/tokens/src/index.ts`.

## PR Etiquette

- One concern per PR
- Descriptive commit messages
- Run `pnpm typecheck && pnpm lint && pnpm validate-content` before marking ready

## Agent Workflows

See `.claude/rules/` for full policies. Quick reference:

| Task | Skill | Agent |
|------|-------|-------|
| New course | `/new-course <slug>` | `course-scaffolder` |
| Ingest PDFs/photos | `/ingest [path]` | `pdf-ingestor` |
| Process WhatsApp dump | `/ingest-whatsapp <path>` | `whatsapp-categorizer` |
| Recalculate predictions | `/recalc-predictions <slug>` | `exam-predictor` |
| Summarize a lecture PDF | `/summarize-lecture <pdf>` | `guide-writer` |
| Update study guide | `/update-guide <slug>` | `guide-writer` |
| Review homework | `/review-maman <pdf>` | `maman-reviewer` |

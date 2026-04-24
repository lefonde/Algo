# Agent Handoff Protocol

## Ingestor → Predictor

When `pdf-ingestor` or `whatsapp-categorizer` finishes, they update `lectures/index.json`, `mamans/index.json`, or `whatsapp-index.json`. The `exam-predictor` agent consumes these to recalculate scores.

Handoff contract: ingestor MUST emit valid JSON before signaling completion. Run `pnpm validate-content` before finishing — if it fails, fix the JSON first.

## Predictor output contract

`exam-predictor` MUST:
1. Read existing `predictions.json` to capture old scores
2. Run `scoring.ts` logic over all indexed sources
3. Compute trend (up/down/unchanged) per question
4. Write updated `predictions.json`
5. Print a diff table to stdout:
   ```
   ID     | Old Score | New Score | Δ | Reason
   ds-1   |     9     |    10     | ↑ | appeared in 2025A
   lp-3   |     8     |     7     | ↓ | duality already tested in 2025A
   ```
6. Ask user to approve before committing

Never write `predictions.json` without printing the diff first.

## Guide Writer contract

`guide-writer` reads `predictions.json` + `lectures/index.json` to produce MDX. It MUST:
- Preserve existing section headers (do not rename them without user approval)
- Not delete existing content — append/update only unless explicitly told to rewrite
- Validate all relative links in MDX point to existing files in `content/`

## Course Scaffolder output

After `/new-course <slug>` runs, the following MUST exist and pass `pnpm validate-content`:
- `content/courses/<slug>/course.json` (user fills in metadata)
- `content/courses/<slug>/predictions.json` (empty questions array)
- `content/courses/<slug>/lectures/index.json` (empty array)
- `content/courses/<slug>/mamans/index.json` (empty array)
- `content/courses/<slug>/tests/index.json` (empty array)

The scaffolder also creates placeholder MDX files in `guide/`.

## Error propagation

If any agent encounters a Zod validation error during `pnpm validate-content`, it MUST:
1. Print the validation error with the file path and failing field
2. Fix the JSON (not skip validation)
3. Re-run `pnpm validate-content` to confirm the fix
4. Only then mark its task complete

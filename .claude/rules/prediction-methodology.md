# Prediction Methodology

## Scoring Weights (canonical — do not improvise)

These weights are encoded in `packages/shared/src/scoring.ts`. Agents MUST use that function; never compute scores ad-hoc.

| Signal | Weight | Description |
|--------|--------|-------------|
| `lecture` | 3.0 | Taught in lecture this semester |
| `maman` | 2.5 | Appeared in homework (ממן) |
| `past-exam` | 2.0 | Appeared in past exams (before most recent) |
| `recent-exam` | 3.0 | Appeared in most recent exam (2025A) |
| `whatsapp-hint` | 1.5 | Discussed/hinted by דימה or other reliable sources in WhatsApp |
| `sample-exam` | 2.0 | In the sample exam on the course website |
| `textbook` | 0.5 | In course textbook but not explicitly taught |

**Final score = min(10, sum(weights for each source that applies))**

Score bands:
- **8–10 Critical** — very likely on exam, study first
- **7 High** — strong signal, prioritize
- **5–6 Medium** — possible, cover if time allows
- **1–4 Low** — unlikely but not impossible

## Trend rules

When `/recalc-predictions` runs, it compares old score to new score:
- `trend.direction = "up"` if new score > old score (upgrade)
- `trend.direction = "down"` if new score < old score (downgrade)
- `trend.delta` = abs(new - old)
- `trend.reason` must explain the change (e.g. "appeared in both 2025A variants → recent-exam weight added")

If no trend exists (first run or no change), omit the `trend` field.

## Recency bias rule

When the most recent exam tests a specific question type, **downgrade** the probability that the exact same question reappears in the next exam. Add a rationale note like:
> "2025A tested Decrease-Key in both variants. Asaf rarely repeats verbatim. Downgraded from 7→5."

## Evidence citation rule

Every prediction question must have at least one source. A question with no sources cannot have a score above 3.

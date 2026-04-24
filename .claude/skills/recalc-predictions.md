---
name: recalc-predictions
description: Recalculates exam question predictions for a course by re-scoring all evidence with scoring.ts. Prints a diff table before writing. Requires user approval before committing predictions.json.
---

<command-context>
The user wants to refresh the exam question predictions for a course.
</command-context>

## Steps

1. Determine target course from args (e.g. `/recalc-predictions advanced-algorithms`). If not provided, list available courses and ask.

2. Spawn `exam-predictor` with the course slug.

3. The predictor will:
   - Load all source indexes
   - Re-score every question using `packages/shared/src/scoring.ts` weights
   - Print a diff table
   - Ask for approval

4. After approval and write, confirm:
   ```
   ✅ predictions.json updated for advanced-algorithms
   24 questions scored. 3 upgraded, 2 downgraded, 19 unchanged.
   
   Top 5 predictions:
   ds-2  | Extract-Min amortized   | 10/10 ⬆️
   ds-1  | D(n) = O(log n) proof   | 10/10  
   lp-9  | LP formulation + dual   | 10/10
   ...
   ```

5. Remind user to run `pnpm build` or push to Vercel to publish updated predictions.

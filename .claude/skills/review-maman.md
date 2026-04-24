---
name: review-maman
description: Reviews a student's submitted homework PDF against course material. Gives advisory feedback — correctness hints, missing cases, clarity suggestions. No grading; advisory only.
---

<command-context>
The user wants feedback on a homework submission.
</command-context>

## Steps

1. Get the PDF path from args (e.g. `/review-maman mamans/pdfs/maman-16.pdf`). If not provided, list `mamans/pdfs/` and ask.

2. Determine the course from context or ask.

3. Spawn `maman-reviewer` agent with the PDF path and course slug.

4. The reviewer produces a per-question feedback report. Print it directly.

5. Offer to save the review:
   ```
   Save review to mamans/reviews/maman-16-review.md? (yes/no)
   ```

Note: This is advisory feedback only. The reviewer will hint at issues without providing full solutions.

---
name: update-guide
description: Regenerates or updates MDX study guide files for a course (or specific subject) from predictions.json and lecture indexes. Preserves existing sections.
---

<command-context>
The user wants to refresh the study guide content.
</command-context>

## Steps

1. Determine course slug from args. Optionally a subject (e.g. `/update-guide advanced-algorithms data-structures`).

2. Spawn `guide-writer` agent with:
   - Course slug
   - Subject filter (if provided)
   - Instruction: update existing MDX, preserve section headers

3. After update, confirm:
   ```
   ✅ Updated guide/data-structures.mdx
   - 3 prediction score annotations updated
   - 1 new section added: "Splay Trees — Access Lemma"
   - 0 sections removed
   ```

4. Remind user to push to trigger Vercel rebuild.

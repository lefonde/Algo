---
name: ingest
description: Runs the PDF ingestion pipeline on ingest-inbox/ (or a given path). OCRs, classifies, and indexes new files into the course content directories.
---

<command-context>
The user wants to ingest new files into the course content.
</command-context>

## Steps

1. Determine target:
   - If an argument was provided (e.g. `/ingest content/courses/advanced-algorithms/ingest-inbox/`), use that path
   - Otherwise, scan all `content/courses/*/ingest-inbox/` directories for new files

2. Report what's found:
   ```
   Found 5 new files in advanced-algorithms/ingest-inbox/
   ```

3. Spawn the `pdf-ingestor` agent with the target path.

4. After ingestion, remind the user:
   - Run `/recalc-predictions <slug>` if new mamans, lectures, or exams were added
   - Review any `unknown` category files manually

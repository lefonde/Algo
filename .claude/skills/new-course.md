---
name: new-course
description: Scaffolds a new course under content/courses/<slug>/. Creates course.json, empty index files, placeholder MDX guides, and validates the skeleton with pnpm validate-content.
---

<command-context>
The user wants to create a new course in the study platform.
</command-context>

You are setting up a new course scaffold.

## Steps

1. Parse the args for `<slug>` and optionally `<title_he>`. If missing, ask the user:
   - Course slug (e.g. "linear-algebra")
   - Hebrew title
   - English title
   - Subject list (names of main exam subjects)

2. Spawn the `course-scaffolder` agent with the collected metadata.

3. After scaffolding completes, print:
   ```
   ✅ Course created: content/courses/<slug>/
   
   Next steps:
   1. Open course.json and fill in professor, term, exam_date
   2. Drop course PDFs into ingest-inbox/ and run /ingest
   3. Run /recalc-predictions <slug> once you have source evidence
   ```

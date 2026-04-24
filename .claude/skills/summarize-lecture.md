---
name: summarize-lecture
description: Extracts key content from a lecture PDF and produces an MDX summary snippet, including definitions, theorems, proofs, and prediction links.
---

<command-context>
The user wants to create a study summary from a lecture PDF.
</command-context>

## Steps

1. Determine the PDF path from args. If not provided, list `lectures/pdfs/` and ask.

2. Extract text via `pdftotext -layout <file> -` (Bash). For scanned PDFs, use `tesseract`.

3. Have `guide-writer` agent produce an MDX snippet with:
   - Section heading with lecture number and date
   - Key definitions (as `<dl>` or callout blocks)
   - Key theorems and proofs (with LaTeX math)
   - Connections to predictions (e.g. "This covers Question ds-1 — Score 10/10")

4. Offer to append the snippet to the relevant guide MDX file:
   ```
   Generated summary for Lecture 5 (Data Structures — Fibonacci Heap).
   
   Append to guide/data-structures.mdx? (yes/no)
   ```

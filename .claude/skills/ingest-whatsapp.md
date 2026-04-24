---
name: ingest-whatsapp
description: Categorizes a WhatsApp chat export using vision + OCR. Emits whatsapp-index.json for user review. Does not move files until user approves.
---

<command-context>
The user wants to process a WhatsApp dump from a study group chat.
</command-context>

## Steps

1. Determine the source folder from args (e.g. `ingest-inbox/whatsapp/`). If not provided, default to `content/courses/advanced-algorithms/ingest-inbox/whatsapp/`.

2. Spawn the `whatsapp-categorizer` agent against that folder.

3. After `whatsapp-index.json` is written, summarize:
   ```
   Categorized 211 files:
   - 89 whiteboard-note
   - 12 exam-hint
   - 94 photo-other
   - 16 duplicate
   
   Suggested prediction links found for 23 files.
   Review whatsapp-index.json then run /ingest to move categorized files.
   ```

4. Ask: "Ready to move the categorized files into their final locations? (yes/no)"
   - If yes: spawn `pdf-ingestor` with the approved categories from `whatsapp-index.json`
   - If no: leave files in place for manual review

# Ingestion Pipeline

## Drop Zone

New files go into `content/courses/<slug>/ingest-inbox/`. The `/ingest [path]` skill runs `pdf-ingestor` against that inbox.

WhatsApp exports go into `content/courses/<slug>/ingest-inbox/whatsapp/` and are processed by `whatsapp-categorizer`.

## pdf-ingestor behavior

1. **Detect file type**: PDF → `pdftotext`; scanned PDF or JPG → `tesseract` with Hebrew+English traineddata
2. **Classify**: based on extracted text + filename, determine category: `lecture | maman | test | summary | textbook | unknown`
3. **Deduplicate**: check for existing file with same or similar name in target folder before moving
4. **Move + index**: move file to `<category>/pdfs/`, append entry to `<category>/index.json`
5. **Report**: print a table of what was classified + any `unknown` files needing manual review

### Lecture deduplication (linoy/ vs word/)

The Advanced Algorithms course has two parallel sets of lecture PDFs (linoy/ and word/ naming schemes). When deduplicating:
- Prefer the longer/cleaner file (fewer scan artifacts)
- Keep both if they differ substantially (different pages, different quality)
- Record both paths under `notes` in `lectures/index.json`

### Maman naming pattern

Hebrew mamans follow: `ממן [number] - [student name] - [ID] - [partner] - [ID].pdf`
Extract: `number` (integer), `partner` name (if present).

### Test naming pattern

Old tests: `YYYY[A|B|_moed[A|B]].pdf` or Hebrew dates. Extract: `year`, `semester` (A/B), `moed` (A/B) where possible.

## whatsapp-categorizer behavior

1. Walk all files in `ingest-inbox/whatsapp/`
2. For each JPG: use Claude vision (Read tool on image) to determine content:
   - `whiteboard-note` — mathematical notation, proofs, algorithms
   - `exam-hint` — references to exam topics, "going to test X"
   - `photo-other` — selfies, food, unrelated
   - `duplicate` — same content as existing file
3. For PDFs in the dump: classify as lecture/maman/test/other
4. Emit `ingest-inbox/whatsapp/whatsapp-index.json` with one entry per file:
   ```json
   { "file": "filename.jpg", "category": "whiteboard-note", "ocr_excerpt": "...", "suggested_prediction_links": ["ds-1", "lp-9"] }
   ```
5. Do NOT move files — user reviews `whatsapp-index.json` and approves before `/ingest-whatsapp` commits changes

## OCR strategy

- `pdftotext -layout <file>.pdf` — works for text PDFs; output is plain text
- `tesseract <file>.{jpg,png} stdout -l heb+eng` — for scanned docs and photos
- If OCR confidence is low (output is garbled or under 20 chars), flag as `low-confidence` and skip auto-classification
- For messy whiteboard photos: use Claude's vision (Read the image file directly) to extract mathematical content

## Validation after ingestion

After every ingestion run, `pnpm validate-content` must pass. If it fails due to a malformed `index.json`, the agent must fix the JSON before finishing.

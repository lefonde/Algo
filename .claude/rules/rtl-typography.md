# RTL & Hebrew Typography

## HTML/JSX directionality

- Set `dir="rtl"` on `<html>` when `course.locale === "he"`. Done in `apps/web/src/app/[slug]/layout.tsx`.
- **Never** set `dir="ltr"` on a container with predominantly Hebrew text (this was the bug in the old study_guide/index.html).
- For English terms embedded in Hebrew sentences, wrap in `<span dir="ltr">`. Example:
  ```jsx
  <p dir="rtl">הגדרה של <span dir="ltr">Fibonacci Heap</span> לפי הרצאה 1.</p>
  ```
- Chat excerpts with Hebrew sender names + Hebrew text: `<blockquote dir="rtl">`.

## Fonts

```css
/* Hebrew-primary content */
font-family: Heebo, Rubik, ui-sans-serif, system-ui, sans-serif;

/* English/mixed content */
font-family: Inter, ui-sans-serif, system-ui, sans-serif;

/* Code / math formulas */
font-family: "JetBrains Mono", ui-monospace, monospace;
```

Load Heebo + Inter from Google Fonts in `apps/web/src/app/layout.tsx`.

## Tailwind logical properties

Use logical properties instead of directional ones so RTL flips automatically:

| Avoid | Use instead |
|-------|-------------|
| `pl-4` | `ps-4` (padding-inline-start) |
| `pr-4` | `pe-4` (padding-inline-end) |
| `ml-4` | `ms-4` (margin-inline-start) |
| `mr-4` | `me-4` (margin-inline-end) |
| `text-left` | `text-start` |
| `text-right` | `text-end` |
| `border-l` | `border-s` |
| `rounded-l` | `rounded-s` |

Exception: `left-0 / right-0` for absolute positioning overlays that should not flip — these are fine to keep.

## Math expressions

LaTeX in Hebrew text stays LTR inside the math environment — KaTeX handles this automatically. No special wrapping needed for `$...$` spans.

## Score badges and number formatting

Hebrew reads RTL but numbers remain LTR. Never wrap numbers in RTL containers without `<span dir="ltr">`:
```jsx
<span dir="rtl">ציון: <span dir="ltr">9.5</span></span>
```

## Component responsibility

- `packages/ui` components must be direction-agnostic: use logical properties, accept `dir` prop from parent.
- The `<html dir>` is set by the course layout, not by individual components.
- Never hardcode `dir` on a component unless it's always a specific direction (e.g., a math block that's always LTR).

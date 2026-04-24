# Component Patterns

## File Structure

```
packages/ui/src/components/prediction-row/
  prediction-row.tsx     # Component implementation
  prediction-row.test.tsx
```

## Props Pattern

```tsx
type PredictionRowProps = {
  question: Question
  expanded?: boolean
  onToggle?: () => void
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>
```

- Always extend native HTML attributes where applicable
- Use `type` not `interface` for props
- Sensible defaults for optional props
- Union types for constrained values, not `string`

## Styling

- Tailwind utility classes only — no inline `style` prop except for CSS custom properties
- All values from `@repo/tokens` — no hardcoded hex colors or px values
- Logical properties for anything that should flip in RTL: `ps-*`, `pe-*`, `ms-*`, `me-*`, `text-start`, `text-end`
- Transitions: use `transitions.fast` (150ms) for hover, `transitions.normal` (200ms) for layout

## Key Components

### ScoreBadge

```tsx
type ScoreBadgeProps = { score: number } & React.HTMLAttributes<HTMLSpanElement>
// Renders colored badge: red 8-10, orange 7, yellow 5-6, gray 1-4
// Uses scoreColors from @repo/tokens
```

### SubjectTag

```tsx
type SubjectTagProps = { subject: 'data-structures' | 'linear-programming' | 'expander-graphs' | 'mixed' }
// Renders a pill with subject color from @repo/tokens subjectColors
```

### PredictionRow

```tsx
type PredictionRowProps = {
  question: Question          // from @repo/content schemas
  expanded?: boolean
  onToggle?: () => void
}
// Collapsed: score badge + subject tag + truncated prompt
// Expanded: full prompt (with math), rationale, source list with links, trend indicator
```

### Card

```tsx
type CardProps = {
  variant?: 'default' | 'elevated' | 'bordered'
  children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>
// Background: surface.card (#1a1a1f), border: surface.border (#2a2a35)
```

## Accessibility Baseline

- Semantic HTML (`button` for interactive, `article` for content cards)
- ARIA labels on icon-only buttons
- Focus ring: visible, using `ring-2 ring-primary-500 ring-offset-2 ring-offset-surface-dark`
- Score badges: include `aria-label` with score value (e.g., `aria-label="Score: 9 (Critical)"`)
- Expanded/collapsed sections: use `aria-expanded` on the toggle button

## Math Rendering

All components that render `prompt_md` or `rationale_md` must pipe through a KaTeX renderer. Use `react-katex` or a custom `MathBlock` wrapper. Never render raw LaTeX strings without processing.

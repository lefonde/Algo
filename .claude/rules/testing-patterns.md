# Testing Patterns

## Unit Tests (Vitest)

- Colocate: `prediction-row.test.tsx` next to `prediction-row.tsx`
- Use `@testing-library/react` for component tests
- Prefer `getByRole`, `getByLabelText` over `getByTestId`
- Test behavior (what the user sees), not implementation (state shape, private methods)

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { ScoreBadge } from './score-badge'

describe('ScoreBadge', () => {
  it('labels a score of 9 as critical', () => {
    render(<ScoreBadge score={9} />)
    expect(screen.getByRole('status', { name: /score: 9.*critical/i })).toBeTruthy()
  })
})
```

## Content Validation Tests

`scripts/validate-content.ts` is the primary content correctness check. It runs Zod against every `*.json` in `content/courses/`. This is wired to the PostToolUse hook on content JSON writes.

Run manually: `pnpm validate-content`

## E2e Tests (Playwright)

Located in `apps/web/e2e/`. Snapshot the predictions page and guide page per course.

```ts
// apps/web/e2e/predictions.spec.ts
test('advanced-algorithms predictions page renders at desktop', async ({ page }) => {
  await page.goto('/advanced-algorithms/predictions')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.locator('[data-testid="prediction-row"]').first()).toBeVisible()
})
```

Priority test targets:
- `/` — course grid renders all courses
- `/<slug>/predictions` — prediction table loads, filters work, expand/collapse works
- `/<slug>/guide` — MDX renders with math, RTL text displays correctly
- Mobile viewport (375px): nav collapses, prediction rows wrap correctly
- RTL: Hebrew content has `dir="rtl"` on the html element

## What NOT to Test

- Exact CSS class names or colors
- Internal state shape
- Third-party library internals (KaTeX, Next.js router)
- Snapshot tests on dynamic content (predictions change)

# Portfolio 2026 — Duminda M

Personal portfolio. **[`plan.md`](./plan.md) is the source of truth** — read it
before making decisions. This README only covers how to run the thing.

## Getting started

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

| Script           | What it does                         |
| ---------------- | ------------------------------------ |
| `pnpm dev`       | Dev server                           |
| `pnpm build`     | Production build                     |
| `pnpm typecheck` | `tsc --noEmit` — separate from build |
| `pnpm lint`      | ESLint                               |
| `pnpm format`    | Prettier (sorts Tailwind classes)    |

## Where things are

```
content/          Project + experiment data (Phase 1)
src/app/          Routes
src/components/   primitives · media · cursor · layout · sections
src/hooks/        usePrefersReducedMotion, useIsTouch, useMediaQuery
src/lib/content/  ⚠️ THE CMS SEAM — see plan.md §5
src/lib/utils/    cn()
src/styles/       tokens.css (the design system) · fonts.css
```

**Two architectural rules**, both from `plan.md`:

1. **No component imports from `content/` directly.** Everything goes through
   `src/lib/content/`. This is what makes a later CMS migration a one-file
   change instead of a refactor.
2. **No hardcoded colour, size, or spacing in any component.** Tokens are
   defined once in `src/styles/tokens.css` and become both CSS custom
   properties and Tailwind utilities.

## `/tokens`

A dev-only route rendering every colour, type size, spacing step, duration, and
radius in the system — plus a **live WCAG contrast audit** that recomputes from
the token values rather than trusting a table. It 404s in production.

Two rules from that audit are load-bearing and easy to get wrong:

- **Blue text on the grey page must be `brand-700` (#1035BF), not `brand-500`.**
  The accent blue fails AA at body size on grey (3.62:1); the deep blue passes
  (5.90:1). `brand-500` is for media fills and accent type on white.
- **`ink-muted` is a paper-only colour.** On the grey page it is exactly 3.00:1
  — large text only. Muted captions belong inside the white container.

## Status

**Phase 0 (Foundation) is complete.** Tokens, hooks, `cn()`, directory
structure, `/tokens` audit route, and a homepage skeleton standing up the
video-band → overlapping-white-container → footer-on-grey structure.

Next: Phase 1 (content layer — zod schemas + `lib/content/local.ts`). See
`plan.md` §12 for the full phase list and acceptance criteria.

### Known gaps

- **Fonts are not installed.** The display/body faces are still an open question
  (`plan.md` §13.3). The stack falls through to `system-ui` until the real family
  is confirmed. Activation steps are in `src/styles/fonts.css`.
- **Hero band height and container overlap are estimates** — `min(60vh, 720px)`
  and `56px`. Both tokenised, so confirming them is a one-line edit.
- `metadataBase` in `src/app/layout.tsx` is a placeholder domain.

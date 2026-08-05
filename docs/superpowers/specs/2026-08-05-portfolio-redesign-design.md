# Portfolio Redesign — Monochrome, 21st.dev-referenced

Date: 2026-08-05
Status: approved

## Goal

Rebuild the design layer of Joanne Chen's portfolio referencing https://21st.dev/: clean,
light-dominant with a real dark mode, and motion that is concentrated and reactive rather
than ambient. Content, routes, data fetching and Admin logic are unchanged.

## Decisions

| Question | Decision |
|---|---|
| Scope | Full rebuild of the design layer. Retire the kinetic/liquid-glass CSS and ambient backgrounds; rebuild tokens, primitives and page markup. Content and data logic untouched. |
| Motion | "Precise & earned". Page is still at rest; no ambient background effects. Motion is concentrated and reactive. |
| Palette | Full monochrome. No chromatic accent. |
| Typography | Onest workhorse + Noto Sans TC for Hanzi + Instrument Serif italic for one emphasis word per headline. |

## Pre-existing defects found during exploration

1. `index.html` loads **Host Grotesk**, but `index.css` declares **Onest**. Onest has never
   loaded; type has been falling back to system sans. Fixed as part of this work.
2. `matter-js`, `@mui/material`, `@emotion/react`, `@emotion/styled` are in
   `frontend/package.json` but imported nowhere. Removed.

## Token layer

`variables.css` is rewritten as a monochrome scale. Removed: `--mint`, `--gold`,
`--accent` as a hue, `--accent-dark`, `--accent-soft`, and all `--signal-*` tokens.

```
                 LIGHT          DARK
--bg             #fcfcfc        #0a0a0a
--surface        #ffffff        #121213
--surface-soft   #f5f5f4        #1a1a1b
--text           #0a0a0a        #fafaf9
--text-muted     #71717a        #8a8a8f
--border         #e7e7e4        #232326
--border-strong  #d0d0cb        #35353a
--fg-invert      #ffffff        #0a0a0a
```

Emphasis is carried by weight, size, contrast and the serif italic — never hue. Focus rings
become a 2px `--text` outline with offset, which is higher contrast than the previous rust
ring in both themes.

Added scales so motion and shape stay consistent across components rather than being
guessed per component: `--radius-*`, `--dur-*`, `--ease-*`.

Theming keeps the existing mechanism: `data-theme` on `<html>`, persisted to
`localStorage`, seeded from `prefers-color-scheme`. Both the `@media (prefers-color-scheme: dark)`
block and the `:root[data-theme='dark']` block are maintained so the toggle wins in both
directions.

## Typography

Loaded fonts become Onest, Noto Sans TC, Instrument Serif (italic).

- Display: `clamp(2.75rem, 7vw, 5rem)`, tracking `-0.03em`
- Section: `clamp(1.75rem, 3.5vw, 2.75rem)`
- Body: `1rem / 1.65`
- Label: `0.75rem`, uppercase, tracking `0.14em`

One emphasis word per headline is set in Instrument Serif italic, optically size-matched to
the surrounding sans. This is load-bearing given there is no accent color.

## Primitives

New `frontend/src/components/ui/`:

`Container`, `SectionHeader`, `Card`, `Button`, `Tag`, `Reveal`, `SplitText`, `Spotlight`,
`ThemeToggle`.

`ThemeToggle` is extracted from `Essentials.tsx`, which currently inlines the same toggle
markup twice (mobile and desktop). Every page composes from these primitives so the
retired `index.css` does not grow a successor.

## Motion

All effects gated behind a single `useReducedMotion` hook.

| Where | What |
|---|---|
| Hero | words fade + rise, 40ms stagger; serif word settles last |
| Cards | `-2px` lift, border to `--border-strong`, pointer-tracked spotlight |
| Nav | active-item underline slides between items |
| Scroll | 1px progress hairline pinned to viewport top |
| Sections | IntersectionObserver reveal — existing `App.tsx` logic retained |
| Routes | View Transitions API fade + 8px rise; no-op where unsupported |

Retired: `MotionBackground.tsx`, `StarBackground.tsx`, and the `liquid-glass-field` /
`trionn-flow` / `liquid-lens` hero decoration.

## Pages

**Home** — hero (type only: eyebrow, headline with serif emphasis, Hanzi line, short intro,
two buttons) → About → Selected work (2-col cards, real project images) → Education →
Experience → SkillMap → Contact.

Education and Experience stay distinct sections per `PRODUCT.md`, rendered as
hairline-ruled timelines rather than cards, so they read as trajectory instead of another
card grid. This replaces the current combined "Trajectory" section.

**Projects / Article / Travel / Traveled / Post** — same primitives, `MotionBackground`
removed. `Post` gets a ~68ch reading measure.

**Admin** — tokens only, no layout rework. It is internal tooling.

## SkillMap regrade

The one place monochrome genuinely costs something: category currently reads by hue.
Re-encoded as fill lightness step + stroke weight + node radius, with link opacity carrying
strength. d3-force and d3-drag behavior is unchanged. Labels must stay legible in both
themes.

Flagged as the most likely piece to need a second pass once reviewed live.

## Cleanup

- Delete `MotionBackground.tsx`, `StarBackground.tsx`
- Drop `matter-js`, `@mui/material`, `@emotion/react`, `@emotion/styled`
- Split `index.css` (currently 6,599 lines) into `styles/tokens.css`, `styles/base.css`,
  `styles/motion.css`; `index.css` shrinks to imports plus Tailwind
- Delete `kinetic-*`, `liquid-*`, `trionn-*`, `signal-*` rules as each page migrates, then
  grep-sweep for orphaned class names

## Accessibility

Per `PRODUCT.md`: honor `prefers-reduced-motion` on every effect, keep contrast readable in
both themes, keep text inside containers at mobile and desktop widths, preserve keyboard
navigation and visible focus states.

Monochrome raises rather than lowers text contrast. The risk it introduces is that any
information previously encoded only by color must be re-encoded — the SkillMap regrade is
the concrete instance of that.

## Verification

`npm run build` and `npm run lint` clean; both themes and reduced-motion checked by hand.

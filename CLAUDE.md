# CLAUDE.md — NordPush

Guidance for Claude Code when working in this repository.

## Design system

**This project uses the Revolut-inspired design system documented in [`DESIGN.md`](./DESIGN.md).**
`DESIGN.md` is authoritative for the entire app — marketing pages, service pages, blog, author profiles, legal pages, and any future surfaces. When adding or changing UI, consult `DESIGN.md` and match its tokens, component styles, and principles.

### Non-negotiables
- **Typography**: Aeonik Pro weight **500** for all headings (never bold). Inter for body at 16px with positive letter-spacing (`0.16px`–`0.24px`).
- **Palette**: near-black `#191c1f` + pure white `#ffffff` + light surface `#f4f4f4`. Semantic colors (`--rui-blue`, `--rui-teal`, `--rui-danger`, etc.) are reserved for the product interface, not marketing surfaces.
- **Buttons**: universal **pill shape** (`--radius-pill` = 9999px) with generous padding `14px 32px`. Variants: `.button.primary` (dark), `.button` (light), `.button.outlined`, `.on-dark .button` (ghost).
- **Elevation**: **zero shadows**. Depth comes from dark/light surface contrast and generous whitespace only.
- **Card radius**: 20px (`--radius-card`). Small surfaces: 12px (`--radius-sm`).
- **Spacing**: 8px grid. Large sections use `80px`–`120px` of vertical padding (`var(--space-20)` / `var(--space-30)`).

### Design tokens
All tokens live in `src/app/globals.css` under `:root`. Use the `--rui-*` custom properties — don't hardcode colors, radii, or font stacks in components.

### When making UI changes
1. Read `DESIGN.md` first; it covers do's/don'ts, typography scale, responsive breakpoints, and example component prompts.
2. Use existing CSS classes in `globals.css` where possible; extend there rather than adding inline styles.
3. If a new pattern is needed, add it to `globals.css` using the `--rui-*` tokens so it stays consistent.
4. Never introduce shadows (`box-shadow` beyond `var(--focus-ring)`), bold display weights (700), or sub-pill button radii.

## Tech stack
- Next.js 15 (App Router) + React 19 + TypeScript 5
- Vanilla CSS with custom properties (no Tailwind, no shadcn, no Framer Motion)
- Fonts: Inter + JetBrains Mono via `next/font/google`; Aeonik Pro declared with Inter fallback

## Project layout
- `src/app/` — routes (homepage, services, blog, author, category, legal)
- `src/components/` — shared components (header, footer, hero, cards, FAQ, etc.)
- `src/app/globals.css` — all design tokens and component styles
- `DESIGN.md` — design system spec (authoritative)

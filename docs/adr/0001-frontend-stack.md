# ADR 0001: Frontend Stack — Tailwind CSS v4 + shadcn/ui + motion

**Date:** 2026-06-21
**Status:** Accepted

## Context

The Slice 1 backend (FastAPI + SQLite) is complete. Slice 2 needs a React frontend. The excalidraw design shows a dashboard with sidebar, habit list, check-in flow, streak display, and eventually analytics.

The user wants a "unique and very beautiful" UI that doesn't look like generic AI-generated design.

## Decision

Use the following frontend stack:

- **React 19** (already scaffolded via Vite)
- **Tailwind CSS v4** — utility-first CSS framework, latest version
- **shadcn/ui** — unstyled, Radix-based component primitives (buttons, dialogs, inputs, etc.) with full theme customization
- **motion** (from motion.dev) — animation library for check-in feedback, page transitions, streak reveals

## Alternatives Considered

| Stack | Why Rejected |
|-------|-------------|
| MUI / Material UI | Too opinionated visually; hard to make it look unique |
| Chakra UI | Good DX but heavier, CSS-in-JS perf overhead |
| Plain CSS Modules | No design system scaffolding; too much manual work |
| Ant Design | Enterprise look, hard to customize to dark cinematic theme |

## Rationale

- Tailwind v4 + shadcn give maximum visual freedom while providing accessible primitives
- shadcn is copy-paste, not a dependency — full control over every component
- motion is the successor to Framer Motion, purpose-built for React animations
- The stack plays well with `impeccable` skill for premium design output
- Dark theme + green accent (motion.dev-inspired) is easy to express in Tailwind's OKLCH color system

## Consequences

- Need to switch project from JSX to TSX (components are TypeScript-first)
- shadcn init will scaffold components into `src/components/ui/`
- Tailwind's `darkMode: 'class'` will handle the system-preference dark theme
- motion replaces any manual CSS transition complexity

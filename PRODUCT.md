# Product

## Register

product

## Users

Adam (the builder and primary user) — learning full-stack development through building a real, usable habit tracker. Secondary users are anyone who wants a clean, no-fuss habit tracker.

**Context:** At their desk, in a terminal or browser, managing daily/weekly habits. The app is both a learning project and a tool they'd actually use.

**Job to be done:** Check in on habits quickly, see what's due today, track streaks, build consistency.

## Product Purpose

A habit tracker that's beautiful, fast, and minimal — not another bloated productivity app. It exists to help Adam learn full-stack architecture (Python/FastAPI backend + React frontend) while producing something genuinely nice to use.

Success: a shippable, usable habit tracker with a dark cinematic UI, smooth animations, and a clean workflow.

## Brand Personality

Sharp · Cinematic · Dev-tool

Inspired by motion.dev's aesthetic: dark theme, bold typography, green accent, terminal/developer-tool energy. The app feels like a premium dev tool — precise, fast, and beautiful — but applied to personal habit tracking.

**Voice:** Direct, minimal, confident. No gamification fluff, no notifications spam. It shows you your habits and gets out of your way.

## Anti-references

- Generic SaaS / corporate dashboards (no boring tables, no blue-and-white, no enterprise-gray)
- Overly gamified apps (no Habitica-style pixel art, no cartoon rewards)
- Social media feed patterns (no infinite scroll, no like/comment)

## Design Principles

1. **Dark first, system-aware** — The default is a cinematic dark theme; light mode exists but is secondary. Respects `prefers-color-scheme`.
2. **Motion with purpose** — Animations serve the interaction (check-in feedback, page transitions), not decoration. Every animation has a `prefers-reduced-motion` fallback.
3. **Terminal precision** — Monospace for data/code, clean sans for UI. Tight spacing, high information density when needed, generous whitespace when not.
4. **Visible state** — Every habit's status (due, done, skipped, loading) is immediately readable. No hover-to-reveal critical info.
5. **Practice what you build** — The codebase is as clean as the UI. TypeScript, linted, tested, committed per feature.

## Accessibility & Inclusion

WCAG AA standard:
- Body text ≥4.5:1 contrast
- Keyboard-navigable (all interactions work without mouse)
- `prefers-reduced-motion` respected — animations degrade to instant transitions
- Focus indicators visible in dark and light themes

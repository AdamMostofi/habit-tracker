# ADR 0002: Migrate Frontend from JavaScript to TypeScript

**Date:** 2026-06-21
**Status:** Accepted

## Context

The Vite scaffold was generated as `.jsx`/`.js`. The chosen shadcn/ui library is TypeScript-first (all components export typed props). The backend's Pydantic schemas have a natural mapping to TypeScript interfaces.

## Decision

Migrate the entire frontend to TypeScript:
- Rename all `.jsx` → `.tsx`, `.js` → `.ts`
- Install `typescript`, `@types/react`, `@types/react-dom`
- Configure `tsconfig.json` for strict mode
- Use `tsx` for all new components going forward

## Alternatives Considered

- **Stay JSX**: Simpler setup, no compile step. But fighting shadcn's type system, losing IDE autocomplete for component props.
- **JSDoc types**: Migration path without renaming files. But tooling support is weaker, and every shadcn paste needs manual JSDoc wrappers.

## Rationale

- shadcn components are authored in TypeScript — importing them into `.jsx` works but loses all type safety
- API response shapes (habits, logs, users) map 1:1 to TypeScript interfaces
- Catches data-shape mismatches between frontend and backend at compile time
- The user explicitly wants production-quality code; TypeScript is the standard

## Consequences

- Rename ~6 files on setup
- ~15 minutes of config overhead (tsconfig, package.json, vite.config)
- All future components will be `.tsx`
- Strict mode may surface type issues early, but that's a feature, not a bug

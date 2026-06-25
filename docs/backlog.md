# Backlog — Memory Bank

> Things to do later, logged with context so we can pick up without re-exploration.
> See also: `docs/ideas.md` for long-term design ideas (Streak Fire, drag-to-reorder, etc.)

---

## ✅ Completed

| Issue | What |
|-------|------|
| #1 | Server-side input validation — `Field` constraints + `Literal` on frequency/status |
| #4 | Strip user concept — deleted User/UserHabit models, users router, user_id from everything |
| #7 | FK cascade deletes — `ondelete="CASCADE"` on HabitLog.hid + PRAGMA foreign_keys |
| #8 | Config env vars — `VITE_API_BASE`, `DATABASE_URL`, `.env.example`, `.gitignore` |

---

## ⏸️ Skipped (YAGNI for dev-only app)

| Issue | Reason |
|-------|--------|
| #2 — Rate limiting (slowapi) | Localhost-only app. No public deployment, no auth, no attack surface. Add if/when deployed. |
| #3 — Exception handler (error leakage) | Pydantic 422 details are development-useful, not sensitive (field names/types only). Frontend garbles them anyway via `res.text()` → `toast.error()`. |

---

## ⏳ Pending

### 1. Terminal Empty States (Issue #5)

**Replace** basic text-and-link empty states with cinematic terminal-themed SVGs.

| Page | Current state | File |
|------|---------------|------|
| TodayView | Plain icon (`ListChecks`) + "No habits yet" + CTA link | `TodayView.tsx` |
| HabitsList | Plain text "No habits yet" + CTA link | `HabitsList.tsx` |
| Analytics | Plain icon (`BarChart3`) + "Create some habits to see analytics" | `Analytics.tsx` |
| HabitDetail (logs) | Plain text "No check-ins yet" | `HabitDetail.tsx` |

**Concept:** Terminal window motifs — `$ ./habits --list` → `ERROR: no habits found`, blinking cursor, brand colors via `currentColor`.

**Implementation notes:**
- Inline SVG `viewBox`, no external assets
- `motion` for subtle blink/pulse on cursor elements
- `role="img"` + `aria-label` for accessibility
- Respect `prefers-reduced-motion`
- Wire into existing `isEmpty`/`isError` branches — no structural changes

---

### 2. Keyboard Shortcuts (Issue #6)

**Phase 1 — Page-level:**
- `ESC` on detail/create/edit pages → navigate back

**Phase 2 — Global:**
- `n` → `/habits/new`
- `1`/`2`/`3` → switch Today / All Habits / Analytics tabs
- `j`/`k` → navigate between habit cards in list

**Implementation notes:**
- `useEffect` with `keydown` listener, cleanup on unmount
- Don't override native browser shortcuts (Cmd+N, etc.)
- Consider a `useHotkeys` hook in `src/lib/hooks/`

---

## Deferred Indefinitely

| Item | Reason |
|------|--------|
| **No CSRF Protection** | No auth = no session to hijack. Revisit if auth is added. |
| **No HTTPS** | Plain HTTP on localhost. Use HTTPS if deployed. |
| **Lockfiles / dep scanning** | No `package-lock.json` committed, no `npm audit`/`pip-audit` in CI. Add before deployment. |
| **`check_same_thread=False`** | SQLite concurrent access limitation. Accept as dev-only. |

# Ideas & Future Polish

> Capture of design ideas, UI polish, and features for later.
> Not planned — just noted so we don't forget.

---

## Streak Fire — Animated SVG

**Idea:** Replace the `🔥` emoji in `StreakBadge` with an animated SVG fire icon that evolves based on streak length.

**Stages:**

| Streak | Visual |
|--------|--------|
| 0 | No flame — dim ember / cold icon |
| 1-2 | Small spark — tiny flicker |
| 3-6 | Small flame — steady burn |
| 7-13 | Medium flame — animated flicker |
| 14-29 | Large flame — intense burn with particle sparks |
| 30+ | Inferno — full fire with ember particles, color shift toward blue-white |

**Implementation notes:**
- SVG paths for each stage, animated with motion's `pathLength` / `fill` / `scale`
- `useTime` or `useAnimationFrame` for continuous flicker on higher stages
- Color palette: orange (#f97316) → amber (#f59e0b) → yellow (#eab308) → blue-white at top
- Particle embers could be tiny circles that `animate` upward with opacity fade

**Status:** Design idea only. Not started.

---

## Long-Press to Check In

**Idea:** On mobile, long-press a habit card → quick check-in without opening the detail page. Haptic feedback if available.

---

## Habit Color Tags

**Idea:** Assign a color to each habit (via Create/Edit form). Color appears as a left-border accent on the card, matching the terminal/cinematic theme.

---

## Drag-to-Reorder Habits

**Idea:** Reorder habits by dragging (motion `<Reorder>` component). Backend needs `sort_order` column.

See `docs/motion-feature-audit.md` — Tier 2.

---

## Edit Habit from Detail Page

**Idea:** The Edit button on HabitDetail navigates to `/habits/:id/edit`. Pre-populated form. Covered in Slice 3, Vertical 2.

---

## Analytics Dashboard

**Idea:** Stats page with completion rates, best streaks, bar charts. Slice 3, Vertical 3.

---

## Keyboard Shortcuts

**Idea:**
- `j` / `k` — navigate between habits
- `c` — check-in focused habit
- `n` — new habit
- `/` — focus search (if we add search)

---

## Empty State Illustrations

**Idea:** Custom dark-cinematic SVG illustrations for empty states instead of plain text. Terminal-themed "no processes running" vibe.

---

## Check-in Timestamp

**Idea:** Show when a habit was checked in (not just the date). E.g., "checked 3h ago" or "08:42 AM".

---

## Terminal-Style Create Form

**Idea:** Replace the standard form page for creating habits with a terminal-themed sequence. Fits the dark cinematic brand.

**Look:**
```
┌─ HABIT INIT ─────────────────────────┐
│                                       │
│  $ ./habit --new                      │
│                                       │
│  > Enter habit name                   │
│  █ Morning run                        │
│                                       │
│  > Select frequency                   │
│  > [daily|weekly|monthly]             │
│                                       │
│  > Description (optional)             │
│  > Run for 30 minutes outdoors        │
│                                       │
│  > [INITIALIZE]                       │
└─────────────────────────────────────────┘
```

**Implementation notes:**
- Terminal-colored container (bg-black/80, font-mono, green prompt `>`)
- `useAnimate` for typewriter prompt reveal on each line
- Standard form inputs underneath (accessibility), styled to blend with terminal theme
- `motion.div` for each prompt line with stagger

**Status:** Design idea only. Not started.

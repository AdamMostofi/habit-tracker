# Motion.dev Feature Audit — Habit Tracker

> Research date: 2026-06-21
> All features checked against https://motion.dev/docs/ (free tier MIT license).
> — = Free | ⭐ = Already used | 💎 = Motion+ (paid, £299)

---

## Tier 1: Already In Use

These are already imported and working in the project.

| Feature | Status | Where |
|---------|--------|-------|
| ⭐ `<motion>` component | ✅ | All pages (motion.div, motion.button, motion.ul, etc.) |
| ⭐ `AnimatePresence` | ✅ | App.tsx (route transitions), TodayView (celebration banner), DeleteHabitButton (dialog) |
| ⭐ `initial` / `animate` / `exit` | ✅ | Page transitions, card animations |
| ⭐ `whileHover` | ✅ | Habit cards (scale: 1.015), Sidebar items |
| ⭐ `whileTap` | ✅ | CheckInButton, Delete button |
| ⭐ `transition` (spring, stagger) | ✅ | Card list staggers, route fade (200ms) |
| ⭐ `layout` prop | ✅ | Used for smooth layout shifts |

---

## Tier 2: High Value — Add Next

Features that would meaningfully improve the existing UI. Free and available now.

### `<Reorder>` — Drag-to-reorder habits

**Why:** Let users reorder their habits by dragging. Currently habits display in creation order.
**Where:** HabitsList page, TodayView.
**How:** Wrap the habit list in `<Reorder.Group axis="y" values={habits} onReorder={setHabits}>`, each card becomes `<Reorder.Item value={habit}>`.
**What it adds:** Custom ordering without an edit mode. Satisfying physical interaction.
**Effort:** Medium — needs a backend PATCH endpoint for `sort_order`, plus `onReorder` handler.

### `layout` prop on shared elements — Smoother list mutations

**Why:** When a habit is checked off, cards shift position. `layout` makes that transition smooth instead of instant.
**Where:** HabitCard, ListItem components.
**How:** Already partially used. Apply `layout` to all list items so add/remove/check-in reflows animate.
**What it adds:** Polished feel when the list changes — cards glide to new positions.
**Effort:** Low — one prop per card, may need `transition={{ layout: { duration: 0.3 } }}`.

### `useInView` + `useAnimate` — Scroll-triggered entrance on analytics

**Why:** When the analytics page scrolls, stats counters and charts should animate in as they enter view.
**Where:** Analytics page (future Slice 3).
**How:** `useInView(ref, { once: true })` + `useAnimate()` to fade up each stat card when scrolled to.
**What it adds:** Polished, sequential reveal on scroll. 0.6kb hook, tiny cost.
**Effort:** Low — hook in, animate opacity+y on trigger.

### `whileInView` — In-viewport card entrance

**Why:** Simpler alternative to `useInView` for basic fade-in effects on scroll.
**Where:** Habits list items, TodayView cards.
**How:** `<motion.div whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 20 }} viewport={{ once: true }}>`
**What it adds:** Subtle entrance as user scrolls. Zero JS setup.
**Effort:** Very low — declarative prop only.

### `useReducedMotion` — Accessibility

**Why:** Users with vestibular disorders need reduced motion. Already declared in AGENTS.md as a requirement.
**Where:** App.tsx, animation configs.
**How:** `const prefersReduced = useReducedMotion()` then conditionally disable spring/stagger.
**What it adds:** WCAG AA compliance on animation.
**Effort:** Low — wrap animation values in a conditional.

### `MotionConfig` — Global animation defaults

**Why:** Centralize transition defaults (duration, easing) instead of repeating them per component.
**Where:** App.tsx, wrap the entire app.
**How:** `<MotionConfig transition={{ duration: 0.2, ease: "easeOut" }}>`
**What it adds:** Consistent animation feel everywhere. One place to tweak timing.
**Effort:** Very low — wrap + remove per-component `transition` props.

### `useSpring` — Smooth motion values for streak counters

**Why:** Streak badge numbers and progress indicators can interpolate smoothly with spring physics.
**Where:** StreakBadge, stats displays.
**How:** `const smoothValue = useSpring(motionValue, { stiffness: 300, damping: 30 })` — value eases to target.
**What it adds:** Streak counter that glides to new numbers instead of jumping.
**Effort:** Low — wrap numeric state in `useMotionValue` + `useSpring`.

### `useMotionValueEvent` — React to animation state

**Why:** Detect when a check-in animation completes, then show a secondary effect (e.g., confetti particle).
**Where:** CheckInButton.
**How:** `useMotionValueEvent(motionValue, "animationcomplete", () => { ... })`
**What it adds:** Chain effects after animations finish.
**Effort:** Low — event listener on existing motion value.

### `LayoutGroup` — Coordinate sibling animations

**Why:** When one habit card expands and another collapses (e.g., expanded details), `LayoutGroup` makes transitions animate together instead of jumping.
**Where:** Habit list views.
**How:** Wrap a section of cards in `<LayoutGroup>`, give each card a `layoutId` if shared across routes.
**What it adds:** Coordinated, fluid layout transitions.
**Effort:** Low — wrap JSX.

---

## Tier 3: Nice To Have — Future Polish

Useful but not critical. Free and available.

### SVG Animation — Animated habit icons

**Why:** Custom SVG icons for each habit (running, reading, meditation) that animate on check-in.
**Where:** HabitCard, CreateHabit form icon picker.
**How:** `motion.path` with `pathLength` + `fill` animation, or SVG morphing between states.
**What it adds:** Delightful micro-interaction when checking in — icon draws itself.
**Effort:** Medium — needs SVG assets and path data.

### `useTransform` — Dynamic visual feedback

**Why:** Map scroll progress or drag distance to visual properties (opacity, color, scale).
**Where:** Scroll progress indicator, drag-to-delete.
**How:** `const scale = useTransform(scrollY, [0, 200], [1, 0.95])` / `const color = useTransform(x, [-100, 0, 100], ["#ef4444", "#fff", "#22c55e"])`
**What it adds:** Values that smoothly track user input.
**Effort:** Low — one hook.

### `useAnimate` — Imperative animation sequences

**Why:** Multi-step animation sequences on check-in (card bounces → icon flips → streak increments).
**Where:** CheckInButton, celebration banner.
**How:** Chain `.then()` calls or pass array of keyframes.
**What it adds:** Orchestrated animation sequences that declarative props can't express.
**Effort:** Medium — replaces declarative props with imperative code.

### `drag` prop — Swipe-to-delete

**Why:** Swipe a habit card left to reveal delete action. Common mobile pattern.
**Where:** HabitCard on mobile.
**How:** `<motion.div drag="x" dragConstraints={{ left: -80, right: 0 }} onDragEnd={...}>`
**What it adds:** Native-feeling gesture interaction.
**Effort:** Medium — need to handle drag threshold + reveal delete zone + spring-back.

### `useDragControls` — Custom drag triggers

**Why:** Small handle/grip icon on a card that initiates dragging, leaving the rest of the card tappable (no accidental drags).
**Where:** Reorder handle on habit cards.
**How:** `const controls = useDragControls()` → handle gets `onPointerDown={e => controls.start(e)}` → card gets `dragControls={controls}`.
**What it adds:** Clean separation — drag handle vs. card body. Prevents accidental reorders.
**Effort:** Low — couple of props.

### `useTime` — Decorative time-based animations

**Why:** Subtle ambient effects — a slow pulsing glow on the sidebar, or a breathing effect on empty states.
**Where:** Empty state illustrations, decorative elements.
**How:** `const time = useTime()` → `const opacity = useTransform(time, t => 0.8 + 0.2 * Math.sin(t / 1000))`.
**What it adds:** Alive ambient feel without user input.
**Effort:** Low — pure hook.

### `useVelocity` — Parallax / speed-reactive effects

**Why:** When scrolling through the habits list, cards could respond to scroll speed with subtle parallax.
**Where:** List scroll container.
**How:** `const { scrollY } = useScroll()` → `const velocity = useVelocity(scrollY)` → map to visual.
**What it adds:** Premium scroll feel.
**Effort:** Medium — fine-tuning threshold.

### `useAnimationFrame` — Custom per-frame logic

**Why:** If we need any custom per-frame effect (animated background, particle system, canvas overlay).
**Where:** Animated backgrounds, decorative effects.
**How:** `useAnimationFrame((time, delta) => { ... })`.
**What it adds:** Access to the render loop for art-direction.
**Effort:** Medium — manual loop management.

### `whileFocus` — Keyboard focus ring

**Why:** Improve keyboard navigation — animate focus ring on interactive elements.
**Where:** All interactive elements (buttons, inputs, links).
**How:** `<motion.button whileFocus={{ boxShadow: "0 0 0 2px var(--color-accent)" }}>`.
**What it adds:** WCAG AA keyboard accessibility with animation.
**Effort:** Low — one prop per element.

### Drag constraints — Snap-back on invalid drag

**Why:** If user drags a card but doesn't reach delete threshold, it springs back. Already inherent in `drag`.
**Where:** All draggable elements.
**How:** Built-in — `drag` + `dragConstraints` + `dragElastic` gives snap-back for free.
**What it adds:** Physics-accurate snap-back.
**Effort:** Already built in.

---

## Tier 4: Paid-Only (Motion+ £299)

Included for completeness so we know what we're not missing.

| Feature | What it does | Would be nice for |
|---------|-------------|-------------------|
| 💎 `<AnimateNumber>` | Animated counting numbers with spring | **Streak counter**, **stats dashboard** (top want) |
| 💎 `<Carousel>` | Gesture-driven carousel | Habit progress photos, screenshots |
| 💎 `<Cursor>` | Custom cursor effects | Landing page / about page |
| 💎 `<ScrambleText>` | Scrambling text reveal animation | **Hero title**, loading states (top want) |
| 💎 `<Ticker>` | Infinite marquee | Motivation quotes ticker |
| 💎 `<Typewriter>` | Typewriter text effect | Onboarding / welcome flow |
| 💎 `<AnimateActivity>` | Activity indicator (pulsing dot) | **Background sync indicator** (top want) |
| 💎 `useCurtains` | Page transition curtain effects | Route transitions |

### Can we emulate these for free?

| Paid feature | Free alternative |
|-------------|-----------------|
| `<AnimateNumber>` | `useSpring(motionValue)` + `useTransform` to format — same result, slightly more code |
| `<ScrambleText>` | CSS text animation or JS char-by-char swap — less polished but possible |
| `<Typewriter>` | `useAnimate` with staggered character reveal — feasible |
| `<Ticker>` | CSS `@keyframes` infinite marquee — works fine |
| `<AnimateActivity>` | Pure CSS pulsing dot — trivial |
| `<Cursor>` | CSS custom cursor — available, but not as rich |
| `<Carousel>` | Embla or Keen Slider — mature free libraries |
| `useCurtains` | `AnimatePresence` route transitions — already using |

**Verdict:** The paid features are nice DX shortcuts but none are essential. We can approximate everything with free Motion features + standard CSS, just with a few more lines of code.

---

## Recommended Priority Order

```
Now (Tier 2 — high value, low effort)
├── MotionConfig → global animation defaults
├── useReducedMotion → accessibility compliance
├── layout on all list items → smooth reflow
├── useInView + useAnimate → scroll-reveal on analytics
├── LayoutGroup → coordinated card transitions
└── useMotionValueEvent → chain effects on check-in

Soon (Tier 2 — medium effort)
├── Reorder → drag-to-reorder habits
│   └── useDragControls → drag handle vs. card body
├── useSpring → smooth streak numbers
├── whileInView → card entrance on scroll
└── whileFocus → keyboard animations

Later (Tier 3 — polish)
├── SVG animation → animated habit icons
├── useTransform → drag color feedback
├── drag → swipe-to-delete
├── useAnimate → multi-step sequences
├── useTime → ambient effects
├── useVelocity → scroll parallax
└── useAnimationFrame → custom effects
```

---

## Summary

- **Free coverage:** We have access to all core motion.dev features with the MIT license. 20+ components/hooks available at zero cost.
- **Already using:** 6 features (motion, AnimatePresence, gestures, layout, spring, stagger).
- **Gap to paid tier:** 8 features locked behind Motion+ (£299). All are replicable with free tools, just more code.
- **Context cost of using these:** Zero when not used. Each webfetch/Context7 call adds ~1-3KB transiently when we look up a specific feature's docs.

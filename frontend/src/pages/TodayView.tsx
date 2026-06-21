import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence, LayoutGroup, useReducedMotion, type Variants } from "motion/react"
import { CheckCircle2, ListChecks } from "lucide-react"
import { habits } from "@/lib/api"
import type { Habit } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { CheckInButton } from "@/components/CheckInButton"
import { DeleteHabitButton } from "@/components/DeleteHabitButton"
import { StreakBadge } from "@/components/StreakBadge"
import { Link } from "react-router-dom"

const frequencyOrder = ["daily", "weekly", "monthly"] as const

const frequencyLabel: Record<string, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
}

const frequencyBadge: Record<string, "secondary" | "outline" | "ghost"> = {
  daily: "secondary",
  weekly: "outline",
  monthly: "ghost",
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
}

const todayFormatted = new Date().toLocaleDateString("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
})

/* Weekly date range label */
const weekLabel = (() => {
  const now = new Date()
  const day = now.getDay()
  const diffToMon = day === 0 ? -6 : 1 - day
  const monday = new Date(now)
  monday.setDate(now.getDate() + diffToMon)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  return `${fmt(monday)} – ${fmt(sunday)}`
})()

const monthLabel = new Date().toLocaleDateString("en-US", {
  month: "long",
})

export function TodayView() {
  const prefersReduced = useReducedMotion()
  const [habitsList, setHabitsList] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [checkedIn, setCheckedIn] = useState<Set<number>>(new Set())

  const fetchHabits = async () => {
    setError(null)
    try {
      const [daily, weekly, monthly] = await Promise.all([
        habits.today(),
        habits.weekly(),
        habits.monthly(),
      ])
      setHabitsList([...daily, ...weekly, ...monthly])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load habits")
    }
  }

  useEffect(() => {
    setLoading(true)
    fetchHabits().finally(() => setLoading(false))
  }, [])

  const handleCheckIn =
    (habitId: number) => async (_status: "done" | "skip") => {
      setCheckedIn((prev) => new Set(prev).add(habitId))
      await fetchHabits()
    }

  const grouped = useMemo(() => {
    const groups: Record<string, Habit[]> = {
      daily: [],
      weekly: [],
      monthly: [],
    }
    habitsList.forEach((habit) => {
      if (groups[habit.frequency]) {
        groups[habit.frequency].push(habit)
      }
    })
    return groups
  }, [habitsList])

  const isError = !loading && error !== null
  const isEmpty = !loading && !error && habitsList.length === 0
  const allDone =
    !loading &&
    !error &&
    habitsList.length > 0 &&
    habitsList.every((h) => checkedIn.has(h.hid))

  const subtitle: Record<string, string> = {
    daily: "Due today",
    weekly: weekLabel,
    monthly: monthLabel,
  }

  const renderCards = (items: Habit[]) => (
    <div className="grid grid-cols-1 gap-3 xl:grid-cols-[repeat(auto-fit,minmax(320px,1fr))]">
      {items.map((habit) => {
        const isCheckedIn = checkedIn.has(habit.hid)
        return (
          <motion.div
            key={habit.hid}
            layout
            variants={itemVariants}
            whileHover={{ scale: 1.015 }}
            transition={{ layout: { duration: 0.3 } }}
            className="group flex items-center gap-4 rounded-xl border border-border bg-card/50 p-4 transition-colors hover:border-primary/20 hover:bg-card/80"
          >
            <Link
              to={`/habits/${habit.hid}`}
              className="min-w-0 flex-1 space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <p className="truncate font-medium text-foreground">
                  {habit.name}
                </p>
                <Badge
                  variant={frequencyBadge[habit.frequency] ?? "secondary"}
                  className="shrink-0"
                >
                  {habit.frequency}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <StreakBadge
                  habitId={habit.hid}
                  count={habit.current_streak}
                />
                {isCheckedIn && (
                  <span className="font-mono text-xs text-primary">
                    checked
                  </span>
                )}
              </div>
            </Link>
            <div className="flex items-center gap-1">
              <DeleteHabitButton
                habitId={habit.hid}
                habitName={habit.name}
                onDeleted={() => {
                  setHabitsList((prev) =>
                    prev.filter((h) => h.hid !== habit.hid),
                  )
                }}
              />
              <CheckInButton
                habitId={habit.hid}
                currentStatus={null}
                onCheckIn={handleCheckIn(habit.hid)}
              />
            </div>
          </motion.div>
        )
      })}
    </div>
  )

  const sectionVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.03 },
    },
  }

  return (
    <section>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Today</h1>
        <p className="mt-1 font-mono text-sm text-muted-foreground">
          {todayFormatted}
        </p>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-8">
          {[0, 1, 2].map((section) => (
            <div key={section}>
              <Skeleton className="mb-3 h-4 w-16 rounded-md" />
              <div className="space-y-3">
                {[0, 1].map((card) => (
                  <Skeleton key={card} className="h-20 w-full rounded-xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card/50 p-8 text-center">
          <p className="text-sm text-muted-foreground">{error}</p>
          <button
            onClick={() => {
              setLoading(true)
              fetchHabits().finally(() => setLoading(false))
            }}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            Retry
          </button>
        </div>
      )}

      {/* No habits at all */}
      {isEmpty && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card/50 p-12 text-center">
          <ListChecks className="size-8 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No habits yet</p>
          <Link
            to="/habits/new"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            Create your first habit
          </Link>
        </div>
      )}

      <AnimatePresence>
        {allDone && (
          <motion.div
            key="celebration-banner"
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mb-4 flex items-center gap-2.5 overflow-hidden rounded-lg border border-primary/20 bg-primary/5 px-4 py-3"
          >
            <CheckCircle2 className="size-4 shrink-0 text-primary" />
            <p className="text-sm font-medium text-primary">
              All done for today
            </p>
            <p className="text-sm text-muted-foreground">
              Great work staying consistent
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && !isError && habitsList.length > 0 && (
        <motion.div
          className="space-y-8"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          transition={prefersReduced ? { staggerChildren: 0 } : undefined}
        >
          {frequencyOrder.map((freq) => {
            const items = grouped[freq]
            if (!items?.length) return null
            return (
              <motion.section key={freq} variants={itemVariants}>
                <div className="flex items-baseline gap-3 mb-3">
                  <h2 className="font-mono text-xs font-medium tracking-widest text-muted-foreground uppercase">
                    {frequencyLabel[freq]}
                  </h2>
                  <span className="font-mono text-[10px] text-muted-foreground/40 tracking-wide">
                    {subtitle[freq]}
                  </span>
                </div>
                <LayoutGroup>{renderCards(items)}</LayoutGroup>
              </motion.section>
            )
          })}
        </motion.div>
      )}
    </section>
  )
}

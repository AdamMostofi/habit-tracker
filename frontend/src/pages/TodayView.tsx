import { useState, useEffect } from "react"
import { motion, type Variants } from "motion/react"
import { habits } from "@/lib/api"
import type { Habit } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { CheckInButton } from "@/components/CheckInButton"
import { StreakBadge } from "@/components/StreakBadge"
import { Link } from "react-router-dom"

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
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

export function TodayView() {
  const [habitsList, setHabitsList] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [checkedIn, setCheckedIn] = useState<Set<number>>(new Set())

  const fetchHabits = async () => {
    setError(null)
    try {
      const data = await habits.today()
      setHabitsList(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load habits")
    }
  }

  useEffect(() => {
    setLoading(true)
    fetchHabits().finally(() => setLoading(false))
  }, [])

  const handleCheckIn =
    (habitId: number) => async (status: "done" | "skip") => {
      const today = new Date().toISOString().split("T")[0]
      try {
        await habits.checkIn(habitId, {
          hid: habitId,
          user_id: 1,
          date: today,
          status,
        })
        setCheckedIn((prev) => new Set(prev).add(habitId))
        await fetchHabits()
      } catch {
        /* silently fail — toast can be added later */
      }
    }

  const isError = !loading && error !== null
  const isEmpty = !loading && !error && habitsList.length === 0
  const allDone =
    !loading && !error && habitsList.length > 0 && checkedIn.size >= habitsList.length

  return (
    <section>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Today</h1>
        <p className="mt-1 font-mono text-sm text-muted-foreground">{todayFormatted}</p>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton
              key={i}
              className={`h-20 rounded-xl ${i === 0 ? "w-full" : i === 1 ? "w-5/6" : "w-4/5"}`}
            />
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
          <p className="text-sm text-muted-foreground">No habits yet</p>
          <Link
            to="/habits/new"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            Create your first habit
          </Link>
        </div>
      )}

      {/* All habits checked in */}
      {allDone && (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card/50 p-12 text-center">
          <p className="text-lg font-medium">All done for today ✦</p>
          <p className="text-sm text-muted-foreground">Great work staying consistent</p>
        </div>
      )}

      {/* Habit cards */}
      {!loading && !isError && habitsList.length > 0 && !allDone && (
        <motion.div
          className="grid grid-cols-1 gap-3 xl:grid-cols-[repeat(auto-fit,minmax(320px,1fr))]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {habitsList.map((habit) => {
            const isCheckedIn = checkedIn.has(habit.hid)
            return (
              <motion.div
                key={habit.hid}
                variants={itemVariants}
                className="flex items-center gap-4 rounded-xl border border-border bg-card/50 p-4 transition-colors hover:bg-card/80"
              >
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium text-foreground">{habit.name}</p>
                    <Badge variant="secondary" className="shrink-0">
                      {habit.frequency}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <StreakBadge habitId={habit.hid} count={0} />
                    {isCheckedIn && (
                      <span className="font-mono text-xs text-primary">checked</span>
                    )}
                  </div>
                </div>
                <CheckInButton
                  habitId={habit.hid}
                  currentStatus={null}
                  onCheckIn={handleCheckIn(habit.hid)}
                />
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </section>
  )
}
